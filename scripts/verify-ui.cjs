const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright-core');

const root = process.cwd();
const outDir = path.join(root, 'verification');
const expectedModelHash = 'cac07733089ee566e655c5397ecf82b70c8ef8836bc1b1b839f766e34744c5c3';
const placeholderModelHash = '1dfc74d4e7a7a34e8b421b73fa1d7916b3ce38040aaf71720edb7cf9eade7dd2';
const expectedModelBytes = 51893304;
const modelFile = path.join(root, 'public', 'avatar-head.glb');
const modelFileBuffer = fs.readFileSync(modelFile);
const actualModelBytes = modelFileBuffer.length;
const actualModelHash = crypto.createHash('sha256').update(modelFileBuffer).digest('hex');
fs.mkdirSync(outDir, { recursive: true });

async function inspectPage(page, label, viewport) {
  const browserErrors = [];
  const glbResponses = [];
  const glbResponseJobs = [];

  page.on('console', (message) => {
    const text = message.text();
    if (/(GLTF|WebGL|THREE|R3F)/i.test(text) || (message.type() === 'error' && !/Failed to load resource/i.test(text))) {
      browserErrors.push(text);
    }
  });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('response', (response) => {
    const url = response.url();
    if (!/\.glb($|\?)/i.test(url)) return;
    glbResponseJobs.push(
      response.body().then((body) => {
        glbResponses.push({
          url,
          status: response.status(),
          bytes: body.length,
          sha256: crypto.createHash('sha256').update(body).digest('hex'),
        });
      }).catch((error) => {
        glbResponses.push({ url, status: response.status(), error: error.message });
      }),
    );
  });

  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-hero-3d] canvas', { timeout: 30000 });
  await page.waitForFunction(() => document.querySelector('[data-hero-3d]')?.dataset.modelLoaded === 'true', null, {
    timeout: 15000,
  });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    function sampleCanvas(canvas) {
      let coloredSamples = 0;
      const signature = [];
      if (!canvas) return { coloredSamples, signature };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { coloredSamples, signature };
      const points = [
        [0.5, 0.5],
        [0.4, 0.42],
        [0.6, 0.42],
        [0.5, 0.28],
        [0.5, 0.7],
        [0.28, 0.5],
        [0.72, 0.5],
      ];
      for (const [x, y] of points) {
        const pixel = new Uint8Array(4);
        gl.readPixels(
          Math.floor(canvas.width * x),
          Math.floor(canvas.height * (1 - y)),
          1,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixel,
        );
        signature.push(pixel[0], pixel[1], pixel[2], pixel[3]);
        if (pixel[3] > 20 && pixel[0] + pixel[1] + pixel[2] > 30) coloredSamples += 1;
      }
      return { coloredSamples, signature };
    }

    const text = document.body.innerText;
    const firstProject = document.querySelector('[data-project-card]');
    const projectSection = document.querySelector('#projects');
    const projectStack = document.querySelector('[data-project-stack]');
    const firstMarquee = document.querySelector('[data-marquee-row]');
    const hero = document.querySelector('[data-hero-3d]');
    const canvas = document.querySelector('[data-hero-3d] canvas');
    const focusable = document.querySelector('nav a');
    const heroSection = document.querySelector('section');
    focusable?.focus();
    const focusStyle = focusable ? getComputedStyle(focusable) : null;
    const heroStyle = heroSection ? getComputedStyle(heroSection) : null;
    const canvasSample = sampleCanvas(canvas);
    return {
      title: document.title,
      hasCaseyHeading: /hi,\s*i'?m\s*casey/i.test(text),
      hasJack: /jack/i.test(text),
      hasHeroCanvas: Boolean(canvas),
      modelLoaded: hero?.getAttribute('data-model-loaded') || 'missing',
      modelSrc: hero?.getAttribute('data-model-src') || 'missing',
      modelBytes: Number(hero?.getAttribute('data-model-bytes') || 0),
      modelSha256: hero?.getAttribute('data-model-sha256') || 'missing',
      modelMeshCount: Number(hero?.getAttribute('data-model-mesh-count') || 0),
      modelMaterialCount: Number(hero?.getAttribute('data-model-material-count') || 0),
      modelTextureCount: Number(hero?.getAttribute('data-model-texture-count') || 0),
      modelBoxX: Number(hero?.getAttribute('data-model-box-x') || 0),
      modelBoxY: Number(hero?.getAttribute('data-model-box-y') || 0),
      modelBoxZ: Number(hero?.getAttribute('data-model-box-z') || 0),
      rotationX: Number(hero?.getAttribute('data-rotation-x') || 0),
      rotationY: Number(hero?.getAttribute('data-rotation-y') || 0),
      hasSkyBackground: Boolean(heroStyle?.backgroundImage?.includes('casey-sky-background')),
      canvasColoredSamples: canvasSample.coloredSamples,
      canvasSignature: canvasSample.signature,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      viewportHeight: window.innerHeight,
      sections: document.querySelectorAll('section').length,
      projectPosition: firstProject ? getComputedStyle(firstProject).position : 'missing',
      projectMode: projectSection?.getAttribute('data-project-mode') || 'missing',
      projectStackHeight: projectStack ? projectStack.scrollHeight : 0,
      projectTrackTransform: 'sticky-stack',
      projectTrackWidth: 0,
      projectViewportWidth: window.innerWidth,
      projectTravelAttr: Number(projectSection?.getAttribute('data-project-travel') || 0),
      projectGsapEnabled: projectSection?.getAttribute('data-gsap-projects') || 'false',
      projectScrollDebug: window.__projectScrollDebug || null,
      projectCardSnapshot: Array.from(document.querySelectorAll('[data-project-card]')).slice(0, 3).map((card) => {
        const style = getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return {
          opacity: Number(style.opacity),
          transform: style.transform,
          position: style.position,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          left: Math.round(rect.left),
          zIndex: Number(style.zIndex || 0),
        };
      }),
      marqueeTransform: firstMarquee ? getComputedStyle(firstMarquee).transform : 'missing',
      focusedText: document.activeElement?.textContent?.trim() || '',
      focusOutline: focusStyle?.outlineStyle || '',
      focusRing: focusStyle?.boxShadow || '',
    };
  });

  await page.mouse.move(Math.round(viewport.width * 0.9), Math.round(viewport.height * 0.45));
  await page.waitForTimeout(900);
  const rotationAfterPointer = await page.evaluate(() => {
    function sampleCanvas(canvas) {
      const signature = [];
      if (!canvas) return signature;
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return signature;
      const points = [
        [0.5, 0.5],
        [0.4, 0.42],
        [0.6, 0.42],
        [0.5, 0.28],
        [0.5, 0.7],
        [0.28, 0.5],
        [0.72, 0.5],
      ];
      for (const [x, y] of points) {
        const pixel = new Uint8Array(4);
        gl.readPixels(
          Math.floor(canvas.width * x),
          Math.floor(canvas.height * (1 - y)),
          1,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixel,
        );
        signature.push(pixel[0], pixel[1], pixel[2], pixel[3]);
      }
      return signature;
    }
    const hero = document.querySelector('[data-hero-3d]');
    const canvas = document.querySelector('[data-hero-3d] canvas');
    return {
      x: Number(hero?.getAttribute('data-rotation-x') || 0),
      y: Number(hero?.getAttribute('data-rotation-y') || 0),
      signature: sampleCanvas(canvas),
    };
  });
  result.rotationDeltaAfterPointer = {
    x: rotationAfterPointer.x - result.rotationX,
    y: rotationAfterPointer.y - result.rotationY,
  };
  result.canvasPixelDeltaAfterPointer = rotationAfterPointer.signature.reduce((sum, value, index) => {
    return sum + Math.abs(value - (result.canvasSignature[index] || 0));
  }, 0);
  await Promise.allSettled(glbResponseJobs);
  result.glbResponses = glbResponses;
  result.browserErrors = browserErrors;

  await page.screenshot({ path: path.join(outDir, `${label}.png`), fullPage: false });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.15));
  await page.waitForTimeout(800);
  result.marqueeTransformAfterScroll = await page.evaluate(() => {
    const firstMarquee = document.querySelector('[data-marquee-row]');
    return firstMarquee ? getComputedStyle(firstMarquee).transform : 'missing';
  });
  const sampleProjectState = () => page.evaluate(() => {
    return {
      debug: window.__projectScrollDebug || null,
      cardSnapshot: Array.from(document.querySelectorAll('[data-project-card]')).slice(0, 3).map((card) => {
        const style = getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return {
          opacity: Number(style.opacity),
          transform: style.transform,
          position: style.position,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          left: Math.round(rect.left),
          zIndex: Number(style.zIndex || 0),
        };
      }),
    };
  });

  const projectTop = await page.evaluate(() => {
    const projectSection = document.querySelector('#projects');
    return projectSection ? projectSection.getBoundingClientRect().top + window.scrollY : document.body.scrollHeight;
  });
  await page.evaluate((top) => window.scrollTo(0, top + 80), projectTop);
  await page.waitForTimeout(900);
  const projectFirstStack = await sampleProjectState();
  const secondCardTop = await page.evaluate(() => {
    const card = document.querySelectorAll('[data-project-card]')[1];
    return card ? card.getBoundingClientRect().top + window.scrollY : document.body.scrollHeight;
  });
  await page.evaluate((top) => window.scrollTo(0, Math.max(0, top - 124)), secondCardTop);
  await page.waitForTimeout(1100);
  const projectSecondStack = await sampleProjectState();
  const thirdCardTop = await page.evaluate(() => {
    const card = document.querySelectorAll('[data-project-card]')[2];
    return card ? card.getBoundingClientRect().top + window.scrollY : document.body.scrollHeight;
  });
  await page.evaluate((top) => window.scrollTo(0, Math.max(0, top - 152)), thirdCardTop);
  await page.waitForTimeout(1100);
  const projectThirdStack = await sampleProjectState();

  result.projectTrackTransformAfterScroll = 'sticky-stack';
  result.projectScrollDebugAfterScroll = projectThirdStack.debug;
  result.projectCardSnapshotAfterScroll = projectThirdStack.cardSnapshot;
  result.projectStackSnapshots = {
    first: projectFirstStack.cardSnapshot,
    second: projectSecondStack.cardSnapshot,
    third: projectThirdStack.cardSnapshot,
  };
  result.projectPinRectAfterScroll = await page.evaluate(() => {
    const projectSection = document.querySelector('#projects');
    const rect = projectSection?.getBoundingClientRect();
    return {
      top: rect ? Math.round(rect.top) : null,
      bottom: rect ? Math.round(rect.bottom) : null,
      trackTransform: 'sticky-stack',
    };
  });
  await page.screenshot({ path: path.join(outDir, `${label}-bottom.png`), fullPage: false });

  return result;
}

