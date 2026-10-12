import { test, expect } from '@playwright/test';

test('the illustrated toolkit keeps real tools and compact artwork at narrow widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#stack');
  await expect(page.locator('.tech-stack-tools li')).toHaveCount(14);
  const artwork = page.locator('.tech-stack-art > img');
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork).toHaveAttribute('alt', '');
  await expect.poll(() => artwork.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1000);
  expect(await page.locator('.tech-stack-art').evaluate(element => element.getBoundingClientRect().height)).toBeLessThanOrEqual(280);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await artwork.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(await artwork.evaluate(element => element.getBoundingClientRect().height)).toBeLessThanOrEqual(205);
    expect(await artwork.evaluate(element => getComputedStyle(element).objectFit)).toBe('contain');
    await expect(page.locator('#stack-title')).toBeVisible();
  }
});

test('the static toolkit retains readable tool context and original sculpture symbols', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#stack');
  await expect(page.locator('#stack video, #stack details')).toHaveCount(0);
  await expect(page.locator('.tech-stack-group h3')).toHaveText(['AI & agentic systems', 'Software & delivery', 'Game development foundation']);
  await expect(page.locator('#stack')).toContainText('Retrieval in the AegisOps design');
  await expect(page.locator('#stack')).toContainText('Event orchestration in the Family OS design');
  const icons = page.locator('.tech-stack-group-icon');
  await expect(icons).toHaveCount(3);
  for (const icon of await icons.all()) {
    await icon.scrollIntoViewIfNeeded();
    await expect.poll(() => icon.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth === 192)).toBe(true);
  }
});

test('toolkit text and artwork remain readable without site JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/#stack');
  await expect(page.locator('.tech-stack-tools li')).toHaveCount(14);
  await expect(page.locator('.tech-stack-art > img')).toBeVisible();
  await expect(page.locator('.tech-stack-group h3')).toHaveCount(3);
  await expect(page.locator('#stack video, #stack details')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});
