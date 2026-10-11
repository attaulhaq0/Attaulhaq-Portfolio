import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['edeviser', 'aegisops', 'family-os', 'cosmo-conqueror', 'survival-game'];

test('homepage is complete and starts its 3D character automatically', async ({ page }) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Atta-ul-');
  await expect(page.locator('.hero-positioning')).toContainText('intelligent products');
  await expect(page.locator('.project-card')).toHaveCount(4);
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready', { timeout: 25000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(requests.filter(url => /mountScene/.test(url))).toHaveLength(1);
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await expect(page.getByRole('link', { name: 'Explore my work' })).toHaveAttribute('href', '#work');
  expect(errors).toEqual([]);
});

test('homepage meets automated WCAG A/AA checks', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

for (const slug of routes) {
  test(`${slug} case study has real content, complete images and accessible sections`, async ({ page }) => {
    // Contrast is checked in a settled state; normal-motion behavior has its own tests.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`/work/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#system h2')).not.toBeEmpty();
    await expect(page.locator('.system-flow li')).toHaveCount(5);
    if (slug === 'cosmo-conqueror' || slug === 'survival-game') {
      await page.locator('.development-evidence summary').click();
      await expect(page.locator('.development-evidence img')).toHaveCount(1);
      await expect(page.locator('.development-evidence ol li')).toHaveCount(3);
    }
    const mediaVideo = page.locator('.case-media video');
    if (await mediaVideo.count()) {
      await expect(mediaVideo).toHaveAttribute('controls', '');
      await expect(mediaVideo.locator('source')).toHaveAttribute('src', /.+/);
      const poster = await mediaVideo.getAttribute('poster');
      expect(poster).toBeTruthy();
      expect((await page.request.get(poster!)).status()).toBe(200);
    } else {
      expect(await page.locator('.case-media img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    // Audit every section after its entrance settles, rather than transient fade colors.
    for (const section of await page.locator('.case-content > section').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toHaveAttribute('data-motion-state', 'entered');
      await expect(section).toHaveCSS('opacity', '1');
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('navigation supports mobile disclosure and keyboard dismissal', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    const toggle = page.locator('.mobile-nav summary');
    await toggle.click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
    await toggle.click();
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Selected work' }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
  } else {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  }
});

test('reduced-motion experience keeps readable content and a static 3D pose', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await expect(page.locator('.hero-poster')).toBeVisible();
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready', { timeout: 25000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
});

test('all essential content works without JavaScript', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await expect(page.locator('h1')).toContainText('Atta-ul-');
  await expect(page.locator('.hero-positioning')).toContainText('intelligent products');
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.locator('.project-title-row a').first().click();
  await expect(page.locator('h1')).toContainText('Cosmo Conqueror');
  await context.close();
});

test('automatic WebGL is cleaned up on pagehide and restores its static fallback', async ({ page }) => {
  test.setTimeout(45000);
  await page.goto('/');
  await expect(page.locator('.hero-art')).toHaveAttribute('data-scene-state', 'ready', { timeout: 25000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('#hero-canvas')).toBeHidden();
  await expect(page.locator('.hero-poster')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-scene-toggle]')).toHaveCount(0);
});

test('unknown routes return the designed 404 page', async ({ page }) => {
  const response = await page.goto('/a-page-that-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This path ends here.' })).toBeVisible();
});