function collectFailures(result, label) {
  const failures = [];
  const matrixX = (value) => {
    if (!value || value === 'none') return 0;
    const match = value.match(/matrix\(([^)]+)\)/);
    if (!match) return 0;
    const parts = match[1].split(',').map((part) => Number(part.trim()));
    return Number.isFinite(parts[4]) ? parts[4] : 0;
  };

  if (!result.hasCaseyHeading) failures.push(`${label}: missing Casey hero heading`);
  if (result.hasJack) failures.push(`${label}: stale Jack text is still visible`);
  if (!result.hasHeroCanvas) failures.push(`${label}: missing hero WebGL canvas`);
  if (result.modelLoaded !== 'true') failures.push(`${label}: hero GLB did not report loaded`);
  if (result.modelSrc !== '/avatar-head.glb') failures.push(`${label}: unexpected model source ${result.modelSrc}`);
  if (result.modelBytes !== expectedModelBytes) failures.push(`${label}: unexpected model byte marker ${result.modelBytes}`);
  if (result.modelSha256 !== expectedModelHash) failures.push(`${label}: unexpected model hash marker ${result.modelSha256}`);
  if (result.modelSha256 === placeholderModelHash) failures.push(`${label}: placeholder model hash is still in use`);
  if (result.modelMeshCount < 1) failures.push(`${label}: model mesh count missing`);
  if (result.modelMaterialCount < 1) failures.push(`${label}: model material count missing`);
  if (Math.min(result.modelBoxX, result.modelBoxY, result.modelBoxZ) < 0.2) failures.push(`${label}: model bounds look flat`);
  if (actualModelBytes !== expectedModelBytes) failures.push(`${label}: public avatar-head.glb has unexpected bytes ${actualModelBytes}`);
  if (actualModelHash !== expectedModelHash) failures.push(`${label}: public avatar-head.glb has unexpected hash ${actualModelHash}`);
  if (actualModelHash === placeholderModelHash) failures.push(`${label}: public avatar-head.glb is still the placeholder`);
  if (!result.glbResponses.some((item) => item.status === 200 && /\/avatar-head\.glb($|\?)/.test(item.url))) {
    failures.push(`${label}: /avatar-head.glb network response not observed`);
  }
  result.glbResponses.forEach((item) => {
    if (item.sha256 && item.sha256 !== expectedModelHash) failures.push(`${label}: network GLB hash mismatch ${item.sha256}`);
    if (item.bytes && item.bytes !== expectedModelBytes) failures.push(`${label}: network GLB byte mismatch ${item.bytes}`);
  });
  if (result.glbResponses.some((item) => item.sha256 === placeholderModelHash)) failures.push(`${label}: placeholder GLB was loaded`);
  if (!result.hasSkyBackground) failures.push(`${label}: static sky background missing`);
  if (result.canvasColoredSamples < 1) failures.push(`${label}: hero WebGL canvas appears blank`);
  if (label !== 'reduced-motion' && Math.abs(result.rotationDeltaAfterPointer.y) < 0.01) {
    failures.push(`${label}: hero model did not rotate after pointer movement`);
  }
  if (label !== 'reduced-motion' && result.canvasPixelDeltaAfterPointer < 20) {
    failures.push(`${label}: hero canvas did not visually change after pointer movement`);
  }
  if (result.browserErrors.length) failures.push(`${label}: browser errors: ${result.browserErrors.join(' | ')}`);
  if (result.horizontalOverflow > 2) failures.push(`${label}: horizontal overflow ${result.horizontalOverflow}px`);
  if (result.sections < 5) failures.push(`${label}: expected 5 sections, found ${result.sections}`);
  if (result.projectPosition === 'missing') failures.push(`${label}: project card missing`);
  if (label === 'desktop') {
    const debug = result.projectScrollDebugAfterScroll || result.projectScrollDebug;
    if (result.projectGsapEnabled !== 'true' && !debug?.active) failures.push(`${label}: GSAP project scene marker missing`);
    if (!debug?.active) failures.push(`${label}: GSAP project debug missing`);
    if (!debug?.scrub) failures.push(`${label}: GSAP project scene is not scrubbed`);
    if (debug?.mode !== 'framer-sticky-stack') failures.push(`${label}: project mode is not framer-sticky-stack`);
    if (debug?.target !== '[data-project-card]') failures.push(`${label}: project target mismatch`);
    if (result.projectMode !== 'framer-sticky-stack') failures.push(`${label}: project DOM mode marker missing`);
    if (result.projectStackHeight < result.viewportHeight * 2) failures.push(`${label}: project stack is too short for vertical card stacking`);
    if ((result.projectCardSnapshot || []).some((card) => card.position !== 'sticky')) {
      failures.push(`${label}: project cards are not sticky`);
    }
    const secondStack = result.projectStackSnapshots?.second || [];
    const thirdStack = result.projectStackSnapshots?.third || [];
    if (secondStack[0] && secondStack[1] && secondStack[1].top >= secondStack[0].bottom - 120) {
      failures.push(`${label}: second project card does not rise into the first card`);
    }
    if (thirdStack[1] && thirdStack[2] && thirdStack[2].top >= thirdStack[1].bottom - 120) {
      failures.push(`${label}: third project card does not rise into the stack`);
    }
    if ((result.projectCardSnapshotAfterScroll || result.projectCardSnapshot).some((card) => card.opacity < 0.95)) {
      failures.push(`${label}: project cards not fully visible after flip-in`);
    }
  }
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
    modelFile: {
      path: 'public/avatar-head.glb',
      bytes: actualModelBytes,
      sha256: actualModelHash,
    },
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
