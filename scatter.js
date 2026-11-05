/* The poster can be rearranged. The making canvas keeps its own coordinates. */
(() => {
  'use strict';
  const poster = document.getElementById('scatter-poster');
  const pieces = Array.from(poster.querySelectorAll('.scatter-piece'));
  const states = new Map(pieces.map(piece => [piece, { x: 0, y: 0 }]));
  const status = document.getElementById('intro-status');
  let active = null, round = 0, resizeTimer = 0;
  const clamp = (value, low, high) => Math.min(Math.max(value, Math.min(low, high)), Math.max(low, high));
  const available = () => document.body.dataset.view === 'landing';
  function setPosition(piece, x, y, bounded = true) {
    const state = states.get(piece);
    if (bounded) {
      const box = piece.getBoundingClientRect(), area = poster.getBoundingClientRect();
      const spill = innerWidth < 600 ? 24 : 55;
      x = clamp(x, state.x + area.left - box.left - spill, state.x + area.right - box.right + spill);
      y = clamp(y, state.y + area.top - box.top - spill, state.y + area.bottom - box.bottom + spill);
    }
    state.x = x; state.y = y;
    piece.style.setProperty('--drag-x', x.toFixed(1) + 'px');
    piece.style.setProperty('--drag-y', y.toFixed(1) + 'px');
    piece.dataset.moveX = x.toFixed(1); piece.dataset.moveY = y.toFixed(1);
  }
  function finishDrag() {
    const previous = active;
    active = null;
    if (!previous) return;
    previous.piece.classList.remove('is-dragging');
    if (previous.piece.hasPointerCapture(previous.pointerId)) previous.piece.releasePointerCapture(previous.pointerId);
  }
  pieces.forEach(piece => {
    piece.addEventListener('pointerdown', event => {
      if (!available() || active || event.button > 0) return;
      event.preventDefault();
      const state = states.get(piece);
      active = { piece, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: state.x, y: state.y };
      piece.classList.add('is-dragging');
      piece.setPointerCapture(event.pointerId);
      piece.focus({ preventScroll: true });
    });
    piece.addEventListener('pointermove', event => {
      if (!active || active.piece !== piece || active.pointerId !== event.pointerId || !available()) return;
      setPosition(piece, active.x + event.clientX - active.startX, active.y + event.clientY - active.startY);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) piece.addEventListener(type, event => {
      if (active?.pointerId === event.pointerId && active?.piece === piece) finishDrag();
    });
    piece.addEventListener('keydown', event => {
      if (!available()) return;
      const step = event.shiftKey ? 32 : 12;
      const directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (event.key === 'Home') {
        event.preventDefault(); piece.style.removeProperty('--tilt'); setPosition(piece, 0, 0, false);
        status.textContent = '这片碎片已放回原位。'; return;
      }
      if (!directions[event.key]) return;
      event.preventDefault();
      const state = states.get(piece), delta = directions[event.key];
      setPosition(piece, state.x + delta[0], state.y + delta[1]);
      status.textContent = '碎片已移动。按 Home 可以放回原位。';
    });
  });
  document.getElementById('reshuffle').addEventListener('click', () => {
    if (!available()) return;
    finishDrag(); round += 1;
    const area = poster.getBoundingClientRect();
    pieces.forEach((piece, index) => {
      piece.style.setProperty('--tilt', (Math.sin(round * 1.7 + index * 2.1) * 18).toFixed(1) + 'deg');
      setPosition(piece, Math.sin(round * 2.2 + index * 2.6) * area.width * .075, Math.cos(round * 1.8 + index * 2.1) * area.height * .085);
    });
    poster.dataset.arrangement = String(round);
    status.textContent = '纸片重新散开了，也可以拖动它们来摆放。';
  });
  new MutationObserver(() => { if (!available()) finishDrag(); }).observe(document.body, { attributes: true, attributeFilter: ['data-view'] });
  window.addEventListener('blur', finishDrag);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishDrag(); });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      finishDrag();
      pieces.forEach(piece => { piece.style.removeProperty('--tilt'); setPosition(piece, 0, 0, false); });
    }, 150);
  });
})();
