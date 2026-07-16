export const API_BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api$/, '');

export const WS_FEED_URL = `${WS_BASE_URL}/orders/all`;
export const WS_ORDERS_URL = `${WS_BASE_URL}/orders`;

export const DragTypes = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_ITEM: 'constructor-item',
} as const;
