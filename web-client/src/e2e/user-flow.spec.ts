import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Login Flow
 */

test.describe('Login Flow', () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies and storage to start fresh
    await context.clearCookies();
  });

  test('should login successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // Verify login page loaded
    await expect(page.locator('h1')).toContainText('Login');

    // Wait for page to be fully loaded (Next.js hydration)
    await page.waitForLoadState('networkidle');
    
    // Wait for Sign In button to be visible and clickable
    const signInButton = page.locator('button:has-text("Sign In")');
    await signInButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click Sign In button
    await signInButton.click();

    // Wait for OAuth interaction page to load (localhost:4000)
    await page.waitForURL(/localhost:4000\/interaction/, { timeout: 10000 });

    // Fill in email
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');

    // Fill in name
    await page.fill('input[name="name"]', 'Test User');

    // Submit the form (look for submit button or Continue button)
    await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Submit")');

    // Wait for consent screen and click Allow button
    await page.waitForTimeout(1000); // Wait for consent screen to load
    const allowButton = page.locator('button:has-text("Allow"), button[type="submit"]:has-text("Allow")');
    await allowButton.waitFor({ state: 'visible', timeout: 5000 });
    await allowButton.click();

    // Wait for authentication to complete and redirect to home
    await page.waitForURL('/', { timeout: 15000 });

    // Verify successful login (user should be redirected to home)
    await expect(page).toHaveURL('/');
  });
});
