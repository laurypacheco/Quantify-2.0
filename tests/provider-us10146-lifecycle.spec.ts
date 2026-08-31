import { expect, test, type Page, type Response } from '@playwright/test';

type ProviderSummary = {
  name: string;
  vendorId: string;
  status: string;
};

type ProviderDates = {
  createdAt: string;
  updatedAt: string;
};

const LOGIN_URL =
  process.env.KEYCLOAK_AUTH_URL ||
  'https://kc.quantify.quisit.net/realms/quantify/protocol/openid-connect/auth?client_id=quantify-app&response_type=code&scope=openid+profile+email&redirect_uri=https:%2F%2Fdev.quantify.quisit.net%2Fauth%2Fkeycloak%2Fcallback&code_challenge=o21hKt3ZuzRBvuvVa6-hPhhIt_LbmIoq5dLmoorDpXk&code_challenge_method=S256';

async function loginAdmin(page: Page): Promise<void> {
  const email = process.env.QA_USER_ADMIN || 'admin@quantify.local';
  const password = process.env.QA_PASS_ADMIN || 'admin123';

  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**dev.quantify.quisit.net/**');
  await page.waitForLoadState('networkidle');
}

async function openProviders(page: Page): Promise<void> {
  await page.goto('https://dev.quantify.quisit.net/providers');
  await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('main').getByText(/\d+ row\(s\) found\.|No providers found\./).first()).toBeVisible({
    timeout: 20_000,
  });
}

async function getStatusFilterOptions(page: Page): Promise<string[]> {
  const options = await page.locator('select').nth(1).locator('option').allTextContents();
  return options.map((opt) => opt.trim()).filter(Boolean);
}

async function filterProvidersByStatus(page: Page, status: string): Promise<number> {
  await page.locator('select').nth(1).selectOption({ label: status });
  await page.waitForLoadState('networkidle');

  const rowCountText =
    (await page.locator('main').getByText(/\d+ row\(s\) found\./).first().textContent().catch(() => '0 row(s) found.')) ||
    '0 row(s) found.';
  return Number.parseInt(rowCountText, 10) || 0;
}

async function readFirstProviderCard(page: Page): Promise<ProviderSummary> {
  const firstCard = page.locator('main').locator('button:has-text("Actions")').first().locator('xpath=ancestor::div[contains(@class,"grid")]').first();

  const name =
    ((await firstCard.locator('p:has-text("Provider Name") + p').first().textContent().catch(() => '')) || '').trim();
  const vendorId =
    ((await firstCard.locator('p:has-text("Vendor ID") + p').first().textContent().catch(() => '')) || '').trim();

  const statusCandidate =
    ((await firstCard.locator('span').first().textContent().catch(() => '')) || '').trim() ||
    ((await firstCard.locator('div').first().textContent().catch(() => '')) || '').trim();

  return {
    name,
    vendorId,
    status: statusCandidate,
  };
}

async function waitForProviderDetailResponse(page: Page): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      const method = response.request().method().toUpperCase();
      const url = response.url().toLowerCase();
      return method === 'GET' && url.includes('/provider') && url.includes('quantify');
    },
    { timeout: 30_000 }
  );
}

async function openFirstProviderDetails(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Actions', exact: true }).first().click();
  await page.getByRole('button', { name: 'View Provider', exact: true }).first().click();
  await page.waitForURL('**/providers/**');
  await expect(page.getByRole('heading', { name: 'View Provider' })).toBeVisible({ timeout: 20_000 });
}

async function readProviderStatusFromView(page: Page): Promise<string> {
  const text = (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const match = text.match(/Status\s+([A-Za-z ]{3,30})/i);
  return (match?.[1] || '').trim();
}

function extractProviderDatesFromPayload(payload: any): ProviderDates {
  const createdAt =
    payload?.createdAt ||
    payload?.dateCreated ||
    payload?.data?.createdAt ||
    payload?.data?.dateCreated ||
    payload?.provider?.createdAt ||
    payload?.provider?.dateCreated ||
    '';

  const updatedAt =
    payload?.updatedAt ||
    payload?.dateModified ||
    payload?.data?.updatedAt ||
    payload?.data?.dateModified ||
    payload?.provider?.updatedAt ||
    payload?.provider?.dateModified ||
    '';

  return { createdAt: String(createdAt || ''), updatedAt: String(updatedAt || '') };
}

async function cancelProviderIfPossible(page: Page): Promise<{ cancelled: boolean; mutationStatus?: number }> {
  await page.getByRole('button', { name: 'Actions', exact: true }).click();

  const cancelBtn = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  if (!(await cancelBtn.isVisible().catch(() => false))) {
    return { cancelled: false };
  }

  const mutationPromise = page.waitForResponse(
    (response) => {
      const method = response.request().method().toUpperCase();
      const url = response.url().toLowerCase();
      return ['POST', 'PUT', 'PATCH'].includes(method) && url.includes('/provider') && url.includes('quantify');
    },
    { timeout: 30_000 }
  );

  await cancelBtn.click();
  const reasonBox = page.getByRole('textbox', { name: /Describe the reason for this change/i }).first();
  if (await reasonBox.isVisible().catch(() => false)) {
    await reasonBox.fill('US10146 automation validation: cancelling active provider to verify final state behavior.');
  }

  const confirmBtn = page.getByRole('button', { name: 'Confirm', exact: true }).first();
  if (await confirmBtn.isVisible().catch(() => false)) {
    await confirmBtn.click();
  }

  const mutation = await mutationPromise;

  await page.getByRole('button', { name: 'Status History', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Status History' })).toBeVisible({ timeout: 20_000 });

  return { cancelled: true, mutationStatus: mutation.status() };
}

test.describe('US 10146 | Providers dates and status lifecycle', () => {
  test('debe validar catalogo de estados y ciclo Active -> Cancelled con evidencias UI/backend', async ({ page }) => {
    await loginAdmin(page);
    await openProviders(page);

    const statusOptions = await getStatusFilterOptions(page);
    expect(statusOptions).toEqual(expect.arrayContaining(['Draft', 'Active', 'Disabled', 'Cancelled']));

    const activeCount = await filterProvidersByStatus(page, 'Active');
    expect(activeCount, 'Precondicion: se requiere al menos 1 provider Active para validar ciclo.').toBeGreaterThan(0);

    const providerBefore = await readFirstProviderCard(page);
    const detailResponsePromise = waitForProviderDetailResponse(page);
    await openFirstProviderDetails(page);

    let providerDates: ProviderDates = { createdAt: '', updatedAt: '' };
    const detailResponse = await detailResponsePromise.catch(() => null);
    if (detailResponse && detailResponse.ok()) {
      const payload = await detailResponse.json().catch(() => ({}));
      providerDates = extractProviderDatesFromPayload(payload);
    }

    if (!providerDates.createdAt) {
      test.info().annotations.push({
        type: 'date-created-not-exposed',
        description: 'Backend payload for provider detail did not expose createdAt/dateCreated in this environment.',
      });
    }

    const currentStatus = await readProviderStatusFromView(page);
    expect.soft(currentStatus.toLowerCase()).toContain('active');

    const cancelResult = await cancelProviderIfPossible(page);
    expect(cancelResult.cancelled, 'El provider Active debe permitir transicion a Cancelled.').toBeTruthy();
    expect.soft(cancelResult.mutationStatus || 0).toBeGreaterThanOrEqual(200);
    expect.soft(cancelResult.mutationStatus || 0).toBeLessThan(400);

    const historyText = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
    expect.soft(historyText.toLowerCase()).toContain('cancel');

    if (!providerDates.updatedAt) {
      test.info().annotations.push({
        type: 'date-modified-not-exposed',
        description: 'Backend payload for provider transition did not expose updatedAt/dateModified in this environment.',
      });
    }

    test.info().annotations.push(
      { type: 'provider', description: `${providerBefore.name} (${providerBefore.vendorId})` },
      { type: 'status-options', description: statusOptions.join(', ') },
      {
        type: 'dates-backend',
        description: `created=${providerDates.createdAt || 'n/a'}; updated=${providerDates.updatedAt || 'n/a'}`,
      }
    );
  });
});
