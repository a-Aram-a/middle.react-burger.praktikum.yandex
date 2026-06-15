import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useAppSelector } from '@store/index';
import { useRef, useState } from 'react';

import { IngredientCard } from './ingredient-card';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients = useAppSelector((s) => s.ingredients.items);
  const [currentTab, setCurrentTab] = useState('bun');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  const handleScroll = (): void => {
    const containerTop = scrollAreaRef.current?.getBoundingClientRect().top ?? 0;
    const sections: { value: string; ref: React.RefObject<HTMLHeadingElement> }[] = [
      { value: 'bun', ref: bunsRef },
      { value: 'sauce', ref: saucesRef },
      { value: 'main', ref: mainsRef },
    ];
    const closest = sections.reduce((prev, curr) => {
      const prevDist = Math.abs(
        (prev.ref.current?.getBoundingClientRect().top ?? Infinity) - containerTop
      );
      const currDist = Math.abs(
        (curr.ref.current?.getBoundingClientRect().top ?? Infinity) - containerTop
      );
      return currDist < prevDist ? curr : prev;
    });
    setCurrentTab(closest.value);
  };

  const buns = ingredients.filter((i: TIngredient) => i.type === 'bun');
  const sauces = ingredients.filter((i: TIngredient) => i.type === 'sauce');
  const mains = ingredients.filter((i: TIngredient) => i.type === 'main');

  const renderGroup = (
    title: string,
    items: TIngredient[],
    ref: React.RefObject<HTMLHeadingElement>
  ): React.JSX.Element => (
    <section className="mt-10">
      <h2 ref={ref} className="text text_type_main-medium mb-6">
        {title}
      </h2>
      <ul className={styles.grid}>
        {items.map((ingredient) => (
          <IngredientCard key={ingredient._id} ingredient={ingredient} />
        ))}
      </ul>
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
      <div
        ref={scrollAreaRef}
        className={`${styles.scroll_area} custom-scroll`}
        onScroll={handleScroll}
      >
        {renderGroup('Булки', buns, bunsRef)}
        {renderGroup('Соусы', sauces, saucesRef)}
        {renderGroup('Начинки', mains, mainsRef)}
      </div>
    </section>
  );
};
