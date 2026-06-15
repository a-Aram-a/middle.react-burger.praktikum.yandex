import { API_BASE_URL } from './constants';

import type { TIngredient } from './types';

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) return res.json() as Promise<T>;
  return Promise.reject(new Error(`Ошибка ${res.status}`));
};

const request = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  fetch(`${API_BASE_URL}${endpoint}`, options).then((res) => checkResponse<T>(res));

export const getIngredients = (): Promise<TIngredient[]> =>
  request<{ data: TIngredient[] }>('/ingredients').then((body) => body.data);

export const createOrder = (ingredientIds: string[]): Promise<number> =>
  request<{ order: { number: number }; success: boolean }>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientIds }),
  }).then((body) => body.order.number);
