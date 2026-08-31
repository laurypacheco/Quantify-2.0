# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: provider-us10146-lifecycle.spec.ts >> US 10146 | Providers dates and status lifecycle >> debe validar catalogo de estados y ciclo Active -> Cancelled con evidencias UI/backend
- Location: tests\provider-us10146-lifecycle.spec.ts:155:7

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('textbox', { name: 'Email' })

```

# Test source

```ts
  1   | import { expect, test, type Page, type Response } from '@playwright/test';
  2   | 
  3   | type ProviderSummary = {
  4   |   name: string;
  5   |   vendorId: string;
  6   |   status: string;
  7   | };
  8   | 
  9   | type ProviderDates = {
  10  |   createdAt: string;
  11  |   updatedAt: string;
  12  | };
  13  | 
  14  | const LOGIN_URL =
  15  |   process.env.KEYCLOAK_AUTH_URL ||
  16  |   'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';
  17  | 
  18  | async function loginAdmin(page: Page): Promise<void> {
  19  |   const email = process.env.QA_USER_ADMIN || 'admin@quantify.local';
  20  |   const password = process.env.QA_PASS_ADMIN || 'admin123';
  21  | 
  22  |   await page.goto(LOGIN_URL);
> 23  |   await page.getByRole('textbox', { name: 'Email' }).fill(email);
      |                                                      ^ Error: locator.fill: Target page, context or browser has been closed
  24  |   await page.getByRole('textbox', { name: 'Password' }).fill(password);
  25  |   await page.getByRole('button', { name: 'Login' }).click();
  26  |   await page.waitForURL('**dev.quantify.quisit.net/**');
  27  |   await page.waitForLoadState('networkidle');
  28  | }
  29  | 
  30  | async function openProviders(page: Page): Promise<void> {
  31  |   await page.goto('https://dev.quantify.quisit.net/providers');
  32  |   await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible({ timeout: 20_000 });
  33  |   await expect(page.locator('main').getByText(/\d+ row\(s\) found\.|No providers found\./).first()).toBeVisible({
  34  |     timeout: 20_000,
  35  |   });
  36  | }
  37  | 
  38  | async function getStatusFilterOptions(page: Page): Promise<string[]> {
  39  |   const options = await page.locator('select').nth(1).locator('option').allTextContents();
  40  |   return options.map((opt) => opt.trim()).filter(Boolean);
  41  | }
  42  | 
  43  | async function filterProvidersByStatus(page: Page, status: string): Promise<number> {
  44  |   await page.locator('select').nth(1).selectOption({ label: status });
  45  |   await page.waitForLoadState('networkidle');
  46  | 
  47  |   const rowCountText =
  48  |     (await page.locator('main').getByText(/\d+ row\(s\) found\./).first().textContent().catch(() => '0 row(s) found.')) ||
  49  |     '0 row(s) found.';
  50  |   return Number.parseInt(rowCountText, 10) || 0;
  51  | }
  52  | 
  53  | async function readFirstProviderCard(page: Page): Promise<ProviderSummary> {
  54  |   const firstCard = page.locator('main').locator('button:has-text("Actions")').first().locator('xpath=ancestor::div[contains(@class,"grid")]').first();
  55  | 
  56  |   const name =
  57  |     ((await firstCard.locator('p:has-text("Provider Name") + p').first().textContent().catch(() => '')) || '').trim();
  58  |   const vendorId =
  59  |     ((await firstCard.locator('p:has-text("Vendor ID") + p').first().textContent().catch(() => '')) || '').trim();
  60  | 
  61  |   const statusCandidate =
  62  |     ((await firstCard.locator('span').first().textContent().catch(() => '')) || '').trim() ||
  63  |     ((await firstCard.locator('div').first().textContent().catch(() => '')) || '').trim();
  64  | 
  65  |   return {
  66  |     name,
  67  |     vendorId,
  68  |     status: statusCandidate,
  69  |   };
  70  | }
  71  | 
  72  | async function waitForProviderDetailResponse(page: Page): Promise<Response> {
  73  |   return page.waitForResponse(
  74  |     (response) => {
  75  |       const method = response.request().method().toUpperCase();
  76  |       const url = response.url().toLowerCase();
  77  |       return method === 'GET' && url.includes('/provider') && url.includes('quantify');
  78  |     },
  79  |     { timeout: 30_000 }
  80  |   );
  81  | }
  82  | 
  83  | async function openFirstProviderDetails(page: Page): Promise<void> {
  84  |   await page.getByRole('button', { name: 'Actions', exact: true }).first().click();
  85  |   await page.getByRole('button', { name: 'View Provider', exact: true }).first().click();
  86  |   await page.waitForURL('**/providers/**');
  87  |   await expect(page.getByRole('heading', { name: 'View Provider' })).toBeVisible({ timeout: 20_000 });
  88  | }
  89  | 
  90  | async function readProviderStatusFromView(page: Page): Promise<string> {
  91  |   const text = (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
  92  |   const match = text.match(/Status\s+([A-Za-z ]{3,30})/i);
  93  |   return (match?.[1] || '').trim();
  94  | }
  95  | 
  96  | function extractProviderDatesFromPayload(payload: any): ProviderDates {
  97  |   const createdAt =
  98  |     payload?.createdAt ||
  99  |     payload?.dateCreated ||
  100 |     payload?.data?.createdAt ||
  101 |     payload?.data?.dateCreated ||
  102 |     payload?.provider?.createdAt ||
  103 |     payload?.provider?.dateCreated ||
  104 |     '';
  105 | 
  106 |   const updatedAt =
  107 |     payload?.updatedAt ||
  108 |     payload?.dateModified ||
  109 |     payload?.data?.updatedAt ||
  110 |     payload?.data?.dateModified ||
  111 |     payload?.provider?.updatedAt ||
  112 |     payload?.provider?.dateModified ||
  113 |     '';
  114 | 
  115 |   return { createdAt: String(createdAt || ''), updatedAt: String(updatedAt || '') };
  116 | }
  117 | 
  118 | async function cancelProviderIfPossible(page: Page): Promise<{ cancelled: boolean; mutationStatus?: number }> {
  119 |   await page.getByRole('button', { name: 'Actions', exact: true }).click();
  120 | 
  121 |   const cancelBtn = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  122 |   if (!(await cancelBtn.isVisible().catch(() => false))) {
  123 |     return { cancelled: false };
```