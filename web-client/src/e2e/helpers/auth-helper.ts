import { Page } from '@playwright/test';

/**
 * Performs complete OAuth login flow
 */
export async function loginUser(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  
  const signInButton = page.locator('button:has-text("Sign In")');
  await signInButton.waitFor({ state: 'visible', timeout: 5000 });
  await signInButton.click();
  
  await page.waitForURL(/localhost:4000\/interaction/, { timeout: 10000 });
  await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
  await page.fill('input[name="name"]', 'Test User');
  await page.click('button[type="submit"], button:has-text("Continue"), button:has-text("Submit")');
  
  await page.waitForTimeout(1000);
  const allowButton = page.locator('button:has-text("Allow"), button[type="submit"]:has-text("Allow")');
  await allowButton.waitFor({ state: 'visible', timeout: 5000 });
  await allowButton.click();
  
  await page.waitForURL('/', { timeout: 15000 });
}
