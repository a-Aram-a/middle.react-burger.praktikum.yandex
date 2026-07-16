import { createAction } from '@reduxjs/toolkit';

import type { TOrder } from '@utils/types';

export const feedWsConnect = createAction('feed/wsConnect');
export const feedWsDisconnect = createAction('feed/wsDisconnect');
export const feedWsOpen = createAction('feed/wsOpen');
export const feedWsClose = createAction('feed/wsClose');
export const feedWsError = createAction<string>('feed/wsError');
export const feedWsMessage = createAction<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>('feed/wsMessage');
