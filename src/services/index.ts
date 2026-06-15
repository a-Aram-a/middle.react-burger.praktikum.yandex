import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { constructorSlice } from './constructor/constructorSlice';
import { ingredientDetailsSlice } from './ingredient-details/ingredientDetailsSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';

import type { TypedUseSelectorHook } from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  ingredientDetailsSlice,
  orderSlice
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
