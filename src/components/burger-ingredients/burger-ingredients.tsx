import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  ingredientCounts: Record<string, number>;
  onIngredientClick: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  ingredientCounts,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');

  const bunsRef = useRef<HTMLHeadingElement>(null);
  const saucesRef = useRef<HTMLHeadingElement>(null);
  const mainsRef = useRef<HTMLHeadingElement>(null);

  const handleTabClick = (value: string): void => {
    setCurrentTab(value);
    const refs: Record<string, React.RefObject<HTMLHeadingElement>> = {
      bun: bunsRef,
      sauce: saucesRef,
      main: mainsRef,
    };
    refs[value]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const buns = ingredients.filter((i) => i.type === 'bun');
  const sauces = ingredients.filter((i) => i.type === 'sauce');
  const mains = ingredients.filter((i) => i.type === 'main');

  const renderCard = (ingredient: TIngredient): React.JSX.Element => {
    const count = ingredientCounts[ingredient._id] ?? 0;
    return (
      <li
        key={ingredient._id}
        className={styles.card}
        onClick={() => onIngredientClick(ingredient)}
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

  const renderGroup = (
    title: string,
    items: TIngredient[],
    ref: React.RefObject<HTMLHeadingElement>
  ): React.JSX.Element => (
    <section className="mt-10">
      <h2 ref={ref} className="text text_type_main-medium mb-6">
        {title}
      </h2>
      <ul className={styles.grid}>{items.map(renderCard)}</ul>
    </section>
  );

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.scroll_area} custom-scroll`}>
        {renderGroup('Булки', buns, bunsRef)}
        {renderGroup('Соусы', sauces, saucesRef)}
        {renderGroup('Начинки', mains, mainsRef)}
      </div>
    </section>
  );
};
