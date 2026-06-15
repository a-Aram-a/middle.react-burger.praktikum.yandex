import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { clearConstructor } from '@store/constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { resetOrder } from '@store/order/orderSlice';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import styles from './home.module.css';

export const HomePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.ingredients);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrderModal = useCallback((): void => setIsOrderModalOpen(true), []);

  const handleCloseOrderModal = useCallback((): void => {
    setIsOrderModalOpen(false);
    dispatch(resetOrder());
    dispatch(clearConstructor());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return (
      <p className="text text_type_main-medium mt-10" style={{ textAlign: 'center' }}>
        Произошла ошибка при загрузке данных. Попробуйте обновить страницу.
      </p>
    );
  }

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients />
          <BurgerConstructor onOrderClick={handleOpenOrderModal} />
        </DndProvider>
      </main>

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
