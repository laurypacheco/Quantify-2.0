# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reviewer-tardy-lifecycle.spec.ts >> Reviewer | Tardy -> Approved -> Registered -> Paid con validacion UI y backend
- Location: tests\reviewer-tardy-lifecycle.spec.ts:174:5

# Error details

```
Error: Se requiere al menos 1 factura actionable. Encontradas: 0.

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - complementary [ref=f2e4]:
    - link "Quantify dashboard" [ref=f2e6] [cursor=pointer]:
      - /url: /dashboard
    - navigation [ref=f2e7]:
      - link "Dashboard" [ref=f2e8] [cursor=pointer]:
        - /url: /dashboard
      - link "Bills" [ref=f2e15] [cursor=pointer]:
        - /url: /invoice/invoices
      - link "Help" [ref=f2e20] [cursor=pointer]:
        - /url: /help
      - paragraph [ref=f2e25]: Administration
      - link "Reports" [ref=f2e26] [cursor=pointer]:
        - /url: /reports
      - link "Settings" [ref=f2e30] [cursor=pointer]:
        - /url: /settings
  - generic [ref=f2e35]:
    - banner [ref=f2e36]:
      - generic [ref=f2e37]:
        - heading "Hello, Juan" [level=1] [ref=f2e38]
        - paragraph [ref=f2e39]: Your payment summary is here!
      - generic [ref=f2e40]:
        - link "Create Bill" [ref=f2e41] [cursor=pointer]:
          - /url: /invoice/new-invoice
        - button "Notificaciones" [ref=f2e44] [cursor=pointer]:
          - generic [ref=f2e48]: "7"
        - button "User menu" [ref=f2e50] [cursor=pointer]: RU
    - main [ref=f2e51]:
      - alert [ref=f2e52]
      - generic [ref=f2e53]:
        - generic [ref=f2e54]:
          - generic [ref=f2e55]:
            - paragraph [ref=f2e59]: Pending Total
            - paragraph [ref=f2e60]: $0
            - paragraph [ref=f2e61]: 0 bills awaiting action
          - generic [ref=f2e62]:
            - paragraph [ref=f2e65]: Overdue Amount
            - paragraph [ref=f2e66]: $0
            - paragraph [ref=f2e67]: 0 overdue bills
          - generic [ref=f2e68]:
            - paragraph [ref=f2e71]: Payments this month
            - paragraph [ref=f2e72]: $0
            - paragraph [ref=f2e73]: 0 paid bills
        - generic [ref=f2e74]:
          - textbox "Invoice Number" [ref=f2e75]
          - button "All companies" [ref=f2e77] [cursor=pointer]
          - button "Advanced" [ref=f2e84] [cursor=pointer]
          - button "Search" [ref=f2e87] [cursor=pointer]
          - generic [ref=f2e91]:
            - button "Status 0 selected" [ref=f2e92] [cursor=pointer]:
              - generic [ref=f2e94]: Status
              - generic [ref=f2e95]: 0 selected
            - generic [ref=f2e96]:
              - textbox "Status" [ref=f2e98]
              - generic [ref=f2e99] [cursor=pointer]:
                - checkbox "Submitted 0" [ref=f2e100]
                - generic [ref=f2e102]: Submitted
                - generic [ref=f2e103]: "0"
              - generic [ref=f2e104] [cursor=pointer]:
                - checkbox "Tardy 0" [active] [ref=f2e105]
                - generic [ref=f2e107]: Tardy
                - generic [ref=f2e108]: "0"
              - button "Clear filters" [ref=f2e110] [cursor=pointer]
          - button "Period" [ref=f2e112] [cursor=pointer]
        - generic [ref=f2e116]:
          - checkbox [ref=f2e117]
          - generic [ref=f2e118]: Select all in page
        - generic [ref=f2e119]: No bills match your filters.
        - generic [ref=f2e122]:
          - paragraph [ref=f2e123]: 0 row(s).
          - generic [ref=f2e124]:
            - generic [ref=f2e125]:
              - generic [ref=f2e126]: Rows per page
              - button "10" [ref=f2e128] [cursor=pointer]
            - generic [ref=f2e131]: Page 1 of 1
            - generic [ref=f2e132]:
              - button [disabled] [ref=f2e133]
              - button [disabled] [ref=f2e137]
              - button [disabled] [ref=f2e140]
              - button [disabled] [ref=f2e143]
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
  18  |     throw new Error(`Missing required env var ${name}`);
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
> 83  |   expect(rowCount, `Se requiere al menos 1 factura actionable. Encontradas: ${rowCount}.`).toBeGreaterThan(0);
      |                                                                                            ^ Error: Se requiere al menos 1 factura actionable. Encontradas: 0.
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
  119 |       const method = response.request().method().toUpperCase();
  120 |       const url = response.url().toLowerCase();
  121 |       return (
  122 |         ['POST', 'PUT', 'PATCH'].includes(method) &&
  123 |         url.includes('/api/') &&
  124 |         (url.includes('invoice') || url.includes('bill'))
  125 |       );
  126 |     },
  127 |     { timeout: 30_000 }
  128 |   );
  129 | }
  130 | 
  131 | function toActionSnapshot(action: BackendActionSnapshot['action'], response: Response): BackendActionSnapshot {
  132 |   return {
  133 |     action,
  134 |     url: response.url(),
  135 |     method: response.request().method(),
  136 |     httpStatus: response.status(),
  137 |     ok: response.ok(),
  138 |   };
  139 | }
  140 | 
  141 | async function continueIfConfirmationExists(page: Page): Promise<void> {
  142 |   const continueBtn = page.getByRole('button', { name: /Continue/i }).first();
  143 |   if (await continueBtn.isVisible().catch(() => false)) {
  144 |     await continueBtn.click();
  145 |   }
  146 | }
  147 | 
  148 | async function transitionApprove(page: Page): Promise<BackendActionSnapshot> {
  149 |   await page.getByRole('button', { name: 'Accept', exact: true }).click();
  150 |   const mutationPromise = captureBackendMutation(page);
  151 |   await continueIfConfirmationExists(page);
  152 |   const mutation = await mutationPromise;
  153 |   await expect(page.getByRole('button', { name: /Mark as Registered/i })).toBeVisible({ timeout: 25_000 });
  154 |   return toActionSnapshot('approve', mutation);
  155 | }
  156 | 
  157 | async function transitionRegistered(page: Page): Promise<BackendActionSnapshot> {
  158 |   await page.getByRole('button', { name: /Mark as Registered/i }).click();
  159 |   const mutationPromise = captureBackendMutation(page);
  160 |   await continueIfConfirmationExists(page);
  161 |   const mutation = await mutationPromise;
  162 |   await expect(page.getByRole('button', { name: /Mark as Paid/i })).toBeVisible({ timeout: 25_000 });
  163 |   return toActionSnapshot('register', mutation);
  164 | }
  165 | 
  166 | async function transitionPaid(page: Page): Promise<BackendActionSnapshot> {
  167 |   await page.getByRole('button', { name: /Mark as Paid/i }).click();
  168 |   const mutationPromise = captureBackendMutation(page);
  169 |   await continueIfConfirmationExists(page);
  170 |   const mutation = await mutationPromise;
  171 |   return toActionSnapshot('paid', mutation);
  172 | }
  173 | 
  174 | test('Reviewer | Tardy -> Approved -> Registered -> Paid con validacion UI y backend', async ({ page }) => {
  175 |   await loginReviewer(page);
  176 |   await openBills(page);
  177 |   await waitBillsLoaded(page);
  178 |   await selectActionableStatuses(page);
  179 | 
  180 |   const { invoiceNumber, invoiceId } = await openFirstInvoice(page);
  181 | 
  182 |   const initialUiStatus = await readUiStatus(page);
  183 |   expect(initialUiStatus.toLowerCase()).toMatch(/tardy|submitted|approved/);
```