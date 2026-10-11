import { test, expect, type Locator, type Page } from '@playwright/test';

const homepage = process.env.PORTFOLIO_GALLERY_URL ?? '/';

async function swipePhoto(page: Page, photo: Locator, direction: 'left' | 'right' | 'vertical') {
  await photo.evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 220, behavior: 'instant' }));
  await photo.evaluate((image: HTMLImageElement) => image.decode());
  await photo.scrollIntoViewIfNeeded();
  await photo.evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 220, behavior: 'instant' }));
  const bounds = await photo.boundingBox();
  expect(bounds).toBeTruthy();
  const width = page.viewportSize()!.width;
  const left = Math.max(35, bounds!.x + 25);
  const right = Math.min(width - 35, bounds!.x + bounds!.width - 25);
  const x = direction === 'right' ? left : right;
  const end = direction === 'right' ? right : left;
  const y = Math.max(250, Math.min(600, bounds!.y + bounds!.height * .25));
  expect(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.tagName, { x, y })).toBe('IMG');
  const touch = await page.context().newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  for (let step = 1; step <= 14; step++) {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: direction === 'vertical' ? x : x + (end - x) * step / 14, y: direction === 'vertical' ? y - 170 * step / 14 : y, id: 1 }] });
    await page.waitForTimeout(20);
  }
  await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await touch.detach();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(homepage);
  await page.evaluate(() => document.fonts.ready);
});

