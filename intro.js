/* Homepage and arrival: prepaint artwork once; animate composited layers only. */
(() => {
  'use strict';
  const landing = document.getElementById('landing');
  const studio = document.getElementById('studio');
  const enterButton = document.getElementById('enter-studio');
  const skipButton = document.getElementById('skip-arrival');
  const artwork = document.getElementById('landing-art');
  const status = document.getElementById('intro-status');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let mode = 'landing';
  let visited = false;
  let finishTimer = 0;
  let resizeTimer = 0;
  let lastArtShape = '';
  let workScroll = 0;
  const recordFrames = new URLSearchParams(location.search).has('qa');
  let frameRequest = 0;
  let framePrevious = 0;
  let frameCount = 0;
  let frameMaximum = 0;
  let frameSlow = 0;

  function recordFrame(timestamp) {
    if (mode !== 'entering') return;
    if (framePrevious) {
      const gap = timestamp - framePrevious;
      frameMaximum = Math.max(frameMaximum, gap);
      if (gap > 34) frameSlow += 1;
      frameCount += 1;
    }
    framePrevious = timestamp;
    frameRequest = requestAnimationFrame(recordFrame);
  }

  function drawArtwork() {
    if (!globalThis.DyeCover || mode !== 'landing') return;
    const box = landing.getBoundingClientRect();
    const width = Math.max(320, Math.round(box.width));
    const height = Math.max(480, Math.round(box.height));
    const shape = `${width}/${height}`;
    if (lastArtShape === shape) return;
    try {
      const stats = DyeCover.draw(artwork, { width, height });
      lastArtShape = shape;
      artwork.dataset.sourceSize = shape;
      artwork.dataset.drawMs = String(stats.durationMs);
      landing.classList.add('art-ready');
    } catch (error) {
      // The indigo CSS base and the entry stay usable if artwork is unavailable.
      console.warn('首页纹样未能绘制：', error.message);
    }
  }
  function finishArrival() {
    if (mode !== 'entering') return;
    clearTimeout(finishTimer);
    finishTimer = 0;
    if (frameRequest) cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    if (recordFrames) {
      studio.dataset.arrivalFrames = String(frameCount);
      studio.dataset.arrivalSlowFrames = String(frameSlow);
      studio.dataset.arrivalMaxGap = frameMaximum.toFixed(1);
    }
    mode = 'studio';
    document.body.dataset.view = 'studio';
    landing.hidden = true;
    studio.inert = false;
    skipButton.hidden = true;
    enterButton.disabled = false;
    document.querySelector('meta[name="theme-color"]').content = '#f0f3f1';
    status.textContent = visited ? '已经回到染布台。' : '染布台已铺好。先挑一种染法，再动手处理布料。';
    if (visited) window.scrollTo({ top: workScroll, behavior: 'instant' });
    else if (window.innerWidth >= 780) document.getElementById('canvas-workspace').scrollIntoView({ block: 'start', behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('stage-title').focus({ preventScroll: true });
    visited = true;
  }
  function enter() {
    if (mode !== 'landing') return;
    mode = 'entering';
    enterButton.disabled = true;
    // Artwork generation is finished before the action. No Canvas render loop
    // runs during this transition; the existing fabric is already prepared.
    studio.hidden = false;
    studio.inert = true;
    landing.inert = true;
    document.body.dataset.view = 'entering';
    status.textContent = '正在为你铺开染布台。';
    // Returning to an existing work position should not replay a top-of-page
    // entrance and then jump to the saved scroll position.
    if (visited || reduceMotion.matches) { finishArrival(); return; }
    skipButton.hidden = false;
    skipButton.focus({ preventScroll: true });
    if (recordFrames) {
      framePrevious = 0;
      frameCount = 0;
      frameMaximum = 0;
      frameSlow = 0;
      frameRequest = requestAnimationFrame(recordFrame);
    }
    finishTimer = setTimeout(finishArrival, 1240);
  }
  function home() {
    if (mode !== 'studio') return;
    workScroll = window.scrollY;
    mode = 'landing';
    studio.inert = true;
    studio.hidden = true;
    landing.hidden = false;
    landing.inert = false;
    document.body.dataset.view = 'landing';
    document.querySelector('meta[name="theme-color"]').content = '#183f63';
    document.getElementById('enter-label').textContent = '接着染';
    status.textContent = '已回到首页，刚才的染布已保留。';
    window.scrollTo({ top: 0, behavior: 'instant' });
    enterButton.focus({ preventScroll: true });
    drawArtwork();
  }
  enterButton.addEventListener('click', enter);
  skipButton.addEventListener('click', finishArrival);
  document.getElementById('back-home').addEventListener('click', home);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mode === 'entering') { event.preventDefault(); finishArrival(); }
  });
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches && mode === 'entering') finishArrival();
  });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawArtwork, 160);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && mode === 'entering') finishArrival();
  });
  // Let the headline and functional entry paint before preparing the static art.
  requestAnimationFrame(() => setTimeout(drawArtwork, 0));
})();
