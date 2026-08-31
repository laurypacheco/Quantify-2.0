# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reviewer-approve-reject.spec.ts >> Reviewer aprueba una factura y rechaza otra con razon
- Location: tests\reviewer-approve-reject.spec.ts:114:5

# Error details

```
Error: Missing required env var QA_USER_REVIEWER
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | 
  3   | const LOGIN_URL =
  4   |   process.env.KEYCLOAK_AUTH_URL ||
  5   |   'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';
  6   | 
  7   | function requireEnv(name: string): string {
  8   |   const value = process.env[name];
  9   |   if (!value) {
> 10  |     throw new Error(`Missing required env var ${name}`);
      |           ^ Error: Missing required env var QA_USER_REVIEWER
  11  |   }
  12  |   return value;
  13  | }
  14  | 
  15  | async function loginReviewer(page: Page): Promise<void> {
  16  |   const email = requireEnv('QA_USER_REVIEWER');
  17  |   const password = requireEnv('QA_PASS_REVIEWER');
  18  | 
  19  |   await page.goto(LOGIN_URL);
  20  |   await page.getByRole('textbox', { name: 'Email' }).fill(email);
  21  |   await page.getByRole('textbox', { name: 'Password' }).fill(password);
  22  |   await page.getByRole('button', { name: 'Login' }).click();
  23  |   await page.waitForURL('**dev.quantify.quisit.net/**');
  24  |   await page.waitForLoadState('networkidle');
  25  | }
  26  | 
  27  | async function openBills(page: Page): Promise<void> {
  28  |   await page.locator('nav').getByRole('link', { name: 'Bills', exact: true }).click();
  29  |   await page.waitForURL('**/invoice/invoices');
  30  |   await page.waitForLoadState('networkidle');
  31  | }
  32  | 
  33  | async function waitBillsLoaded(page: Page): Promise<void> {
  34  |   await expect(page.getByText('Loading bills…')).toHaveCount(0, { timeout: 20_000 });
  35  |   await expect(page.getByText(/\d+ row\(s\)\./)).toBeVisible({ timeout: 20_000 });
  36  | }
  37  | 
  38  | async function selectSubmittedAndTardyStatus(page: Page): Promise<number> {
  39  |   await page.getByRole('button', { name: /Status/i }).click();
  40  |   const submittedCheckbox = page.getByRole('checkbox', { name: /Submitted/i });
  41  |   const tardyCheckbox = page.getByRole('checkbox', { name: /Tardy/i });
  42  | 
  43  |   const submittedExists = (await submittedCheckbox.count()) > 0;
  44  |   const tardyExists = (await tardyCheckbox.count()) > 0;
  45  | 
  46  |   if (!submittedExists && !tardyExists) {
  47  |     await page.keyboard.press('Escape');
  48  |     return 0;
  49  |   }
  50  | 
  51  |   if (submittedExists && !(await submittedCheckbox.isChecked().catch(() => false))) {
  52  |     await submittedCheckbox.check();
  53  |   }
  54  | 
  55  |   if (tardyExists && !(await tardyCheckbox.isChecked().catch(() => false))) {
  56  |     await tardyCheckbox.check();
  57  |   }
  58  | 
  59  |   const submittedCountText = submittedExists
  60  |     ? ((await page.locator('label', { has: submittedCheckbox }).first().textContent()) || '').trim()
  61  |     : '';
  62  |   const submittedCount = Number.parseInt(submittedCountText.match(/(\d+)$/)?.[1] || '0', 10);
  63  | 
  64  |   const tardyCountText = tardyExists
  65  |     ? ((await page.locator('label', { has: tardyCheckbox }).first().textContent()) || '').trim()
  66  |     : '';
  67  |   const tardyCount = Number.parseInt(tardyCountText.match(/(\d+)$/)?.[1] || '0', 10);
  68  | 
  69  |   if (submittedExists && submittedCount === 0 && (await submittedCheckbox.isChecked().catch(() => false))) {
  70  |     await submittedCheckbox.uncheck();
  71  |   }
  72  |   if (tardyExists && tardyCount === 0 && (await tardyCheckbox.isChecked().catch(() => false))) {
  73  |     await tardyCheckbox.uncheck();
  74  |   }
  75  | 
  76  |   await page.keyboard.press('Escape');
  77  |   await waitBillsLoaded(page);
  78  |   return submittedCount + tardyCount;
  79  | }
  80  | 
  81  | async function openInvoiceFromRow(page: Page, rowIndex: number): Promise<string> {
  82  |   const actionButtons = page.getByRole('button', { name: 'Action', exact: true });
  83  |   const count = await actionButtons.count();
  84  |   expect(count).toBeGreaterThan(rowIndex);
  85  | 
  86  |   const invoiceNumbers = page.locator('p:has-text("Invoice Number") + p');
  87  |   const number = (await invoiceNumbers.nth(rowIndex).textContent().catch(() => ''))?.trim() || '';
  88  | 
  89  |   await actionButtons.nth(rowIndex).click();
  90  |   await page.getByRole('button', { name: 'View Bill', exact: true }).click();
  91  |   await page.waitForURL('**/invoice/**');
  92  |   await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible({ timeout: 15_000 });
  93  | 
  94  |   return number;
  95  | }
  96  | 
  97  | async function approveInvoice(page: Page): Promise<void> {
  98  |   await page.getByRole('button', { name: 'Accept', exact: true }).click();
  99  |   await page.getByRole('button', { name: 'Continue', exact: true }).click();
  100 | 
  101 |   const processing = page.getByRole('button', { name: /Processing/i });
  102 |   await expect(processing).toHaveCount(0, { timeout: 20_000 });
  103 | }
  104 | 
  105 | async function rejectInvoiceWithReason(page: Page, reason: string): Promise<void> {
  106 |   await page.getByRole('button', { name: 'Decline', exact: true }).click();
  107 |   await page.locator('select').first().selectOption({ label: 'Incorrect Data' });
  108 |   await page.getByRole('textbox', { name: /Tell us a little bit about/i }).fill(reason);
  109 |   await page.getByRole('button', { name: 'Save', exact: true }).click();
  110 | 
```