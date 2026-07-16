import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { addIngredient, selectTotalPrice } from '@store/constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { placeOrder } from '@store/order/orderActions';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { DragTypes } from '@utils/constants';

import { ConstructorItem } from './constructor-item';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const bun = useAppSelector((s) => s.burgerConstructor.bun);
  const ingredients = useAppSelector((s) => s.burgerConstructor.ingredients);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [{ isOver: isBunTopOver }, bunTopDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: DragTypes.INGREDIENT,
    canDrop: (item) => item.type === 'bun',
    drop: (item) => dispatch(addIngredient(item)),
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.canDrop() }),
  });

  const [{ isOver: isBunBottomOver }, bunBottomDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: DragTypes.INGREDIENT,
    canDrop: (item) => item.type === 'bun',
    drop: (item) => dispatch(addIngredient(item)),
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.canDrop() }),
  });

  const [{ isOver: isFillingsOver }, fillingsDrop] = useDrop<
    TIngredient,
    void,
    { isOver: boolean }
  >({
    accept: DragTypes.INGREDIENT,
    canDrop: (item) => item.type !== 'bun',
    drop: (item) => dispatch(addIngredient(item)),
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.canDrop() }),
  });

  const handleOrderClick = (): void => {
    if (!bun) return;
    if (!user) {
      void navigate('/login');
      return;
    }
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    void dispatch(placeOrder(ids));
    onOrderClick();
  };

  return (
    <section className={styles.burger_constructor}>
      <div
        ref={bunTopDrop}
        className={`ml-8 mb-4 ${isBunTopOver ? styles.drop_active : ''}`}
        data-testid="constructor-bun-top"
      >
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className="text text_type_main-default text_color_inactive">
              Выберите булки
            </span>
          </div>
        )}
      </div>

      <ul
        ref={fillingsDrop}
        className={`${styles.fillings} custom-scroll ${isFillingsOver ? styles.drop_active : ''}`}
        data-testid="constructor-fillings"
      >
        {ingredients.length > 0 ? (
          ingredients.map((item, index) => (
            <ConstructorItem key={item.uid} ingredient={item} index={index} />
          ))
        ) : (
          <li className={styles.placeholder_item}>
            <span className="text text_type_main-default text_color_inactive">
              Выберите начинку
            </span>
          </li>
        )}
      </ul>

      <div
        ref={bunBottomDrop}
        className={`ml-8 mt-4 ${isBunBottomOver ? styles.drop_active : ''}`}
        data-testid="constructor-bun-bottom"
      >
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className="text text_type_main-default text_color_inactive">
              Выберите булки
            </span>
          </div>
        )}
      </div>

      <div className={`${styles.footer} mt-10 mr-4`}>
        <div className={`${styles.total} mr-10`}>
          <span className="text text_type_digits-medium mr-2" data-testid="total-price">
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
