import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const websites = [
  ['Artechs USA', 'https://artechsusa.com/', 'artechsusa-website'],
  ['Arissoft', 'https://arissoft.tech/', 'arissoft-website'],
  ['Sira Studios', 'https://sirastudios.com/', 'sira-studios-website'],
  ['The EB1', 'https://theeb1.com/', 'theeb1-website'],
];

test('freelance websites stay separate from the five main projects with real local previews', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#freelance-web-development');
  await expect(section.getByRole('heading', { level: 2 })).toHaveAccessibleName('Freelance web development.');
  await expect(section.locator('.client-website')).toHaveCount(4);
  await expect(page.locator('#work .project-card')).toHaveCount(4);
  await expect(page.locator('#work .fyp-feature')).toHaveCount(1);
  expect(await section.evaluate(element => [element.previousElementSibling?.id, element.nextElementSibling?.id])).toEqual(['work', 'approach']);
  for (const [name, liveUrl, repo] of websites) {
    const card = section.getByRole('article', { name });
    await expect(card.getByRole('link', { name: `View ${name} website`, exact: true })).toHaveAttribute('href', liveUrl);
    await expect(card.getByRole('link', { name: `View ${name} code`, exact: true })).toHaveAttribute('href', `https://github.com/attaulhaq0/${repo}`);
    const image = card.locator('.client-website-preview img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 1600 && element.naturalHeight === 1120)).toBe(true);
  }
  await expect(section.locator('iframe, form, script, canvas')).toHaveCount(0);
});

test('freelance cards and expanded evidence remain readable in both themes down to 320px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#freelance-web-development');
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await section.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(section).toHaveCSS('color', theme === 'dark' ? 'rgb(247, 242, 252)' : 'rgb(43, 32, 53)');
    }
    for (const summary of await section.locator('summary').all()) {
      if (!(await summary.evaluate(element => element.parentElement?.hasAttribute('open')))) await summary.click();
    }
    const results = await new AxeBuilder({ page }).include('#freelance-web-development').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('freelance source evidence opens by keyboard without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  const section = page.locator('#freelance-web-development');
  await expect(section.locator('.client-website')).toHaveCount(4);
  const details = section.locator('details').first();
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(details.getByRole('link', { name: 'Backend setup in source' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await context.close();
});

test('full Arissoft and EB1 homepages are inspectable through native evidence', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  for (const [name, filename] of [['Arissoft', 'arissoft-homepage-full.webp'], ['The EB1', 'theeb1-homepage-full.webp']]) {
    const card = page.locator('#freelance-web-development').getByRole('article', { name });
    const details = card.locator('details');
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    const link = details.getByRole('link', { name: `View full ${name} homepage`, exact: true });
    await expect(link).toHaveAttribute('href', `/images/client-work/${filename}`);
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const image = details.locator('.client-homepage-preview img');
    // Playwright's stability wait uses animation frames, which are suspended with JavaScript disabled.
    await image.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth >= 1000 && element.naturalHeight > element.naturalWidth * 2)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).not.toHaveAttribute('open', '');
  }
  await context.close();
});