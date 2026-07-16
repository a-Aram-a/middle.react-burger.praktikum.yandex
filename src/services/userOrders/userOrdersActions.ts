import { createAction } from '@reduxjs/toolkit';

import type { TOrder } from '@utils/types';

export const userOrdersWsConnect = createAction('userOrders/wsConnect');
export const userOrdersWsDisconnect = createAction('userOrders/wsDisconnect');
export const userOrdersWsOpen = createAction('userOrders/wsOpen');
export const userOrdersWsClose = createAction('userOrders/wsClose');
export const userOrdersWsError = createAction<string>('userOrders/wsError');
export const userOrdersWsMessage = createAction<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>('userOrders/wsMessage');
