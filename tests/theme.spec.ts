import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('visitors can switch the entire site and retain their choice across routes and reloads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const toggle = page.getByRole('button', { name: 'Switch to light mode', exact: true });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Switch to dark mode', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('light');
  await page.goto('/work/edeviser/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the theme control is keyboard accessible and narrow layouts retain navigation', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Switch to light mode', exact: true });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.getByRole('button', { name: 'Switch to dark mode', exact: true })).toBeVisible();
    await expect(page.locator('.mobile-nav summary')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('blocked preference storage does not prevent switching or readable no-JS content', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new Error('Storage blocked'); } });
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto('http://127.0.0.1:4322/');
  await expect(staticPage.getByRole('heading', { name: 'Atta-ul-Haq', exact: true })).toBeVisible();
  await expect(staticPage.locator('.theme-toggle')).toBeHidden();
  await noJs.close();
});

test('light mode keeps each case and the homepage readable with original media', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'light'));
  for (const route of ['/', '/work/edeviser/', '/work/aegisops/', '/work/family-os/', '/work/cosmo-conqueror/', '/work/survival-game/']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) })), route).toEqual([]);
  }
});
