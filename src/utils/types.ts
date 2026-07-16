export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & { uid: string };

export type TUser = {
  email: string;
  name: string;
};

export type TRegisterForm = {
  email: string;
  password: string;
  name: string;
};

export type TLoginForm = {
  email: string;
  password: string;
};

export type TUpdateUserForm = {
  name: string;
  email: string;
  password: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type TOrdersWsMessage = {
  success: boolean;
  orders?: unknown;
  total?: number;
  totalToday?: number;
  message?: string;
};
