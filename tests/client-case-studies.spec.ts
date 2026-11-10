import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cases = [
  { name: 'Narrcorp', id: 'narrcorp', slug: 'narrcorp', stack: 'Astro', domain: 'narrcorp.com', repo: 'narrcorp-website' },
  { name: 'AR TECH INC', id: 'artechsusa', slug: 'ar-tech-inc', stack: 'PHPMailer', domain: 'artechsusa.com', repo: 'artechsusa-website' },
];

for (const study of cases) {
  test(`${study.name} case is discoverable, complete and connected`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/freelance-work/');
    await page.locator(`#${study.id}`).getByRole('link', { name: `Read ${study.name} case study`, exact: true }).click();
    await expect(page).toHaveURL(`/freelance-work/${study.slug}/`);
    await expect(page).toHaveTitle(`${study.name} Website Case Study — Sheikh Atta-ul-Haq`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${study.name}.`);
    await expect(page.locator('#brief')).toContainText('end-to-end contribution');
    await expect(page.locator('.client-case-stack')).toContainText(study.stack);
    await expect(page.getByRole('link', { name: 'Visit website', exact: true })).toHaveAttribute('href', `https://${study.domain}/`);
    await expect(page.getByRole('link', { name: 'View source', exact: true })).toHaveAttribute('href', `https://github.com/attaulhaq0/${study.repo}`);
    for (const link of await page.getByRole('navigation', { name: 'Case study sections' }).getByRole('link').all()) {
      await link.click();
      const destination = page.locator((await link.getAttribute('href'))!);
      await expect(destination.getByRole('heading', { level: 2 })).toBeInViewport();
    }
    for (const image of await page.locator('.client-case-cover img, .client-case-detail img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 1000)).toBe(true);
    }
    if (process.env.PUBLIC_SITE_URL) {
      const canonical = new URL(`/freelance-work/${study.slug}/`, process.env.PUBLIC_SITE_URL).href;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new URL(`/images/client-work/${study.id === 'narrcorp' ? 'narrcorp-hero' : 'artechsusa'}-poster.webp`, process.env.PUBLIC_SITE_URL).href);
      expect(await (await request.get('/sitemap.xml')).text()).toContain(`${canonical}</loc>`);
    }
    await page.getByRole('link', { name: 'Back to freelance work', exact: true }).click();
    await expect(page).toHaveURL(`/freelance-work/#${study.id}`);
    expect(errors).toEqual([]);
  });

  test(`${study.name} case works across themes, widths and keyboard access`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/freelance-work/${study.slug}/`);
    for (const theme of ['dark', 'light']) {
      if (theme === 'light') await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
      for (const width of [1440, 1024, 768, 760, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        const header = (await page.locator('.header').boundingBox())!;
        const back = (await page.getByRole('link', { name: 'Back to freelance work', exact: true }).boundingBox())!;
        expect(back.y).toBeGreaterThanOrEqual(header.y + header.height);
      }
      const results = await new AxeBuilder({ page }).include('#main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
    }
    const first = page.getByRole('navigation', { name: 'Case study sections' }).getByRole('link').first();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#brief$/);
    await expect(page.locator('#brief h2')).toBeInViewport();
  });

  test(`${study.name} case remains readable without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${baseURL}/freelance-work/${study.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${study.name}.`);
    await expect(page.locator('#delivery')).toContainText('client');
    await page.getByRole('link', { name: 'Explore the case', exact: true }).click();
    await expect(page.locator('#decisions h2')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await expect(page.locator('video')).toHaveAttribute('controls', '');
    await context.close();
  });

  test(`${study.name} preview starts on request and pauses offscreen`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const videos: string[] = [];
    page.on('request', request => { if (request.url().endsWith('.mp4')) videos.push(request.url()); });
    await page.goto(`/freelance-work/${study.slug}/`);
    const preview = page.locator('.client-case-motion video');
    expect(videos).toEqual([]);
    await expect(preview).toHaveAttribute('preload', 'none');
    expect(await preview.evaluate((v: HTMLVideoElement) => ({ autoplay: v.autoplay, paused: v.paused }))).toEqual({ autoplay: false, paused: true });
    await preview.scrollIntoViewIfNeeded();
    await preview.evaluate((v: HTMLVideoElement) => v.play());
    await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1);
    await page.locator('#delivery').scrollIntoViewIfNeeded();
    await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });
}
