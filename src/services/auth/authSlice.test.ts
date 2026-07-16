import { describe, expect, it } from 'vitest';

import { user } from '@utils/test-fixtures';

import {
  checkUserAuth,
  getUser,
  login,
  logout,
  register,
  updateUser,
} from './authActions';
import { authSlice } from './authSlice';

const reducer = authSlice.reducer;

const initialState = { user: null, isAuthChecked: false };

const authorizedState = { user, isAuthChecked: true };

const registerForm = { email: user.email, password: 'password', name: user.name };
const loginForm = { email: user.email, password: 'password' };
const updateForm = { email: user.email, password: 'password', name: 'Новое имя' };

describe('authSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('register.fulfilled сохраняет пользователя', () => {
    const state = reducer(initialState, register.fulfilled(user, 'id', registerForm));

    expect(state.user).toEqual(user);
  });

  it('register.rejected не сохраняет пользователя', () => {
    const state = reducer(
      initialState,
      register.rejected(new Error('Пользователь уже существует'), 'id', registerForm)
    );

    expect(state).toEqual(initialState);
  });

  it('login.fulfilled сохраняет пользователя', () => {
    const state = reducer(initialState, login.fulfilled(user, 'id', loginForm));

    expect(state.user).toEqual(user);
  });

  it('login.rejected не сохраняет пользователя', () => {
    const state = reducer(
      initialState,
      login.rejected(new Error('Неверный логин или пароль'), 'id', loginForm)
    );

    expect(state).toEqual(initialState);
  });

  it('getUser.fulfilled сохраняет пользователя', () => {
    const state = reducer(initialState, getUser.fulfilled(user, 'id', undefined));

    expect(state.user).toEqual(user);
  });

  it('updateUser.fulfilled обновляет данные пользователя', () => {
    const updated = { ...user, name: 'Новое имя' };
    const state = reducer(
      authorizedState,
      updateUser.fulfilled(updated, 'id', updateForm)
    );

    expect(state.user).toEqual(updated);
  });

  it('updateUser.rejected оставляет прежние данные пользователя', () => {
    const state = reducer(
      authorizedState,
      updateUser.rejected(new Error('Ошибка обновления'), 'id', updateForm)
    );

    expect(state.user).toEqual(user);
  });

  it('logout.fulfilled очищает пользователя', () => {
    const state = reducer(authorizedState, logout.fulfilled(undefined, 'id', undefined));

    expect(state.user).toBeNull();
  });

  it('logout.fulfilled не сбрасывает флаг проверки авторизации', () => {
    const state = reducer(authorizedState, logout.fulfilled(undefined, 'id', undefined));

    expect(state.isAuthChecked).toBe(true);
  });

  it('checkUserAuth.fulfilled выставляет флаг проверки авторизации', () => {
    const state = reducer(
      initialState,
      checkUserAuth.fulfilled(undefined, 'id', undefined)
    );

    expect(state.isAuthChecked).toBe(true);
  });

  it('checkUserAuth.rejected тоже выставляет флаг проверки авторизации', () => {
    const state = reducer(
      initialState,
      checkUserAuth.rejected(new Error('Ошибка сети'), 'id', undefined)
    );

    expect(state).toEqual({ user: null, isAuthChecked: true });
  });

  it('checkUserAuth.pending оставляет флаг проверки авторизации сброшенным', () => {
    const state = reducer(initialState, checkUserAuth.pending('id', undefined));

    expect(state.isAuthChecked).toBe(false);
  });
});
