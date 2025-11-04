import { Page, expect } from '@playwright/test';

/**
 * Browse products and select a category
 */
export async function browseProductsByCategory(page: Page) {
  await page.goto('/products');
  await expect(page).toHaveURL('/products');
  await expect(page.locator('h1')).toContainText('All Products');

  await page.waitForSelector('div:has(button:has-text("Add to Cart"))', {
    timeout: 10000,
  });

  const categoryRadios = page.locator('input[type="radio"][name="category"]');
  const categoryCount = await categoryRadios.count();

  if (categoryCount > 1) {
    await categoryRadios.nth(1).click({ force: true });
    await page.waitForURL(/category=/, { timeout: 5000 });
    expect(page.url()).toContain('category=');

    const products = page.locator('div:has(button:has-text("Add to Cart"))');
    expect(await products.count()).toBeGreaterThan(0);
  }
}

/**
 * Add first product to cart
 */
export async function addProductToCart(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('button:has-text("Add to Cart")', {
    timeout: 10000,
  });

  const addToCartButton = page
    .locator('button:has-text("Add to Cart")')
    .first();
  await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Product added to cart');
    await dialog.accept();
  });

  await addToCartButton.click({ timeout: 5000 });
  await page.waitForTimeout(2000);

  await page.goto('/cart');
  await expect(page).toHaveURL('/cart');
  await page.waitForLoadState('networkidle');

  const emptyCartHeading = page.locator('h1:has-text("Your Cart is Empty")');
  const hasEmptyCart = await emptyCartHeading.isVisible().catch(() => false);
  expect(hasEmptyCart).toBe(false);
}
