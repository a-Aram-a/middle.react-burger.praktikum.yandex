import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '@store/index';
import {
  userOrdersWsConnect,
  userOrdersWsDisconnect,
} from '@store/userOrders/userOrdersActions';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, hasLoaded, error } = useAppSelector((s) => s.userOrders);
  const ingredientsLoaded = useAppSelector((s) => s.ingredients.items.length > 0);

  useEffect(() => {
    dispatch(userOrdersWsConnect());
    return (): void => {
      dispatch(userOrdersWsDisconnect());
    };
  }, [dispatch]);

  if (!hasLoaded || !ingredientsLoaded) {
    return (
      <div className={styles.state}>
        {error ? (
          <p className="text text_type_main-default text_color_inactive">{error}</p>
        ) : (
          <Preloader />
        )}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.state}>
        <p className="text text_type_main-default text_color_inactive">
          У вас пока нет заказов
        </p>
      </div>
    );
  }

  const sortedOrders = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ul className={`${styles.list} custom-scroll`}>
      {sortedOrders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          to={`/profile/orders/${order._id}`}
          showStatus
        />
      ))}
    </ul>
  );
};
