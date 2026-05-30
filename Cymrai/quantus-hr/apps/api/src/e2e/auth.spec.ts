import { test, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// QHR-34 - End-to-end tests for auth and employee profile flows
const BASE_URL = process.env.BASE_URL;
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
const EMPLOYEE_EMAIL = process.env.TEST_EMPLOYEE_EMAIL;
const EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD;

if (!BASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD || !EMPLOYEE_EMAIL || !EMPLOYEE_PASSWORD) {
  throw new Error(
    'Missing required environment variables. Ensure BASE_URL, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, TEST_EMPLOYEE_EMAIL, and TEST_EMPLOYEE_PASSWORD are set.'
  );
}

/** Helper: log in via the UI and return the storage state for session reuse */
async function loginAs(
  email: string,
  password: string,
  baseUrl: string
): Promise<string> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseUrl}/login`);
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button:has-text("Login")');
  const storageState = await context.storageState();
  await browser.close();
  // Return serialised storage state as a JSON string so callers can pass it
  // directly to browser.newContext({ storageState }).
  return JSON.stringify(storageState);
}

test('Admin registers, logs in, and lands on /admin/employees', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
  await page.fill('[name="username"]', 'admin');
  await page.fill('[name="email"]', ADMIN_EMAIL!);
  await page.fill('[name="password"]', ADMIN_PASSWORD!);
  await page.click('button:has-text("Register")');
  await expect(page).toHaveURL(`${BASE_URL}/login`);

  // Log in as admin
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', ADMIN_EMAIL!);
  await page.fill('[name="password"]', ADMIN_PASSWORD!);
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL(`${BASE_URL}/admin/employees`);
});

test('Admin creates an employee profile and sees it in the list', async ({ browser }) => {
  // Establish an authenticated admin session independently of other tests.
  const adminStorageState = await loginAs(ADMIN_EMAIL!, ADMIN_PASSWORD!, BASE_URL!);
  const context = await browser.newContext({
    storageState: JSON.parse(adminStorageState),
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/admin/employees/create`);
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.fill('[name="email"]', 'john.doe@example.com');
  await page.click('button:has-text("Create Employee")');

  // Use a data-testid selector instead of a fragile XPath.
  await expect(page.locator('[data-testid="employee-row-john-doe"]')).toBeVisible();

  await context.close();
});

test('Employee logs in and sees their own score on /dashboard/me', async ({ browser }) => {
  // Establish an authenticated employee session independently of other tests.
  const employeeStorageState = await loginAs(EMPLOYEE_EMAIL!, EMPLOYEE_PASSWORD!, BASE_URL!);
  const context = await browser.newContext({
    storageState: JSON.parse(employeeStorageState),
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/dashboard/me`);
  await expect(page).toHaveURL(`${BASE_URL}/dashboard/me`);

  // Assert that the score element contains a non-empty numeric value.
  const score = await page.$eval('[data-testid="score"]', (el) => el.textContent);
  expect(score?.trim()).toMatch(/^\d+$/);

  await context.close();
});

test('Employee attempts to access /admin/employees and is redirected', async ({ browser }) => {
  // Establish an authenticated employee session independently of other tests.
  const employeeStorageState = await loginAs(EMPLOYEE_EMAIL!, EMPLOYEE_PASSWORD!, BASE_URL!);
  const context = await browser.newContext({
    storageState: JSON.parse(employeeStorageState),
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/admin/employees`);
  await expect(page).toHaveURL(`${BASE_URL}/dashboard/me`);

  await context.close();
});

// ---------------------------------------------------------------------------
// Negative / edge-case tests (QHR-34 coverage gaps)
// ---------------------------------------------------------------------------

test('Login with wrong password shows an error message', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', ADMIN_EMAIL!);
  await page.fill('[name="password"]', 'WrongPassword999!');
  await page.click('button:has-text("Login")');
  // Should stay on /login and show an error.
  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
});

test('Login with non-existent user shows an error message', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', 'nonexistent@example.com');
  await page.fill('[name="password"]', 'SomePassword1!');
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
});

test('Registration with a duplicate email is rejected with an error', async ({ page }) => {
  // ADMIN_EMAIL is already registered during setup.
  await page.goto(`${BASE_URL}/register`);
  await page.fill('[name="username"]', 'duplicate');
  await page.fill('[name="email"]', ADMIN_EMAIL!);
  await page.fill('[name="password"]', ADMIN_PASSWORD!);
  await page.click('button:has-text("Register")');
  await expect(page.locator('[data-testid="register-error"]')).toBeVisible();
});

test('Unauthenticated access to a protected route redirects to /login', async ({ page }) => {
  // No session — fresh context with no cookies.
  await page.goto(`${BASE_URL}/admin/employees`);
  await expect(page).toHaveURL(`${BASE_URL}/login`);
});
