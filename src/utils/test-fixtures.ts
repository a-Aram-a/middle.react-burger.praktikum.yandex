import type { TConstructorIngredient, TIngredient, TOrder, TUser } from './types';

export const bun: TIngredient = {
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

export const anotherBun: TIngredient = {
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

export const sauce: TIngredient = {
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

export const main: TIngredient = {
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

export const ingredients: TIngredient[] = [bun, anotherBun, sauce, main];

export const user: TUser = {
  email: 'stellar@burger.space',
  name: 'Космонавт',
};

export const order: TOrder = {
  _id: '664e2b1c119d45001b50a1f3',
  ingredients: [bun._id, main._id, bun._id],
  status: 'done',
  number: 12345,
  createdAt: '2024-05-22T10:15:32.428Z',
  updatedAt: '2024-05-22T10:15:33.180Z',
  name: 'Краторный люминесцентный бургер',
};

export const anotherOrder: TOrder = {
  _id: '664e2b1c119d45001b50a1f4',
  ingredients: [anotherBun._id, sauce._id, anotherBun._id],
  status: 'pending',
  number: 12346,
  createdAt: '2024-05-22T11:02:11.031Z',
  updatedAt: '2024-05-22T11:02:12.774Z',
  name: 'Флюоресцентный космический бургер',
};

export const toConstructorIngredient = (
  ingredient: TIngredient,
  uid: string
): TConstructorIngredient => ({ ...ingredient, uid });
