import type { Page } from '@playwright/test';

export const BUN = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  __v: 0,
};

export const ANOTHER_BUN = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  __v: 0,
};

export const SAUCE = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  __v: 0,
};

export const MAIN = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  __v: 0,
};

export const INGREDIENTS = [BUN, ANOTHER_BUN, SAUCE, MAIN];

export const USER = { email: 'stellar@burger.space', name: 'Космонавт' };

export const ORDER_NUMBER = 54321;

export const mockApi = async (page: Page): Promise<void> => {
  await page.route('**/api/ingredients', (route) =>
    route.fulfill({ json: { success: true, data: INGREDIENTS } })
  );

  await page.route('**/api/auth/user', (route) =>
    route.fulfill({ json: { success: true, user: USER } })
  );

  await page.route('**/api/orders', (route) =>
    route.fulfill({
      json: {
        success: true,
        name: 'Краторный бургер',
        order: { number: ORDER_NUMBER },
      },
    })
  );
};

export const authenticate = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer e2e-access-token');
    localStorage.setItem('refreshToken', 'e2e-refresh-token');
  });
};
