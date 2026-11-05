/*
 * Static printed ground for the scatter poster.
 * The separate HTML pieces and giant letters own the composition; this layer
 * only contributes paper grain, stray dye, offset marks and a loose thread.
 * It is prepared once per size, never during the cloth entrance animation.
 */
(function attachScatterCover(root) {
  'use strict';
  const cache = new Map();
  const PAPER = '#183f63';
  let grainTile;

  function finite(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
  }
  function randomSource(seed) {
    let value = seed >>> 0;
    return function random() {
      value = (value + 0x6D2B79F5) >>> 0;
      let n = Math.imul(value ^ (value >>> 15), 1 | value);
      n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
      return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
  }
  function surface(width, height) {
    const canvas = typeof OffscreenCanvas === 'function'
      ? new OffscreenCanvas(width, height)
      : document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  function paperGrain(context, width, height) {
    if (!grainTile) {
      grainTile = surface(128, 128);
      const g = grainTile.getContext('2d');
      const image = g.createImageData(128, 128);
      const random = randomSource(427);
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const offset = (y * 128 + x) * 4;
        const value = random() > .52 ? 255 : 15;
        image.data[offset] = value;
        image.data[offset + 1] = value;
        image.data[offset + 2] = value;
        image.data[offset + 3] = random() * 8 + (y % 4 === 0 ? 2 : 0);
      }
      g.putImageData(image, 0, 0);
    }
    context.fillStyle = context.createPattern(grainTile, 'repeat');
    context.fillRect(0, 0, width, height);
  }
  function roughLine(context, points, color, width) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) context.lineTo(points[i][0], points[i][1]);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  }
  function compose(canvas, portrait) {
    const width = canvas.width, height = canvas.height;
    const context = canvas.getContext('2d', { alpha: false });
    const random = randomSource(1994);
    context.fillStyle = PAPER;
    context.fillRect(0, 0, width, height);
    paperGrain(context, width, height);

    // A broken thread runs across the field rather than enclosing a UI region.
    context.beginPath();
    context.moveTo(width * -.05, height * .53);
    context.bezierCurveTo(width * .10, height * .50, width * .06, height * .37, width * .24, height * .49);
    context.bezierCurveTo(width * .39, height * .59, width * .34, height * .32, width * .51, height * .42);
    context.bezierCurveTo(width * .62, height * .48, width * .63, height * .40, width * .74, height * .44);
    context.strokeStyle = 'rgba(196,212,220,.18)';
    context.lineWidth = Math.max(.8, width / 1050);
    context.lineCap = 'round';
    context.stroke();

    // Registration marks and dry-brush fragments recall a printed work sheet.
    const marks = portrait
      ? [[.06,.19,12], [.88,.56,9], [.12,.80,11]]
      : [[.045,.25,13], [.70,.33,11], [.58,.88,15]];
    for (const [u,v,size] of marks) {
      const x = width*u, y = height*v, r = size*Math.min(width,height)/800;
      roughLine(context, [[x-r,y-r*.05],[x+r*.18,y+r*.05],[x+r,y-r*.12]], 'rgba(196,212,220,.58)', 1.2);
      roughLine(context, [[x+r*.08,y-r],[x-r*.04,y+r]], 'rgba(196,212,220,.58)', 1.2);
    }
    context.save();
    context.translate(width * (portrait ? .05 : .105), height * (portrait ? .87 : .86));
    context.rotate(-.12);
    const length = width * (portrait ? .18 : .115);
    for (let i=0;i<8;i++) {
      const y = i * Math.max(.8,height*.0019);
      roughLine(context, [[0,y],[length*.20,y-1],[length*.51,y+1],[length,y-2]], i%3 ? 'rgba(196,212,220,.35)' : 'rgba(196,212,220,.73)', 1.8);
    }
    context.restore();

    // Sparse imperfect ink flecks. They stay peripheral to the entry ticket.
    const clusters = portrait ? [[.94,.30],[.025,.69]] : [[.64,.15],[.95,.73],[.035,.73]];
    for (const [u,v] of clusters) for(let i=0;i<20;i++) {
      const x = width*u+(random()-.5)*width*.045;
      const y = height*v+(random()-.5)*height*.06;
      context.beginPath();
      context.arc(x,y,.35+random()*1.25,0,Math.PI*2);
      context.fillStyle = i%4 ? 'rgba(196,212,220,.33)' : 'rgba(214,134,114,.65)';
      context.fill();
    }
  }
  function draw(canvas, options) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('DyeCover.draw requires a canvas.');
    const settings = options && typeof options === 'object' ? options : {};
    const requestedWidth = finite(settings.width, finite(canvas.clientWidth, finite(root.innerWidth,1280)));
    const requestedHeight = finite(settings.height, finite(canvas.clientHeight, finite(root.innerHeight,800)));
    const portrait = requestedWidth / requestedHeight < .86;
    const cap = portrait ? 960 : 1280;
    const ratio = Math.min(finite(root.devicePixelRatio,1),1.5,cap/Math.max(requestedWidth,requestedHeight));
    const width = Math.max(1,Math.round(requestedWidth*ratio));
    const height = Math.max(1,Math.round(requestedHeight*ratio));
    const key = width+'x'+height+':'+(portrait?'p':'l');
    const started = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    let image = cache.get(key);
    const cached = Boolean(image);
    if (!image) {
      image = surface(width,height);
      compose(image,portrait);
      if(cache.size>=2)cache.delete(cache.keys().next().value);
      cache.set(key,image);
    }
    canvas.width=width;canvas.height=height;
    const context=canvas.getContext('2d',{alpha:false});
    if(!context)throw new Error('Canvas 2D rendering is unavailable.');
    context.drawImage(image,0,0);
    const finished=typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
    return{width,height,durationMs:Math.round((finished-started)*10)/10,cached};
  }
  root.DyeCover=Object.freeze({draw});
})(typeof globalThis!=='undefined'?globalThis:this);
