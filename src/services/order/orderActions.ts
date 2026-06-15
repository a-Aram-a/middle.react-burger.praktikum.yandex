import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder } from '@utils/api';

export const placeOrder = createAsyncThunk('order/place', createOrder);
