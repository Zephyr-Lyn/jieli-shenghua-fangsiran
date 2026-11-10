/* Plain-data history: one completed gesture is one checkpoint. No image data. */
(function (root) {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const editContent = value => ({ params: value.params, stitch: value.stitch, phase: value.phase,
    drafts: value.drafts.map(([key, saved]) => [key, { params: saved.params, stitch: saved.stitch }]), layerCache: value.layerCache, reference: value.reference });
  class Journal {
    constructor(current, past = [], future = []) {
      this.current = copy(current);
      this.past = copy(past.slice(-100));
      this.future = copy(future.slice(-100));
    }
    record(next) {
      if (same(editContent(this.current), editContent(next))) {
        this.current = copy(next); // Preserve focus context without making a false edit.
        return false;
      }
      this.past.push(this.current);
      if (this.past.length > 100) this.past.shift();
      this.current = copy(next); this.future = [];
      return true;
    }
    undo() {
      if (!this.past.length) return null;
      this.future.push(this.current); this.current = this.past.pop();
      return copy(this.current);
    }
    redo() {
      if (!this.future.length) return null;
      this.past.push(this.current); this.current = this.future.pop();
      return copy(this.current);
    }
  }
  function readDocument(text, normalize) {
    if (typeof text !== 'string' || text.length > 2500000) throw new Error('草稿文件过大。');
    const input = JSON.parse(text);
    if (input?.version !== 1) throw new Error('不支持这个草稿版本。');
    const methods = ['circle', 'stripe', 'snowflake', 'clamp', 'stitch', 'cloud'];
    function params(value) {
      if (!value || !methods.includes(value.technique) ||
        !['radius', 'tightness', 'dips', 'seed', 'x', 'y', 'density'].every(key => Number.isFinite(value[key])) ||
        !Array.isArray(value.points) || value.points.length < 1 || value.points.length > 6 ||
        !value.points.every(p => p && Number.isFinite(p.x) && Number.isFinite(p.y))) throw new Error('草稿参数不完整。');
      if (value.layers !== undefined) {
        if (!Array.isArray(value.layers) || value.layers.length > 2) throw new Error('组合最多三种染法。');
        const seen = new Set([value.technique]);
        for (const layer of value.layers) {
          if (!layer || layer.layers !== undefined || seen.has(layer.technique)) throw new Error('组合染法重复或嵌套。');
          params(layer); seen.add(layer.technique);
        }
      }
      if (value.stitchProgress !== undefined && (!Number.isFinite(value.stitchProgress) || value.stitchProgress < 0 || value.stitchProgress > 1)) throw new Error('缝合进度无效。');
      return normalize(value);
    }
    function editor(value) {
      if (!value || !Number.isFinite(value.stitch) || !Number.isInteger(value.selected)) throw new Error('草稿状态不完整。');
      const p = params(value.params);
      return { params: p, stitch: Math.max(0, Math.min(1, value.stitch)), selected: Math.max(0, Math.min(layerFor(p,value.editing).points.length - 1, value.selected)) };
    }
    function snapshot(value) {
      const result = editor(value);
      if (!['tie', 'dye', 'unfold'].includes(value.phase)) throw new Error('草稿制作阶段无效。');
      result.phase = value.phase; result.guides = Boolean(value.guides);
      if (!Array.isArray(value.drafts) || value.drafts.length > 6) throw new Error('染法草稿无效。');
      result.drafts = value.drafts.map(entry => {
        if (!Array.isArray(entry) || !methods.includes(entry[0])) throw new Error('染法草稿无效。');
        const saved = editor(entry[1]);
        if (saved.params.technique !== entry[0]) throw new Error('染法草稿不匹配。');
        return [entry[0], saved];
      });
      result.reference = null;
      if(value.layerCache!==undefined){
        if(!Array.isArray(value.layerCache)||value.layerCache.length>6)throw new Error('染法参数暂存无效。');
        const seen=new Set();
        const cache=value.layerCache.map(entry=>{
          if(!Array.isArray(entry)||!methods.includes(entry[0])||seen.has(entry[0]))throw new Error('染法参数暂存重复或无效。');
          seen.add(entry[0]);const saved=editor(entry[1]);
          if(saved.params.technique!==entry[0]||saved.params.layers)throw new Error('染法暂存必须是对应的单项参数。');
          return [entry[0],saved];
        });
        if(cache.length)result.layerCache=cache;
      }
      if (value.editing !== undefined) {
        if (![result.params.technique,...(result.params.layers||[]).map(layer=>layer.technique)].includes(value.editing)) throw new Error('正在编辑的染法不在组合中。');
        result.editing = value.editing;
      }
      if (value.reference) {
        const reference = value.reference;
        if (!['all', 'tightness', 'dips', 'radius'].includes(reference.key)) throw new Error('对比参数无效。');
        result.reference = { key: reference.key, params: params(reference.params) };
        if(reference.target!==undefined){
          if(reference.key!=='radius'||![result.params.technique,...(result.params.layers||[]).map(layer=>layer.technique)].includes(reference.target))throw new Error('对比染法无效。');
          result.reference.target=reference.target;
        }
        // An imported comparison must obey the same one-variable constraint.
        const expected = copy(result.reference.params);
        if(reference.target)layerFor(expected,reference.target).radius=layerFor(result.params,reference.target).radius;
        else expected[reference.key] = result.params[reference.key];
        if (reference.key !== 'all' && !same(expected, result.params)) throw new Error('对比草稿改变了多个参数。');
      }
      return result;
    }
    for (const key of ['past', 'future']) {
      if (input[key] !== undefined && (!Array.isArray(input[key]) || input[key].length > 100)) throw new Error('历史记录无效。');
    }
    return { current: snapshot(input.current), past: (input.past || []).map(snapshot), future: (input.future || []).map(snapshot) };
  }
  function tutorialStep(state, defaults) {
    if (state.phase === 'unfold') return 4;
    if (['dye', 'dyeing', 'unfolding'].includes(state.phase)) return 3;
    if (state.params.tightness !== defaults.tightness) return 2;
    const layout = ['points', 'x', 'y', 'radius', 'density', 'angle', 'petals', 'shape', 'motif'];
    return state.stitch > 0 || layout.some(key => !same(state.params[key], defaults[key])) ? 1 : 0;
  }
  function layerFor(params, type) { return [params,...(params.layers||[])].find(layer=>layer.technique===type)||params; }
  function pendingStitch(params, progress) {
    if(params.technique==='stitch'&&progress<.995)return true;
    return (params.layers||[]).some(layer=>layer.technique==='stitch'&&(layer.stitchProgress??1)<.995);
  }
  function rememberLayers(params,progress){
    return [params,...(params.layers||[])].map(layer=>{
      const saved=copy(layer);delete saved.layers;delete saved.stitchProgress;
      Object.assign(saved,{seed:params.seed,tightness:params.tightness,dips:params.dips});
      return [layer.technique,{params:saved,stitch:layer.technique==='stitch'?(layer===params?progress:(layer.stitchProgress??1)):0,selected:0}];
    });
  }
  function reroll(snapshot){const next=copy(snapshot);next.params.seed=(next.params.seed+997)>>>0;next.reference=null;return next;}
  function toggleTechnique(params, stitch, type, candidate) {
    const current=copy(params), layers=current.layers||[], selected=[current.technique,...layers.map(p=>p.technique)];
    if(selected.includes(type)){
      if(selected.length===1)throw new Error('至少保留一种染法。');
      if(type===current.technique){
        const next=layers.shift(), progress=next.technique==='stitch'?(next.stitchProgress??1):0;
        delete next.stitchProgress;delete next.layers;
        return {params:{...next,seed:current.seed,tightness:current.tightness,dips:current.dips,layers},stitch:progress};
      }
      current.layers=layers.filter(p=>p.technique!==type);return {params:current,stitch};
    }
    if(selected.length>=3)throw new Error('最多选择三种染法，请先取消一种。');
    if(!candidate||candidate.technique!==type)throw new Error('染法参数无效。');
    current.layers=[...layers,copy(candidate)];return {params:current,stitch};
  }
  const api = { toggleTechnique, Journal, readDocument, same, tutorialStep, layerFor, pendingStitch, rememberLayers, reroll };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DyeExperience = api;
})(globalThis);
