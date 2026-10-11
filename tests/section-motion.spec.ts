import { test, expect } from '@playwright/test';

test('section entrances enhance offscreen content and leave the hero untouched', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const approach = page.locator('.capabilities-heading');
  await expect(approach).toHaveAttribute('data-motion-state', 'pending');
  await expect(approach).toHaveCSS('opacity', '0');
  await expect(page.locator('.spatial-hero [data-motion-state]')).toHaveCount(0);
  await expect(page.locator('#hero-title')).toBeVisible();
  await approach.scrollIntoViewIfNeeded();
  await expect(approach).toHaveAttribute('data-motion-state', 'entered');
  await expect(approach).toHaveCSS('opacity', '1');
  await expect(approach).toHaveCSS('transform', 'none');
});

test('keyboard focus immediately reveals its pending content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const certificate = page.locator('.career-certificate');
  await expect(certificate).toHaveAttribute('data-motion-state', 'pending');
  await certificate.locator('summary').focus();
  await expect(certificate.locator('summary')).toBeFocused();
  await expect(certificate).toHaveAttribute('data-motion-state', 'entered');
  await expect(certificate).toHaveAttribute('data-motion-immediate', '');
  await expect(certificate).toHaveCSS('opacity', '1');
  await expect(certificate).toHaveCSS('transition-duration', '0s');
});

test('the first pointer click opens pending certificate content after navigation', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  if (isMobile) await page.locator('.mobile-nav summary').click();
  const cv = isMobile ? page.locator('.mobile-nav a[download]') : page.locator('.desktop-nav a[download]');
  const download = page.waitForEvent('download');
  await cv.click();
  await download;
  const certificate = page.locator('.career-certificate');
  await expect(certificate).toHaveAttribute('data-motion-state', 'pending');
  await certificate.locator('summary').click();
  await expect(certificate).toHaveAttribute('open', '');
});

test('revealing a pending interactive block on pointer focus keeps its target in place', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(options?.rootMargin === '0px 0px 64px 0px' ? () => {} : callback, options);
      }
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const certificate = page.locator('.career-certificate');
  await expect(certificate).toHaveAttribute('data-motion-state', 'pending');
  await certificate.locator('summary').evaluate(summary => window.scrollTo({ top: scrollY + summary.getBoundingClientRect().top - innerHeight / 2, behavior: 'instant' }));
  const before = await certificate.locator('summary').boundingBox();
  expect(before).toBeTruthy();
  await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
  await page.mouse.down();
  const after = await certificate.locator('summary').boundingBox();
  await page.mouse.up();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
  await expect(certificate).toHaveAttribute('open', '');
});

test('reduced motion shows every section and reacts when the preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-motion-state="pending"]').first()).toBeAttached();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-motion-state="pending"]')).toHaveCount(0);
  const heading = page.locator('.capabilities-heading');
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toHaveCSS('transform', 'none');
  await expect(heading).toHaveCSS('transition-duration', '0s');
});

test('pagehide releases pending entrances and bfcache restoration keeps content usable', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    (window as any).__motionObservers = [];
    window.IntersectionObserver = class extends NativeObserver {
      record?: { disconnected: boolean };
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        if (options?.rootMargin === '0px 0px 64px 0px') {
          this.record = { disconnected: false };
          (window as any).__motionObservers.push(this.record);
        }
      }
      disconnect() { if (this.record) this.record.disconnected = true; super.disconnect(); }
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-motion-state="pending"]').first()).toBeAttached();
  expect(await page.evaluate(() => (window as any).__motionObservers)).toEqual([{ disconnected: false }]);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  expect(await page.evaluate(() => (window as any).__motionObservers)).toEqual([{ disconnected: true }]);
  await expect(page.locator('[data-motion-state="pending"]')).toHaveCount(0);
  await expect(page.locator('.capabilities-heading')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  expect(await page.evaluate(() => (window as any).__motionObservers)).toEqual([{ disconnected: true }, { disconnected: false }]);
  await page.locator('.career-certificate summary').focus();
  await expect(page.locator('.career-certificate summary')).toBeFocused();
  await expect(page.locator('.career-certificate')).toHaveCSS('opacity', '1');
});

test('all section content stays visible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('[data-motion-state]')).toHaveCount(0);
  await expect(page.locator('.capabilities-heading')).toHaveCSS('opacity', '1');
  await expect(page.locator('.career-certificate')).toHaveCSS('opacity', '1');
  await page.locator('.career-certificate summary').click();
  await expect(page.locator('.career-certificate')).toHaveAttribute('open', '');
  await context.close();
});

for (const slug of ['aegisops', 'family-os']) {
  test(`${slug} case content settles visibly after a direct scroll to its workflow`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/work/${slug}/`);
    const system = page.locator('#system');
    await expect(system).toHaveAttribute('data-motion-state', 'pending');
    await system.scrollIntoViewIfNeeded();
    await expect(system).toHaveAttribute('data-motion-state', 'entered');
    await expect(system).toHaveCSS('opacity', '1');
    await expect(system.locator('h2').first()).toBeVisible();
    expect(await system.evaluate(element => {
      let current: Element | null = element;
      while (current) { if (getComputedStyle(current).opacity !== '1') return false; current = current.parentElement; }
      return true;
    })).toBe(true);
  });
}

test('a native case navigation link reveals its destination immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/work/aegisops/');
  await expect(page.locator('#system')).toHaveAttribute('data-motion-state', 'pending');
  await page.getByRole('navigation', { name: 'Case study sections' }).getByRole('link', { name: 'Under the hood' }).click();
  await expect(page).toHaveURL(/#system$/);
  await expect(page.locator('#system')).toHaveAttribute('data-motion-immediate', '');
  await expect(page.locator('#system')).toHaveCSS('opacity', '1');
});

test('opening a case URL at a workflow hash leaves its destination readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/work/family-os/#system');
  await expect(page.locator('#system')).toHaveAttribute('data-motion-state', 'entered');
  await expect(page.locator('#system')).toHaveAttribute('data-motion-immediate', '');
  await expect(page.locator('#system')).toHaveCSS('opacity', '1');
});
