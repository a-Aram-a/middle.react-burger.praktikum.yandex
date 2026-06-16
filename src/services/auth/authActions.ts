import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUserApi, loginApi, logoutApi, registerApi, updateUserApi } from '@utils/api';
import { clearTokens, getAccessToken, setTokens } from '@utils/tokens';

import type { TLoginForm, TRegisterForm, TUpdateUserForm } from '@utils/types';

export const register = createAsyncThunk(
  'auth/register',
  async (form: TRegisterForm) => {
    const data = await registerApi(form);
    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  }
);

export const login = createAsyncThunk('auth/login', async (form: TLoginForm) => {
  const data = await loginApi(form);
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  clearTokens();
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (form: TUpdateUserForm) => {
    const data = await updateUserApi(form);
    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk<void, void>(
  'auth/checkUser',
  async (_arg, { dispatch }) => {
    if (getAccessToken()) {
      try {
        await dispatch(getUser()).unwrap();
      } catch {
        clearTokens();
      }
    }
  }
);
