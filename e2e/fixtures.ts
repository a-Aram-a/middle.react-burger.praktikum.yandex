import type { Page } from '@playwright/test';

// Ответы API лежат в HAR-файлах; здесь — только те поля, которые проверяют тесты.
export const BUN = {
  id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  price: 1255,
};
export const ANOTHER_BUN = {
  id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  price: 988,
};
export const SAUCE = { id: '643d69a5c3f7b9001cfa0942', name: 'Соус Spicy-X', price: 90 };
export const MAIN = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  price: 424,
  calories: 4242,
  proteins: 420,
};

export const ORDER_NUMBER = 54321;

const API_GLOB = '**/api/**';
const ORDERS_GLOB = '**/api/orders';

export const mockApi = async (page: Page): Promise<void> => {
  await page.routeFromHAR('e2e/har/api.har', { url: API_GLOB, notFound: 'abort' });
};

// Регистрируется после mockApi, поэтому перекрывает успешный ответ на POST /orders.
export const mockOrderError = async (page: Page): Promise<void> => {
  await page.routeFromHAR('e2e/har/api-order-error.har', {
    url: ORDERS_GLOB,
    notFound: 'abort',
  });
};

export const authenticate = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer e2e-access-token');
    localStorage.setItem('refreshToken', 'e2e-refresh-token');
  });
};
