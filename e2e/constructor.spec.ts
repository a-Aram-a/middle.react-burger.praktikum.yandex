import { expect, test } from '@playwright/test';

import {
  ANOTHER_BUN,
  BUN,
  MAIN,
  ORDER_NUMBER,
  SAUCE,
  authenticate,
  mockApi,
} from './fixtures';

import type { Locator, Page } from '@playwright/test';

const ingredientCard = (page: Page, id: string): Locator =>
  page.getByTestId(`ingredient-${id}`);

const ingredientCounter = (page: Page, id: string): Locator =>
  page.getByTestId(`counter-${id}`);

const dragToConstructor = async (
  page: Page,
  id: string,
  target: string
): Promise<void> => {
  await ingredientCard(page, id).dragTo(page.getByTestId(target));
};

const assembleBurger = async (page: Page): Promise<void> => {
  await dragToConstructor(page, BUN._id, 'constructor-bun-top');
  await dragToConstructor(page, SAUCE._id, 'constructor-fillings');
};

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await authenticate(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});

test.describe('Конструктор — перетаскивание ингредиентов', () => {
  test('пустой конструктор показывает подсказки', async ({ page }) => {
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-fillings')).toContainText(
      'Выберите начинку'
    );
    await expect(page.getByTestId('total-price')).toHaveText('0');
  });

  test('булка занимает верх и низ конструктора', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-bun-top');

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      `${BUN.name} (верх)`
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      `${BUN.name} (низ)`
    );
  });

  test('счётчик булки показывает 2, а цена удваивается', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-bun-top');

    await expect(ingredientCounter(page, BUN._id)).toHaveText('2');
    await expect(page.getByTestId('total-price')).toHaveText(String(BUN.price * 2));
  });

  test('новая булка заменяет предыдущую', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-bun-top');
    await dragToConstructor(page, ANOTHER_BUN._id, 'constructor-bun-top');

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      `${ANOTHER_BUN.name} (верх)`
    );
    await expect(ingredientCounter(page, BUN._id)).toBeHidden();
    await expect(ingredientCounter(page, ANOTHER_BUN._id)).toHaveText('2');
    await expect(page.getByTestId('total-price')).toHaveText(
      String(ANOTHER_BUN.price * 2)
    );
  });

  test('начинки добавляются в середину и суммируются в цене', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-bun-top');
    await dragToConstructor(page, SAUCE._id, 'constructor-fillings');
    await dragToConstructor(page, MAIN._id, 'constructor-fillings');

    const fillings = page.getByTestId('constructor-filling');

    await expect(fillings).toHaveCount(2);
    await expect(fillings.nth(0)).toContainText(SAUCE.name);
    await expect(fillings.nth(1)).toContainText(MAIN.name);
    await expect(page.getByTestId('total-price')).toHaveText(
      String(BUN.price * 2 + SAUCE.price + MAIN.price)
    );
  });

  test('булку нельзя бросить в зону начинок', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-fillings');

    await expect(page.getByTestId('constructor-filling')).toHaveCount(0);
    await expect(page.getByTestId('constructor-fillings')).toContainText(
      'Выберите начинку'
    );
  });

  test('одинаковые начинки считаются счётчиком', async ({ page }) => {
    await dragToConstructor(page, SAUCE._id, 'constructor-fillings');
    await dragToConstructor(page, SAUCE._id, 'constructor-fillings');

    await expect(page.getByTestId('constructor-filling')).toHaveCount(2);
    await expect(ingredientCounter(page, SAUCE._id)).toHaveText('2');
  });

  test('начинку можно удалить из конструктора', async ({ page }) => {
    await dragToConstructor(page, BUN._id, 'constructor-bun-top');
    await dragToConstructor(page, SAUCE._id, 'constructor-fillings');

    await page
      .getByTestId('constructor-filling')
      .locator('.constructor-element__action')
      .click();

    await expect(page.getByTestId('constructor-filling')).toHaveCount(0);
    await expect(ingredientCounter(page, SAUCE._id)).toBeHidden();
    await expect(page.getByTestId('total-price')).toHaveText(String(BUN.price * 2));
  });
});

test.describe('Конструктор — модальное окно ингредиента', () => {
  test('клик по ингредиенту открывает модалку с деталями', async ({ page }) => {
    await ingredientCard(page, MAIN._id).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText(MAIN.name);
    await expect(modal).toContainText(String(MAIN.calories));
    await expect(modal).toContainText(String(MAIN.proteins));
    await expect(page).toHaveURL(`/ingredients/${MAIN._id}`);
  });

  test('модалка закрывается по клику на крестик', async ({ page }) => {
    await ingredientCard(page, MAIN._id).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('модалка закрывается по клику на оверлей', async ({ page }) => {
    await ingredientCard(page, MAIN._id).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(page.getByTestId('modal')).toBeHidden();
  });

  test('модалка закрывается по Escape', async ({ page }) => {
    await ingredientCard(page, MAIN._id).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('modal')).toBeHidden();
  });
});

test.describe('Конструктор — оформление заказа', () => {
  test('собранный бургер отправляется на сервер и показывает номер заказа', async ({
    page,
  }) => {
    await assembleBurger(page);

    const [request] = await Promise.all([
      page.waitForRequest(
        (r) => r.url().endsWith('/api/orders') && r.method() === 'POST'
      ),
      page.getByRole('button', { name: 'Оформить заказ' }).click(),
    ]);

    expect(request.postDataJSON()).toEqual({
      ingredients: [BUN._id, SAUCE._id, BUN._id],
    });

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(String(ORDER_NUMBER));
    await expect(modal).toContainText('идентификатор заказа');
    await expect(modal).toContainText('Ваш заказ начали готовить');
  });

  test('закрытие модалки заказа очищает конструктор', async ({ page }) => {
    await assembleBurger(page);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('order-number')).toHaveText(String(ORDER_NUMBER));

    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).toBeHidden();
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-fillings')).toContainText(
      'Выберите начинку'
    );
    await expect(page.getByTestId('total-price')).toHaveText('0');
  });

  test('бургер без булки не оформляется', async ({ page }) => {
    await dragToConstructor(page, SAUCE._id, 'constructor-fillings');

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('ошибка сервера показывается в модалке заказа', async ({ page }) => {
    await page.route('**/api/orders', (route) =>
      route.fulfill({ status: 500, json: { success: false, message: 'Ошибка сервера' } })
    );
    await assembleBurger(page);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toContainText('Ошибка при создании заказа');
  });
});
