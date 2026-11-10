(function (root) {
  'use strict';

  // Owns rendering resources only; callers own workflow and stale-result checks.
  function create(patterns, environment = root) {
    const pending = new Map();
    let worker = null, jobId = 0;
    const backend = name => { environment.document.body.dataset.renderBackend = name; };
    const dispose = result => { result?.bitmap?.close?.(); };

    function close() {
      const previous = worker;
      worker = null;
      previous?.terminate();
      backend('canvas');
      for (const job of pending.values()) job.reject(new Error('worker unavailable'));
      pending.clear();
    }

    function start() {
      if (worker || !environment.Worker || !environment.OffscreenCanvas || !patterns.workerSource) return;
      let url;
      try {
        const handler = 'self.onmessage=function(e){const j=e.data;try{const c=new OffscreenCanvas(j.size,j.size);const s=DyePatterns.render(c,j.params,{size:j.size,dyed:j.dyed});const b=c.transferToImageBitmap();self.postMessage({id:j.id,bitmap:b,stats:s},[b]);}catch(e){self.postMessage({id:j.id,error:e.message});}};';
        url = environment.URL.createObjectURL(new environment.Blob([patterns.workerSource, handler], { type: 'text/javascript' }));
        worker = new environment.Worker(url);
        const active = worker;
        backend('worker');
        worker.onmessage = event => {
          if (worker !== active) { dispose(event.data); return; }
          const job = pending.get(event.data.id);
          if (!job) { dispose(event.data); return; }
          pending.delete(event.data.id);
          if (event.data.error) job.reject(new Error(event.data.error));
          else job.resolve(event.data);
        };
        worker.onerror = worker.onmessageerror = () => { if (worker === active) close(); };
      } catch (_) { close(); }
      finally { if (url) environment.URL.revokeObjectURL(url); }
    }

    async function render(params, size, dyed = true) {
      if (worker) {
        try {
          return await new Promise((resolve, reject) => {
            const id = ++jobId;
            pending.set(id, { resolve, reject });
            try { worker.postMessage({ id, params: JSON.parse(JSON.stringify(params)), size, dyed }); }
            catch (_) { close(); }
          });
        } catch (_) { /* Local file browsers may deny workers; keep the canvas path. */ }
      }
      backend('canvas');
      await new Promise(resolve => environment.setTimeout(resolve, 0));
      const canvas = environment.document.createElement('canvas');
      const stats = patterns.render(canvas, params, { size, dyed });
      return { bitmap: canvas, stats };
    }

    function draw(target, result) {
      target.width = result.stats.width; target.height = result.stats.height;
      target.getContext('2d', { alpha: false }).drawImage(result.bitmap, 0, 0);
    }

    return { start, render, draw, dispose, close };
  }

  const api = { create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DyeRenderService = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
