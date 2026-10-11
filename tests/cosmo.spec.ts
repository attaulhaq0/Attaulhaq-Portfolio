import { test, expect } from '@playwright/test';

const caseUrl = process.env.PORTFOLIO_COSMO_URL ?? '/work/cosmo-conqueror/';

test('primary gameplay pauses offscreen and on pagehide, then can resume after pageshow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(caseUrl);
  const video = page.locator('.case-media > video');
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.2);
  await page.locator('#considerations').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async (element: HTMLVideoElement) => { await element.play(); });
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await video.evaluate(async (element: HTMLVideoElement) => { await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeFalsy();
});

test('Cosmo provides real primary playback and separate focused demonstrations', async ({ page }) => {
  await page.goto(caseUrl);
  const primary = page.locator('.case-media video');
  await expect(primary).toHaveCount(1);
  await primary.scrollIntoViewIfNeeded();
  await primary.evaluate(async (video: HTMLVideoElement) => { video.muted = true; await video.play(); });
  await expect.poll(() => primary.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(.3);
  await primary.evaluate((video: HTMLVideoElement) => video.pause());
  await expect(page.locator('.project-demo')).toHaveCount(4);
  await expect(page.locator('.project-demo-video')).toHaveCount(4);
  for (const video of await page.locator('.project-demo-video').all()) {
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay', '');
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  }
});

test('a focused clip plays only on request and pauses when its disclosure closes', async ({ page }) => {
  await page.goto(caseUrl);
  await expect(page.locator('.project-demo')).toHaveCount(4);
  for (const demo of await page.locator('.project-demo').all()) {
    await demo.locator('summary').click();
    const video = demo.locator('.project-demo-video');
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
    await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.3);
    await demo.locator('summary').click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  }
});

test('focused demonstrations keep controls and captions without JavaScript', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(process.env.PORTFOLIO_COSMO_URL ?? 'http://127.0.0.1:4322/work/cosmo-conqueror/');
  const demo = page.locator('.project-demo').last();
  await demo.locator('summary').click();
  await expect(demo).toHaveAttribute('open', '');
  const video = demo.locator('video');
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBeTruthy();
  await expect(demo.locator('figcaption')).not.toBeEmpty();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await context.close();
});

test('focused playback pauses offscreen and survives bfcache cleanup', async ({ page }) => {
  await page.goto(caseUrl);
  const demo = page.locator('.project-demo').last();
  await demo.locator('summary').click();
  const video = demo.locator('video');
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.3);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(async (element: HTMLVideoElement) => { await element.play(); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeFalsy();
  await demo.locator('summary').click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
});
