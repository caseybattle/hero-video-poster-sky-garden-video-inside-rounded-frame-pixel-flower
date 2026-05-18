const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const root = process.cwd();
const outDir = path.join(root, 'verification');
fs.mkdirSync(outDir, { recursive: true });

const expected = {
  title: 'Signal Foundry',
  heroVideo:
    'https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_062927_2b8ce586-f555-4610-88ae-b2d3752ede3b.mp4',
  heroPoster: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-painted-city-hero.webp',
  skyVideo:
    'https://d8j0ntlcm91z4.cloudfront.net/user_30c6yRkxUog0TZ5432rCR7HN4Pe/hf_20260501_082435_42398084-1c8d-48e5-a962-fe7c28c124e6.mp4',
  skyPoster: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-sky-garden.webp',
  pixelFlower: 'https://playground.bravebrand.com/assets/backgrounds/signal-foundry-pixel-flower.webp',
};

async function inspectPage(page, label, viewport) {
  const browserErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource/i.test(message.text())) {
      browserErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => browserErrors.push(error.message));

  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-hero-video]', { timeout: 15000 });
  await page.waitForSelector('.skyVideo', { timeout: 15000 });
  await page.waitForTimeout(1200);

  const result = await page.evaluate(() => {
    const text = document.body.innerText;
    const heroVideo = document.querySelector('[data-hero-video] video');
    const skyFrame = document.querySelector('.skyArt');
    const skyVideo = document.querySelector('.skyVideo');
    const pixelFlower = document.querySelector('img[src*="signal-foundry-pixel-flower"]');
    const heroSection = document.querySelector('[data-hero-video]');
    const nav = document.querySelector('nav');
    const heroCard = document.querySelector('[data-hero-video] article');
    const firstHeading = document.querySelector('h1');
    const systemCards = Array.from(document.querySelectorAll('#careers article'));
    const skyRect = skyFrame?.getBoundingClientRect();
    const skyVideoRect = skyVideo?.getBoundingClientRect();

    return {
      title: document.title,
      hasBrand: /Signal Foundry/.test(text),
      hasHeroHeadline: /AI that turns ideas into operating companies\./.test(text),
      hasHeroCopy: /Signal Foundry is an applied AI lab/.test(text),
      hasMainHeadline: /From founder insight to agent-ready execution\./.test(text),
      hasManifestoHeadline: /Where starting up a real world company is as easy as playing a video game\./.test(text),
      hasSystemHeadline: /A company brain, not another chat thread\./.test(text),
      hasClosingHeadline: /Agentic companies are on the horizon\. We're building them\./.test(text),
      hasHeroVideo: Boolean(heroVideo),
      heroVideoSrc: heroVideo?.currentSrc || heroVideo?.getAttribute('src') || '',
      heroVideoPoster: heroVideo?.getAttribute('poster') || '',
      heroBg: getComputedStyle(heroSection).backgroundImage,
      hasSkyVideo: Boolean(skyVideo),
      skyVideoSrc: skyVideo?.currentSrc || skyVideo?.getAttribute('src') || '',
      skyVideoPoster: skyVideo?.getAttribute('poster') || '',
      skyFrameBg: getComputedStyle(skyFrame).backgroundImage,
      skyFrameRadius: getComputedStyle(skyFrame).borderRadius,
      skyVideoCoversFrame: skyRect && skyVideoRect
        ? Math.abs(skyRect.width - skyVideoRect.width) < 2 && Math.abs(skyRect.height - skyVideoRect.height) < 2
        : false,
      hasPixelFlower: Boolean(pixelFlower),
      sections: document.querySelectorAll('section').length,
      cardCount: systemCards.length,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      bodyFont: getComputedStyle(document.body).fontFamily,
      headingFont: firstHeading ? getComputedStyle(firstHeading).fontFamily : '',
      navText: nav?.innerText || '',
      heroCardBottom: heroCard ? Math.round(window.innerHeight - heroCard.getBoundingClientRect().bottom) : null,
      browserHeight: window.innerHeight,
      browserWidth: window.innerWidth,
    };
  });

  await page.screenshot({ path: path.join(outDir, `${label}.png`), fullPage: false });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${label}-bottom.png`), fullPage: false });

  return { ...result, browserErrors };
}

function collectFailures(result, label) {
  const failures = [];

  if (result.title !== expected.title) failures.push(`${label}: incorrect title ${result.title}`);
  if (!result.hasBrand) failures.push(`${label}: missing Signal Foundry brand`);
  if (!result.hasHeroHeadline) failures.push(`${label}: missing hero headline`);
  if (!result.hasHeroCopy) failures.push(`${label}: missing hero support copy`);
  if (!result.hasMainHeadline) failures.push(`${label}: missing support headline`);
  if (!result.hasManifestoHeadline) failures.push(`${label}: missing manifesto headline`);
  if (!result.hasSystemHeadline) failures.push(`${label}: missing system headline`);
  if (!result.hasClosingHeadline) failures.push(`${label}: missing closing headline`);
  if (!result.hasHeroVideo) failures.push(`${label}: missing hero video`);
  if (result.heroVideoSrc !== expected.heroVideo) failures.push(`${label}: wrong hero video src`);
  if (result.heroVideoPoster !== expected.heroPoster) failures.push(`${label}: wrong hero poster`);
  if (!result.heroBg.includes('signal-foundry-painted-city-hero')) failures.push(`${label}: missing hero CSS poster fallback`);
  if (!result.hasSkyVideo) failures.push(`${label}: missing sky-garden video`);
  if (result.skyVideoSrc !== expected.skyVideo) failures.push(`${label}: wrong sky video src`);
  if (result.skyVideoPoster !== expected.skyPoster) failures.push(`${label}: wrong sky poster`);
  if (!result.skyFrameBg.includes('signal-foundry-sky-garden')) failures.push(`${label}: missing sky CSS poster fallback`);
  if (!result.skyVideoCoversFrame) failures.push(`${label}: sky video does not cover frame`);
  if (!result.hasPixelFlower) failures.push(`${label}: missing pixel flower`);
  if (result.sections !== 5) failures.push(`${label}: expected 5 semantic sections, found ${result.sections}`);
  if (result.cardCount !== 4) failures.push(`${label}: expected 4 system cards, found ${result.cardCount}`);
  if (result.horizontalOverflow > 2) failures.push(`${label}: horizontal overflow ${result.horizontalOverflow}px`);
  if (!/Inter Tight/.test(result.bodyFont)) failures.push(`${label}: body font is not Inter Tight`);
  if (!/Instrument Serif/.test(result.headingFont)) failures.push(`${label}: heading font is not Instrument Serif`);
  if (!/About/i.test(result.navText) || !/Writing/i.test(result.navText) || !/Careers/i.test(result.navText) || !/Get Signal/i.test(result.navText)) {
    failures.push(`${label}: nav copy incomplete`);
  }
  if (result.browserErrors.length) failures.push(`${label}: browser errors: ${result.browserErrors.join(' | ')}`);

  return failures;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  const desktop = await browser.newPage();
  const desktopResult = await inspectPage(desktop, 'desktop', { width: 1440, height: 1000 });

  const mobile = await browser.newPage();
  const mobileResult = await inspectPage(mobile, 'mobile', { width: 390, height: 844 });

  const reduced = await browser.newPage();
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  const reducedResult = await inspectPage(reduced, 'reduced-motion', { width: 1440, height: 1000 });

  await browser.close();

  const summary = {
    desktop: desktopResult,
    mobile: mobileResult,
    reducedMotion: reducedResult,
    screenshots: [
      'verification/desktop.png',
      'verification/desktop-bottom.png',
      'verification/mobile.png',
      'verification/mobile-bottom.png',
      'verification/reduced-motion.png',
    ],
  };

  console.log(JSON.stringify(summary, null, 2));

  const failures = [
    ...collectFailures(desktopResult, 'desktop'),
    ...collectFailures(mobileResult, 'mobile'),
    ...collectFailures(reducedResult, 'reduced-motion'),
  ];

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
})();
