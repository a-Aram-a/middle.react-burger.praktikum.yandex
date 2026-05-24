import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredient = action.payload;
    },
    clearSelectedIngredient(state) {
      state.ingredient = null;
    },
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientDetailsSlice.actions;
export const ingredientDetailsReducer = ingredientDetailsSlice.reducer;
