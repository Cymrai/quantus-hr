import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env (ignored in CI where secrets are injected).
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
const EMPLOYEE_EMAIL = process.env.TEST_EMPLOYEE_EMAIL;
const EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !EMPLOYEE_EMAIL || !EMPLOYEE_PASSWORD) {
  throw new Error(
    'Missing required environment variables for test setup. ' +
      'Ensure TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, TEST_EMPLOYEE_EMAIL, and TEST_EMPLOYEE_PASSWORD are set.'
  );
}

/**
 * Global setup — runs once before the entire Playwright test suite.
 * Register in playwright.config.ts via: globalSetup: './src/e2e/setup.ts'
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // 1. Register the admin account.
  await axios
    .post(`${API_URL}/register`, {
      username: 'admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    .catch((err) => {
      // Ignore 409 Conflict — the admin may already exist from a previous run.
      if (err?.response?.status !== 409) throw err;
    });

  // 2. Log in as admin and retrieve the auth token.
  const adminLoginResponse = await axios.post(`${API_URL}/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const adminToken: string = adminLoginResponse.data.token;

  // 3. Create the seeded employee account via the authenticated API.
  await axios
    .post(
      `${API_URL}/create-employee`,
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    )
    .catch((err) => {
      if (err?.response?.status !== 409) throw err;
    });

  // 4. Register the dedicated test employee account.
  await axios
    .post(`${API_URL}/register`, {
      username: 'test_employee',
      email: EMPLOYEE_EMAIL,
      password: EMPLOYEE_PASSWORD,
      role: 'employee',
    })
    .catch((err) => {
      if (err?.response?.status !== 409) throw err;
    });

  // 5. Verify that the employee can authenticate successfully.
  await axios.post(`${API_URL}/login`, {
    email: EMPLOYEE_EMAIL,
    password: EMPLOYEE_PASSWORD,
  });

  // 6. Persist admin storage state so tests can reuse the authenticated session.
  //    (Optional — tests may also call loginAs() directly for full isolation.)
  const browser = await chromium.launch();
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const BASE_URL = process.env.BASE_URL || 'http://localhost:4200';
  await adminPage.goto(`${BASE_URL}/login`);
  await adminPage.fill('[name="email"]', ADMIN_EMAIL!);
  await adminPage.fill('[name="password"]', ADMIN_PASSWORD!);
  await adminPage.click('button:has-text("Login")');
  await adminContext.storageState({ path: 'playwright/.auth/admin.json' });
  await browser.close();
}

export default globalSetup;
