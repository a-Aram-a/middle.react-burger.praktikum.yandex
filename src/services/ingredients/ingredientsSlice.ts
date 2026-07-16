import { createSelector, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './ingredientsActions';

import type { TIngredient } from '@utils/types';

export type TIngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectIngredientsById = createSelector(
  (state: { ingredients: TIngredientsState }) => state.ingredients.items,
  (items): Record<string, TIngredient> =>
    items.reduce<Record<string, TIngredient>>((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {})
);
