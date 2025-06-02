import { test } from '@playwright/test';

test('navigate to form layouts page', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
});

