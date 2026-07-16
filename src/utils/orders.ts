import type { TIngredient, TOrder } from './types';

const VALID_STATUSES = new Set(['created', 'pending', 'done']);

const isValidOrder = (value: unknown): value is TOrder => {
  if (typeof value !== 'object' || value === null) return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order._id === 'string' &&
    typeof order.number === 'number' &&
    typeof order.status === 'string' &&
    VALID_STATUSES.has(order.status) &&
    Array.isArray(order.ingredients) &&
    order.ingredients.length > 0 &&
    order.ingredients.every((id) => typeof id === 'string') &&
    typeof order.createdAt === 'string' &&
    typeof order.updatedAt === 'string'
  );
};

const withFallbackName = (order: TOrder): TOrder => ({
  ...order,
  name: typeof order.name === 'string' ? order.name : '',
});

export const sanitizeOrders = (orders: unknown): TOrder[] =>
  Array.isArray(orders) ? orders.filter(isValidOrder).map(withFallbackName) : [];

export const sanitizeOrder = (order: unknown): TOrder | null =>
  isValidOrder(order) ? withFallbackName(order) : null;

export const calculateOrderPrice = (
  order: TOrder,
  ingredientsById: Record<string, TIngredient>
): number =>
  order.ingredients.reduce((sum, id) => sum + (ingredientsById[id]?.price ?? 0), 0);

export const getVisibleIngredientIds = (
  ids: string[],
  max = 6
): { visibleIds: string[]; remaining: number } => {
  if (ids.length <= max) return { visibleIds: ids, remaining: 0 };
  const visibleIds = ids.slice(0, max - 1);
  return { visibleIds, remaining: ids.length - visibleIds.length };
};

export const STATUS_LABELS: Record<TOrder['status'], string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export const chunkColumns = <T>(items: T[], perColumn = 10, maxColumns = 2): T[][] => {
  const trimmed = items.slice(0, perColumn * maxColumns);
  const columns: T[][] = [];
  for (let i = 0; i < trimmed.length; i += perColumn) {
    columns.push(trimmed.slice(i, i + perColumn));
  }
  return columns;
};
