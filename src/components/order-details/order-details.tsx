import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const { number, status } = useAppSelector((s) => s.order);

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <Preloader />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">
          Ошибка при создании заказа. Попробуйте снова.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p
        className={`${styles.order_id} text text_type_digits-large mb-8`}
        data-testid="order-number"
      >
        {number}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`${styles.icon_wrapper} mb-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
