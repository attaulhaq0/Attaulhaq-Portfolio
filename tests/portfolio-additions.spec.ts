import { test, expect } from '@playwright/test';

test('project rows alternate illustration placement and preserve mobile reading order', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.project-card h3')).toHaveText(['Cuevo', 'AegisOps', 'Family OS', 'Cosmo Conqueror']);
  const layout = await page.locator('.project-card').evaluateAll(cards => cards.map(card => ({
    art: card.querySelector('.project-art-wrap')!.getBoundingClientRect(),
    text: card.querySelector('.project-copy')!.getBoundingClientRect(),
  })).map(({ art, text }) => ({ artX: art.x, textX: text.x, artY: art.y, textY: text.y })));
  for (const [index, item] of layout.entries()) {
    if (isMobile) expect(item.artY).toBeLessThan(item.textY);
    else if (index % 2 === 0) expect(item.artX).toBeLessThan(item.textX);
    else expect(item.artX).toBeGreaterThan(item.textX);
  }
});

test('current positioning covers intelligent systems and preserves the game development origin', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Sheikh Atta-ul-Haq — Product & Systems Engineer');
  await expect(page.locator('#intro-title')).toContainText('Intelligent systems');
  await expect(page.locator('.hero-role-note')).toContainText('Intelligent systems & automation');
  await expect(page.locator('.capability-row h3')).toHaveText(['Intelligent systems', 'Product & system design', 'Implementation & validation']);
  await expect(page.locator('.tech-stack-group h3')).toHaveText(['AI & agentic systems', 'Software & delivery', 'Game development foundation']);
  await expect(page.locator('#about')).toContainText('I started in game development');
  await expect(page.locator('#contact')).toContainText('growing an engineering team');
  await expect(page.locator('.hero-role')).not.toContainText('Unreal');
});

test('illustrated homepage covers lead to actual recordings and real case evidence', async ({ page }) => {
  await page.goto('/');
  const videos = page.locator('.home-gameplay video');
  await expect(videos).toHaveCount(2);
  for (const video of await videos.all()) {
    await expect(video).toHaveAttribute('poster', /\/images\/home\/.+illustration\.webp/);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay', '');
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.2);
    await page.locator('#stack').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
  }
  await expect(page.locator('.project-art img')).toHaveCount(3);
  for (const image of await page.locator('.project-art img').all()) await expect(image).toHaveAttribute('src', /\/images\/home\//);
  await page.getByRole('link', { name: 'Cosmo Conqueror', exact: true }).click();
  await expect(page.locator('.case-cover img')).toHaveAttribute('src', '/images/cosmo/mission.webp');
});

