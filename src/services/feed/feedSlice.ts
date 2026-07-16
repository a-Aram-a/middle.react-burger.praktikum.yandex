import { createSlice } from '@reduxjs/toolkit';

import {
  feedWsClose,
  feedWsConnect,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
} from './feedActions';

import type { TOrder } from '@utils/types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  hasLoaded: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  hasLoaded: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsConnect, (state) => {
        state.error = null;
      })
      .addCase(feedWsOpen, (state) => {
        state.connected = true;
        state.error = null;
      })
      .addCase(feedWsClose, (state) => {
        state.connected = false;
      })
      .addCase(feedWsError, (state, action) => {
        state.error = action.payload;
      })
      .addCase(feedWsMessage, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.hasLoaded = true;
      });
  },
});
