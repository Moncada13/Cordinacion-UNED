import { expect, test } from '@playwright/test'

test('home page shows the app title', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Planificador de cuatrimestre' }),
  ).toBeVisible()
})
