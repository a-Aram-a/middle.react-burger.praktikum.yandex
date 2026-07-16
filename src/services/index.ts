import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { WS_FEED_URL, WS_ORDERS_URL } from '@utils/constants';
import { getRawAccessToken } from '@utils/tokens';

import { authSlice } from './auth/authSlice';
import { constructorSlice } from './constructor/constructorSlice';
import {
  feedWsClose,
  feedWsConnect,
  feedWsDisconnect,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
} from './feed/feedActions';
import { feedSlice } from './feed/feedSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';
import { createSocketMiddleware } from './socketMiddleware';
import {
  userOrdersWsClose,
  userOrdersWsConnect,
  userOrdersWsDisconnect,
  userOrdersWsError,
  userOrdersWsMessage,
  userOrdersWsOpen,
} from './userOrders/userOrdersActions';
import { userOrdersSlice } from './userOrders/userOrdersSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  orderSlice,
  authSlice,
  feedSlice,
  userOrdersSlice
);

const feedSocketMiddleware = createSocketMiddleware(
  {
    connect: feedWsConnect,
    disconnect: feedWsDisconnect,
    onOpen: feedWsOpen,
    onClose: feedWsClose,
    onError: feedWsError,
    onMessage: feedWsMessage,
  },
  () => WS_FEED_URL
);

const userOrdersSocketMiddleware = createSocketMiddleware(
  {
    connect: userOrdersWsConnect,
    disconnect: userOrdersWsDisconnect,
    onOpen: userOrdersWsOpen,
    onClose: userOrdersWsClose,
    onError: userOrdersWsError,
    onMessage: userOrdersWsMessage,
  },
  () => {
    const token = getRawAccessToken();
    return token ? `${WS_ORDERS_URL}?token=${token}` : null;
  },
  true
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedSocketMiddleware, userOrdersSocketMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
