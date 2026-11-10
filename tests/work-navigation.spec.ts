import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('one Work disclosure groups both destinations across header layouts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1024, 1101, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const mobile = width <= 1100;
    if (mobile) await page.locator('.mobile-nav > summary').click();
    const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation', exact: true });
    await expect(nav.getByRole('link', { name: 'Website work', exact: true })).toHaveCount(0);
    const work = nav.locator('[data-work-navigation]');
    await expect(work.locator('summary')).toHaveText('Work');
    await expect(work.getByRole('link', { name: 'Freelance websites', exact: true })).not.toBeVisible();
    await work.locator('summary').click();
    await expect(work.getByRole('link', { name: 'Engineering projects', exact: true })).toHaveAttribute('href', '/#work');
    await expect(work.getByRole('link', { name: 'Freelance websites', exact: true })).toBeVisible();
    const bounds = await work.locator('.work-options').boundingBox();
    expect(bounds?.x).toBeGreaterThanOrEqual(0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
    await work.getByRole('link', { name: 'Freelance websites', exact: true }).click();
    await expect(page).toHaveURL(/\/freelance-work\/$/);
    if (mobile) await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
  }
});

test('Work supports keyboard activation, Escape and outside dismissal', async ({ page }) => {
  await page.goto('/');
  const mobile = (page.viewportSize()?.width ?? 1440) <= 1100;
  if (mobile) await page.locator('.mobile-nav > summary').click();
  const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation', exact: true });
  const work = nav.locator('[data-work-navigation]');
  const trigger = work.locator('summary');
  await trigger.press('Enter');
  await expect(work).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(work.getByRole('link', { name: 'Engineering projects', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(work).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
  if (mobile) await expect(page.locator('.mobile-nav')).toHaveAttribute('open', '');
  await trigger.click();
  await page.getByRole('heading', { level: 1 }).click();
  await expect(page.locator(mobile ? '.mobile-nav [data-work-navigation]' : '.desktop-nav [data-work-navigation]')).not.toHaveAttribute('open', '');
});

test('expanded Work is accessible in both themes on a client case', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/freelance-work/narrcorp/');
  const mobile = (page.viewportSize()?.width ?? 1440) <= 1100;
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { localStorage.setItem('portfolio-theme', value); }, theme);
    await page.reload();
    if (mobile) await page.locator('.mobile-nav > summary').click();
    const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation', exact: true });
    await nav.locator('[data-work-navigation] > summary').click();
    await expect(nav.getByRole('link', { name: 'Freelance websites', exact: true })).toHaveAttribute('aria-current', 'location');
    const results = await new AxeBuilder({ page }).include('.header').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('Work navigation remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/freelance-work/');
  const work = page.getByRole('navigation', { name: 'Main navigation', exact: true }).locator('[data-work-navigation]');
  await work.locator('summary').click();
  await work.getByRole('link', { name: 'Engineering projects', exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await context.close();
});

test('desktop Work opens after an expanded mobile menu is resized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await page.locator('.mobile-nav > summary').click();
  await page.setViewportSize({ width: 1440, height: 900 });
  const work = page.locator('.desktop-nav [data-work-navigation]');
  await work.locator('summary').click();
  await expect(work.getByRole('link', { name: 'Freelance websites', exact: true })).toBeVisible();
});
