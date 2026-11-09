import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const websites = [
  ['Narrcorp', 'narrcorp.com', 'narrcorp-website'],
  ['AR TECH INC', 'artechsusa.com', 'artechsusa-website'],
  ['Arissoft', 'arissoft.tech', 'arissoft-website'],
  ['Sira Studios', 'sirastudios.com', 'sira-studios-website'],
  ['theEb1', 'theeb1.com', 'theeb1-website'],
];

test('homepage introduces freelance work without loading its gallery', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const teaser = page.locator('#freelance-web-development');
  await expect(teaser.getByRole('heading', { level: 2 })).toHaveAccessibleName('Freelance website work.');
  await expect(teaser.locator('article, video, img')).toHaveCount(0);
  await expect(page.locator('#work .project-card')).toHaveCount(4);
  await expect(page.locator('#work .fyp-feature')).toHaveCount(1);
  await teaser.getByRole('link', { name: 'Explore the five projects' }).click();
  await expect(page).toHaveURL(/\/freelance-work\/$/);
  await expect(page.locator('.client-website')).toHaveCount(5);
});

test('collection links, selected views and real previews are complete', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const requestedVideos: string[] = [];
  page.on('request', request => { if (request.url().endsWith('.mp4')) requestedVideos.push(request.url()); });
  await page.goto('/freelance-work/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Freelance website work.');
  await expect(page.locator('.client-website-motion')).toHaveCount(5);
  expect(requestedVideos).toEqual([]);
  for (const [name, domain, repo] of websites) {
    const card = page.getByRole('article', { name, exact: true });
    await expect(card.getByRole('link', { name: `View ${name} website`, exact: true })).toHaveAttribute('href', `https://${domain}/`);
    await expect(card.getByRole('link', { name: `View ${name} code`, exact: true })).toHaveAttribute('href', `https://github.com/attaulhaq0/${repo}`);
    await card.locator('summary').click();
    await expect(card.locator('.client-selected-views figure')).toHaveCount(2);
    for (const image of await card.locator('.client-selected-views img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 1000)).toBe(true);
    }
    await expect(card.locator('.client-website-evidence')).toContainText('Build scope');
  }
  await expect(page.locator('#freelance-web-development iframe, #freelance-web-development form, #freelance-web-development canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('collection is readable in both themes from 320px to desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/freelance-work/');
  const section = page.locator('#freelance-web-development');
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const header = await page.locator('.header').boundingBox();
      const back = await page.getByRole('link', { name: 'Back to portfolio', exact: true }).boundingBox();
      expect(header).not.toBeNull(); expect(back).not.toBeNull();
      expect(back!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
      await expect(section).toHaveCSS('color', theme === 'dark' ? 'rgb(247, 242, 252)' : 'rgb(43, 32, 53)');
    }
    for (const summary of await section.locator('summary').all()) {
      if (!(await summary.evaluate(element => element.parentElement?.hasAttribute('open')))) await summary.click();
    }
    const results = await new AxeBuilder({ page }).include('#main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('selected views, source links and complete captures work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/freelance-work/');
  await expect(page.locator('.client-website')).toHaveCount(5);
  const details = page.locator('.client-website-details').first();
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(details.locator('.client-selected-views a').first()).toBeFocused();
  for (const [name, file] of [['Arissoft', 'arissoft-homepage-full.webp'], ['theEb1', 'theeb1-homepage-full.webp']]) {
    const card = page.getByRole('article', { name, exact: true });
    await card.locator('summary').focus();
    await page.keyboard.press('Enter');
    const link = card.getByRole('link', { name: `View full ${name} homepage`, exact: true });
    await expect(link).toHaveAttribute('href', `/images/client-work/${file}`);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});

test('all website previews play on request and pause offscreen', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/freelance-work/');
  for (const video of await page.locator('.client-website-motion').all()) {
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('controls', '');
    expect(await video.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, autoplay: v.autoplay, loop: v.loop, muted: v.muted }))).toEqual({ paused: true, autoplay: false, loop: true, muted: true });
    await video.evaluate((v: HTMLVideoElement) => v.play());
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.videoWidth)).toBe(1200);
    expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeGreaterThan(7);
    expect(await video.evaluate((v: HTMLVideoElement) => v.videoHeight)).toBe(Number(await video.getAttribute('height')));
    if ((await video.getAttribute('aria-label'))?.startsWith('Narrcorp')) {
      await page.locator('#contact').scrollIntoViewIfNeeded();
    } else {
      await page.getByRole('link', { name: 'Back to portfolio', exact: true }).scrollIntoViewIfNeeded();
    }
    await expect.poll(() => video.evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.bottom <= 0 || box.top >= innerHeight;
    })).toBe(true);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  }
});

test('freelance route has canonical, social, sitemap and collection metadata', async ({ page, request }) => {
  await page.goto('/freelance-work/');
  await expect(page).toHaveTitle(/Freelance Website Work/);
  const siteUrl = process.env.PUBLIC_SITE_URL;
  if (!siteUrl) {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    return;
  }
  const canonical = new URL('/freelance-work/', siteUrl).href;
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema['@type']).toBe('CollectionPage');
  expect(schema.hasPart).toHaveLength(5);
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('/freelance-work/</loc>');
});

test('native preview loops and only one visible player runs at a time', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 3000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/freelance-work/');
  const first = page.locator('#narrcorp video');
  const second = page.locator('#artechsusa video');
  for (const video of [first, second]) {
    const box = await video.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThan(3000);
  }
  await first.evaluate((video: HTMLVideoElement) => video.play());
  await expect.poll(() => first.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1);
  await first.evaluate((video: HTMLVideoElement) => { video.currentTime = video.duration - 0.3; });
  await expect.poll(() => first.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeLessThan(2);
  expect(await first.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await second.evaluate((video: HTMLVideoElement) => video.play());
  await expect.poll(() => second.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1);
  await expect.poll(() => first.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

// Clients should reach the collection from the header, including tablet menus.
test('website work is reachable from every header layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1024, 1101, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const navigation = width <= 1100 ? page.getByRole('navigation', { name: 'Mobile navigation' }) : page.getByRole('navigation', { name: 'Main navigation' });
    if (width <= 1100) await page.locator('.mobile-nav summary').click();
    const link = navigation.getByRole('link', { name: 'Website work', exact: true });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/freelance-work\/$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width <= 1100) {
      await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
      await page.locator('.mobile-nav summary').click();
    }
    await expect(navigation.getByRole('link', { name: 'Website work', exact: true })).toHaveAttribute('aria-current', 'page');
  }
});

test('technology labels distinguish static pages, frontend builds and PHP backends', async ({ page }) => {
  await page.goto('/freelance-work/');
  const artech = page.getByRole('article', { name: 'AR TECH INC', exact: true });
  await expect(artech.locator('.client-website-stack')).toHaveText(['HTMLCSSJavaScriptPHPPHPMailer']);
  await expect(artech.locator('.client-website-runtime')).toContainText('no build step');
  await expect(page.locator('#narrcorp .client-website-stack')).toContainText('GSAP');
  for (const id of ['arissoft', 'sira-studios', 'theeb1']) {
    await expect(page.locator(`#${id} .client-website-stack`)).toContainText('MySQL');
    await expect(page.locator(`#${id} .client-website-runtime`)).toContainText('Vite builds the React frontend');
  }
});
