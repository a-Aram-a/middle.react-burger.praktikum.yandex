import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { authSlice } from './auth/authSlice';
import { constructorSlice } from './constructor/constructorSlice';
import { ingredientsSlice } from './ingredients/ingredientsSlice';
import { orderSlice } from './order/orderSlice';

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

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
