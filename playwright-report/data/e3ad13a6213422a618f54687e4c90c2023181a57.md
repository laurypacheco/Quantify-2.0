# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roles-e2e.spec.ts >> RBAC E2E | flujo completo multirol >> debe validar navegación, restricciones y hallazgos críticos por rol
- Location: tests\roles-e2e.spec.ts:112:7

# Error details

```
Error: Missing required env var QA_USER_PROVIDER
```

# Test source

```ts
  1   | import { expect, test, type Browser, type Page } from '@playwright/test';
  2   | 
  3   | type Role = 'provider' | 'reviewer' | 'approver' | 'admin';
  4   | 
  5   | type RoleCreds = {
  6   |   role: Role;
  7   |   email: string;
  8   |   password: string;
  9   | };
  10  | 
  11  | type ProbeResult = {
  12  |   route: string;
  13  |   url: string;
  14  |   h1: string;
  15  |   has403Text: boolean;
  16  | };
  17  | 
  18  | const LOGIN_URL =
  19  |   process.env.KEYCLOAK_AUTH_URL ||
  20  |   'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';
  21  | 
  22  | const ROLE_CREDS: RoleCreds[] = [
  23  |   {
  24  |     role: 'provider',
  25  |     email: process.env.QA_USER_PROVIDER || '',
  26  |     password: process.env.QA_PASS_PROVIDER || '',
  27  |   },
  28  |   {
  29  |     role: 'reviewer',
  30  |     email: process.env.QA_USER_REVIEWER || '',
  31  |     password: process.env.QA_PASS_REVIEWER || '',
  32  |   },
  33  |   {
  34  |     role: 'approver',
  35  |     email: process.env.QA_USER_APPROVER || '',
  36  |     password: process.env.QA_PASS_APPROVER || '',
  37  |   },
  38  |   {
  39  |     role: 'admin',
  40  |     email: process.env.QA_USER_ADMIN || '',
  41  |     password: process.env.QA_PASS_ADMIN || '',
  42  |   },
  43  | ];
  44  | 
  45  | const EXPECTED_NAV: Record<Role, string[]> = {
  46  |   provider: ['Bills', 'Help', 'Settings'],
  47  |   reviewer: ['Dashboard', 'Bills', 'Help', 'Reports', 'Settings'],
  48  |   approver: ['Dashboard', 'Bills', 'Help', 'Settings'],
  49  |   admin: ['Dashboard', 'Providers', 'Bills', 'Companies', 'Help', 'Users', 'Reports', 'Settings'],
  50  | };
  51  | 
  52  | const RESTRICTED_BY_ROLE: Record<Role, string[]> = {
  53  |   provider: ['/dashboard', '/providers', '/users', '/reports'],
  54  |   reviewer: ['/providers', '/users'],
  55  |   approver: ['/providers', '/users', '/reports'],
  56  |   admin: [],
  57  | };
  58  | 
  59  | function requireEnv(name: string): string {
  60  |   const value = process.env[name];
  61  |   if (!value) {
> 62  |     throw new Error(`Missing required env var ${name}`);
      |           ^ Error: Missing required env var QA_USER_PROVIDER
  63  |   }
  64  |   return value;
  65  | }
  66  | 
  67  | async function loginAs(page: Page, creds: RoleCreds): Promise<void> {
  68  |   await page.goto(LOGIN_URL);
  69  |   await page.getByRole('textbox', { name: 'Email' }).fill(creds.email);
  70  |   await page.getByRole('textbox', { name: 'Password' }).fill(creds.password);
  71  |   await page.getByRole('button', { name: 'Login' }).click();
  72  |   await page.waitForURL('**dev.quantify.quisit.net/**');
  73  |   await page.waitForLoadState('networkidle');
  74  | }
  75  | 
  76  | async function navLabels(page: Page): Promise<string[]> {
  77  |   const all = await page.locator('nav a').allTextContents();
  78  |   return all.map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
  79  | }
  80  | 
  81  | async function probeRoute(page: Page, route: string): Promise<ProbeResult> {
  82  |   await page.goto(`https://dev.quantify.quisit.net${route}`);
  83  |   await page.waitForLoadState('domcontentloaded');
  84  | 
  85  |   const h1 = (await page.locator('h1').first().textContent().catch(() => '')) || '';
  86  |   const has403Text = await page
  87  |     .getByText(/403|forbidden|unauthorized|not authorized|acceso denegado/i)
  88  |     .first()
  89  |     .isVisible()
  90  |     .catch(() => false);
  91  | 
  92  |   return {
  93  |     route,
  94  |     url: page.url(),
  95  |     h1: h1.trim(),
  96  |     has403Text,
  97  |   };
  98  | }
  99  | 
  100 | test.describe('RBAC E2E | flujo completo multirol', () => {
  101 |   test.beforeAll(() => {
  102 |     requireEnv('QA_USER_PROVIDER');
  103 |     requireEnv('QA_PASS_PROVIDER');
  104 |     requireEnv('QA_USER_REVIEWER');
  105 |     requireEnv('QA_PASS_REVIEWER');
  106 |     requireEnv('QA_USER_APPROVER');
  107 |     requireEnv('QA_PASS_APPROVER');
  108 |     requireEnv('QA_USER_ADMIN');
  109 |     requireEnv('QA_PASS_ADMIN');
  110 |   });
  111 | 
  112 |   test('debe validar navegación, restricciones y hallazgos críticos por rol', async ({ browser }) => {
  113 |     const findings: string[] = [];
  114 | 
  115 |     for (const creds of ROLE_CREDS) {
  116 |       const context = await (browser as Browser).newContext();
  117 |       const page = await context.newPage();
  118 |       const consoleErrors: string[] = [];
  119 |       page.on('console', (message) => {
  120 |         if (message.type() === 'error') {
  121 |           consoleErrors.push(message.text());
  122 |         }
  123 |       });
  124 | 
  125 |       await loginAs(page, creds);
  126 | 
  127 |       const labels = await navLabels(page);
  128 |       expect.soft(labels).toEqual(EXPECTED_NAV[creds.role]);
  129 | 
  130 |       if (labels.includes('Bills')) {
  131 |         await page.locator('nav').getByRole('link', { name: 'Bills', exact: true }).click();
  132 |         await page.waitForLoadState('networkidle');
  133 |       }
  134 | 
  135 |       const hello = ((await page.locator('h1').first().textContent()) || '').trim();
  136 |       if (creds.role !== 'provider' && /Hello, Juan/i.test(hello)) {
  137 |         findings.push(
  138 |           `${creds.role}: la vista Bills muestra saludo de Provider (Hello, Juan) en lugar del usuario autenticado`
  139 |         );
  140 |       }
  141 | 
  142 |       for (const route of RESTRICTED_BY_ROLE[creds.role]) {
  143 |         const probe = await probeRoute(page, route);
  144 |         if (probe.url.endsWith(route)) {
  145 |           findings.push(`${creds.role}: acceso inesperado permitido a ${route}`);
  146 |         }
  147 |       }
  148 | 
  149 |       if (creds.role === 'admin') {
  150 |         const companiesProbe = await probeRoute(page, '/companies');
  151 |         if (companiesProbe.h1 === '404' || /404/.test(companiesProbe.url)) {
  152 |           findings.push('admin: el modulo Companies retorna 404 pero aparece en el menu');
  153 |         }
  154 |       }
  155 | 
  156 |       const corsErrors = consoleErrors.filter(
  157 |         (line) =>
  158 |           /Access to XMLHttpRequest|CORS policy|No 'Access-Control-Allow-Origin'|ERR_FAILED/i.test(line)
  159 |       );
  160 |       if (corsErrors.length > 0) {
  161 |         findings.push(
  162 |           `${creds.role}: errores CORS en dashboard/bills detectados (${corsErrors.length} eventos)`
```