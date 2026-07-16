import { expect, test } from '@playwright/test';

import {
  ANOTHER_BUN,
  BUN,
  MAIN,
  ORDER_NUMBER,
  SAUCE,
  authenticate,
  mockApi,
  mockOrderError,
} from './fixtures';

import type { Locator, Page } from '@playwright/test';

const ingredientCard = (page: Page, id: string): Locator =>
  page.getByTestId(`ingredient-${id}`);

const ingredientCounter = (page: Page, id: string): Locator =>
  page.getByTestId(`counter-${id}`);

const bunTop = (page: Page): Locator => page.getByTestId('constructor-bun-top');
const bunBottom = (page: Page): Locator => page.getByTestId('constructor-bun-bottom');
const fillingsZone = (page: Page): Locator => page.getByTestId('constructor-fillings');
const fillings = (page: Page): Locator => page.getByTestId('constructor-filling');
const totalPrice = (page: Page): Locator => page.getByTestId('total-price');
const modal = (page: Page): Locator => page.getByTestId('modal');
const orderButton = (page: Page): Locator =>
  page.getByRole('button', { name: 'Оформить заказ' });

const dragToConstructor = async (
  page: Page,
  id: string,
  target: Locator
): Promise<void> => {
  await ingredientCard(page, id).dragTo(target);
};

const assembleBurger = async (page: Page): Promise<void> => {
  await dragToConstructor(page, BUN.id, bunTop(page));
  await dragToConstructor(page, SAUCE.id, fillingsZone(page));
};

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await authenticate(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});

test.describe('Конструктор — перетаскивание ингредиентов', () => {
  test('пустой конструктор показывает подсказки', async ({ page }) => {
    await expect(bunTop(page)).toContainText('Выберите булки');
    await expect(bunBottom(page)).toContainText('Выберите булки');
    await expect(fillingsZone(page)).toContainText('Выберите начинку');
    await expect(totalPrice(page)).toHaveText('0');
  });

  test('булка занимает верх и низ конструктора', async ({ page }) => {
    await dragToConstructor(page, BUN.id, bunTop(page));

    await expect(bunTop(page)).toContainText(`${BUN.name} (верх)`);
    await expect(bunBottom(page)).toContainText(`${BUN.name} (низ)`);
  });

  test('счётчик булки показывает 2, а цена удваивается', async ({ page }) => {
    await dragToConstructor(page, BUN.id, bunTop(page));

    await expect(ingredientCounter(page, BUN.id)).toHaveText('2');
    await expect(totalPrice(page)).toHaveText(String(BUN.price * 2));
  });

  test('новая булка заменяет предыдущую', async ({ page }) => {
    await dragToConstructor(page, BUN.id, bunTop(page));
    await dragToConstructor(page, ANOTHER_BUN.id, bunTop(page));

    await expect(bunTop(page)).toContainText(`${ANOTHER_BUN.name} (верх)`);
    await expect(ingredientCounter(page, BUN.id)).toBeHidden();
    await expect(ingredientCounter(page, ANOTHER_BUN.id)).toHaveText('2');
    await expect(totalPrice(page)).toHaveText(String(ANOTHER_BUN.price * 2));
  });

  test('начинки добавляются в середину и суммируются в цене', async ({ page }) => {
    await dragToConstructor(page, BUN.id, bunTop(page));
    await dragToConstructor(page, SAUCE.id, fillingsZone(page));
    await dragToConstructor(page, MAIN.id, fillingsZone(page));

    const items = fillings(page);

    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText(SAUCE.name);
    await expect(items.nth(1)).toContainText(MAIN.name);
    await expect(totalPrice(page)).toHaveText(
      String(BUN.price * 2 + SAUCE.price + MAIN.price)
    );
  });

  test('булку нельзя бросить в зону начинок', async ({ page }) => {
    await dragToConstructor(page, BUN.id, fillingsZone(page));

    await expect(fillings(page)).toHaveCount(0);
    await expect(fillingsZone(page)).toContainText('Выберите начинку');
  });

  test('одинаковые начинки считаются счётчиком', async ({ page }) => {
    await dragToConstructor(page, SAUCE.id, fillingsZone(page));
    await dragToConstructor(page, SAUCE.id, fillingsZone(page));

    await expect(fillings(page)).toHaveCount(2);
    await expect(ingredientCounter(page, SAUCE.id)).toHaveText('2');
  });

  test('начинку можно удалить из конструктора', async ({ page }) => {
    await dragToConstructor(page, BUN.id, bunTop(page));
    await dragToConstructor(page, SAUCE.id, fillingsZone(page));

    await fillings(page).locator('.constructor-element__action').click();

    await expect(fillings(page)).toHaveCount(0);
    await expect(ingredientCounter(page, SAUCE.id)).toBeHidden();
    await expect(totalPrice(page)).toHaveText(String(BUN.price * 2));
  });
});

test.describe('Конструктор — модальное окно ингредиента', () => {
  test('клик по ингредиенту открывает модалку с деталями', async ({ page }) => {
    await ingredientCard(page, MAIN.id).click();

    const details = modal(page);

    await expect(details).toBeVisible();
    await expect(details).toContainText('Детали ингредиента');
    await expect(details).toContainText(MAIN.name);
    await expect(details).toContainText(String(MAIN.calories));
    await expect(details).toContainText(String(MAIN.proteins));
    await expect(page).toHaveURL(`/ingredients/${MAIN.id}`);
  });

  test('модалка закрывается по клику на крестик', async ({ page }) => {
    const details = modal(page);

    await ingredientCard(page, MAIN.id).click();
    await expect(details).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(details).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('модалка закрывается по клику на оверлей', async ({ page }) => {
    const details = modal(page);

    await ingredientCard(page, MAIN.id).click();
    await expect(details).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(details).toBeHidden();
  });

  test('модалка закрывается по Escape', async ({ page }) => {
    const details = modal(page);

    await ingredientCard(page, MAIN.id).click();
    await expect(details).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(details).toBeHidden();
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
      orderButton(page).click(),
    ]);

    expect(request.postDataJSON()).toEqual({
      ingredients: [BUN.id, SAUCE.id, BUN.id],
    });

    const details = modal(page);

    await expect(details).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(String(ORDER_NUMBER));
    await expect(details).toContainText('идентификатор заказа');
    await expect(details).toContainText('Ваш заказ начали готовить');
  });

  test('закрытие модалки заказа очищает конструктор', async ({ page }) => {
    await assembleBurger(page);
    await orderButton(page).click();
    await expect(page.getByTestId('order-number')).toHaveText(String(ORDER_NUMBER));

    await page.getByTestId('modal-close').click();

    await expect(modal(page)).toBeHidden();
    await expect(bunTop(page)).toContainText('Выберите булки');
    await expect(fillingsZone(page)).toContainText('Выберите начинку');
    await expect(totalPrice(page)).toHaveText('0');
  });

  test('бургер без булки не оформляется', async ({ page }) => {
    await dragToConstructor(page, SAUCE.id, fillingsZone(page));

    await orderButton(page).click();

    await expect(modal(page)).toBeHidden();
    await expect(page).toHaveURL('/');
  });

  test('ошибка сервера показывается в модалке заказа', async ({ page }) => {
    await mockOrderError(page);
    await assembleBurger(page);

    await orderButton(page).click();

    await expect(modal(page)).toContainText('Ошибка при создании заказа');
  });
});
