import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, uid: nanoid() } };
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((i) => i.uid !== action.payload);
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;

const selectConstructorState = (state: {
  burgerConstructor: TConstructorState;
}): TConstructorState => state.burgerConstructor;

export const selectIngredientCounts = createSelector(
  selectConstructorState,
  ({ bun, ingredients }) => {
    const counts: Record<string, number> = {};
    if (bun) counts[bun._id] = 2;
    ingredients.forEach((i) => {
      counts[i._id] = (counts[i._id] ?? 0) + 1;
    });
    return counts;
  }
);

export const selectTotalPrice = createSelector(
  selectConstructorState,
  ({ bun, ingredients }) =>
    (bun?.price ?? 0) * 2 + ingredients.reduce((s, i) => s + i.price, 0)
);
