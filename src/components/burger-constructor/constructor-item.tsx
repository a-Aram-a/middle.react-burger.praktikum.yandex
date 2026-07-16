import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { moveIngredient, removeIngredient } from '@store/constructor/constructorSlice';
import { useAppDispatch } from '@store/index';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { DragTypes } from '@utils/constants';

import type { TConstructorIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TConstructorItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

type TDragItem = {
  uid: string;
  index: number;
};

export const ConstructorItem = ({
  ingredient,
  index,
}: TConstructorItemProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [, drag] = useDrag<TDragItem>({
    type: DragTypes.CONSTRUCTOR_ITEM,
    item: { uid: ingredient.uid, index },
  });

  const [, drop] = useDrop<TDragItem>({
    accept: DragTypes.CONSTRUCTOR_ITEM,
    hover(draggedItem) {
      if (draggedItem.index === index) return;
      dispatch(moveIngredient({ fromIndex: draggedItem.index, toIndex: index }));
      draggedItem.index = index;
    },
  });

  drag(drop(ref));

  return (
    <li ref={ref} className={styles.filling_item} data-testid="constructor-filling">
      <DragIcon type="secondary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => dispatch(removeIngredient(ingredient.uid))}
      />
    </li>
  );
};
