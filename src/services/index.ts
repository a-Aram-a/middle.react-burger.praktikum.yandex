import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { authSlice } from './auth/authSlice';
import { constructorSlice } from './constructor/constructorSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';

import type { TypedUseSelectorHook } from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  orderSlice,
  authSlice
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
