import { expect, test, type Page } from '@playwright/test';

const LOGIN_URL =
  process.env.KEYCLOAK_AUTH_URL ||
  'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

async function loginReviewer(page: Page): Promise<void> {
  const email = requireEnv('QA_USER_REVIEWER');
  const password = requireEnv('QA_PASS_REVIEWER');

  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**dev.quantify.quisit.net/**');
  await page.waitForLoadState('networkidle');
}

async function openBills(page: Page): Promise<void> {
  await page.locator('nav').getByRole('link', { name: 'Bills', exact: true }).click();
  await page.waitForURL('**/invoice/invoices');
  await page.waitForLoadState('networkidle');
}

async function waitBillsLoaded(page: Page): Promise<void> {
  await expect(page.getByText('Loading bills…')).toHaveCount(0, { timeout: 20_000 });
  await expect(page.getByText(/\d+ row\(s\)\./)).toBeVisible({ timeout: 20_000 });
}

async function selectSubmittedAndTardyStatus(page: Page): Promise<number> {
  await page.getByRole('button', { name: /Status/i }).click();
  const submittedCheckbox = page.getByRole('checkbox', { name: /Submitted/i });
  const tardyCheckbox = page.getByRole('checkbox', { name: /Tardy/i });

  const submittedExists = (await submittedCheckbox.count()) > 0;
  const tardyExists = (await tardyCheckbox.count()) > 0;

  if (!submittedExists && !tardyExists) {
    await page.keyboard.press('Escape');
    return 0;
  }

  if (submittedExists && !(await submittedCheckbox.isChecked().catch(() => false))) {
    await submittedCheckbox.check();
  }

  if (tardyExists && !(await tardyCheckbox.isChecked().catch(() => false))) {
    await tardyCheckbox.check();
  }

  const submittedCountText = submittedExists
    ? ((await page.locator('label', { has: submittedCheckbox }).first().textContent()) || '').trim()
    : '';
  const submittedCount = Number.parseInt(submittedCountText.match(/(\d+)$/)?.[1] || '0', 10);

  const tardyCountText = tardyExists
    ? ((await page.locator('label', { has: tardyCheckbox }).first().textContent()) || '').trim()
    : '';
  const tardyCount = Number.parseInt(tardyCountText.match(/(\d+)$/)?.[1] || '0', 10);

  if (submittedExists && submittedCount === 0 && (await submittedCheckbox.isChecked().catch(() => false))) {
    await submittedCheckbox.uncheck();
  }
  if (tardyExists && tardyCount === 0 && (await tardyCheckbox.isChecked().catch(() => false))) {
    await tardyCheckbox.uncheck();
  }

  await page.keyboard.press('Escape');
  await waitBillsLoaded(page);
  return submittedCount + tardyCount;
}

async function openInvoiceFromRow(page: Page, rowIndex: number): Promise<string> {
  const actionButtons = page.getByRole('button', { name: 'Action', exact: true });
  const count = await actionButtons.count();
  expect(count).toBeGreaterThan(rowIndex);

  const invoiceNumbers = page.locator('p:has-text("Invoice Number") + p');
  const number = (await invoiceNumbers.nth(rowIndex).textContent().catch(() => ''))?.trim() || '';

  await actionButtons.nth(rowIndex).click();
  await page.getByRole('button', { name: 'View Bill', exact: true }).click();
  await page.waitForURL('**/invoice/**');
  await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible({ timeout: 15_000 });

  return number;
}

async function approveInvoice(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  const processing = page.getByRole('button', { name: /Processing/i });
  await expect(processing).toHaveCount(0, { timeout: 20_000 });
}

async function rejectInvoiceWithReason(page: Page, reason: string): Promise<void> {
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.locator('select').first().selectOption({ label: 'Incorrect Data' });
  await page.getByRole('textbox', { name: /Tell us a little bit about/i }).fill(reason);
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByText('Reason for Rejection:')).toHaveCount(0, { timeout: 20_000 });
}

test('Reviewer aprueba una factura y rechaza otra con razon', async ({ page }) => {
  await loginReviewer(page);
  await openBills(page);
  await waitBillsLoaded(page);

  const actionableCount = await selectSubmittedAndTardyStatus(page);
  await waitBillsLoaded(page);

  const rowCountText =
    (await page.locator('main').getByText(/\d+ row\(s\)\./).first().textContent()) || '0 row(s).';
  const rowCount = Number.parseInt(rowCountText, 10) || 0;
  expect(
    actionableCount,
    `Precondicion fallida: se requieren al menos 2 facturas en estado Tardy/Submitted para este flujo. Detectadas: ${actionableCount}.`
  ).toBeGreaterThan(1);
  expect(
    rowCount,
    `Precondicion fallida: el grid devuelve ${rowCount} factura(s) tras filtrar por Tardy/Submitted.`
  ).toBeGreaterThan(1);

  test.info().annotations.push({
    type: 'status-filter-used',
    description: 'Submitted+Tardy',
  });

  const firstInvoice = await openInvoiceFromRow(page, 0);
  await approveInvoice(page);
  await page.getByRole('link', { name: 'Back to Bills', exact: true }).click();
  await waitBillsLoaded(page);

  const secondInvoice = await openInvoiceFromRow(page, 1);
  await rejectInvoiceWithReason(page, 'Monto y descripcion inconsistentes con el soporte enviado.');

  test.info().annotations.push({
    type: 'processed-invoices',
    description: `approve=${firstInvoice || 'row0'}; reject=${secondInvoice || 'row1'}`,
  });

  await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible();
});
