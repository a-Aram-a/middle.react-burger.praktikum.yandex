import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { useOrder } from '@hooks/use-order';

import styles from './order.module.css';

export const OrderPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { order, status } = useOrder(id);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={styles.container}>
        <Preloader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Заказ не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <OrderInfo order={order} />
    </div>
  );
};
