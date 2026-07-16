import { describe, expect, it } from 'vitest';

import { anotherOrder, order } from '@utils/test-fixtures';

import {
  userOrdersWsClose,
  userOrdersWsConnect,
  userOrdersWsError,
  userOrdersWsMessage,
  userOrdersWsOpen,
} from './userOrdersActions';
import { userOrdersSlice } from './userOrdersSlice';

import type { TUserOrdersState } from './userOrdersSlice';

const reducer = userOrdersSlice.reducer;

const initialState: TUserOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  hasLoaded: false,
  error: null,
};

const message = { orders: [order, anotherOrder], total: 12, totalToday: 3 };

describe('userOrdersSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('userOrdersWsConnect сбрасывает ошибку предыдущего подключения', () => {
    const state = reducer(
      { ...initialState, error: 'Соединение потеряно' },
      userOrdersWsConnect()
    );

    expect(state.error).toBeNull();
  });

  it('userOrdersWsOpen помечает сокет подключённым и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'Соединение потеряно' },
      userOrdersWsOpen()
    );

    expect(state.connected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('userOrdersWsClose помечает сокет отключённым', () => {
    const state = reducer({ ...initialState, connected: true }, userOrdersWsClose());

    expect(state.connected).toBe(false);
  });

  it('userOrdersWsError записывает текст ошибки', () => {
    const state = reducer(initialState, userOrdersWsError('Токен просрочен'));

    expect(state.error).toBe('Токен просрочен');
  });

  it('userOrdersWsMessage записывает заказы и счётчики', () => {
    const state = reducer(
      { ...initialState, connected: true },
      userOrdersWsMessage(message)
    );

    expect(state.orders).toEqual([order, anotherOrder]);
    expect(state.total).toBe(12);
    expect(state.totalToday).toBe(3);
    expect(state.hasLoaded).toBe(true);
  });

  it('userOrdersWsMessage заменяет предыдущие заказы, а не дополняет их', () => {
    const withOrders = reducer(initialState, userOrdersWsMessage(message));
    const state = reducer(
      withOrders,
      userOrdersWsMessage({ orders: [order], total: 13, totalToday: 4 })
    );

    expect(state.orders).toEqual([order]);
    expect(state.total).toBe(13);
  });

  it('userOrdersWsClose сохраняет полученные ранее заказы', () => {
    const withOrders = reducer(initialState, userOrdersWsMessage(message));
    const state = reducer(withOrders, userOrdersWsClose());

    expect(state.orders).toEqual([order, anotherOrder]);
    expect(state.hasLoaded).toBe(true);
  });

  it('проходит полный цикл: подключение — данные — обрыв', () => {
    const connecting = reducer(initialState, userOrdersWsConnect());
    const opened = reducer(connecting, userOrdersWsOpen());
    const loaded = reducer(opened, userOrdersWsMessage(message));
    const errored = reducer(loaded, userOrdersWsError('Токен просрочен'));
    const closed = reducer(errored, userOrdersWsClose());

    expect(closed).toEqual({
      orders: [order, anotherOrder],
      total: 12,
      totalToday: 3,
      connected: false,
      hasLoaded: true,
      error: 'Токен просрочен',
    });
  });
});
