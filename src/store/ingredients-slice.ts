import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
};

export const fetchIngredients = createAsyncThunk('ingredients/fetch', getIngredients);

const ingredientsSlice = createSlice({
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

export const ingredientsReducer = ingredientsSlice.reducer;
