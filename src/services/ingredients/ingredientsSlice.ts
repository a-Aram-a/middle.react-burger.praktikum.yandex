import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './ingredientsActions';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
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
