import { expect, test } from '@playwright/test';

test('opens envelope and shows the main invitation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Открыть приглашение' })).toBeVisible();
  await page.getByRole('button', { name: 'Открыть приглашение' }).click();
  await expect(page.getByRole('heading', { name: 'Дмитрий & Дарья' })).toBeVisible();
  await expect(page.getByText('28 августа 2026').first()).toBeVisible();
});

test('validates RSVP fields and hides drinks for declined guests', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть приглашение' }).click();
  if (isMobile) await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.getByRole('link', { name: 'Анкета' }).click();

  await page.getByRole('button', { name: 'Отправить ответ' }).click();
  await expect(page.getByText('Пожалуйста, укажите имя гостя.')).toBeVisible();
  await expect(page.getByText('Пожалуйста, выберите статус участия.')).toBeVisible();

  await page.getByLabel('Имя гостя').fill('Анна Иванова');
  await page.getByLabel('Буду присутствовать').check();
  await page.getByRole('button', { name: 'Отправить ответ' }).click();
  await expect(page.getByText('Пожалуйста, выберите хотя бы один вариант напитка.')).toBeVisible();
  await expect(page.getByLabel('Горячительный напиток ручной работы')).toBeVisible();

  await page.getByLabel('Не смогу присутствовать').check();
  await expect(page.getByText('Можно выбрать несколько вариантов')).toBeHidden();
});

test('keeps route links and map fallbacks available', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть приглашение' }).click();
  if (isMobile) await page.getByRole('button', { name: 'Открыть меню' }).click();
  await page.getByRole('link', { name: 'Места' }).click();

  await expect(page.getByText('г. Саранск, ул. Коммунистическая, 61', { exact: true })).toBeVisible();
  await expect(page.getByText('«Rose park», г. Саранск, ул. Строительная, 15', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Построить маршрут' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Построить маршрут' }).first()).toHaveAttribute(
    'href',
    'https://yandex.ru/maps/42/saransk/house/kommunisticheskaya_ulitsa_61/YEwYdwBpQUYEQFtufX15dH1qbQ==/?ll=45.179833%2C54.185199&utm_source=share&z=17',
  );
  await expect(page.locator('.map-shell iframe')).toHaveCount(2);
});

test('opens and closes the mobile menu', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only interaction');

  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть приглашение' }).click();
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await expect(page.getByRole('link', { name: 'Дресс-код' })).toBeVisible();
  await page.getByRole('link', { name: 'Дресс-код' }).click();
  await expect(page.getByRole('link', { name: 'Дресс-код' })).toBeHidden();
});