test('story navigation scrolls to another moment and updates the current story', async ({ page }) => {
  const gallery = page.locator('[data-moments-gallery]');
  const slides = gallery.locator('[data-moment-slide]');
  const total = await slides.count();
  expect(total).toBeGreaterThan(1);
  const current = gallery.locator('[data-moments-current]');
  await expect(current).toHaveText('01');
  await gallery.getByRole('button', { name: 'Next story' }).click();
  await expect(current).toHaveText('02');
  await expect(gallery.locator('[data-moments-page]').nth(1)).toHaveAttribute('aria-current', 'true');
  await expect.poll(() => gallery.locator('[data-moments-track]').evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  await gallery.getByRole('button', { name: 'Previous story' }).click();
  await expect(current).toHaveText('01');
});

test('focused story track supports keyboard navigation without intercepting page scrolling', async ({ page }) => {
  const gallery = page.locator('[data-moments-gallery]');
  const track = gallery.locator('[data-moments-track]');
  const current = gallery.locator('[data-moments-current]');
  const total = await gallery.locator('[data-moment-slide]').count();
  await track.focus();
  await page.keyboard.press('ArrowRight');
  await expect(current).toHaveText('02');
  await page.keyboard.press('End');
  await expect(current).toHaveText(String(total).padStart(2, '0'));
  await page.keyboard.press('Home');
  await expect(current).toHaveText('01');
  await expect(track).toBeFocused();
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
});

test('native scrolling selects a story and the gallery survives bfcache resume', async ({ page }) => {
  const gallery = page.locator('[data-moments-gallery]');
  const track = gallery.locator('[data-moments-track]');
  await track.evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  const total = await gallery.locator('[data-moment-slide]').count();
  await expect(gallery.locator('[data-moments-current]')).toHaveText(String(total).padStart(2, '0'));
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await gallery.getByRole('button', { name: 'Previous story' }).click();
  await expect(gallery.locator('[data-moments-current]')).toHaveText(String(total - 1).padStart(2, '0'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('all story context remains readable without JavaScript', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const url = process.env.PORTFOLIO_GALLERY_URL ?? 'http://127.0.0.1:4322/';
  await page.goto(url);
  const slides = page.locator('[data-moment-slide]');
  expect(await slides.count()).toBeGreaterThan(1);
  for (const slide of await slides.all()) {
    await expect(slide.locator('h3')).not.toBeEmpty();
    await expect(slide.locator('.moment-story-description')).not.toBeEmpty();
    await expect(slide.locator('.moment-story-context')).not.toBeEmpty();
  }
  await expect(page.getByRole('button', { name: 'Next story' })).not.toBeVisible();
  const firstPhotos = slides.first().locator('[data-event-photos]');
  await expect(firstPhotos.locator('[data-photo-slide]')).toHaveCount(2);
  await expect(firstPhotos.getByRole('button', { name: 'Next photo', exact: true })).not.toBeVisible();
  await firstPhotos.locator('[data-photo-track]').evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  await firstPhotos.locator('[data-photo-slide]').last().locator('a').scrollIntoViewIfNeeded();
  await expect(firstPhotos.locator('[data-photo-slide]').last().locator('a')).toBeInViewport();
  await page.locator('[data-moments-track]').evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  const last = slides.last();
  await last.locator('h3').scrollIntoViewIfNeeded();
  await expect(last.locator('h3')).toBeInViewport();
  const details = last.locator('details');
  if (await details.count()) {
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('.moment-story-details')).toBeVisible();
  }
  await context.close();
});

test('desktop story arrows sit on opposite sides of the gallery', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop overlay position; mobile uses full-width inline navigation.');
  await page.locator('[data-moments-track]').scrollIntoViewIfNeeded();
  const stage = await page.locator('.moments-gallery-stage').boundingBox();
  const previous = await page.getByRole('button', { name: 'Previous story', exact: true }).boundingBox();
  const next = await page.getByRole('button', { name: 'Next story', exact: true }).boundingBox();
  expect(stage && previous && next).toBeTruthy();
  expect(previous!.x).toBeLessThan(stage!.x + 10);
  expect(next!.x + next!.width).toBeGreaterThan(stage!.x + stage!.width - 10);
  expect(Math.abs(previous!.y - next!.y)).toBeLessThan(2);
});

test('photo navigation changes the event photo without changing the outer story', async ({ page }) => {
  const story = page.locator('[data-moment-slide]').first();
  const photos = story.locator('[data-event-photos]');
  await expect(photos.locator('[data-photo-current]')).toHaveText('01');
  await photos.getByRole('button', { name: 'Next photo', exact: true }).click();
  await expect(photos.locator('[data-photo-current]')).toHaveText('02');
  await expect(page.locator('[data-moments-current]')).toHaveText('01');
  await expect.poll(() => photos.locator('[data-photo-track]').evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  await photos.locator('[data-photo-track]').focus();
  await page.keyboard.press('Home');
  await expect(photos.locator('[data-photo-current]')).toHaveText('01');
  await page.keyboard.press('ArrowRight');
  await expect(photos.locator('[data-photo-current]')).toHaveText('02');
  await expect(page.locator('[data-moments-current]')).toHaveText('01');
});

test('event photo state syncs native scrolling and bfcache resume', async ({ page }) => {
  const photos = page.locator('[data-event-photos]').first();
  await photos.locator('[data-photo-track]').evaluate(element => element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }));
  await expect(photos.locator('[data-photo-current]')).toHaveText('02');
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await photos.getByRole('button', { name: 'Previous photo', exact: true }).click();
  await expect(photos.locator('[data-photo-current]')).toHaveText('01');
});

test('branded portrait graphics pair into complete pages and retain every image', async ({ page, isMobile }) => {
  const story = page.locator('[data-moment="13"]');
  const media = story.locator('[data-event-photos]');
  const storyIndex = await story.evaluate(story => Array.from(story.parentElement!.querySelectorAll('[data-moment-slide]')).indexOf(story));
  await page.locator(`[data-moments-page="${storyIndex}"]`).click();
  await expect(page.locator('[data-moments-current]')).toHaveText(String(storyIndex + 1).padStart(2, '0'));
  await expect(media.locator('figure.moment-photo')).toHaveCount(3);
  await expect(media.locator('[data-photo-slide]')).toHaveCount(2);
  await expect(media.locator('.moment-photo-count')).toContainText('pages · 3 images');
  const firstPage = media.locator('[data-photo-slide]').first();
  await expect(firstPage.locator('figure')).toHaveCount(2);
  const images = firstPage.locator('img');
  await firstPage.scrollIntoViewIfNeeded();
  for (const image of await images.all()) {
    await image.evaluate((image: HTMLImageElement) => image.decode());
    await expect(image).toHaveCSS('object-fit', 'contain');
    await expect(image).toHaveCSS('aspect-ratio', 'auto');
  }
  const first = await images.nth(0).boundingBox();
  const second = await images.nth(1).boundingBox();
  expect(first && second).toBeTruthy();
  if (isMobile) { expect(second!.y).toBeGreaterThan(first!.y + first!.height); expect(first!.width).toBeGreaterThan(220); }
  else { expect(second!.x).toBeGreaterThan(first!.x + first!.width); expect(Math.abs(first!.y - second!.y)).toBeLessThan(2); }
  await media.getByRole('button', { name: 'Next photo page', exact: true }).click();
  await expect(media.locator('[data-photo-current]')).toHaveText('02');
  await expect(media.locator('[data-photo-slide]').last().locator('img')).toHaveAttribute('src', /qaiser-moments-branded/);
});

test('paired graphics remain accessible through native scrolling without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const story = page.locator('[data-moment="13"]');
  await story.evaluate((story: HTMLElement) => {
    const track = story.closest<HTMLElement>('[data-moments-track]')!;
    const first = track.querySelector<HTMLElement>('[data-moment-slide]')!;
    track.scrollTo({ left: story.offsetLeft - first.offsetLeft, behavior: 'instant' });
  });
  const media = story.locator('[data-event-photos]');
  await expect(media.locator('figure.moment-photo')).toHaveCount(3);
  for (const figure of await media.locator('figure.moment-photo').all()) {
    await figure.locator('a').scrollIntoViewIfNeeded();
    await expect(figure.locator('a')).toBeInViewport();
    await expect(figure.locator('figcaption')).not.toBeEmpty();
  }
  await expect(media.getByRole('button', { name: 'Next photo page', exact: true })).not.toBeVisible();
  await context.close();
});

