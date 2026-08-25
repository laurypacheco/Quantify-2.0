# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reviewer-approve-reject.spec.ts >> Reviewer aprueba una factura y rechaza otra con razon
- Location: tests\reviewer-approve-reject.spec.ts:114:5

# Error details

```
Error: Precondicion fallida: se requieren al menos 2 facturas en estado Tardy/Submitted para este flujo. Detectadas: 1.

expect(received).toBeGreaterThan(expected)

Expected: > 1
Received:   1
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
            - paragraph [ref=f2e60]: $1,250
            - paragraph [ref=f2e61]: 1 bills awaiting action
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
            - button "Status 1 selected" [ref=f2e92] [cursor=pointer]:
              - generic [ref=f2e94]: Status
              - generic [ref=f2e95]: 1 selected
            - generic [ref=f2e96]:
              - textbox "Status" [ref=f2e98]
              - generic [ref=f2e99] [cursor=pointer]:
                - checkbox "Submitted 0" [active] [ref=f2e100]
                - generic [ref=f2e102]: Submitted
                - generic [ref=f2e103]: "0"
              - generic [ref=f2e104] [cursor=pointer]:
                - checkbox "Tardy 1" [checked] [ref=f2e105]
                - generic [ref=f2e107]: Tardy
                - generic [ref=f2e108]: "1"
              - button "Clear filters" [ref=f2e110] [cursor=pointer]
          - button "Period" [ref=f2e112] [cursor=pointer]
        - generic [ref=f2e116]:
          - checkbox [ref=f2e117]
          - generic [ref=f2e118]: Select all in page
        - generic [ref=f2e121] [cursor=pointer]:
          - checkbox [ref=f2e123]
          - generic [ref=f2e124]: Tardy
          - generic [ref=f2e127]:
            - paragraph [ref=f2e128]: Invoice Number
            - paragraph [ref=f2e132]: JDP90011
          - generic [ref=f2e133]:
            - paragraph [ref=f2e134]: Provider
            - paragraph [ref=f2e137]: Global Tech Vendors Inc
          - generic [ref=f2e138]:
            - paragraph [ref=f2e139]: Company
            - paragraph [ref=f2e142]: Khensys
          - generic [ref=f2e143]:
            - paragraph [ref=f2e144]: Project
            - paragraph [ref=f2e149]: Internal Tools
          - generic [ref=f2e150]:
            - paragraph [ref=f2e151]: Deadline to Submit
            - paragraph [ref=f2e154]: Jan 06, 2025
          - generic [ref=f2e155]:
            - paragraph [ref=f2e156]: Period
            - paragraph [ref=f2e160]: January 2025
          - generic [ref=f2e161]:
            - paragraph [ref=f2e162]: Amount
            - paragraph [ref=f2e165]: $1,250
          - button "Action" [ref=f2e167]
        - generic [ref=f2e171]:
          - paragraph [ref=f2e172]: 1 row(s).
          - generic [ref=f2e173]:
            - generic [ref=f2e174]:
              - generic [ref=f2e175]: Rows per page
              - button "10" [ref=f2e177] [cursor=pointer]
            - generic [ref=f2e180]: Page 1 of 1
            - generic [ref=f2e181]:
              - button [disabled] [ref=f2e182]
              - button [disabled] [ref=f2e186]
              - button [disabled] [ref=f2e189]
              - button [disabled] [ref=f2e192]
```

# Test source

```ts
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
  111 |   await expect(page.getByText('Reason for Rejection:')).toHaveCount(0, { timeout: 20_000 });
  112 | }
  113 | 
  114 | test('Reviewer aprueba una factura y rechaza otra con razon', async ({ page }) => {
  115 |   await loginReviewer(page);
  116 |   await openBills(page);
  117 |   await waitBillsLoaded(page);
  118 | 
  119 |   const actionableCount = await selectSubmittedAndTardyStatus(page);
  120 |   await waitBillsLoaded(page);
  121 | 
  122 |   const rowCountText =
  123 |     (await page.locator('main').getByText(/\d+ row\(s\)\./).first().textContent()) || '0 row(s).';
  124 |   const rowCount = Number.parseInt(rowCountText, 10) || 0;
  125 |   expect(
  126 |     actionableCount,
  127 |     `Precondicion fallida: se requieren al menos 2 facturas en estado Tardy/Submitted para este flujo. Detectadas: ${actionableCount}.`
> 128 |   ).toBeGreaterThan(1);
      |     ^ Error: Precondicion fallida: se requieren al menos 2 facturas en estado Tardy/Submitted para este flujo. Detectadas: 1.
  129 |   expect(
  130 |     rowCount,
  131 |     `Precondicion fallida: el grid devuelve ${rowCount} factura(s) tras filtrar por Tardy/Submitted.`
  132 |   ).toBeGreaterThan(1);
  133 | 
  134 |   test.info().annotations.push({
  135 |     type: 'status-filter-used',
  136 |     description: 'Submitted+Tardy',
  137 |   });
  138 | 
  139 |   const firstInvoice = await openInvoiceFromRow(page, 0);
  140 |   await approveInvoice(page);
  141 |   await page.getByRole('link', { name: 'Back to Bills', exact: true }).click();
  142 |   await waitBillsLoaded(page);
  143 | 
  144 |   const secondInvoice = await openInvoiceFromRow(page, 1);
  145 |   await rejectInvoiceWithReason(page, 'Monto y descripcion inconsistentes con el soporte enviado.');
  146 | 
  147 |   test.info().annotations.push({
  148 |     type: 'processed-invoices',
  149 |     description: `approve=${firstInvoice || 'row0'}; reject=${secondInvoice || 'row1'}`,
  150 |   });
  151 | 
  152 |   await expect(page.getByRole('heading', { name: /Number Bill:/i })).toBeVisible();
  153 | });
  154 | 
```