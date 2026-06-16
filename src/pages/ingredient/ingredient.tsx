import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import styles from './ingredient.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { items, status } = useAppSelector((s) => s.ingredients);
  const ingredient = items.find((item) => item._id === id);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={styles.container}>
        <Preloader />
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large`}>Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};
