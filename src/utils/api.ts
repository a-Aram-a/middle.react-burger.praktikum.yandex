import { API_BASE_URL } from './constants';
import { getAccessToken, getRefreshToken, setTokens } from './tokens';

import type {
  TIngredient,
  TLoginForm,
  TRegisterForm,
  TUpdateUserForm,
  TUser,
} from './types';

type TServerResponse<T> = { success: boolean } & T;

type TAuthResponse = TServerResponse<{
  user: TUser;
  accessToken: string;
  refreshToken: string;
}>;

type TRefreshResponse = TServerResponse<{
  accessToken: string;
  refreshToken: string;
}>;

type TUserResponse = TServerResponse<{ user: TUser }>;

type TMessageResponse = TServerResponse<{ message: string }>;

const jsonHeaders = { 'Content-Type': 'application/json' };

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) return res.json() as Promise<T>;
  return res
    .json()
    .then((err: { message?: string }) =>
      Promise.reject(new Error(err.message ?? `Ошибка ${res.status}`))
    );
};

const request = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  fetch(`${API_BASE_URL}${endpoint}`, options).then((res) => checkResponse<T>(res));

const refreshToken = (): Promise<TRefreshResponse> =>
  request<TRefreshResponse>('/auth/token', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: getRefreshToken() }),
  });

const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      const data = await refreshToken();
      setTokens(data.accessToken, data.refreshToken);
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          authorization: data.accessToken,
        },
      });
      return await checkResponse<T>(res);
    }
    throw err;
  }
};

export const getIngredients = (): Promise<TIngredient[]> =>
  request<TServerResponse<{ data: TIngredient[] }>>('/ingredients').then(
    (body) => body.data
  );

export const createOrder = (ingredientIds: string[]): Promise<number> =>
  fetchWithRefresh<TServerResponse<{ order: { number: number } }>>('/orders', {
    method: 'POST',
    headers: { ...jsonHeaders, authorization: getAccessToken() ?? '' },
    body: JSON.stringify({ ingredients: ingredientIds }),
  }).then((body) => body.order.number);

export const registerApi = (form: TRegisterForm): Promise<TAuthResponse> =>
  request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });

export const loginApi = (form: TLoginForm): Promise<TAuthResponse> =>
  request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });

export const logoutApi = (): Promise<TMessageResponse> =>
  request<TMessageResponse>('/auth/logout', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: getRefreshToken() }),
  });

export const getUserApi = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('/auth/user', {
    headers: { authorization: getAccessToken() ?? '' },
  });

export const updateUserApi = (form: TUpdateUserForm): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: { ...jsonHeaders, authorization: getAccessToken() ?? '' },
    body: JSON.stringify(form),
  });

export const forgotPasswordApi = (email: string): Promise<TMessageResponse> =>
  request<TMessageResponse>('/password-reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });

export const resetPasswordApi = (form: {
  password: string;
  token: string;
}): Promise<TMessageResponse> =>
  request<TMessageResponse>('/password-reset/reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });
