import { test, expect, type Page } from '@playwright/test';

const homepage = process.env.PORTFOLIO_LIFECYCLE_URL ?? '/';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

async function mockScene(page: Page) {
  await page.route(/\/mountScene[^/]*\.js(?:\?.*)?$/, route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: `
      window.__sceneMock = { instances: [], aborts: 0, disposals: 0 };
      export function mountScene(container, signal) {
        const state = window.__sceneMock;
        const instance = { container, signal, aborted: false, disposed: false };
        state.instances.push(instance);
        return new Promise((resolve, reject) => {
          const dispose = () => {
            if (instance.disposed) return;
            instance.disposed = true;
            container.replaceChildren();
            state.disposals += 1;
            signal.removeEventListener('abort', abort);
          };
          const abort = () => {
            instance.aborted = true;
            state.aborts += 1;
            dispose();
            reject(new DOMException('Cancelled', 'AbortError'));
          };
          instance.finish = () => {
            if (instance.disposed || signal.aborted) return;
            container.append(document.createElement('canvas'));
            resolve(dispose);
          };
          if (signal.aborted) abort();
          else signal.addEventListener('abort', abort, { once: true });
        });
      }
    `,
  }));
}

async function starts(page: Page, count: number) {
  await expect.poll(() => page.evaluate(() => (window as any).__sceneMock?.instances.length ?? 0)).toBe(count);
}

async function finish(page: Page, index: number) {
  await page.evaluate(index => (window as any).__sceneMock.instances[index].finish(), index);
}

test('the scene starts automatically while the loading portrait and content remain readable', async ({ page }) => {
  await mockScene(page);
  await page.goto(homepage);
  await starts(page, 1);
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'loading');
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await expect(page.locator('#hero-title')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__sceneMock.instances[0].signal instanceof AbortSignal)).toBe(true);
  await finish(page, 0);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('pagehide immediately aborts pending initialization and preserves the static portrait', async ({ page }) => {
  await mockScene(page);
  await page.goto(homepage);
  await starts(page, 1);
  const cancelled = await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    return { aborted: (window as any).__sceneMock.instances[0].signal.aborted, aborts: (window as any).__sceneMock.aborts };
  });
  expect(cancelled).toEqual({ aborted: true, aborts: 1 });
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('#hero-canvas')).toBeHidden();
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'suspended');
  await finish(page, 0);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('pagehide disposes the ready scene once and bfcache pageshow starts a fresh scene automatically', async ({ page }) => {
  await mockScene(page);
  await page.goto(homepage);
  await starts(page, 1);
  await finish(page, 0);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
  });
  expect(await page.evaluate(() => (window as any).__sceneMock.disposals)).toBe(1);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('#hero-canvas')).toBeHidden();
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await starts(page, 2);
  await finish(page, 1);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('an aborted initialization cannot replace or remove the scene started after bfcache resume', async ({ page }) => {
  await mockScene(page);
  await page.goto(homepage);
  await starts(page, 1);
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await starts(page, 2);
  await finish(page, 1);
  await expect(page.locator('canvas')).toHaveCount(1);
  await finish(page, 0);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready');
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(await page.evaluate(() => (window as any).__sceneMock.instances.map((instance: any) => ({ aborted: instance.aborted, disposed: instance.disposed })))).toEqual([
    { aborted: true, disposed: true }, { aborted: false, disposed: false },
  ]);
});
