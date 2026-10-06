const { test, expect } = require('@playwright/test');

test('the page has a title and a mount point', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Gem Puzzle');
  await expect(page.locator('#app')).toBeVisible();
});
