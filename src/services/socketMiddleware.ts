import { refreshTokenApi } from '@utils/api';
import { sanitizeOrders } from '@utils/orders';
import { setTokens } from '@utils/tokens';

import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import type { TOrdersWsMessage } from '@utils/types';

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';
const CONNECT_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 1000;
const MAX_RETRIES = 5;

export type TSocketMessagePayload = {
  orders: ReturnType<typeof sanitizeOrders>;
  total: number;
  totalToday: number;
};

export type TSocketActionCreators = {
  connect: ActionCreatorWithoutPayload;
  disconnect: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TSocketMessagePayload>;
};

export const createSocketMiddleware = (
  actions: TSocketActionCreators,
  getUrl: () => string | null,
  withTokenRefresh = false
): Middleware => {
  return (store: MiddlewareAPI) => {
    let socket: WebSocket | null = null;
    let isActive = false;
    let isRefreshing = false;
    let retryCount = 0;
    let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let connectTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const clearTimers = (): void => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }
      if (connectTimeoutId) {
        clearTimeout(connectTimeoutId);
        connectTimeoutId = null;
      }
    };

    const scheduleRetry = (): void => {
      if (retryCount >= MAX_RETRIES) {
        store.dispatch(actions.onError('Не удалось подключиться к серверу'));
        return;
      }
      retryCount += 1;
      retryTimeoutId = setTimeout(() => {
        retryTimeoutId = null;
        openSocket();
      }, RETRY_DELAY_MS);
    };

    const openSocket = (): void => {
      const url = getUrl();
      if (!url) {
        store.dispatch(actions.onError('Отсутствует токен авторизации'));
        return;
      }

      const ws = new WebSocket(url);
      socket = ws;

      connectTimeoutId = setTimeout(() => {
        if (socket !== ws) return;
        ws.close();
      }, CONNECT_TIMEOUT_MS);

      ws.onopen = (): void => {
        if (socket !== ws) return;
        clearTimers();
        retryCount = 0;
        store.dispatch(actions.onOpen());
      };

      ws.onerror = (): void => {
        if (socket !== ws) return;
        store.dispatch(actions.onError('Ошибка соединения'));
      };

      ws.onclose = (): void => {
        if (socket !== ws) return;
        clearTimers();
        socket = null;
        store.dispatch(actions.onClose());
        if (isActive && !isRefreshing) {
          scheduleRetry();
        }
      };

      ws.onmessage = (event: MessageEvent<string>): void => {
        if (socket !== ws) return;

        let data: TOrdersWsMessage;
        try {
          data = JSON.parse(event.data) as TOrdersWsMessage;
        } catch {
          return;
        }

        if (!data.success) {
          const message = data.message ?? 'Ошибка получения данных';

          if (withTokenRefresh && message === INVALID_TOKEN_MESSAGE && !isRefreshing) {
            isRefreshing = true;
            ws.close();
            void refreshTokenApi()
              .then((res) => {
                setTokens(res.accessToken, res.refreshToken);
                isRefreshing = false;
                if (isActive) openSocket();
              })
              .catch(() => {
                isRefreshing = false;
                store.dispatch(actions.onError(message));
              });
            return;
          }

          store.dispatch(actions.onError(message));
          return;
        }

        store.dispatch(
          actions.onMessage({
            orders: sanitizeOrders(data.orders),
            total: data.total ?? 0,
            totalToday: data.totalToday ?? 0,
          })
        );
      };
    };

    return (next) => (action) => {
      if (actions.connect.match(action)) {
        clearTimers();
        isActive = true;
        retryCount = 0;
        socket?.close();
        openSocket();
      } else if (actions.disconnect.match(action)) {
        clearTimers();
        isActive = false;
        isRefreshing = false;
        socket?.close();
        socket = null;
        store.dispatch(actions.onClose());
      }
      return next(action);
    };
  };
};