test('employers can download the supplied CV from navigation and see current tools and milestones', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  if (isMobile) await page.locator('.mobile-nav summary').click();
  const cv = isMobile ? page.locator('.mobile-nav a[download]') : page.locator('.desktop-nav a[download]');
  await expect(cv).toHaveAttribute('href', '/documents/sheikh-atta-ul-haq-cv.pdf');
  await expect(cv).toHaveAttribute('download', 'Sheikh-Atta-ul-Haq-CV.pdf');
  const download = page.waitForEvent('download');
  await cv.click();
  expect((await download).suggestedFilename()).toBe('Sheikh-Atta-ul-Haq-CV.pdf');
  const response = await page.request.get('/documents/sheikh-atta-ul-haq-cv.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).byteLength).toBe(313423);
  await expect(page.locator('#about a[download], .contact-section a[download]')).toHaveCount(0);
  await expect(page.locator('#stack')).toContainText('Python');
  await expect(page.locator('#stack')).toContainText('Docker');
  await expect(page.locator('#milestones')).toContainText('62+');
  await expect(page.locator('#milestones')).toContainText('PKR 1M+');
  const fiverrImage = page.locator('.career-freelance .fiverr-evidence img');
  await expect(fiverrImage).toHaveAttribute('src', '/images/fiverr-level-overview.webp');
  await expect(fiverrImage).toHaveAttribute('width', '1280');
  await expect(fiverrImage).toHaveAttribute('height', '638');
  await expect(fiverrImage).toHaveAttribute('alt', /profile/i);
  await expect(page.getByRole('link', { name: 'Open full-size Fiverr record' })).toHaveAttribute('href', '/images/fiverr-level-overview.webp');
  await expect(page.locator('.fiverr-full-record')).toHaveCount(0);
  await fiverrImage.scrollIntoViewIfNeeded();
  await expect.poll(() => fiverrImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBeTruthy();
  await expect(fiverrImage).toHaveCSS('object-fit', 'contain');
  const fiverrDimensions = await fiverrImage.evaluate((image: HTMLImageElement) => {
    const bounds = image.getBoundingClientRect();
    const frame = image.parentElement!.getBoundingClientRect();
    return { displayedRatio: bounds.width / bounds.height, naturalRatio: image.naturalWidth / image.naturalHeight, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, insideFrame: bounds.left >= frame.left && bounds.right <= frame.right && bounds.top >= frame.top && bounds.bottom <= frame.bottom };
  });
  expect(fiverrDimensions.displayedRatio).toBeCloseTo(fiverrDimensions.naturalRatio, 2);
  expect(fiverrDimensions.naturalWidth).toBe(1280);
  expect(fiverrDimensions.naturalHeight).toBe(638);
  expect(fiverrDimensions.insideFrame).toBeTruthy();
  const milestoneLayout = await page.locator('.career-freelance').evaluate(card => {
    const copy = card.querySelector('.career-freelance-copy')!.getBoundingClientRect();
    const art = card.querySelector('.fiverr-evidence')!.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    const employment = document.querySelector('.career-employment')!.getBoundingClientRect();
    return { copyRight: copy.right, copyBottom: copy.bottom, artLeft: art.left, artTop: art.top, cardBottom: cardBounds.bottom, employmentTop: employment.top };
  });
  if (isMobile) expect(milestoneLayout.artTop).toBeGreaterThan(milestoneLayout.copyBottom);
  else expect(milestoneLayout.artLeft).toBeGreaterThan(milestoneLayout.copyRight);
  expect(milestoneLayout.employmentTop).toBeGreaterThan(milestoneLayout.cardBottom);
  await expect(page.locator('.career-employment .fiverr-evidence')).toHaveCount(0);
  await expect(page.locator('.career-freelance .career-certificate')).toHaveCount(0);
  await expect(page.locator('.career-employment > .career-certificate')).toHaveCount(1);
  await expect(page.locator('#about')).toContainText('I started by');
  const certificate = page.locator('#career-certificate');
  await certificate.locator('summary').click();
  await expect(certificate).toHaveAttribute('open', '');
  await expect(certificate.locator('img')).toBeVisible();
  await expect(certificate.getByRole('link', { name: 'Open full-size certificate' })).toHaveAttribute('href', '/images/subrickzz-experience-certificate.webp');
});

test('Qatar talk is second and branded LinkedIn pages stay intact', async ({ page }) => {
  await page.goto('/');
  const stories = page.locator('[data-moment-slide]');
  await expect(stories.first().locator('figure.moment-photo img').first()).toHaveAttribute('src', '/images/moments/qstp-team.webp');
  await expect(stories.nth(1)).toContainText('Qatar Event Show');
  await expect(stories.nth(1)).toContainText('Speaker');
  const summit = stories.filter({ has: page.locator('[src="/images/moments/bahria-welcome-branded.webp"]') });
  const branded = summit.locator('img').first();
  expect(await branded.evaluate(img => getComputedStyle(img).objectFit)).toBe('contain');
  await expect(summit.locator('figure.moment-photo')).toHaveCount(4);
  await expect(stories).toHaveCount(12);
  await expect(page.getByRole('heading', { name: 'Education, in conversation.' })).toHaveCount(0);
  await expect(page.locator('img[src="/images/moments/bahria-group.webp"], img[src="/images/moments/ai-future-fireside-panel-branded.webp"]')).toHaveCount(0);
  await expect(summit.locator('a[href*="7409170356218863616"]')).toHaveCount(1);
  const google = stories.filter({ hasText: 'Google Cloud Summit Doha' });
  await expect(google.locator('figure.moment-photo img').first()).toHaveAttribute('src', '/images/moments/google-pointing.webp');
  await expect(google.locator('figure.moment-photo')).toHaveCount(8);
});

for (const slug of ['aegisops', 'family-os']) {
  test(`${slug} concept animation plays on demand and pauses on close`, async ({ page }) => {
    await page.goto(`/work/${slug}/`);
    const concept = page.locator('.concept-motion');
    await concept.locator('summary').click();
    const video = concept.locator('video');
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay', '');
    await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(.2);
    await concept.locator('summary').click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBeTruthy();
    await expect(concept.locator('figcaption')).toContainText('visual metaphor');
  });
}

test('game studies explain Blueprint development and Cosmo reel is shortened', async ({ page }) => {
  await page.goto('/work/cosmo-conqueror/');
  await expect(page.locator('.case-media-duration')).toHaveText('44-second showcase');
  await page.locator('.development-evidence summary').click();
  await expect(page.locator('.development-evidence')).toContainText('Behavior Trees');
  await expect(page.locator('.development-evidence figcaption')).toContainText('not an Unreal screenshot');
  const video = page.locator('.case-media video');
  await video.evaluate((element: HTMLVideoElement) => element.load());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.duration)).toBe(44);
  await page.goto('/work/survival-game/');
  await page.locator('.development-evidence summary').click();
  await expect(page.locator('.development-evidence')).toContainText('collision validation');
  await expect(page.locator('.development-evidence figcaption')).toContainText('project report');
});
