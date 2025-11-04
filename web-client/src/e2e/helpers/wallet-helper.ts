import { Page, expect } from '@playwright/test';

/**
 * Top up wallet with specified amount
 */
export async function topUpWallet(page: Page, amount: string = '100') {
  await page.goto('/wallets');
  await expect(page).toHaveURL('/wallets');
  await page.waitForLoadState('networkidle');

  const topUpButton = page
    .locator('button:has-text("Top Up"), a:has-text("Top Up")')
    .first();
  await topUpButton.waitFor({ state: 'visible', timeout: 5000 });
  await topUpButton.click();
  await page.waitForTimeout(1000);

  const amountInput = page
    .locator('input[name="amount"], input[type="number"]')
    .first();
  await amountInput.waitFor({ state: 'visible', timeout: 5000 });
  await amountInput.fill(amount);

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Top up successful');
    await dialog.accept();
  });

  const submitButton = page
    .locator(
      'button[type="submit"]:has-text("Top Up"), button:has-text("Confirm"), button:has-text("Submit")'
    )
    .first();
  await submitButton.click();
  await page.waitForTimeout(2000);

  await expect(page).toHaveURL(/wallets/);
}
