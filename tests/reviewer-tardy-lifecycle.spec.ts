import { expect, test, type Page, type Response } from '@playwright/test';

type BackendActionSnapshot = {
  action: 'approve' | 'register' | 'paid';
  url: string;
  method: string;
  httpStatus: number;
  ok: boolean;
};

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
  await expect(page.locator('main').getByText(/\d+ row\(s\)\./).first()).toBeVisible({ timeout: 20_000 });
}

async function selectActionableStatuses(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Status/i }).click();

  const submittedCheckbox = page.getByRole('checkbox', { name: /Submitted/i });
  const tardyCheckbox = page.getByRole('checkbox', { name: /Tardy/i });

  if ((await submittedCheckbox.count()) > 0 && !(await submittedCheckbox.isChecked().catch(() => false))) {
    await submittedCheckbox.check();
  }
  if ((await tardyCheckbox.count()) > 0 && !(await tardyCheckbox.isChecked().catch(() => false))) {
    await tardyCheckbox.check();
  }

  const submittedLabel =
    (await page.locator('label', { has: submittedCheckbox }).first().textContent().catch(() => '')) || '';
  const tardyLabel =
    (await page.locator('label', { has: tardyCheckbox }).first().textContent().catch(() => '')) || '';

  const submittedCount = Number.parseInt(submittedLabel.match(/(\d+)$/)?.[1] || '0', 10);
  const tardyCount = Number.parseInt(tardyLabel.match(/(\d+)$/)?.[1] || '0', 10);

  if (submittedCount === 0 && (await submittedCheckbox.isChecked().catch(() => false))) {
    await submittedCheckbox.uncheck();
  }
  if (tardyCount === 0 && (await tardyCheckbox.isChecked().catch(() => false))) {
    await tardyCheckbox.uncheck();
  }

  await page.keyboard.press('Escape');
  await waitBillsLoaded(page);
}

async function openFirstInvoice(page: Page): Promise<{ invoiceNumber: string; invoiceId: string }> {
  const rowCountText =
    (await page.locator('main').getByText(/\d+ row\(s\)\./).first().textContent().catch(() => '0 row(s).')) ||
    '0 row(s).';
  const rowCount = Number.parseInt(rowCountText, 10) || 0;
  expect(rowCount, `Se requiere al menos 1 factura actionable. Encontradas: ${rowCount}.`).toBeGreaterThan(0);

  const invoiceNumber =
    ((await page.locator('p:has-text("Invoice Number") + p').first().textContent().catch(() => '')) || '').trim();

  await page.getByRole('button', { name: 'Action', exact: true }).first().click();
  await page.getByRole('button', { name: 'View Bill', exact: true }).click();

  await page.waitForURL('**/invoice/**');
  await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible({ timeout: 20_000 });

  const url = page.url();
  const invoiceId = url.split('/invoice/')[1]?.split('?')[0] || '';
  expect(invoiceId).toMatch(/[a-f0-9-]{20,}/i);

  return { invoiceNumber, invoiceId };
}

async function readUiStatus(page: Page): Promise<string> {
  const status = ((await page.locator('p:has-text("Bill Status") + p').textContent().catch(() => '')) || '').trim();
  return status;
}

async function waitUiStatus(page: Page, expected: 'approved' | 'registered' | 'paid'): Promise<string> {
  await expect
    .poll(async () => (await readUiStatus(page)).toLowerCase(), {
      timeout: 30_000,
      intervals: [500, 1000, 1500],
    })
    .toContain(expected);
  return readUiStatus(page);
}

async function captureBackendMutation(page: Page): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      const method = response.request().method().toUpperCase();
      const url = response.url().toLowerCase();
      return (
        ['POST', 'PUT', 'PATCH'].includes(method) &&
        url.includes('/api/') &&
        (url.includes('invoice') || url.includes('bill'))
      );
    },
    { timeout: 30_000 }
  );
}

function toActionSnapshot(action: BackendActionSnapshot['action'], response: Response): BackendActionSnapshot {
  return {
    action,
    url: response.url(),
    method: response.request().method(),
    httpStatus: response.status(),
    ok: response.ok(),
  };
}

async function continueIfConfirmationExists(page: Page): Promise<void> {
  const continueBtn = page.getByRole('button', { name: /Continue/i }).first();
  if (await continueBtn.isVisible().catch(() => false)) {
    await continueBtn.click();
  }
}

async function transitionApprove(page: Page): Promise<BackendActionSnapshot> {
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  const mutationPromise = captureBackendMutation(page);
  await continueIfConfirmationExists(page);
  const mutation = await mutationPromise;
  await expect(page.getByRole('button', { name: /Mark as Registered/i })).toBeVisible({ timeout: 25_000 });
  return toActionSnapshot('approve', mutation);
}

async function transitionRegistered(page: Page): Promise<BackendActionSnapshot> {
  await page.getByRole('button', { name: /Mark as Registered/i }).click();
  const mutationPromise = captureBackendMutation(page);
  await continueIfConfirmationExists(page);
  const mutation = await mutationPromise;
  await expect(page.getByRole('button', { name: /Mark as Paid/i })).toBeVisible({ timeout: 25_000 });
  return toActionSnapshot('register', mutation);
}

async function transitionPaid(page: Page): Promise<BackendActionSnapshot> {
  await page.getByRole('button', { name: /Mark as Paid/i }).click();
  const mutationPromise = captureBackendMutation(page);
  await continueIfConfirmationExists(page);
  const mutation = await mutationPromise;
  return toActionSnapshot('paid', mutation);
}

test('Reviewer | Tardy -> Approved -> Registered -> Paid con validacion UI y backend', async ({ page }) => {
  await loginReviewer(page);
  await openBills(page);
  await waitBillsLoaded(page);
  await selectActionableStatuses(page);

  const { invoiceNumber, invoiceId } = await openFirstInvoice(page);

  const initialUiStatus = await readUiStatus(page);
  expect(initialUiStatus.toLowerCase()).toMatch(/tardy|submitted|approved/);

  const backendApprove = await transitionApprove(page);
  const uiAfterApprove = await waitUiStatus(page, 'approved');
  expect.soft(backendApprove.ok).toBeTruthy();

  const backendRegistered = await transitionRegistered(page);
  const uiAfterRegistered = await waitUiStatus(page, 'registered');
  expect.soft(backendRegistered.ok).toBeTruthy();

  const backendPaid = await transitionPaid(page);
  const uiAfterPaid = await waitUiStatus(page, 'paid');
  expect.soft(backendPaid.ok).toBeTruthy();

  test.info().annotations.push(
    { type: 'invoice-id', description: invoiceId },
    { type: 'invoice-number', description: invoiceNumber || 'unknown' },
    {
      type: 'backend-after',
      description: `approve=${backendApprove.httpStatus} ${backendApprove.method}, registered=${backendRegistered.httpStatus} ${backendRegistered.method}, paid=${backendPaid.httpStatus} ${backendPaid.method}`,
    },
    {
      type: 'ui-after',
      description: `approve=${uiAfterApprove}, registered=${uiAfterRegistered}, paid=${uiAfterPaid}`,
    }
  );
});
