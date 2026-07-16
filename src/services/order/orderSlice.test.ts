import { describe, expect, it } from 'vitest';

import { bun, main } from '@utils/test-fixtures';

import { placeOrder } from './orderActions';
import { orderSlice, resetOrder } from './orderSlice';

const reducer = orderSlice.reducer;

const initialState = { number: null, status: 'idle' as const };

const ids = [bun._id, main._id, bun._id];

describe('orderSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('placeOrder.pending переводит статус в loading', () => {
    const state = reducer(initialState, placeOrder.pending('id', ids));

    expect(state.status).toBe('loading');
    expect(state.number).toBeNull();
  });

  it('placeOrder.pending сбрасывает номер предыдущего заказа', () => {
    const state = reducer(
      { number: 12345, status: 'succeeded' },
      placeOrder.pending('id', ids)
    );

    expect(state).toEqual({ number: null, status: 'loading' });
  });

  it('placeOrder.fulfilled сохраняет номер заказа и статус succeeded', () => {
    const state = reducer(
      { number: null, status: 'loading' },
      placeOrder.fulfilled(54321, 'id', ids)
    );

    expect(state).toEqual({ number: 54321, status: 'succeeded' });
  });

  it('placeOrder.rejected переводит статус в failed', () => {
    const state = reducer(
      { number: null, status: 'loading' },
      placeOrder.rejected(new Error('Ошибка оформления'), 'id', ids)
    );

    expect(state).toEqual({ number: null, status: 'failed' });
  });

  it('resetOrder возвращает состояние к начальному', () => {
    const state = reducer({ number: 54321, status: 'succeeded' }, resetOrder());

    expect(state).toEqual(initialState);
  });

  it('resetOrder сбрасывает состояние после неудачного заказа', () => {
    const state = reducer({ number: null, status: 'failed' }, resetOrder());

    expect(state).toEqual(initialState);
  });
});
