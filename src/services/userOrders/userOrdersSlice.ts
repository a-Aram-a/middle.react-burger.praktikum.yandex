import { createSlice } from '@reduxjs/toolkit';

import {
  userOrdersWsClose,
  userOrdersWsConnect,
  userOrdersWsError,
  userOrdersWsMessage,
  userOrdersWsOpen,
} from './userOrdersActions';

import type { TOrder } from '@utils/types';

export type TUserOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  hasLoaded: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  hasLoaded: false,
  error: null,
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userOrdersWsConnect, (state) => {
        state.error = null;
      })
      .addCase(userOrdersWsOpen, (state) => {
        state.connected = true;
        state.error = null;
      })
      .addCase(userOrdersWsClose, (state) => {
        state.connected = false;
      })
      .addCase(userOrdersWsError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(userOrdersWsMessage, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.hasLoaded = true;
      });
  },
});
