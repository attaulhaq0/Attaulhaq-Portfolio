import { test, expect } from '@playwright/test';

const caseUrl = process.env.PORTFOLIO_DIGITAL_DYNASTY_URL ?? '/work/survival-game/';

test('Digital Dynasty provides a playable owner-supplied gameplay excerpt', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(caseUrl);
  await expect(page.locator('h1')).toContainText('Digital Dynasty');
  const video = page.locator('.case-media video');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('preload', 'none');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).not.toHaveAttribute('autoplay', '');
  await expect(video.locator('source')).toHaveAttribute('src', '/media/digital-dynasty-gameplay.mp4');
  await expect(page.locator('.case-media figcaption')).toContainText(/gameplay|excerpt/i);
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.3);
  expect(await video.evaluate((element: HTMLVideoElement) => element.videoWidth / element.videoHeight)).toBeCloseTo(16 / 9, 1);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  expect(errors).toEqual([]);
});

test('Digital Dynasty gameplay captures retain descriptions and open full images', async ({ page }) => {
  await page.goto(caseUrl);
  const captures = page.locator('.case-gallery figure');
  await expect(captures).toHaveCount(3);
  for (const capture of await captures.all()) {
    await expect(capture.locator('figcaption')).not.toBeEmpty();
    await capture.locator('img').scrollIntoViewIfNeeded();
    expect(await capture.locator('img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
  }
  const link = captures.first().getByRole('link');
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
  await popup.waitForLoadState();
  expect(await popup.locator('img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
  await popup.close();
});

test('gameplay playback controls and descriptions work without site JavaScript', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(process.env.PORTFOLIO_DIGITAL_DYNASTY_URL ?? 'http://127.0.0.1:4322/work/survival-game/');
  const video = page.locator('.case-media video');
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBeTruthy();
  await expect(page.locator('.case-media figcaption')).not.toBeEmpty();
  await expect(page.locator('.case-gallery figure')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await context.close();
});
