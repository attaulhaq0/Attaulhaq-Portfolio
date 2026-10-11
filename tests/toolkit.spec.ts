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

test('toolkit motion plays on request and pauses on close, offscreen and page lifecycle changes', async ({ page }) => {
  await page.goto('/#stack');
  const disclosure = page.locator('.tech-stack-motion');
  const summary = disclosure.locator('summary');
  const video = disclosure.locator('video');
  await summary.scrollIntoViewIfNeeded();
  await summary.focus();
  await summary.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).toHaveAttribute('preload', 'none');
  await expect(video).not.toHaveAttribute('autoplay');
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true);
  const play = async () => {
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(element => (element as HTMLVideoElement).play());
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(false);
  };
  await play();
  expect(await video.evaluate(element => (element as HTMLVideoElement).duration)).toBeCloseTo(4, 1);
  await summary.click();
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true);
  await summary.click();
  await play();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true);
  await play();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')));
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await play();
  await summary.click();
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true);
});

test('toolkit text, artwork and native disclosure remain usable without site JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/#stack');
  await expect(page.locator('.tech-stack-tools li')).toHaveCount(14);
  await expect(page.locator('.tech-stack-art > img')).toBeVisible();
  const summary = page.locator('.tech-stack-motion summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(page.getByLabel('Illustrated toolkit animation')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});
