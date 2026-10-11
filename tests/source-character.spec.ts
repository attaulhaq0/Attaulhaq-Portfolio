import { test, expect, type Page } from '@playwright/test';

const homepage = process.env.PORTFOLIO_SOURCE_CHARACTER_URL ?? '/';
const modelPath = '/models/source-character.glb';

async function ready(page: Page) {
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready', { timeout: 25000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '0');
}

async function preserveCanvas(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: Record<string, unknown>) {
      return Reflect.apply(original, this, [type, /webgl/.test(type) ? { ...options, preserveDrawingBuffer: true } : options]);
    } as typeof original;
  });
}

async function canvasImage(page: Page) {
  return page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
}

test('the source character starts automatically, keeps a poster during loading and reopens after bfcache', async ({ page }) => {
  test.setTimeout(60000);
  const modelRequests: string[] = [];
  const errors: string[] = [];
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  page.on('request', request => { if (new URL(request.url()).pathname === modelPath) modelRequests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.route(`**${modelPath}`, async route => { await pending; await route.continue(); });
  await page.goto(homepage);
  await expect.poll(() => modelRequests.length).toBe(1);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'loading');
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
  release();
  await ready(page);
  await expect(page.locator('canvas')).toHaveAttribute('data-pose', 'standing');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await ready(page);
  expect(modelRequests).toHaveLength(2);
  expect(errors).toEqual([]);
});

for (const failure of ['unavailable', 'malformed'] as const) {
  test(`${failure === 'unavailable' ? 'an' : 'a'} ${failure} source model restores the poster and reload recovers automatically`, async ({ page }) => {
    test.setTimeout(60000);
    let attempts = 0;
    await page.route(`**${modelPath}`, route => {
      attempts += 1;
      if (attempts > 1) return route.continue();
      return route.fulfill(failure === 'unavailable'
        ? { status: 503, contentType: 'text/plain', body: 'Unavailable' }
        : { status: 200, contentType: 'model/gltf-binary', body: 'This is not a GLB.' });
    });
    await page.goto(homepage);
    await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'fallback', { timeout: 25000 });
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.locator('#hero-canvas')).toBeHidden();
    await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
    await expect(page.locator('.scene-status')).toContainText('illustration remains available');
    await page.reload();
    await ready(page);
    expect(attempts).toBe(2);
  });
}

test('native scrolling changes the rendered source pose without trapping the page', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await preserveCanvas(page);
  await page.goto(homepage);
  await ready(page);
  const before = await canvasImage(page);
  await page.evaluate(distance => window.scrollTo({ top: distance, behavior: 'instant' }), isMobile ? 120 : 150);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(isMobile ? 120 : 150);
  await expect.poll(() => canvasImage(page)).not.toBe(before);
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
});

test('reduced motion holds the source pose stable during scroll and pointer movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await preserveCanvas(page);
  await page.goto(homepage);
  await ready(page);
  const before = await canvasImage(page);
  const canvas = page.locator('canvas');
  await canvas.dispatchEvent('pointermove', { clientX: 5, clientY: 5, pointerType: 'mouse' });
  await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(120);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await canvasImage(page)).toBe(before);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
});

test('desktop avatar carries into the introduction then leaves before selected work', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Mobile keeps the animated avatar in its inline hero.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await preserveCanvas(page);
  await page.goto(homepage);
  await ready(page);
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('.spatial-hero')!.getBoundingClientRect().height, behavior: 'instant' }));
  await expect(page.locator('#hero-canvas')).toHaveAttribute('data-journey-stage', 'intro');
  await expect(page.locator('canvas')).toHaveAttribute('data-pose', 'seated');
  expect(await page.locator('#hero-canvas').evaluate(element => getComputedStyle(element).position)).toBe('fixed');
  await expect(page.locator('canvas')).toBeVisible();
  const bounds = await page.locator('canvas').boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(1000);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('#hero-canvas')).toHaveAttribute('data-journey-stage', 'complete');
  await expect(page.locator('#hero-canvas')).toHaveCSS('opacity', '0');
});

test('a valid model finishing offscreen waits for return instead of timing out', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The desktop journey intentionally stays on screen longer.');
  test.setTimeout(45000);
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route(`**${modelPath}`, async route => { await pending; await route.continue(); });
  await page.goto(homepage);
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
  release();
  await page.waitForTimeout(15500);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'loading');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await ready(page);
});

test('a lost WebGL context restores the poster after successful startup', async ({ page }) => {
  await page.goto(homepage);
  await ready(page);
  await page.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'fallback');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
});
