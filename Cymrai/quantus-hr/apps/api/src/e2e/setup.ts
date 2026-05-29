import { test as baseTest } from '@playwright/test';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();
const API_URL = process.env.API_URL || 'http://localhost:3000';

const test = baseTest.extend({
  page: async ({}, use) => {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await browser.close();
  },
});

// Seed the test tenant with a dedicated API call
test('beforeAll', async () => {
  // Register admin and employee via API calls
  await axios.post(`${API_URL}/register`, { username: 'admin', email: 'admin@example.com', password: 'Password123!' });
  await axios.post(`${API_URL}/login`, { email: 'admin@example.com', password: 'Password123!' });
  await axios.post(`${API_URL}/create-employee`, { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
  await axios.post(`${API_URL}/login`, { email: 'employee@example.com', password: 'Password123!' });
});

export default test;