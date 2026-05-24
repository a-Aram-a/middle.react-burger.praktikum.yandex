import { API_BASE_URL } from './constants';

import type { TIngredient } from './types';

export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json() as Promise<{ data: TIngredient[] }>;
    })
    .then((body) => body.data);

export const createOrder = (ingredientIds: string[]): Promise<number> =>
  fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredientIds }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json() as Promise<{ order: { number: number }; success: boolean }>;
    })
    .then((body) => body.order.number);
