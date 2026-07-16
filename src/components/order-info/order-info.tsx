import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';
import { selectIngredientsById } from '@store/ingredients/ingredientsSlice';

import { STATUS_LABELS, calculateOrderPrice } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order: TOrder;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  const ingredientsById = useAppSelector(selectIngredientsById);
  const price = calculateOrderPrice(order, ingredientsById);

  const counts = new Map<string, number>();
  order.ingredients.forEach((id) => {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-default">
        #{String(order.number).padStart(6, '0')}
      </p>

      <h2 className={`${styles.name} text text_type_main-medium mt-10 mb-3`}>
        {order.name}
      </h2>

      <p
        className={`text text_type_main-default mb-15 ${
          order.status === 'done' ? styles.status_done : ''
        }`}
      >
        {STATUS_LABELS[order.status]}
      </p>

      <h3 className="text text_type_main-medium mb-6">Состав:</h3>
      <ul className={`${styles.ingredients} custom-scroll`}>
        {Array.from(counts.entries()).map(([id, count]) => {
          const ingredient = ingredientsById[id];
          if (!ingredient) return null;
          return (
            <li key={id} className={styles.ingredient}>
              <div className={styles.ingredient_image_wrapper}>
                <img
                  className={styles.ingredient_image}
                  src={ingredient.image}
                  alt={ingredient.name}
                />
              </div>
              <p className={`${styles.ingredient_name} text text_type_main-default`}>
                {ingredient.name}
              </p>
              <div className={styles.ingredient_price}>
                <span className="text text_type_digits-default mr-2">
                  {count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`${styles.footer} mt-10`}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
