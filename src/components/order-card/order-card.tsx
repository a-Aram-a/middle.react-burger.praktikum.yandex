import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';
import { selectIngredientsById } from '@store/ingredients/ingredientsSlice';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  STATUS_LABELS,
  calculateOrderPrice,
  getVisibleIngredientIds,
} from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  to: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  to,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const ingredientsById = useAppSelector(selectIngredientsById);

  const price = calculateOrderPrice(order, ingredientsById);
  const { visibleIds, remaining } = getVisibleIngredientIds(order.ingredients);

  const handleClick = (): void => {
    void navigate(to, { state: { background: location } });
  };

  return (
    <li className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">
          #{String(order.number).padStart(6, '0')}
        </span>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>

      <p className={`${styles.name} text text_type_main-medium mt-6 mb-2`}>
        {order.name}
      </p>

      {showStatus && (
        <p
          className={`${styles.status} text text_type_main-default ${
            order.status === 'done' ? styles.status_done : ''
          }`}
        >
          {STATUS_LABELS[order.status]}
        </p>
      )}

      <div className={`${styles.footer} mt-6`}>
        <ul className={styles.ingredients}>
          {visibleIds.map((id, index) => {
            const ingredient = ingredientsById[id];
            if (!ingredient) return null;
            const isLast = index === visibleIds.length - 1 && remaining > 0;
            return (
              <li
                key={`${id}-${index}`}
                className={styles.ingredient}
                style={{ zIndex: visibleIds.length - index }}
              >
                <img
                  className={styles.ingredient_image}
                  src={ingredient.image}
                  alt={ingredient.name}
                />
                {isLast && (
                  <span className={styles.ingredient_overlay}>+{remaining}</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </li>
  );
};
