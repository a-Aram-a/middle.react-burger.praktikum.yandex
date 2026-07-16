import { describe, expect, it } from 'vitest';

import { bun, ingredients, main } from '@utils/test-fixtures';

import { fetchIngredients } from './ingredientsActions';
import { ingredientsSlice, selectIngredientsById } from './ingredientsSlice';

import type { TIngredientsState } from './ingredientsSlice';

const reducer = ingredientsSlice.reducer;

const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
};

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('fetchIngredients.pending переводит статус в loading', () => {
    const state = reducer(initialState, fetchIngredients.pending('id', undefined));

    expect(state.status).toBe('loading');
    expect(state.items).toEqual([]);
  });

  it('fetchIngredients.fulfilled записывает ингредиенты и статус succeeded', () => {
    const state = reducer(
      { items: [], status: 'loading' },
      fetchIngredients.fulfilled(ingredients, 'id', undefined)
    );

    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(ingredients);
  });

  it('fetchIngredients.rejected переводит статус в failed', () => {
    const state = reducer(
      { items: [], status: 'loading' },
      fetchIngredients.rejected(new Error('Ошибка сети'), 'id', undefined)
    );

    expect(state.status).toBe('failed');
    expect(state.items).toEqual([]);
  });

  it('fetchIngredients.pending после ошибки не стирает загруженные ингредиенты', () => {
    const state = reducer(
      { items: ingredients, status: 'failed' },
      fetchIngredients.pending('id', undefined)
    );

    expect(state.items).toEqual(ingredients);
  });
});

describe('selectIngredientsById', () => {
  it('возвращает пустой объект, когда ингредиенты не загружены', () => {
    expect(selectIngredientsById({ ingredients: initialState })).toEqual({});
  });

  it('индексирует ингредиенты по _id', () => {
    const byId = selectIngredientsById({
      ingredients: { items: ingredients, status: 'succeeded' },
    });

    expect(byId[bun._id]).toEqual(bun);
    expect(byId[main._id]).toEqual(main);
    expect(Object.keys(byId)).toHaveLength(ingredients.length);
  });
});
