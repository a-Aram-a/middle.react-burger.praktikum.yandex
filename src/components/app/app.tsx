import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getIngredients()
      .then(setIngredients)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const bun = useMemo(
    () => ingredients.find((i) => i.type === 'bun') ?? null,
    [ingredients]
  );
  const fillings = useMemo(
    () => ingredients.filter((i) => i.type !== 'bun').slice(0, 5),
    [ingredients]
  );

  const ingredientCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (bun) counts[bun._id] = 2;
    fillings.forEach((i) => {
      counts[i._id] = (counts[i._id] ?? 0) + 1;
    });
    return counts;
  }, [bun, fillings]);

  const totalPrice = useMemo(
    () => (bun?.price ?? 0) * 2 + fillings.reduce((s, i) => s + i.price, 0),
    [bun, fillings]
  );

  const handleOpenOrderModal = useCallback(() => setIsOrderModalOpen(true), []);
  const handleCloseOrderModal = useCallback(() => setIsOrderModalOpen(false), []);
  const handleCloseIngredientModal = useCallback(() => setSelectedIngredient(null), []);

  if (isLoading) return <Preloader />;

  if (hasError) {
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
        <BurgerIngredients
          ingredients={ingredients}
          ingredientCounts={ingredientCounts}
          onIngredientClick={setSelectedIngredient}
        />
        <BurgerConstructor
          bun={bun}
          fillings={fillings}
          totalPrice={totalPrice}
          onOrderClick={handleOpenOrderModal}
        />
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
