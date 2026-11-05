/*
 * Six deliberately different resist fields, interpreted in two dimensions.
 * This is an expressive, seeded visual model, not a physical dye simulation.
 * Coordinates always describe the complete, unfolded square of cloth.
 * No browser globals are needed: the same closure can run in a canvas worker.
 */
(function attachDyePatterns(root) {
  'use strict';

  const TAU = Math.PI * 2;
  const METHODS = ['circle', 'stripe', 'snowflake', 'clamp', 'stitch', 'cloud'];
  const NOISE_SIZE = 128;
  const ANGLES = 2048;
  const FIELD_SIZE = 384;
  const seededFields = new Map();
  const stitchFields = new Map();
  const weave = new Float32Array(4096);
  for (let i = 0; i < weave.length; i += 1) {
    weave[i] = Math.sin(i / weave.length * TAU * 346) * 0.58 + Math.sin(i / weave.length * TAU * 691 + 0.8) * 0.24;
  }

  function clamp(value, low, high) { return Math.min(high, Math.max(low, value)); }
  function finite(value, fallback) { return typeof value === 'number' && Number.isFinite(value) ? value : fallback; }
  function smooth(low, high, value) {
    const t = clamp((value - low) / (high - low), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function modulo(value, period) { return ((value % period) + period) % period; }

  function defaults(technique) {
    const method = METHODS.includes(technique) ? technique : 'circle';
    return {
      technique: method,
      points: method === 'cloud'
        ? [{ x: 0.30, y: 0.29 }, { x: 0.72, y: 0.48 }, { x: 0.38, y: 0.75 }]
        : [{ x: 0.28, y: 0.28 }, { x: 0.73, y: 0.41 }, { x: 0.43, y: 0.74 }],
      x: 0.5, y: 0.5, radius: method === 'snowflake' ? 0.23 : 0.17,
      tightness: 0.7, dips: 2, seed: 73,
      density: method === 'clamp' ? 4 : 6, angle: 0, petals: 6,
      shape: 'diamond', motif: 'flower'
    };
  }

  function normalizeSingle(input) {
    const p = input && typeof input === 'object' ? input : {};
    const d = defaults(p.technique);
    const sourcePoints = Array.isArray(p.points) && p.points.length ? p.points.slice(0, 6) : d.points;
    return {
      technique: d.technique,
      points: sourcePoints.map((point, index) => {
        const q = point && typeof point === 'object' ? point : {};
        const fallback = d.points[index % d.points.length];
        return { x: clamp(finite(q.x, fallback.x), 0.06, 0.94), y: clamp(finite(q.y, fallback.y), 0.06, 0.94) };
      }),
      x: clamp(finite(p.x, d.x), 0.16, 0.84),
      y: clamp(finite(p.y, d.y), 0.16, 0.84),
      radius: clamp(finite(p.radius, d.radius), 0.09, 0.23),
      tightness: clamp(finite(p.tightness, d.tightness), 0.15, 0.95),
      dips: clamp(Math.round(finite(p.dips, d.dips)), 1, 3),
      seed: Math.round(finite(p.seed, d.seed)) >>> 0,
      density: clamp(Math.round(finite(p.density, d.density)), 3, 9),
      angle: clamp(finite(p.angle, d.angle), 0, 90),
      petals: [4, 6, 8].includes(p.petals) ? p.petals : d.petals,
      shape: ['square', 'diamond', 'circle'].includes(p.shape) ? p.shape : d.shape,
      motif: ['flower', 'leaf', 'butterfly'].includes(p.motif) ? p.motif : d.motif,
      ...(p.technique === 'stitch' && p.stitchProgress !== undefined ? {stitchProgress: clamp(finite(p.stitchProgress, 1), 0, 1)} : {})
    };
  }

  function normalize(input) {
    const p = normalizeSingle(input), layers = [], seen = new Set([p.technique]);
    if (Array.isArray(input?.layers)) for (const layer of input.layers) {
      if (layer && METHODS.includes(layer.technique) && !seen.has(layer.technique)) {
        layers.push(normalizeSingle(layer)); seen.add(layer.technique);
        if (layers.length === 2) break;
      }
    }
    if (layers.length) p.layers = layers.sort((a,b) => METHODS.indexOf(a.technique) - METHODS.indexOf(b.technique));
    return p;
  }

  function randomSource(seed) {
    let value = seed >>> 0;
    return function random() {
      value = (value + 0x6D2B79F5) >>> 0;
      let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeField(seed) {
    if (seededFields.has(seed)) return seededFields.get(seed);
    const random = randomSource(seed);
    const phase = Array.from({ length: 9 }, () => random() * TAU);
    const noise = new Float32Array(NOISE_SIZE * NOISE_SIZE);
    for (let i = 0; i < noise.length; i += 1) noise[i] = random();
    const warp = new Float32Array(ANGLES);
    const widths = new Float32Array(ANGLES);
    const pleats = new Float32Array(ANGLES);
    const feathers = new Float32Array(ANGLES);
    const offsets = Array.from({ length: 4 }, () => new Float32Array(ANGLES));
    for (let i = 0; i < ANGLES; i += 1) {
      const a = i / ANGLES * TAU - Math.PI;
      warp[i] = Math.sin(a * 3 + phase[0]) * 0.058 + Math.sin(a * 7 + phase[1]) * 0.027 + Math.sin(a * 17 + phase[2]) * 0.013;
      widths[i] = 0.86 + Math.sin(a * 5 + phase[3]) * 0.16 + Math.sin(a * 13 + phase[4]) * 0.10;
      const pleat = Math.abs(Math.sin(a * 21 + Math.sin(a * 5 + phase[2]) * 1.8 + phase[5]));
      pleats[i] = Math.pow(pleat, 18) * (0.6 + 0.4 * Math.sin(a * 4 + phase[4]) ** 2);
      feathers[i] = Math.sin(a * 67 + Math.sin(a * 9 + phase[1]) * 2.4 + phase[6]) * 0.5;
      for (let ring = 0; ring < 4; ring += 1) {
        offsets[ring][i] = Math.sin(a * (6 + ring * 2) + phase[ring + 2]) * 0.025 + Math.sin(a * (19 + ring * 3) + phase[ring + 4]) * 0.010 + Math.sin(a * (43 + ring * 7) + phase[ring + 1]) * 0.005;
      }
    }
    const field = { noise, phase, warp, widths, pleats, feathers, offsets };
    if (seededFields.size >= 5) seededFields.delete(seededFields.keys().next().value);
    seededFields.set(seed, field);
    return field;
  }

  function noiseAt(field, x, y) {
    const sx = modulo(x, NOISE_SIZE);
    const sy = modulo(y, NOISE_SIZE);
    const ix = Math.floor(sx), iy = Math.floor(sy);
    const tx = sx - ix, ty = sy - iy;
    const fx = tx * tx * (3 - 2 * tx), fy = ty * ty * (3 - 2 * ty);
    const right = (ix + 1) % NOISE_SIZE, bottom = (iy + 1) % NOISE_SIZE;
    const a = field.noise[iy * NOISE_SIZE + ix];
    const b = field.noise[iy * NOISE_SIZE + right];
    const c = field.noise[bottom * NOISE_SIZE + ix];
    const d = field.noise[bottom * NOISE_SIZE + right];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  function motifPoints(motif) {
    const points = [];
    function point(x, y) { points.push({ x: x / 100, y: y / 100 }); }
    function cubic(x1, y1, x2, y2, x3, y3, steps) {
      const start = points[points.length - 1];
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps, u = 1 - t;
        point(100 * start.x * u ** 3 + 3 * x1 * u * u * t + 3 * x2 * u * t * t + x3 * t ** 3,
          100 * start.y * u ** 3 + 3 * y1 * u * u * t + 3 * y2 * u * t * t + y3 * t ** 3);
      }
    }
    if (motif === 'leaf') {
      point(29, 79);
      cubic(14, 45, 43, 17, 76, 19, 64);
      cubic(83, 53, 61, 82, 29, 79, 64);
      // The contour closes at its stem, then a gently curved central vein.
      cubic(43, 59, 59, 38, 76, 19, 52);
    } else if (motif === 'butterfly') {
      point(50, 42);
      cubic(36, 13, 10, 17, 22, 48, 44);
      cubic(7, 59, 24, 87, 45, 65, 44);
      cubic(47, 69, 49, 79, 50, 79, 16);
      cubic(51, 79, 53, 69, 55, 65, 16);
      cubic(76, 87, 93, 59, 78, 48, 44);
      cubic(90, 17, 64, 13, 50, 42, 44);
      point(50, 70);
    } else {
      // A five-petal contour, followed by its connected centre ring. The very
      // same rounded polyline is returned as SVG and used for dye resistance.
      for (let i = 0; i <= 240; i += 1) {
        const a = -Math.PI / 2 + i / 240 * TAU;
        const radius = 22 + 8 * Math.cos(5 * (a + Math.PI / 2));
        point(50 + Math.cos(a) * radius, 49 + Math.sin(a) * radius);
      }
      point(50, 42);
      for (let i = 0; i <= 64; i += 1) {
        const a = -Math.PI / 2 + i / 64 * TAU;
        point(50 + Math.cos(a) * 7, 49 + Math.sin(a) * 7);
      }
    }
    // Round once so the SVG and the distance field use identical geometry.
    return points.map(p => ({ x: Math.round(p.x * 100000) / 100000, y: Math.round(p.y * 100000) / 100000 }));
  }

  function stitchPath(motif) {
    return motifPoints(motif).map((p, i) => `${i ? 'L' : 'M'}${+(p.x * 100).toFixed(3)} ${+(p.y * 100).toFixed(3)}`).join(' ');
  }

  function makeStitchField(motif) {
    if (stitchFields.has(motif)) return stitchFields.get(motif);
    const points = motifPoints(motif);
    const distance = new Float32Array(FIELD_SIZE * FIELD_SIZE).fill(1);
    const along = new Float32Array(FIELD_SIZE * FIELD_SIZE);
    const scale = FIELD_SIZE - 1;
    let traveled = 0;
    for (let i = 1; i < points.length; i += 1) {
      const a = points[i - 1], b = points[i];
      const vx = b.x - a.x, vy = b.y - a.y;
      const length2 = vx * vx + vy * vy;
      if (length2 < 1e-12) continue;
      const length = Math.sqrt(length2);
      const margin = 0.105;
      const x0 = clamp(Math.floor((Math.min(a.x, b.x) - margin) * scale), 0, scale);
      const x1 = clamp(Math.ceil((Math.max(a.x, b.x) + margin) * scale), 0, scale);
      const y0 = clamp(Math.floor((Math.min(a.y, b.y) - margin) * scale), 0, scale);
      const y1 = clamp(Math.ceil((Math.max(a.y, b.y) + margin) * scale), 0, scale);
      for (let row = y0; row <= y1; row += 1) {
        const y = row / scale;
        for (let col = x0; col <= x1; col += 1) {
          const x = col / scale;
          const t = clamp(((x - a.x) * vx + (y - a.y) * vy) / length2, 0, 1);
          const dx = x - (a.x + vx * t), dy = y - (a.y + vy * t);
          const d = dx * dx + dy * dy;
          const offset = row * FIELD_SIZE + col;
          if (d < distance[offset]) {
            distance[offset] = d;
            along[offset] = traveled + t * length;
          }
        }
      }
      traveled += length;
    }
    for (let i = 0; i < distance.length; i += 1) distance[i] = Math.sqrt(distance[i]);
    const field = { distance, along };
    stitchFields.set(motif, field);
    return field;
  }

  function fieldAt(values, x, y) {
    const sx = clamp(x, 0, 1) * (FIELD_SIZE - 1), sy = clamp(y, 0, 1) * (FIELD_SIZE - 1);
    const ix = Math.floor(sx), iy = Math.floor(sy);
    const fx = sx - ix, fy = sy - iy;
    const right = Math.min(ix + 1, FIELD_SIZE - 1), bottom = Math.min(iy + 1, FIELD_SIZE - 1);
    const a = values[iy * FIELD_SIZE + ix], b = values[iy * FIELD_SIZE + right];
    const c = values[bottom * FIELD_SIZE + ix], d = values[bottom * FIELD_SIZE + right];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  function compile(input) {
    const p = normalize(input);
    const binding = (p.tightness - 0.15) / 0.8;
    return {
      p, field: makeField(p.seed),
      layers: (p.layers || []).map(layer => compile({ ...layer, seed: p.seed, tightness: p.tightness, dips: p.dips })),
      stitch: p.technique === 'stitch' ? makeStitchField(p.motif) : null,
      cos: Math.cos(p.angle / 180 * Math.PI), sin: Math.sin(p.angle / 180 * Math.PI),
      binding, edgeWidth: 0.028 + binding * 0.095,
      // Loose ties admit dye into the pale fringe; tight ties keep a wider,
      // cleaner white band. This changes resistance, not overall exposure.
      penetrationPower: 3 - binding * 2.35,
      dye: [[103, 146, 178], [43, 88, 135], [17, 42, 78]][p.dips - 1]
    };
  }

  // Preparation guides share the exact unwarped layout with the dye field.
  // Local seepage and small fabric wrinkles deliberately soften this geometry.
  function preparationGeometry(input) {
    const p = normalize(input);
    if (p.technique === 'stripe') {
      const angle = p.angle / 180 * Math.PI;
      return {
        technique: p.technique, angle: p.angle, spacing: 1 / (p.density + 1),
        // Lines satisfy -sin(angle)*x + cos(angle)*y = offset + k*spacing.
        // 0 degrees is horizontal; 45 slopes down-right; 90 is vertical.
        offset: -Math.sin(angle) * p.x + Math.cos(angle) * p.y
      };
    }
    if (p.technique === 'clamp') {
      const size = 0.19 + p.radius * 0.53 + p.tightness * 0.042;
      // For diamonds halfSize is the square's half-side BEFORE rotating 45°.
      const halfSize = size / p.density / (p.shape === 'diamond' ? 0.76 * Math.SQRT2 : 1);
      const extent = halfSize * (p.shape === 'diamond' ? Math.SQRT2 : 1);
      const centers = [];
      const firstCol = Math.ceil((-extent - p.x) * p.density);
      const lastCol = Math.floor((1 + extent - p.x) * p.density);
      const firstRow = Math.ceil((-extent - p.y) * p.density);
      const lastRow = Math.floor((1 + extent - p.y) * p.density);
      for (let row = firstRow; row <= lastRow; row += 1) {
        for (let col = firstCol; col <= lastCol; col += 1) centers.push({ x: p.x + col / p.density, y: p.y + row / p.density });
      }
      return { technique: p.technique, centers, halfSize, shape: p.shape };
    }
    if (p.technique === 'snowflake') return { technique: p.technique, center: { x: p.x, y: p.y }, outlineRadius: p.radius * 1.5 };
    return { technique: p.technique };
  }

  function ringResistance(dx, dy, radius, state, index) {
    const p = state.p, f = state.field;
    const r = Math.sqrt(dx * dx + dy * dy) / radius;
    if (r > 1.55) return 0;
    const angle = Math.min(ANGLES - 1, Math.floor((Math.atan2(dy, dx) + Math.PI) / TAU * ANGLES));
    const a = (angle + index * 277) % ANGLES;
    const uneven = noiseAt(f, (dx / radius + 2) * 13 + index * 7, (dy / radius + 2) * 13 + 5) - 0.5;
    const fine = noiseAt(f, (dx / radius + 2) * 43 + 17, (dy / radius + 2) * 43 + 29) - 0.5;
    const q = r * (1 + f.warp[a]) + uneven * 0.047 + fine * 0.030 + f.feathers[a] * 0.013;
    const width = state.edgeWidth * f.widths[a];
    let resist = 1 - smooth(0.055 + state.binding * 0.10, 0.13 + state.binding * 0.10, q);
    for (let ring = 0; ring < 4; ring += 1) {
      const middle = 0.30 + ring * 0.245 + f.offsets[ring][a] + uneven * ring * 0.014;
      const separation = Math.abs(q - middle);
      const w = width * (1 - ring * 0.075);
      const ridge = 1 - smooth(w * (0.25 + state.binding * 0.59), w, separation);
      const seep = (1 - smooth(w, w + 0.14 - state.binding * 0.09 + uneven * 0.03, separation)) * 0.16;
      resist = Math.max(resist, (ridge * 0.91 + seep) * (0.99 - ring * 0.045) * (0.97 + uneven * 0.06 + fine * 0.025));
    }
    const reach = smooth(0.13, 0.34, q) * (1 - smooth(0.98, 1.43, q));
    resist += f.pleats[a] * reach * (0.11 + p.tightness * 0.18) * (1 - resist * 0.55);
    return clamp(resist * (0.87 + p.tightness * 0.13), 0, 0.997);
  }

  function resistance(x, y, state) {
    const p = state.p, f = state.field, t = p.tightness, binding = state.binding;
    const coarse = noiseAt(f, x * 15 + 3, y * 15 + 11) - 0.5;
    const fine = noiseAt(f, x * 120 + 7, y * 120 + 29) - 0.5;
    if (p.technique === 'circle') {
      let result = 0;
      for (let i = 0; i < p.points.length; i += 1) {
        const point = p.points[i];
        const value = ringResistance(x - point.x, y - point.y, p.radius * (0.94 + (i % 3) * 0.06), state, i);
        result = Math.max(result, value);
      }
      return result;
    }
    if (p.technique === 'stripe') {
      const u = -(x - p.x) * state.sin + (y - p.y) * state.cos;
      const v = (x - p.x) * state.cos + (y - p.y) * state.sin;
      const waviness = (noiseAt(f, v * 8 + 19, u * 3 + 2) - 0.5) * 0.045 + coarse * 0.008;
      const period = 1 / (p.density + 1);
      const phase = modulo((u + waviness) / period + 0.5, 1) - 0.5;
      const w = (0.018 + binding * 0.13) * (p.radius / 0.17);
      const feather = fine * 0.022 + (noiseAt(f, v * 115 + 6, u * 9 + 31) - 0.5) * 0.025;
      const primary = Math.abs(phase + feather);
      const twin = Math.abs(Math.abs(phase + feather * 0.8) - 0.20);
      const main = 1 - smooth(w * (0.20 + binding * 0.55), w + 0.06 - binding * 0.04, primary);
      const thread = (1 - smooth(w * 0.18, w * 0.64 + 0.015, twin)) * 0.78;
      const halo = (1 - smooth(w, w + 0.13, primary)) * 0.18;
      return clamp((Math.max(main, thread) + halo) * (0.75 + t * 0.25), 0, 0.98);
    }
    if (p.technique === 'snowflake') {
      const dx = x - p.x, dy = y - p.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > p.radius * 2.1) return 0;
      const a = Math.atan2(dy, dx) + Math.PI / 2;
      // Folded angular lobes repeat exactly; dye seepage varies within them.
      const lobe = 1.12 + 0.38 * Math.cos(a * p.petals);
      const q = r / (p.radius * lobe) + coarse * 0.035 + fine * 0.022;
      const angle = Math.min(ANGLES - 1, Math.floor(modulo(a + Math.PI, TAU) / TAU * ANGLES));
      const w = 0.016 + binding * 0.095;
      let result = 1 - smooth(0.10, 0.17 + t * 0.03, q);
      for (let ring = 0; ring < 4; ring += 1) {
        const center = 0.30 + ring * 0.245 + f.offsets[ring][angle] * 0.32;
        const d = Math.abs(q - center);
        const ridge = 1 - smooth(w * 0.3, w, d);
        const halo = (1 - smooth(w, w + 0.065, d)) * 0.20;
        result = Math.max(result, (ridge + halo) * (0.95 - ring * 0.045));
      }
      const seam = Math.pow(Math.abs(Math.cos(a * p.petals / 2)), 48);
      const seamReach = smooth(0.08, 0.20, q) * (1 - smooth(0.98, 1.20, q));
      const lace = f.pleats[angle] * (1 - smooth(0.87, 1.18, q)) * smooth(0.17, 0.35, q);
      result = Math.max(result, seam * seamReach * (0.45 + t * 0.35));
      result += lace * 0.13 * (1 - result);
      return clamp(result * (0.85 + t * 0.15), 0, 0.99);
    }
    if (p.technique === 'clamp') {
      const warpX = (noiseAt(f, x * 5 + 2, y * 9 + 8) - 0.5) * 0.012;
      const warpY = (noiseAt(f, x * 9 + 22, y * 5 + 28) - 0.5) * 0.012;
      const u = Math.abs(modulo((x - p.x + warpX) * p.density + 0.5, 1) - 0.5);
      const v = Math.abs(modulo((y - p.y + warpY) * p.density + 0.5, 1) - 0.5);
      let d;
      if (p.shape === 'square') d = Math.max(u, v);
      else if (p.shape === 'circle') d = Math.sqrt(u * u + v * v);
      else d = (u + v) * 0.76;
      const size = 0.19 + p.radius * 0.53 + t * 0.042;
      const edge = 0.075 - binding * 0.062;
      const warped = d + fine * 0.018 + coarse * 0.016;
      const plate = 1 - smooth(size - edge, size + edge, warped);
      const halo = (1 - smooth(size + edge, size + edge + 0.055, warped)) * 0.12;
      const stains = (noiseAt(f, x * 47 + 13, y * 47 + 3) - 0.5) * 0.045;
      return clamp((plate * (0.86 + t * 0.13 + stains) + halo) * (0.89 + t * 0.11), 0, 0.995);
    }
    if (p.technique === 'stitch') {
      const d = fieldAt(state.stitch.distance, x, y);
      if (d > 0.105) return 0;
      const along = fieldAt(state.stitch.along, x, y);
      const pull = Math.sin(along * TAU * 71 + f.phase[0]);
      const pinched = 0.76 + 0.24 * pull * pull;
      const w = (0.003 + p.radius * 0.035 + binding * 0.020) * pinched;
      const edge = d + coarse * 0.0025 + fine * 0.003;
      const core = 1 - smooth(w * (0.15 + t * 0.35), w * 1.13, edge);
      const halo = (1 - smooth(w * 0.8, w * 2.6, edge)) * 0.25;
      const sideRidge = (1 - smooth(w * 0.11, w * 0.60, Math.abs(edge - w * 2.1))) * 0.19;
      const feather = Math.pow(Math.abs(pull), 10) * (1 - smooth(w, w * 3.6, edge)) * 0.16;
      return clamp((core * 0.91 + halo + sideRidge + feather) * (0.73 + t * 0.27), 0, 0.993);
    }
    // Crumpled clouds: warp and rotate the noise domain so the folds have no
    // visible square grid. Fine wrinkles interrupt the broad dye boundaries.
    const u = x * 0.83 + y * 0.56 + (noiseAt(f, x * 4 + 19, y * 4 + 53) - 0.5) * 0.22;
    const v = -x * 0.56 + y * 0.83 + (noiseAt(f, x * 4 + 41, y * 4 + 7) - 0.5) * 0.22;
    const n1 = noiseAt(f, u * (p.density * 0.78) + 31, v * (p.density * 0.78) + 19);
    const n2 = noiseAt(f, u * p.density * 2.7 + 8, v * p.density * 2.7 + 27);
    const n3 = noiseAt(f, u * p.density * 7.7 + 63, v * p.density * 7.7 + 43);
    let gathered = 0;
    for (const point of p.points) {
      const dx = x - point.x, dy = y - point.y;
      const r = Math.sqrt(dx * dx + dy * dy) / (p.radius * 1.6);
      gathered = Math.max(gathered, (1 - smooth(0.20, 1.6, r)) * 0.23);
    }
    const billow = n1 * 0.52 + n2 * 0.30 + n3 * 0.18 + gathered;
    const threshold = 0.65 - t * 0.13;
    const cloud = smooth(threshold - 0.13, threshold + 0.17, billow + fine * 0.05);
    const creaseDistance = Math.abs(n2 - 0.5 + (n1 - 0.5) * 0.4 + (n3 - 0.5) * 0.20 + fine * 0.10);
    const crease = (1 - smooth(0.006 + t * 0.006, 0.036 + t * 0.018, creaseDistance)) * (0.10 + n3 * 0.16);
    return clamp((cloud * (0.65 + t * 0.24) + crease * (1 - cloud * 0.70)) * (0.76 + t * 0.24), 0, 0.97);
  }

  function shade(x, y, state, dyed, output, offset) {
    const p = state.p, field = state.field;
    const fiber = weave[Math.min(4095, Math.floor(x * 4096))] + weave[Math.min(4095, Math.floor(y * 4096))] * 0.78;
    const grain = noiseAt(field, x * 86 + 7, y * 86 + 11) - 0.5;
    const cloth = fiber * 1.1 + grain * 2.8;
    const paperR = 245 + cloth, paperG = 242 + cloth, paperB = 230 + cloth;
    let red = paperR, green = paperG, blue = paperB;
    if (dyed) {
      // Union of resist masks: every selected preparation can keep its pale marks.
      // This is a simultaneous visual interpretation, not sequential overdyeing.
      let combined = resistance(x, y, state);
      for (const layer of state.layers) combined = Math.max(combined, resistance(x, y, layer));
      const resist = Math.pow(combined, state.penetrationPower);
      const pool = noiseAt(field, x * 8 + 31, y * 8 + 19) - 0.5;
      const dyeVariation = pool * 12 + grain * 3 + fiber * 0.7;
      const dyeR = state.dye[0] + dyeVariation * 0.65;
      const dyeG = state.dye[1] + dyeVariation;
      const dyeB = state.dye[2] + dyeVariation * 1.2;
      red = dyeR + (paperR - dyeR) * resist;
      green = dyeG + (paperG - dyeG) * resist;
      blue = dyeB + (paperB - dyeB) * resist;
    }
    output[offset] = Math.round(clamp(red, 0, 255));
    output[offset + 1] = Math.round(clamp(green, 0, 255));
    output[offset + 2] = Math.round(clamp(blue, 0, 255));
  }

  function sample(x, y, input) {
    const result = [0, 0, 0];
    shade(clamp(finite(x, 0.5), 0, 1), clamp(finite(y, 0.5), 0, 1), compile(input), true, result, 0);
    return result;
  }

  function render(canvas, input, options) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('DyePatterns.render requires a canvas.');
    const settings = options && typeof options === 'object' ? options : {};
    const size = clamp(Math.round(finite(settings.size, 720)), 64, 1800);
    const dyed = settings.dyed !== false;
    const started = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas 2D rendering is unavailable.');
    const pixels = context.createImageData(size, size);
    const state = compile(input);
    for (let row = 0; row < size; row += 1) {
      const y = (row + 0.5) / size;
      for (let col = 0; col < size; col += 1) {
        const offset = (row * size + col) * 4;
        shade((col + 0.5) / size, y, state, dyed, pixels.data, offset);
        pixels.data[offset + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    const finished = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    return { durationMs: Math.round((finished - started) * 10) / 10, width: size, height: size };
  }

  const workerSource = '(' + attachDyePatterns.toString() + ')(globalThis);';
  const api = Object.freeze({ normalize, render, sample, defaults, stitchPath, preparationGeometry, workerSource });
  root.DyePatterns = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