test('mobile story controls appear before tall photo pages and photo links have no overlay labels', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The mobile gallery keeps story controls above its tall photo pages.');
  await page.setViewportSize({ width: 320, height: 844 });
  await expect(page.locator('[data-moments-next]')).toBeVisible();
  await page.locator('[data-moments-track]').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 220, behavior: 'instant' }));
  const next = await page.locator('[data-moments-next]').boundingBox();
  const firstPhoto = await page.locator('[data-moment-slide]').first().locator('img').first().boundingBox();
  expect(next && firstPhoto).toBeTruthy();
  expect(next!.y).toBeGreaterThanOrEqual(0);
  expect(next!.y + next!.height).toBeLessThanOrEqual(firstPhoto!.y);
  await expect(page.locator('.moment-photo a > span')).toHaveCount(0);
  await expect(page.locator('.moment-photo a').first()).toHaveAttribute('aria-label', /Open full image:/);
});

test('mobile photo swipes reach the next story at the edge while vertical touch still scrolls the page', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Uses real mobile touch gestures.');
  await page.setViewportSize({ width: 320, height: 844 });
  const story = page.locator('[data-moment="13"]');
  const index = await story.evaluate(element => Array.from(element.parentElement!.children).indexOf(element));
  await page.locator('[data-moments-page]').nth(index).click();
  const current = page.locator('[data-moments-current]');
  await expect(current).toHaveText(String(index + 1).padStart(2, '0'));
  await swipePhoto(page, story.locator('img').first(), 'left');
  await expect(story.locator('[data-photo-current]')).toHaveText('02');
  await expect(current).toHaveText(String(index + 1).padStart(2, '0'));
  await swipePhoto(page, story.locator('img').last(), 'left');
  await expect(current).toHaveText(String(index + 2).padStart(2, '0'));
  const nextStory = page.locator('[data-moment-slide]').nth(index + 1);
  await swipePhoto(page, nextStory.locator('img').first(), 'right');
  await expect(current).toHaveText(String(index + 1).padStart(2, '0'));
  await story.locator('img').last().evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 220, behavior: 'instant' }));
  const before = await page.evaluate(() => scrollY);
  await swipePhoto(page, story.locator('img').last(), 'vertical');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 50);
  await expect(current).toHaveText(String(index + 1).padStart(2, '0'));
});
