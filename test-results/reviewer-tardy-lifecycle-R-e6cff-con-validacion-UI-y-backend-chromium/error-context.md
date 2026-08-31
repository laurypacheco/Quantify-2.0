# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reviewer-tardy-lifecycle.spec.ts >> Reviewer | Tardy -> Approved -> Registered -> Paid con validacion UI y backend
- Location: tests\reviewer-tardy-lifecycle.spec.ts:174:5

# Error details

```
Error: Missing required env var QA_USER_REVIEWER
```

# Test source

```ts
  1   | import { expect, test, type Page, type Response } from '@playwright/test';
  2   | 
  3   | type BackendActionSnapshot = {
  4   |   action: 'approve' | 'register' | 'paid';
  5   |   url: string;
  6   |   method: string;
  7   |   httpStatus: number;
  8   |   ok: boolean;
  9   | };
  10  | 
  11  | const LOGIN_URL =
  12  |   process.env.KEYCLOAK_AUTH_URL ||
  13  |   'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';
  14  | 
  15  | function requireEnv(name: string): string {
  16  |   const value = process.env[name];
  17  |   if (!value) {
> 18  |     throw new Error(`Missing required env var ${name}`);
      |           ^ Error: Missing required env var QA_USER_REVIEWER
  19  |   }
  20  |   return value;
  21  | }
  22  | 
  23  | async function loginReviewer(page: Page): Promise<void> {
  24  |   const email = requireEnv('QA_USER_REVIEWER');
  25  |   const password = requireEnv('QA_PASS_REVIEWER');
  26  | 
  27  |   await page.goto(LOGIN_URL);
  28  |   await page.getByRole('textbox', { name: 'Email' }).fill(email);
  29  |   await page.getByRole('textbox', { name: 'Password' }).fill(password);
  30  |   await page.getByRole('button', { name: 'Login' }).click();
  31  |   await page.waitForURL('**dev.quantify.quisit.net/**');
  32  |   await page.waitForLoadState('networkidle');
  33  | }
  34  | 
  35  | async function openBills(page: Page): Promise<void> {
  36  |   await page.locator('nav').getByRole('link', { name: 'Bills', exact: true }).click();
  37  |   await page.waitForURL('**/invoice/invoices');
  38  |   await page.waitForLoadState('networkidle');
  39  | }
  40  | 
  41  | async function waitBillsLoaded(page: Page): Promise<void> {
  42  |   await expect(page.getByText('Loading bills…')).toHaveCount(0, { timeout: 20_000 });
  43  |   await expect(page.locator('main').getByText(/\d+ row\(s\)\./).first()).toBeVisible({ timeout: 20_000 });
  44  | }
  45  | 
  46  | async function selectActionableStatuses(page: Page): Promise<void> {
  47  |   await page.getByRole('button', { name: /Status/i }).click();
  48  | 
  49  |   const submittedCheckbox = page.getByRole('checkbox', { name: /Submitted/i });
  50  |   const tardyCheckbox = page.getByRole('checkbox', { name: /Tardy/i });
  51  | 
  52  |   if ((await submittedCheckbox.count()) > 0 && !(await submittedCheckbox.isChecked().catch(() => false))) {
  53  |     await submittedCheckbox.check();
  54  |   }
  55  |   if ((await tardyCheckbox.count()) > 0 && !(await tardyCheckbox.isChecked().catch(() => false))) {
  56  |     await tardyCheckbox.check();
  57  |   }
  58  | 
  59  |   const submittedLabel =
  60  |     (await page.locator('label', { has: submittedCheckbox }).first().textContent().catch(() => '')) || '';
  61  |   const tardyLabel =
  62  |     (await page.locator('label', { has: tardyCheckbox }).first().textContent().catch(() => '')) || '';
  63  | 
  64  |   const submittedCount = Number.parseInt(submittedLabel.match(/(\d+)$/)?.[1] || '0', 10);
  65  |   const tardyCount = Number.parseInt(tardyLabel.match(/(\d+)$/)?.[1] || '0', 10);
  66  | 
  67  |   if (submittedCount === 0 && (await submittedCheckbox.isChecked().catch(() => false))) {
  68  |     await submittedCheckbox.uncheck();
  69  |   }
  70  |   if (tardyCount === 0 && (await tardyCheckbox.isChecked().catch(() => false))) {
  71  |     await tardyCheckbox.uncheck();
  72  |   }
  73  | 
  74  |   await page.keyboard.press('Escape');
  75  |   await waitBillsLoaded(page);
  76  | }
  77  | 
  78  | async function openFirstInvoice(page: Page): Promise<{ invoiceNumber: string; invoiceId: string }> {
  79  |   const rowCountText =
  80  |     (await page.locator('main').getByText(/\d+ row\(s\)\./).first().textContent().catch(() => '0 row(s).')) ||
  81  |     '0 row(s).';
  82  |   const rowCount = Number.parseInt(rowCountText, 10) || 0;
  83  |   expect(rowCount, `Se requiere al menos 1 factura actionable. Encontradas: ${rowCount}.`).toBeGreaterThan(0);
  84  | 
  85  |   const invoiceNumber =
  86  |     ((await page.locator('p:has-text("Invoice Number") + p').first().textContent().catch(() => '')) || '').trim();
  87  | 
  88  |   await page.getByRole('button', { name: 'Action', exact: true }).first().click();
  89  |   await page.getByRole('button', { name: 'View Bill', exact: true }).click();
  90  | 
  91  |   await page.waitForURL('**/invoice/**');
  92  |   await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible({ timeout: 20_000 });
  93  | 
  94  |   const url = page.url();
  95  |   const invoiceId = url.split('/invoice/')[1]?.split('?')[0] || '';
  96  |   expect(invoiceId).toMatch(/[a-f0-9-]{20,}/i);
  97  | 
  98  |   return { invoiceNumber, invoiceId };
  99  | }
  100 | 
  101 | async function readUiStatus(page: Page): Promise<string> {
  102 |   const status = ((await page.locator('p:has-text("Bill Status") + p').textContent().catch(() => '')) || '').trim();
  103 |   return status;
  104 | }
  105 | 
  106 | async function waitUiStatus(page: Page, expected: 'approved' | 'registered' | 'paid'): Promise<string> {
  107 |   await expect
  108 |     .poll(async () => (await readUiStatus(page)).toLowerCase(), {
  109 |       timeout: 30_000,
  110 |       intervals: [500, 1000, 1500],
  111 |     })
  112 |     .toContain(expected);
  113 |   return readUiStatus(page);
  114 | }
  115 | 
  116 | async function captureBackendMutation(page: Page): Promise<Response> {
  117 |   return page.waitForResponse(
  118 |     (response) => {
```