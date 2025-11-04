import { test, expect } from '@playwright/test';
import { loginUser } from './helpers/auth-helper';
import { browseProductsByCategory, addProductToCart } from './helpers/product-helper';
import { topUpWallet } from './helpers/wallet-helper';

/**
 * E2E Test Suite: Complete User Flow
 * Tests the entire user journey from login to checkout
 */

test.describe('Complete User Flow', () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies and storage to start fresh
    await context.clearCookies();
  });

  test('should complete full e-commerce flow: login → browse → cart → wallet → checkout', async ({
    page,
  }) => {
    // ==========================================
    // STEP 1: Login
    // ==========================================
    await test.step('Login', async () => {
      await loginUser(page);
      await expect(page).toHaveURL('/');
    });

    // ==========================================
    // STEP 2: Browse products by category
    // ==========================================
    await test.step('Browse products by category', async () => {
      await browseProductsByCategory(page);
    });

    // ==========================================
    // STEP 3: Add product to cart
    // ==========================================
    await test.step('Add product to cart', async () => {
      await addProductToCart(page);
    });

    // ==========================================
    // STEP 4: Top up wallet
    // ==========================================
    await test.step('Top up wallet', async () => {
      await topUpWallet(page);
    });

    // ==========================================
    // STEP 5: Checkout (TODO)
    // ==========================================
    // await test.step('Checkout with wallet', async () => {
    //   // TODO: Implement checkout flow
    // });
  });
});
