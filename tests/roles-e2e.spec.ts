import { expect, test, type Browser, type Page } from '@playwright/test';

type Role = 'provider' | 'reviewer' | 'approver' | 'admin';

type RoleCreds = {
  role: Role;
  email: string;
  password: string;
};

type ProbeResult = {
  route: string;
  url: string;
  h1: string;
  has403Text: boolean;
};

const LOGIN_URL =
  process.env.KEYCLOAK_AUTH_URL ||
  'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';

const ROLE_CREDS: RoleCreds[] = [
  {
    role: 'provider',
    email: process.env.QA_USER_PROVIDER || '',
    password: process.env.QA_PASS_PROVIDER || '',
  },
  {
    role: 'reviewer',
    email: process.env.QA_USER_REVIEWER || '',
    password: process.env.QA_PASS_REVIEWER || '',
  },
  {
    role: 'approver',
    email: process.env.QA_USER_APPROVER || '',
    password: process.env.QA_PASS_APPROVER || '',
  },
  {
    role: 'admin',
    email: process.env.QA_USER_ADMIN || '',
    password: process.env.QA_PASS_ADMIN || '',
  },
];

const EXPECTED_NAV: Record<Role, string[]> = {
  provider: ['Bills', 'Help', 'Settings'],
  reviewer: ['Dashboard', 'Bills', 'Help', 'Reports', 'Settings'],
  approver: ['Dashboard', 'Bills', 'Help', 'Settings'],
  admin: ['Dashboard', 'Providers', 'Bills', 'Companies', 'Help', 'Users', 'Reports', 'Settings'],
};

const RESTRICTED_BY_ROLE: Record<Role, string[]> = {
  provider: ['/dashboard', '/providers', '/users', '/reports'],
  reviewer: ['/providers', '/users'],
  approver: ['/providers', '/users', '/reports'],
  admin: [],
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

async function loginAs(page: Page, creds: RoleCreds): Promise<void> {
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'Email' }).fill(creds.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(creds.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**dev.quantify.quisit.net/**');
  await page.waitForLoadState('networkidle');
}

async function navLabels(page: Page): Promise<string[]> {
  const all = await page.locator('nav a').allTextContents();
  return all.map((value) => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

async function probeRoute(page: Page, route: string): Promise<ProbeResult> {
  await page.goto(`https://dev.quantify.quisit.net${route}`);
  await page.waitForLoadState('domcontentloaded');

  const h1 = (await page.locator('h1').first().textContent().catch(() => '')) || '';
  const has403Text = await page
    .getByText(/403|forbidden|unauthorized|not authorized|acceso denegado/i)
    .first()
    .isVisible()
    .catch(() => false);

  return {
    route,
    url: page.url(),
    h1: h1.trim(),
    has403Text,
  };
}

test.describe('RBAC E2E | flujo completo multirol', () => {
  test.beforeAll(() => {
    requireEnv('QA_USER_PROVIDER');
    requireEnv('QA_PASS_PROVIDER');
    requireEnv('QA_USER_REVIEWER');
    requireEnv('QA_PASS_REVIEWER');
    requireEnv('QA_USER_APPROVER');
    requireEnv('QA_PASS_APPROVER');
    requireEnv('QA_USER_ADMIN');
    requireEnv('QA_PASS_ADMIN');
  });

  test('debe validar navegación, restricciones y hallazgos críticos por rol', async ({ browser }) => {
    const findings: string[] = [];

    for (const creds of ROLE_CREDS) {
      const context = await (browser as Browser).newContext();
      const page = await context.newPage();
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await loginAs(page, creds);

      const labels = await navLabels(page);
      expect.soft(labels).toEqual(EXPECTED_NAV[creds.role]);

      if (labels.includes('Bills')) {
        await page.locator('nav').getByRole('link', { name: 'Bills', exact: true }).click();
        await page.waitForLoadState('networkidle');
      }

      const hello = ((await page.locator('h1').first().textContent()) || '').trim();
      if (creds.role !== 'provider' && /Hello, Juan/i.test(hello)) {
        findings.push(
          `${creds.role}: la vista Bills muestra saludo de Provider (Hello, Juan) en lugar del usuario autenticado`
        );
      }

      for (const route of RESTRICTED_BY_ROLE[creds.role]) {
        const probe = await probeRoute(page, route);
        if (probe.url.endsWith(route)) {
          findings.push(`${creds.role}: acceso inesperado permitido a ${route}`);
        }
      }

      if (creds.role === 'admin') {
        const companiesProbe = await probeRoute(page, '/companies');
        if (companiesProbe.h1 === '404' || /404/.test(companiesProbe.url)) {
          findings.push('admin: el modulo Companies retorna 404 pero aparece en el menu');
        }
      }

      const corsErrors = consoleErrors.filter(
        (line) =>
          /Access to XMLHttpRequest|CORS policy|No 'Access-Control-Allow-Origin'|ERR_FAILED/i.test(line)
      );
      if (corsErrors.length > 0) {
        findings.push(
          `${creds.role}: errores CORS en dashboard/bills detectados (${corsErrors.length} eventos)`
        );
      }

      await context.close();
    }

    expect.soft(findings).toEqual([]);
  });
});
