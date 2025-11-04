import { Page, expect } from '@playwright/test';

/**
 * Complete checkout using wallet payment
 */
export async function checkoutWithWallet(page: Page) {
  await page.goto('/checkout');
  await expect(page).toHaveURL('/checkout');
  await page.waitForLoadState('networkidle');

  // Verify checkout page loaded
  await expect(page.locator('h1')).toContainText('Checkout');

  // Wait for wallets to load
  await page.waitForTimeout(1500);

  // Select first wallet from dropdown
  const walletSelect = page.locator('select[name="walletCurrency"], select').first();
  await walletSelect.waitFor({ state: 'visible', timeout: 5000 });
  
  // Get first option value and select it
  const firstOption = await walletSelect.locator('option').nth(1).getAttribute('value');
  if (firstOption) {
    await walletSelect.selectOption(firstOption);
  }

  // Handle success alert
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Order placed successfully');
    await dialog.accept();
  });

  // Click Place Order button
  const placeOrderButton = page.locator('button:has-text("Place Order")');
  await expect(placeOrderButton).toBeVisible();
  await placeOrderButton.click();

  // Wait for order to be processed and redirect
  await page.waitForURL('/', { timeout: 15000 });

  // Verify redirect to home page after successful order
  await expect(page).toHaveURL('/');
}
