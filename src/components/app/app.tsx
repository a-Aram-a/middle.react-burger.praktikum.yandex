import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { clearConstructor } from '@store/constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { clearSelectedIngredient } from '@store/ingredient-details/ingredientDetailsSlice';
import { fetchIngredients } from '@store/ingredients/ingredientsActions';
import { resetOrder } from '@store/order/orderSlice';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.ingredients);
  const selectedIngredient = useAppSelector((s) => s.ingredientDetails.ingredient);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleOpenOrderModal = useCallback(() => setIsOrderModalOpen(true), []);

  const handleCloseOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
    dispatch(resetOrder());
    dispatch(clearConstructor());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') return <Preloader />;

  if (status === 'failed') {
    return (
      <p className="text text_type_main-medium mt-10" style={{ textAlign: 'center' }}>
        Произошла ошибка при загрузке данных. Попробуйте обновить страницу.
      </p>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor onOrderClick={handleOpenOrderModal} />
      </main>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
