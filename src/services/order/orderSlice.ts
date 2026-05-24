import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './orderActions';

type TOrderState = {
  number: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: TOrderState = {
  number: null,
  status: 'idle',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.number = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.number = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.number = action.payload;
      })
      .addCase(placeOrder.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { resetOrder } = orderSlice.actions;
