import { describe, expect, it } from 'vitest';

import {
  anotherBun,
  bun,
  main,
  sauce,
  toConstructorIngredient,
} from '@utils/test-fixtures';

import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  moveIngredient,
  removeIngredient,
  selectIngredientCounts,
  selectTotalPrice,
} from './constructorSlice';

const reducer = constructorSlice.reducer;

const initialState = { bun: null, ingredients: [] };

const sauceItem = toConstructorIngredient(sauce, 'uid-1');
const mainItem = toConstructorIngredient(main, 'uid-2');

describe('constructorSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('добавляет начинку в список и не трогает булку', () => {
      const state = reducer(initialState, addIngredient(sauce));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({ _id: sauce._id, name: sauce.name });
    });

    it('добавляет каждой начинке уникальный uid', () => {
      const withFirst = reducer(initialState, addIngredient(sauce));
      const withSecond = reducer(withFirst, addIngredient(sauce));

      const [first, second] = withSecond.ingredients;

      expect(withSecond.ingredients).toHaveLength(2);
      expect(first.uid).toEqual(expect.any(String));
      expect(second.uid).not.toBe(first.uid);
    });

    it('сохраняет порядок добавления начинок', () => {
      const withSauce = reducer(initialState, addIngredient(sauce));
      const withMain = reducer(withSauce, addIngredient(main));

      expect(withMain.ingredients.map((i) => i._id)).toEqual([sauce._id, main._id]);
    });

    it('кладёт булку в bun, а не в список начинок', () => {
      const state = reducer(initialState, addIngredient(bun));

      expect(state.bun).toMatchObject({ _id: bun._id });
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет булку, а не добавляет вторую', () => {
      const withBun = reducer(initialState, addIngredient(bun));
      const withAnotherBun = reducer(withBun, addIngredient(anotherBun));

      expect(withAnotherBun.bun).toMatchObject({ _id: anotherBun._id });
      expect(withAnotherBun.ingredients).toEqual([]);
    });
  });

  describe('removeIngredient', () => {
    it('удаляет начинку по uid', () => {
      const state = reducer(
        { bun: null, ingredients: [sauceItem, mainItem] },
        removeIngredient(sauceItem.uid)
      );

      expect(state.ingredients).toEqual([mainItem]);
    });

    it('удаляет только одну копию одинаковых ингредиентов', () => {
      const duplicate = toConstructorIngredient(sauce, 'uid-3');
      const state = reducer(
        { bun: null, ingredients: [sauceItem, duplicate] },
        removeIngredient(sauceItem.uid)
      );

      expect(state.ingredients).toEqual([duplicate]);
    });

    it('не меняет список при неизвестном uid', () => {
      const state = reducer(
        { bun: null, ingredients: [sauceItem, mainItem] },
        removeIngredient('uid-неизвестный')
      );

      expect(state.ingredients).toEqual([sauceItem, mainItem]);
    });
  });

  describe('moveIngredient', () => {
    it('перемещает начинку вниз по списку', () => {
      const state = reducer(
        { bun: null, ingredients: [sauceItem, mainItem] },
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients).toEqual([mainItem, sauceItem]);
    });

    it('перемещает начинку вверх по списку', () => {
      const third = toConstructorIngredient(main, 'uid-3');
      const state = reducer(
        { bun: null, ingredients: [sauceItem, mainItem, third] },
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients).toEqual([third, sauceItem, mainItem]);
    });

    it('не меняет список при перемещении на ту же позицию', () => {
      const state = reducer(
        { bun: null, ingredients: [sauceItem, mainItem] },
        moveIngredient({ fromIndex: 1, toIndex: 1 })
      );

      expect(state.ingredients).toEqual([sauceItem, mainItem]);
    });
  });

  describe('clearConstructor', () => {
    it('очищает булку и начинки', () => {
      const state = reducer(
        { bun, ingredients: [sauceItem, mainItem] },
        clearConstructor()
      );

      expect(state).toEqual(initialState);
    });

    it('оставляет пустое состояние пустым', () => {
      expect(reducer(initialState, clearConstructor())).toEqual(initialState);
    });
  });
});

describe('selectIngredientCounts', () => {
  it('возвращает пустой объект для пустого конструктора', () => {
    expect(selectIngredientCounts({ burgerConstructor: initialState })).toEqual({});
  });

  it('считает булку дважды — верх и низ', () => {
    const counts = selectIngredientCounts({
      burgerConstructor: { bun, ingredients: [] },
    });

    expect(counts).toEqual({ [bun._id]: 2 });
  });

  it('суммирует одинаковые начинки', () => {
    const counts = selectIngredientCounts({
      burgerConstructor: {
        bun,
        ingredients: [sauceItem, toConstructorIngredient(sauce, 'uid-3'), mainItem],
      },
    });

    expect(counts).toEqual({ [bun._id]: 2, [sauce._id]: 2, [main._id]: 1 });
  });
});

describe('selectTotalPrice', () => {
  it('возвращает 0 для пустого конструктора', () => {
    expect(selectTotalPrice({ burgerConstructor: initialState })).toBe(0);
  });

  it('учитывает булку дважды', () => {
    const total = selectTotalPrice({ burgerConstructor: { bun, ingredients: [] } });

    expect(total).toBe(bun.price * 2);
  });

  it('суммирует стоимость булки и всех начинок', () => {
    const total = selectTotalPrice({
      burgerConstructor: { bun, ingredients: [sauceItem, mainItem] },
    });

    expect(total).toBe(bun.price * 2 + sauce.price + main.price);
  });

  it('считает начинки без булки', () => {
    const total = selectTotalPrice({
      burgerConstructor: { bun: null, ingredients: [sauceItem, mainItem] },
    });

    expect(total).toBe(sauce.price + main.price);
  });
});
