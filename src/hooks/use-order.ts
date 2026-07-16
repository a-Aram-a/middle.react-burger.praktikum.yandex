import { useAppSelector } from '@store/index';
import { useEffect, useState } from 'react';

import { getOrderApi } from '@utils/api';
import { sanitizeOrder } from '@utils/orders';

import type { TOrder } from '@utils/types';

type TUseOrderStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type TUseOrderResult = {
  order: TOrder | undefined;
  status: TUseOrderStatus;
};

export const useOrder = (id: string | undefined): TUseOrderResult => {
  const feedOrder = useAppSelector((s) =>
    s.feed.orders.find((order) => order._id === id)
  );
  const userOrder = useAppSelector((s) =>
    s.userOrders.orders.find((order) => order._id === id)
  );
  const storeOrder = feedOrder ?? userOrder;

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);
  const [fetchStatus, setFetchStatus] = useState<TUseOrderStatus>('idle');

  useEffect(() => {
    if (storeOrder || !id) return;

    let isCancelled = false;
    setFetchStatus('loading');

    getOrderApi(id)
      .then((data) => {
        if (isCancelled) return;
        const order = sanitizeOrder(data.order);
        if (order) {
          setFetchedOrder(order);
          setFetchStatus('succeeded');
        } else {
          setFetchStatus('failed');
        }
      })
      .catch(() => {
        if (!isCancelled) setFetchStatus('failed');
      });

    return (): void => {
      isCancelled = true;
    };
  }, [storeOrder, id]);

  if (storeOrder) {
    return { order: storeOrder, status: 'succeeded' };
  }

  if (!id) {
    return { order: undefined, status: 'failed' };
  }

  return { order: fetchedOrder ?? undefined, status: fetchStatus };
};
