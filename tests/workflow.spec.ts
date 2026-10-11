import { test, expect } from '@playwright/test';

const caseUrl = process.env.PORTFOLIO_WORKFLOW_URL ?? '/work/aegisops/';

test('numbered workflow selections reveal the corresponding stage and preserve a direct link', async ({ page }) => {
  await page.goto(caseUrl);
  await expect(page.locator('.system-flow li')).toHaveCount(5);
  const stage = page.locator('[data-workflow-stage]').nth(2);
  const label = await stage.locator('.workflow-stage-title').textContent();
  await stage.click();
  await expect(stage).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.system-flow li').nth(2)).toBeVisible();
  await expect(page.locator('.system-flow li').nth(2).locator('h3')).toHaveText(label!);
  await expect(page).toHaveURL(/#system-stage-3$/);
  await page.reload();
  await expect(page.locator('[data-workflow-stage]').nth(2)).toHaveAttribute('aria-pressed', 'true');
});

test('workflow controls support keyboard selection and recover after bfcache resume', async ({ page }) => {
  await page.goto(caseUrl);
  const stages = page.locator('[data-workflow-stage]');
  await stages.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(stages.nth(1)).toBeFocused();
  await expect(stages.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('End');
  await expect(stages.last()).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Home');
  await expect(stages.first()).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await stages.nth(3).click();
  await expect(stages.nth(3)).toHaveAttribute('aria-pressed', 'true');
});

test('all ordered stage descriptions remain readable without JavaScript', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(process.env.PORTFOLIO_WORKFLOW_URL ?? 'http://127.0.0.1:4322/work/aegisops/');
  await expect(page.locator('.system-flow li')).toHaveCount(5);
  for (const step of await page.locator('.system-flow li').all()) {
    await expect(step).toBeVisible();
    await expect(step.locator('h3')).not.toBeEmpty();
    await expect(step.locator('p')).not.toBeEmpty();
  }
  await expect(page.locator('[data-workflow-ring]')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await context.close();
});
