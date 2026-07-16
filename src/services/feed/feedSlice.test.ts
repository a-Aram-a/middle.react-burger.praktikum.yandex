import { describe, expect, it } from 'vitest';

import { anotherOrder, order } from '@utils/test-fixtures';

import {
  feedWsClose,
  feedWsConnect,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
} from './feedActions';
import { feedSlice } from './feedSlice';

import type { TFeedState } from './feedSlice';

const reducer = feedSlice.reducer;

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  hasLoaded: false,
  error: null,
};

const message = { orders: [order, anotherOrder], total: 1234, totalToday: 56 };

describe('feedSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('feedWsConnect сбрасывает ошибку предыдущего подключения', () => {
    const state = reducer(
      { ...initialState, error: 'Соединение потеряно' },
      feedWsConnect()
    );

    expect(state.error).toBeNull();
  });

  it('feedWsOpen помечает сокет подключённым и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'Соединение потеряно' },
      feedWsOpen()
    );

    expect(state.connected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('feedWsClose помечает сокет отключённым', () => {
    const state = reducer({ ...initialState, connected: true }, feedWsClose());

    expect(state.connected).toBe(false);
  });

  it('feedWsError записывает текст ошибки', () => {
    const state = reducer(initialState, feedWsError('Соединение потеряно'));

    expect(state.error).toBe('Соединение потеряно');
  });

  it('feedWsMessage записывает заказы и счётчики', () => {
    const state = reducer({ ...initialState, connected: true }, feedWsMessage(message));

    expect(state.orders).toEqual([order, anotherOrder]);
    expect(state.total).toBe(1234);
    expect(state.totalToday).toBe(56);
    expect(state.hasLoaded).toBe(true);
  });

  it('feedWsMessage заменяет предыдущие заказы, а не дополняет их', () => {
    const withOrders = reducer(initialState, feedWsMessage(message));
    const state = reducer(
      withOrders,
      feedWsMessage({ orders: [order], total: 1235, totalToday: 57 })
    );

    expect(state.orders).toEqual([order]);
    expect(state.total).toBe(1235);
  });

  it('feedWsClose сохраняет полученные ранее заказы', () => {
    const withOrders = reducer(initialState, feedWsMessage(message));
    const state = reducer(withOrders, feedWsClose());

    expect(state.orders).toEqual([order, anotherOrder]);
    expect(state.hasLoaded).toBe(true);
  });

  it('проходит полный цикл: подключение — данные — обрыв', () => {
    const connecting = reducer(initialState, feedWsConnect());
    const opened = reducer(connecting, feedWsOpen());
    const loaded = reducer(opened, feedWsMessage(message));
    const errored = reducer(loaded, feedWsError('Соединение потеряно'));
    const closed = reducer(errored, feedWsClose());

    expect(closed).toEqual({
      orders: [order, anotherOrder],
      total: 1234,
      totalToday: 56,
      connected: false,
      hasLoaded: true,
      error: 'Соединение потеряно',
    });
  });
});
