import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { selectIngredientCounts } from '@store/constructor-slice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { setSelectedIngredient } from '@store/ingredient-details-slice';
import { useDrag } from 'react-dnd';

import { DragTypes } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TIngredientCardProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const counts = useAppSelector(selectIngredientCounts);
  const count = counts[ingredient._id] ?? 0;

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.INGREDIENT,
    item: ingredient,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <li
      ref={drag}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => dispatch(setSelectedIngredient(ingredient))}
    >
      <div className={styles.image_wrapper}>
        <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
        {count > 0 && (
          <Counter count={count} size="default" extraClass={styles.counter} />
        )}
      </div>
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};
