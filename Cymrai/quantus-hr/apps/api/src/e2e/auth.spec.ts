import { test, expect } from '@playwright/test';

// QHR-34 - End-to-end tests for auth and employee profile flows
const BASE_URL = 'https://staging-quantus-hr.cymrai.com'; // Use the staging URL as a GitHub Actions secret

test('Admin registers, logs in, and lands on /admin/employees', async ({ page }) => {
  await page.goto(`${BASE_URL}/register`);
  await page.fill('[name="username"]', 'admin');
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button:has-text("Register")');
  await expect(page).toHaveURL(`${BASE_URL}/login`);

  // Log in as admin
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL(`${BASE_URL}/admin/employees`);
});

test('Admin creates an employee profile and sees it in the list', async ({ page }) => {
  // Assuming admin is already logged in from previous test
  await page.goto(`${BASE_URL}/admin/employees/create`);
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.fill('[name="email"]', 'john.doe@example.com');
  await page.click('button:has-text("Create Employee")');

  // Check if the employee is listed
  await expect(page.locator(`//td[contains(text(), 'John Doe')]`)).toBeVisible();
});

test('Employee logs in and sees their own score on /dashboard/me', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[name="email"]', 'employee@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL(`${BASE_URL}/dashboard/me`);

  // Check if the employee's score is displayed
  const score = await page.$eval('[data-testid="score"]', el => el.textContent);
  expect(score).toBeDefined();
});

test('Employee attempts to access /admin/employees and is redirected', async ({ page }) => {
  // Assuming employee is already logged in from previous test
  await page.goto(`${BASE_URL}/admin/employees`);
  await expect(page).toHaveURL(`${BASE_URL}/dashboard/me`);
});