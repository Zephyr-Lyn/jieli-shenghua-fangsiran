/* Six tactile preparations. Artwork is generated off the animation thread. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const modes = {
    circle: { name: '圆花', craft: '多点捆扎', title: '把花，放在喜欢的地方。', description: '捏起布料，用线扎紧。每一处线结，都会留下自己的圆花。', hint: '点击空白处添一个结，拖动线结调整位置', radius: '圆花大小', position: '选中线结的位置', ready: '收好线结，浸入靛蓝', fold: [.72,.72], result: '每一朵，都由你安放。', observation: '每一朵花，都有自己的位置。', note: '试着让几个线结靠近，再展开看看留白怎样相遇。', source: 'https://www.boisestate.edu/library-makerlab/wp-content/uploads/sites/506/2021/08/Sunburst-Tie-Dye-with-Accessibility-Tags.pdf', credit: '工艺图解：Boise State University · 多点捆扎', craftNote: '在布上捏起多处，再分别捆扎，就能形成散布的放射圆纹。扎点的位置与大小，决定纹样的布局。' },
    stripe: { name: '条纹', craft: '风琴折扎', title: '一折一叠，留下线的节奏。', description: '将布料一正一反收成褶，换一个方向，条纹也跟着转向。', hint: '选择方向和密度，在布上拖动，调整条纹位置', radius: '条带宽度', position: '条纹的位置', ready: '收拢褶皱，浸入靛蓝', fold: [.26,1], result: '一折一叠，成了流动的线。', observation: '整齐之中，也会有手作的起伏。', note: '改变折叠密度，看看细密条纹与宽阔留白带来的不同节奏。', source: 'https://www.wxmuseum.cn/News/Details/c95f96a5-d50d-4acd-9279-b5d5b5b43580', credit: '工艺资料：无锡博物院 · 扎染纹样', craftNote: '一正一反的风琴折，可以形成连续纹样。折叠与捆扎共同控制线条走向，扎紧处保留浅色。' },
    snowflake: { name: '雪花', craft: '对称折扎', title: '把一角，折成一整朵花。', description: '沿花心对称折叠，再扎住一段。展开以后，相应的折面一起显出花纹。', hint: '拖动花心，选择四瓣、六瓣或八瓣的对称组合', radius: '花纹大小', position: '花心的位置', ready: '折好扎紧，浸入靛蓝', fold: [.6,.6], result: '藏在折角里的花，展开了。', observation: '一次折叠，让花纹相互呼应。', note: '试试不同的对称数量，观察花瓣的疏密。花心偏向一侧，也能形成新的构图。', source: 'https://www.wxmuseum.cn/News/Details/c95f96a5-d50d-4acd-9279-b5d5b5b43580', credit: '工艺资料：无锡博物院 · 对称纹样', craftNote: '布料对折或沿对角线折叠，再配合扎结，可以形成对称纹样。这里用可调的放射对称，演绎折扎后的雪花效果。' },
    clamp: { name: '夹扎', craft: '几何留白', title: '夹住的地方，替你留白。', description: '将布折叠，用成对的小夹板压紧。换一块夹板，就换一种几何节奏。', hint: '换一种夹板形状，拖动中间的夹板调整布局', radius: '夹板大小', position: '夹板布局的位置', ready: '夹紧布料，浸入靛蓝', fold: [.45,.45], result: '小小夹板，留下整幅秩序。', observation: '夹板的边缘，也有柔软的色晕。', note: '方、菱、圆会留下不同的几何纹样。密度越高，重复排列越细密。', source: 'https://www.chinasilkmuseum.com/bwgf/info_309.aspx?itemid=28506', credit: '工艺图解：中国丝绸博物馆 · 夹扎', craftNote: '在有规律折叠的基础上，用两块同形夹板固定布料，可以形成重复的几何色块。这次体验参考夹扎工坊的形状防染方法。' },
    stitch: { name: '缝花', craft: '针缝抽紧', title: '沿着轮廓，把花缝进布里。', description: '拖着针尖沿线走，或让针替你缝一圈。穿好线，再调整松紧，把轮廓收住。', hint: '拖动针尖沿着虚线走，或点击“沿着轮廓缝一圈”', radius: '缝线留白宽度', position: '', ready: '抽紧缝线，浸入靛蓝', fold: [.72,.66], result: '一针一线，留下一朵花。', observation: '针走过的路，会留在布上。', note: '团花、叶片与蝴蝶，都沿着同一条缝线生成。收线越紧，轮廓留白越明显。', source: 'https://www.wxmuseum.cn/News/Details/c95f96a5-d50d-4acd-9279-b5d5b5b43580', credit: '工艺资料：无锡博物院 · 平缝串针', craftNote: '平缝串针沿图案轮廓走线，再抽紧防染。真实工艺中，针距与收线松紧共同影响轮廓，这里提供三种缝扎轮廓的视觉演绎。' },
    cloud: { name: '云雾', craft: '抓皱成纹', title: '把布轻轻聚拢，留住一片云。', description: '把几处布料抓成褶团，松松紧紧的皱褶，会让颜色深浅交错。', hint: '点一下添一处褶团，拖动它，让云纹聚散', radius: '聚拢范围', position: '选中褶团的位置', ready: '扎住褶团，浸入靛蓝', fold: [.66,.62], result: '这片云，只在这一次展开。', observation: '不规则的褶皱，也有自己的秩序。', note: '挪动褶团、改变密度，看看浅色如何聚散。相同的调整会得到相同的纹样。', source: 'https://www.boisestate.edu/library-makerlab/wp-content/uploads/sites/506/2021/08/Crumple-Tie-Dye-with-Accessibility-Tags.pdf', credit: '工艺图解：Boise State University · 抓皱染', craftNote: '将布料抓皱成团后固定，再染色。松紧不同的褶皱让染液进入的程度不同，产生不规则的纹理。' }
  };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fabric = $('fabric'), cloth = $('cloth'), stage = $('cloth-stage'), guide = $('preparation-guide');
  const primary = $('primary-action'), handles = $('handles');
  const drafts = new Map(), layerCache = new Map();
  const rendering = DyeRenderService.create(DyePatterns);
  const { render, draw, dispose } = rendering;
  let white = null, stitchFrame = 0, stitchSamples = [];
  let prepared = null, motionFrame = 0;
  const qa = new URLSearchParams(location.search).has('qa');
  const state = { params: null, phase: 'tie', selected: 0, stitch: 0, sewing: false, guides: false, pointer: null, revision: 0 };
  const clone = object => JSON.parse(JSON.stringify(object));
  const activeParams = () => DyeExperience.layerFor(state.params,state.editing);
  const meta = () => modes[activeParams().technique];
  const compositionName = () => [state.params.technique,...(state.params.layers||[]).map(layer=>layer.technique)].map(type=>modes[type].name).join('＋');
  const manyPoints = () => ['circle','cloud'].includes(activeParams().technique);
  const getStitch = () => activeParams().technique!=='stitch'?0:activeParams()===state.params?state.stitch:(activeParams().stitchProgress??1);
  const setStitch = value => {if(activeParams()===state.params)state.stitch=value;else activeParams().stitchProgress=value;};
  const needsStitch = () => DyeExperience.pendingStitch(state.params,state.stitch);
  let posterTicket=0,posterImage=null,posterParams=null,posterOpener=null;
  function redrawPoster(){
    if(posterImage&&posterParams)DyeArtwork.poster($('poster-canvas'),posterImage,posterParams,$('poster-name').value);
  }
  async function openPoster(){
    if(state.phase!=='unfold'||$('poster-dialog').open)return;
    const ticket=++posterTicket;posterParams=clone(state.params);posterOpener=document.activeElement;
    $('poster-save').disabled=true;$('poster-name').value='';$('poster-canvas').hidden=true;
    $('poster-status').textContent='正在用这块布生成海报…';$('poster-dialog').showModal();$('poster-name').focus();
    try{
      const result=await render(posterParams,1200);
      if(ticket!==posterTicket||!$('poster-dialog').open){dispose(result);return;}
      posterImage=document.createElement('canvas');draw(posterImage,result);dispose(result);redrawPoster();
      $('poster-canvas').hidden=false;$('poster-save').disabled=false;
      $('poster-status').textContent='海报已准备好，可选填名称；修改名称不会改变作品或撤销历史。';
    }catch(_){if(ticket===posterTicket)$('poster-status').textContent='海报生成未完成，请关闭后重试；原布纹仍可保存。';}
  }
  async function savePoster(){
    if(!posterImage||$('poster-save').disabled)return;
    const ticket=posterTicket,name=DyeArtwork.recipe(posterParams).title,seed=posterParams.seed;
    const button=$('poster-save');button.disabled=true;button.textContent='正在保存…';
    try{
      const blob=await new Promise(resolve=>$('poster-canvas').toBlob(resolve,'image/png'));
      if(!blob)throw new Error('empty poster');
      if(ticket!==posterTicket||!$('poster-dialog').open)return;
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;
      link.download='结里生花-作品海报-'+name+'-'+seed+'.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
      $('poster-status').textContent='已生成1600 × 2200像素的作品海报。';
    }catch(_){if(ticket===posterTicket)$('poster-status').textContent='图片未能保存，请再试一次；作品仍保留。';}
    finally{if(ticket===posterTicket){button.disabled=false;button.textContent='保存海报 PNG';}}
  }
  let viewerTicket=0,viewerZoom=1,viewerOpener=null;
  function viewerLayout() {
    const viewport=$('artwork-viewport');
    viewport.style.setProperty('--viewer-base',Math.max(1,Math.min(viewport.clientWidth,viewport.clientHeight))+'px');
    viewport.style.setProperty('--viewer-zoom',viewerZoom);
    $('viewer-scale').textContent=Math.round(viewerZoom*100)+'%';
    $('viewer-less').disabled=viewerZoom<=1;$('viewer-more').disabled=viewerZoom>=3;
  }
  function zoomViewer(delta) {viewerZoom=Math.max(1,Math.min(3,viewerZoom+delta));viewerLayout();}
  async function openViewer() {
    if(state.phase!=='unfold'||$('artwork-viewer').open)return;
    const params=clone(state.params),ticket=++viewerTicket,canvas=$('viewer-canvas');
    viewerOpener=document.activeElement;viewerZoom=1;
    canvas.width=canvas.height=1200;canvas.getContext('2d').drawImage(fabric,0,0,1200,1200);
    $('viewer-title').textContent=compositionName()+' · 成品细节';
    $('viewer-status').textContent='正在生成1200像素细节…';
    $('artwork-viewer').showModal();viewerLayout();$('artwork-viewport').scrollTo(0,0);
    try{const result=await render(params,1200);if(ticket===viewerTicket&&$('artwork-viewer').open){draw(canvas,result);$('viewer-status').textContent='1200 × 1200像素，可放大至300%查看纹理。';}dispose(result);}
    catch(_){if(ticket===viewerTicket)$('viewer-status').textContent='细节图暂未生成，当前仍可查看成品预览；关闭后可重试。';}
  }
  const announce = message => { $('live-summary').textContent = message; };
  const dyeDepthNames = ['浅靛', '中靛', '深靛'];
  const bindingName = value => value < .25 ? '很松' : value < .45 ? '偏松' : value < .65 ? '适中' : value < .85 ? '偏紧' : '很紧';
  const storageKey = 'dye-experience-draft-v1', tourKey = 'dye-experience-tour-v1';
  let journal = null, reference = null, restoring = false, importing = false;
  let dirty = false;
  let sampleTimer = 0, sampleRevision = 0, comparisonRevision = 0, saveTimer = 0;
  let tourVisible = false;
  const stablePhase = () => ['tie','dye','unfold'].includes(state.phase);
  const locked = key => Boolean(reference && reference.key !== key);
  function snapshot() {
    return { params: clone(state.params), stitch: state.stitch, selected: state.selected, phase: state.phase,
      guides: state.guides, drafts: clone([...drafts]), reference: clone(reference), ...(state.editing?{editing:state.editing}:{}), ...(layerCache.size?{layerCache:clone([...layerCache])}:{}) };
  }
  function draftMessage(message, error = false) {
    $('draft-status').textContent = message; $('draft-status').dataset.error = String(error);
    const menu = document.querySelector('.draft-menu');
    menu.dataset.error = String(error);
    menu.querySelector('summary').textContent = error ? '草稿有提示' : '草稿与帮助';
    if (error) announce(message);
  }
  function persist() {
    clearTimeout(saveTimer);
    if (!journal || !dirty) return;
    // Save the last stable checkpoint while a reveal or an image restore is running.
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...journal }));
      dirty = false;
      draftMessage('草稿与历史已保存在本机');
    } catch (_) { draftMessage('本机保存失败，请导出草稿备份', true); }
  }
  function historyUI() {
    if (!journal) return;
    const inFlight = !stablePhase() || state.sewing || state.pointer !== null;
    $('undo').disabled = importing || (!journal.past.length && (!inFlight || restoring));
    $('redo').disabled = importing || !journal.future.length || (inFlight && !restoring);
    $('history-status').textContent = '可撤销 ' + journal.past.length + ' 步 · 最多保留 100 步';
    $('undo').title = '撤销上一步（Ctrl / ⌘ + Z）；制作过程中可取消';
    $('redo').title = '重做（Ctrl / ⌘ + Shift + Z）';
  }
  function checkpoint() {
    if (!journal || restoring || !stablePhase() || state.sewing || state.pointer !== null) { historyUI(); return; }
    if (journal.record(snapshot())) dirty = true;
    historyUI();
    if (dirty) { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 180); }
    updateTour();
  }
  async function restoreSnapshot(saved, message) {
    cancelWork(); restoring = true; sampleRevision++; comparisonRevision++;
    state.params = clone(saved.params); state.stitch = saved.stitch; state.editing=saved.editing; state.selected = saved.selected;
    state.guides = saved.guides; reference = clone(saved.reference);
    drafts.clear(); for (const [key, value] of saved.drafts) drafts.set(key, clone(value));
    layerCache.clear();for(const [key,value] of saved.layerCache||[])layerCache.set(key,clone(value));
    const target = saved.phase;
    if (target === 'tie') { restoring = false; setPhase('tie'); blank(); }
    else {
      setPhase('previewing'); const revision = state.revision;
      try {
        const result = await render(state.params, 720);
        if (revision !== state.revision) { dispose(result); return; }
        if (target === 'dye') { prepared = result; blank(); }
        else { draw(fabric, result); dispose(result); fabric.setAttribute('aria-label', compositionName() + '扎染成品，已从历史恢复'); }
        restoring = false; setPhase(target);
      } catch (_) {
        if (revision !== state.revision) return;
        restoring = false; setPhase('tie'); blank();
        // Keep the original checkpoint available so the result can be rendered again.
        message = '花纹恢复未完成，参数已保留，可重新浸染。';
      }
    }
    announce(message); updateLocks(); historyUI(); persist(); updateTour();
    if(target==='unfold')bringClothIntoView(true);
  }
  function travel(direction) {
    if (!journal || importing) return;
    // Each click moves history immediately, even while its previous image renders.
    if (restoring) {
      const saved = journal[direction]();
      if (saved) { dirty = true; restoreSnapshot(saved, direction === 'undo' ? '已撤销上一步。' : '已重做这一步。'); }
      return;
    }
    if (!stablePhase() || state.sewing || state.pointer !== null) {
      if (direction === 'undo') restoreSnapshot(journal.current, '已取消当前制作，回到最近一次完成的操作。');
      return;
    }
    // Include an active slider edit even before its native change event fires.
    checkpoint();
    const saved = journal[direction]();
    if (saved) { dirty = true; restoreSnapshot(saved, direction === 'undo' ? '已撤销，参数和布料状态已恢复。' : '已重做这一步。'); }
  }
  function parameterLabel(params, key) {
    if(key==='radius')params=DyeExperience.layerFor(params,reference?.target);
    return key === 'tightness' ? '松紧 ' + Math.round(params.tightness * 100) + ' · ' + bindingName(params.tightness) :
      key === 'dips' ? params.dips + ' 遍 · ' + dyeDepthNames[params.dips - 1] :
      modes[params.technique].radius + ' ' + Math.round(params.radius * 100);
  }
  const comparedValue = params => reference.key==='radius'?DyeExperience.layerFor(params,reference.target).radius:params[reference.key];
  function queueSample() {
    clearTimeout(sampleTimer); const ticket = ++sampleRevision;
    $('parameter-sample').hidden = state.phase !== 'tie';
    if (state.phase !== 'tie') return;
    $('sample-status').textContent = '正在更新预计效果…';
    const params = clone(state.params);
    sampleTimer = setTimeout(async () => {
      try {
        const result = await render(params, 160);
        if (ticket === sampleRevision && state.phase === 'tie') {
          draw($('sample-canvas'), result);
          $('sample-status').textContent = bindingName(params.tightness) + ' · ' + dyeDepthNames[params.dips - 1];
        }
        dispose(result);
      } catch (_) { if (ticket === sampleRevision) $('sample-status').textContent = '小样暂不可用，仍可正常浸染。'; }
    }, 140);
  }
  async function updateComparison() {
    const ticket = ++comparisonRevision;
    $('comparison').hidden = !reference;
    $('compare-entry').hidden = state.phase !== 'unfold' || Boolean(reference);
    if (!reference) return;
    const before = clone(reference.params), after = clone(state.params), key = reference.key;
    $('compare-summary').textContent = '本次只比较：' + (key === 'tightness' ? '松紧' : key === 'dips' ? '染色深浅' : modes[DyeExperience.layerFor(after,reference.target).technique].radius) + '。线结位置与底纹保持一致。';
    $('reference-label').textContent = parameterLabel(before, key);
    $('comparison-label').textContent = parameterLabel(after, key);
    const revealed = state.phase === 'unfold';
    $('comparison-canvas').hidden = !revealed; $('compare-waiting').hidden = revealed;
    $('compare-status').textContent = revealed ? '正在准备两张花纹…' : '先调整右侧开放的参数，再浸染、展开。';
    try {
      const results = await Promise.all([render(before, 360), revealed ? render(after, 360) : Promise.resolve(null)]);
      if (ticket === comparisonRevision) {
        draw($('reference-canvas'), results[0]);
        if (results[1]) draw($('comparison-canvas'), results[1]);
        if (revealed) $('compare-status').textContent = comparedValue(before) === comparedValue(after) ? '参数还没有变化，两张花纹应当相同。回到白布，改一处再试。' : '这里只改变了' + (key === 'dips' ? '浸染遍数' : key === 'tightness' ? '松紧' : meta().radius) + '，可以对照观察留白与色晕。';
      }
      results.forEach(dispose);
    } catch (_) { if (ticket === comparisonRevision) $('compare-status').textContent = '对比图未生成，请结束对比后重试；当前布料仍保留。'; }
  }
  function updateLocks() {
    $('compare-tip').hidden = !reference;
    $('leave-comparison').hidden = !reference;
    if (reference) {
      $('compare-tip-text').textContent = '本次只调整' + (reference.key === 'dips' ? '浸染遍数' : reference.key === 'tightness' ? '松紧' : meta().radius) + '，其余条件已固定。';
      $('controls').setAttribute('aria-describedby','compare-tip');
      $('canvas-hint').textContent = state.phase === 'tie' ? '对比中：布面位置固定，请调整开放的参数' : $('canvas-hint').textContent;
      cloth.setAttribute('aria-label','对比中的布面，线结位置已固定');
      $('knot-help').textContent = '对比期间布面不可移动，结束对比后即可自由调整。';
    } else $('controls').removeAttribute('aria-describedby');
    for (const key of ['radius','tightness','density']) $(key).disabled = locked(key);
    for (const key of ['angle','petals','shape','motif']) $('method-' + key).disabled = Boolean(reference);
    $('remove-point').disabled = Boolean(reference) || activeParams().points.length <= 1;
    document.querySelectorAll('[data-dips]').forEach(button => { button.disabled = locked('dips'); });
    // Switching technique or cloth exits comparison in the same undoable action.
    document.querySelectorAll('.technique-choice').forEach(button => { button.disabled = importing; });
    $('reset').disabled = importing;
    $('restart').disabled = importing;
    document.querySelectorAll('[data-end-comparison]').forEach(button => { button.disabled = importing; });
    cloth.tabIndex = state.phase==='unfold'||(state.phase === 'tie' && manyPoints() && !reference) ? 0 : -1;
    if(state.phase==='unfold'){cloth.setAttribute('role','button');cloth.setAttribute('aria-haspopup','dialog');cloth.setAttribute('aria-label',compositionName()+'成品，点击放大查看');}
    else{cloth.removeAttribute('role');cloth.removeAttribute('aria-haspopup');}
    handles.querySelectorAll('button').forEach(button => { if (reference) button.disabled = true; });
    const extras=state.params.layers||[], selected=[state.params.technique,...extras.map(layer=>layer.technique)];
    document.querySelectorAll('[data-mix]').forEach(input=>{
      const type=input.dataset.mix, main=type===state.params.technique;
      input.checked=selected.includes(type);
      input.disabled=importing||main||(!input.checked&&selected.length>=3);
      input.nextElementSibling.textContent=modes[type].name+(main?' · 主染法':'');
    });
    $('mix-summary').textContent=extras.length?compositionName()+' · 组合':'组合染法';
    $('mix-limit').textContent=extras.length?'已选 '+selected.length+' / 3：'+compositionName()+'。可取消勾选叠加染法。':'当前为单一染法。';
    $('clear-mix').disabled=importing||!extras.length;
    $('clear-mix').textContent='仅保留'+modes[state.params.technique].name;
    document.querySelectorAll('[data-edit-layer]').forEach(button=>{
      button.hidden=!selected.includes(button.dataset.editLayer);
      button.disabled=importing;
      button.setAttribute('aria-pressed',String(button.dataset.editLayer===activeParams().technique));
    });
    $('layer-editor').hidden=!extras.length;
    $('layer-edit-status').textContent='正在编辑：'+meta().name+'。位置和专属参数只影响这一种染法。';
  }
  function updateTour() {
    $('first-dye').hidden = !tourVisible;
    if (!tourVisible) return;
    if (reference) {
      $('tour-count').textContent = '参数对比 · 一次只改一处';
      $('tour-title').textContent = state.phase === 'unfold' ? '两张布都展开了，看看哪里不同。' : '原来的那张已保留，可以放心试。';
      $('tour-text').textContent = '本次只开放' + (reference.key === 'dips' ? '浸染遍数' : reference.key === 'tightness' ? '松紧' : meta().radius) + '。调整后浸染、展开，在页面下方查看对比；结束对比即可自由编辑。';
      $('tour-skip').textContent = '收起引导'; return;
    }
    const step = DyeExperience.tutorialStep({...state,params:activeParams(),stitch:getStitch()}, DyePatterns.defaults(activeParams().technique));
    const titles = ['在布面上，留下一处痕迹。', '调一调松紧，看小样怎样变。', '准备好了，把布浸入靛蓝。', '拆开束缚，看看你的花纹。', '第一块布，完成了。'];
    const descriptions = [activeParams().technique === 'stitch' ? '沿虚线缝一针，或点击主按钮帮你缝好一圈。' : manyPoints() ? '点白布添一个结，或挪动已有标记；也可以用回车和方向键操作。' : '挪动布面上的标记，改变花纹布局；选中标记后也可以用方向键操作。', '找到松紧滑杆，试着往左或往右调。旁边的小样会显示预计效果。', '点击制作主按钮进入浸染。每一步都可以撤销，不必担心试错。', '点击“拆开束缚，展开花纹”。完成后可以保存图片，也可以只改一个参数做对比。', '你可以保存作品，或保留这一张，再比较松紧和染色深浅。'];
    $('tour-count').textContent = step === 4 ? '第一次染 · 已完成' : '第一次染 · ' + (step + 1) + ' / 4';
    $('tour-title').textContent = titles[step]; $('tour-text').textContent = descriptions[step];
    $('tour-skip').textContent = step === 4 ? '知道了' : '跳过引导';
  }
  function downloadDraft() {
    checkpoint(); persist();
    const blob = new Blob([JSON.stringify({ version: 1, current: journal.current }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = '放肆染-草稿.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000); announce('已生成当前草稿备份；导入不会清空本次撤销历史。');
  }
  async function importDraft(file) {
    if (!file || importing) return;
    try {
      if (file.size > 2500000) throw new Error('草稿文件超过 2.5 MB。');
      const loaded = DyeExperience.readDocument(await file.text(), DyePatterns.normalize);
      // Import is one reversible operation; the current session's history is retained.
      if (!stablePhase() || state.sewing || restoring) { announce('请先完成或撤销当前制作，再导入草稿。'); return; }
      checkpoint(); journal.record(loaded.current); dirty = true;
      importing = true; updateLocks(); historyUI();
      await restoreSnapshot(loaded.current, '草稿已导入；可点击撤销找回导入前的布。');
      importing = false; restoring = false; checkpoint(); updateLocks();
    } catch (error) { importing = false; draftMessage('导入失败：' + error.message + ' 原草稿仍保留。', true); updateLocks(); historyUI(); }
    finally { $('draft-file').value = ''; }
  }
  function bringClothIntoView(force=false) {
    if ((!force&&!matchMedia('(max-width: 779px)').matches) || document.body.dataset.view !== 'studio') return;
    const box = cloth.getBoundingClientRect();
    if (box.top < 24 || box.bottom > innerHeight - 90) {
      cloth.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'center' });
    }
  }
  const wait = duration => new Promise(resolve => setTimeout(resolve, duration));

  function blank() {
    if (white) draw(fabric, white);
    else { fabric.width = fabric.height = 720; fabric.getContext('2d').fillStyle = '#eeefe5'; fabric.getContext('2d').fillRect(0, 0, 720, 720); }
    fabric.setAttribute('aria-label', meta().name + '染法：正在处理的白色棉布');
  }
  function cancelWork() {
    state.revision += 1;
    if (stitchFrame) cancelAnimationFrame(stitchFrame);
    stitchFrame = 0; state.sewing = false;
    const id = state.pointer; state.pointer = null;
    if (id !== null && cloth.hasPointerCapture?.(id)) cloth.releasePointerCapture(id);
    dispose(prepared); prepared = null;
  }
  function selectedPoint() {
    const p=activeParams();return manyPoints() ? p.points[state.selected] || p.points[0] : p;
  }
  function updatePrimary() {
    const phase = state.phase;
    const busy = ['dyeing','unfolding','previewing'].includes(phase) || state.sewing;
    const incomplete = phase === 'tie' && needsStitch();
    primary.disabled = busy;
    primary.textContent = phase === 'tie' ? (state.sewing ? '针线正在沿轮廓走…' : incomplete ? (activeParams().technique==='stitch'?'沿着轮廓缝一圈':'先完成缝花，再浸染') : meta().ready) :
      phase === 'dyeing' ? '靛蓝正在染入布面…' : phase === 'dye' ? '拆开束缚，展开花纹' :
      phase === 'unfolding' ? '花纹正在展开…' : phase === 'previewing' ? '正在生成这次的花纹…' : reference ? '调整对比参数，再染一次' : '调整这块布，再染一次';
  }
  function updateControls() {
    const p = activeParams(), type = p.technique, m = meta();
    $('point-controls').hidden = !manyPoints();
    $('points-label').textContent = type === 'cloud' ? '布上的褶团' : '布上的线结';
    $('point-count').textContent = p.points.length + ' / 6';
    $('remove-point').disabled = p.points.length <= 1;
    $('remove-point').hidden = state.phase !== 'tie';
    for (const [id, test] of [['angle',type === 'stripe'],['petal',type === 'snowflake'],['shape',type === 'clamp'],['motif',type === 'stitch']]) $(id + '-controls').hidden = !test;
    $('density-controls').hidden = !['stripe','clamp','cloud'].includes(type);
    $('density-label').textContent = type === 'cloud' ? '褶皱密度' : type === 'clamp' ? '重复密度' : '折叠密度';
    $('density').value = p.density; $('density-output').textContent = p.density + (type === 'cloud' ? ' 级' : ' 组');
    $('radius').value = Math.round(p.radius * 100); $('radius-label').textContent = m.radius;
    $('radius-output').textContent = p.radius < .14 ? '较小' : p.radius > .19 ? '较大' : '适中';
    const shared=state.params;
    $('tightness').value = Math.round(shared.tightness * 100);
    $('tightness-label').textContent = type === 'clamp' ? '夹紧程度' : type === 'cloud' ? '聚拢松紧' : '线的松紧';
    $('tightness-output').textContent = bindingName(shared.tightness);
    $('tightness').setAttribute('aria-valuetext', bindingName(shared.tightness) + (shared.tightness < .45 ? '，渗色更多，留白更细' : shared.tightness > .65 ? '，留白更宽，边缘更清楚' : '，留白与色晕适中'));
    for (const key of ['angle','petals','shape','motif']) $('method-' + key).value = p[key];
    document.querySelectorAll('[data-dips]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.dips) === shared.dips)));
    document.querySelectorAll('.technique-choice').forEach(button => button.setAttribute('aria-pressed', String(!state.params.layers?.length&&button.dataset.technique === state.params.technique)));
    $('local-params-title').textContent=m.name+'参数';
    cloth.classList.toggle('show-guides', state.guides);
    $('show-guides').checked = state.guides;
    updatePrimary();
    updateLocks();
  }
  function svgLine(x1,y1,x2,y2,className) {
    return '<line class="' + className + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
  }
  function drawPreparation() {
    const p = {...activeParams(),tightness:state.params.tightness}, type = p.technique, shapes = [];
    if (type === 'circle') {
      p.points.forEach((point,index) => shapes.push('<circle class="fold-line' + (index === state.selected ? '' : ' secondary') + '" cx="' + point.x*100 + '" cy="' + point.y*100 + '" r="' + p.radius*100 + '"/>'));
    } else if (type === 'stripe') {
      const geometry=DyePatterns.preparationGeometry(p), a=geometry.angle*Math.PI/180;
      const normal={x:-Math.sin(a),y:Math.cos(a)}, direction={x:Math.cos(a),y:Math.sin(a)};
      for(let i=-p.density*2;i<=p.density*2;i++){
        const u=geometry.offset+i*geometry.spacing;
        shapes.push(svgLine((normal.x*u-direction.x*2)*100,(normal.y*u-direction.y*2)*100,(normal.x*u+direction.x*2)*100,(normal.y*u+direction.y*2)*100,i%2?'fold-line secondary':'fold-line'));
      }
    } else if (type === 'snowflake') {
      for (let i=0;i<p.petals*2;i++) {
        const a=i*Math.PI/p.petals, x=p.x*100,y=p.y*100;
        shapes.push(svgLine(x,y,x+Math.cos(a)*110,y+Math.sin(a)*110,i%2 ? 'fold-line secondary' : 'fold-line'));
      }
      shapes.push('<circle class="binding-line" cx="' + p.x*100 + '" cy="' + p.y*100 + '" r="' + p.radius*90 + '"/>');
    } else if (type === 'clamp') {
      const geometry=DyePatterns.preparationGeometry(p),radius=geometry.halfSize*100;
      for(const center of geometry.centers) {
        const x=center.x*100,y=center.y*100;
        if(p.shape==='circle') shapes.push('<circle class="clamp-plate" cx="'+x+'" cy="'+y+'" r="'+radius+'"/>');
        else shapes.push('<rect class="clamp-plate" x="'+(x-radius)+'" y="'+(y-radius)+'" width="'+radius*2+'" height="'+radius*2+'" rx=".6" transform="rotate('+(p.shape==='diamond'?45:0)+' '+x+' '+y+')"/>');
      }
    } else if (type === 'stitch') {
      const path = DyePatterns.stitchPath(p.motif);
      shapes.push('<path id="stitch-path" class="stitch-outline" d="'+path+'"/>','<path id="stitch-thread" class="stitch-thread" d="'+path+'"/>');
    } else {
      p.points.forEach((point,index) => {
        const x=point.x*100,y=point.y*100;
        for(let j=0;j<p.density+6;j++) {
          const a=j*Math.PI*2/(p.density+6)+index, r=p.radius*100*(.6+(j%3)*.24);
          shapes.push('<path class="crease-line" d="M '+x+' '+y+' Q '+(x+Math.cos(a+.3)*r*.5)+' '+(y+Math.sin(a+.3)*r*.5)+' '+(x+Math.cos(a)*r)+' '+(y+Math.sin(a)*r)+'"/>');
        }
      });
    }
    guide.innerHTML = shapes.join('');
    if(type==='stitch') {
      const path=$('stitch-path'), length=path.getTotalLength();
      stitchSamples=Array.from({length:161},(_,i)=>{const v=path.getPointAtLength(length*i/160);return {x:v.x/100,y:v.y/100,t:i/160};});
      $('stitch-thread').style.strokeDasharray=length;
    } else stitchSamples=[];
    drawHandles();
  }
  function drawHandles() {
    const p=activeParams(), count=manyPoints()?p.points.length:1;
    if(handles.childElementCount!==count || handles.dataset.technique!==p.technique) {
      handles.replaceChildren();
      handles.dataset.technique=p.technique;
      for(let i=0;i<count;i++) {
        const button=document.createElement('button');
        button.type='button'; button.className='fabric-handle '+(p.technique==='stitch'?'stitch-handle':manyPoints()?'point-handle':'center-handle');
        button.dataset.point=String(i);
        button.innerHTML=p.technique==='stitch'?'<span class="needle-shaft"></span>':'<span class="string-loop"></span><span class="string-tail"></span><small>'+(i+1)+'</small>';
        handles.append(button);
      }
    }
    Array.from(handles.children).forEach((button,i)=>{
      const point=manyPoints()?p.points[i]:p;
      button.style.left=point.x*100+'%'; button.style.top=point.y*100+'%';
      button.classList.toggle('selected',i===state.selected);
      button.tabIndex=state.phase==='tie'&&!reference?0:-1;
      button.disabled=state.phase!=='tie'||state.sewing||Boolean(reference);
      button.setAttribute('aria-label',p.technique==='stitch'?'针尖，沿轮廓拖动，或按回车缝一针':(p.technique==='cloud'?'褶团':p.technique==='clamp'?'夹板布局':'扎点')+' '+(i+1)+'，左右'+Math.round(point.x*100)+'%，上下'+Math.round(point.y*100)+'%，可用方向键移动');
    });
    updateStitchProgress();
  }
  function updateStitchProgress() {
    if(activeParams().technique!=='stitch') return;
    const path=$('stitch-path'), thread=$('stitch-thread'), needle=handles.firstElementChild;
    if(!path||!thread||!needle) return;
    const progress=getStitch(),length=path.getTotalLength(), point=path.getPointAtLength(length*progress);
    thread.style.strokeDashoffset=length*(1-progress);
    needle.style.left=point.x+'%'; needle.style.top=point.y+'%';
    $('stitch-progress-fill').style.transform='scaleX('+progress+')';
    document.querySelector('.stitch-progress').setAttribute('aria-valuenow',String(Math.round(progress*100)));
    stage.dataset.stitchProgress=String(Math.round(progress*100));
    updatePrimary();
  }
  function setPhase(phase) {
    if(motionFrame)cancelAnimationFrame(motionFrame);
    motionFrame=0;
    state.phase=phase;
    const m=meta(), busy=['dyeing','unfolding','previewing'].includes(phase), revealed=['unfold','unfolding'].includes(phase);
    stage.dataset.phase=phase; stage.dataset.technique=activeParams().technique; cloth.dataset.stage=phase;
    $('studio').dataset.phase=phase;
    cloth.style.setProperty('--fold-x',m.fold[0]); cloth.style.setProperty('--fold-y',m.fold[1]);
    stage.setAttribute('aria-busy',String(busy));
    $('controls').disabled=phase!=='tie'||state.sewing;
    $('controls').hidden=revealed;
    $('result-notes').hidden=!revealed;
    $('download').hidden=phase!=='unfold';
    $('open-poster').hidden=phase!=='unfold';
    if(revealed)$('mix-panel').open=false;
    $('view-artwork').hidden=phase!=='unfold';
    $('guide-control').hidden=phase!=='unfold'; $('stage-message').hidden=phase!=='tie';
    $('stage-meta').textContent=state.params.layers?.length?compositionName():m.name+' · '+m.craft;
    $('method-caption').textContent=revealed?'属于你的这一块':m.craft;
    $('tool-title').textContent=revealed?'你的这一染。':phase==='dye'?'等一次花开。':compositionName();
    $('tool-description').textContent=revealed?(reference?'A图已经保留。可以再调一次对比参数，也可以退出对比自由编辑。':'保存这块布，或保留当前参数继续调整。下方还可以只改一个参数做对比。'):phase==='dye'?'束缚还在，花纹藏在布里。松开它们，看看这次留下了什么。':m.description;
    $('stage-title').textContent=phase==='tie'?m.name+' · 处理白布':phase==='dyeing'?'正在浸染靛蓝':phase==='dye'?'染好了，花纹尚未展开':phase==='previewing'?'正在生成花纹':compositionName()+' · 你的这一次染';
    $('canvas-hint').textContent=phase==='tie'?m.hint:phase==='dye'?'轻轻拆开，让花纹展开':revealed?'留白与色晕，记下了你刚才的选择':'让靛蓝进入布面';
    $('stage-bottom').hidden=busy;
    $('dye-caption').textContent=phase==='dyeing'?'靛蓝正在染入布面':phase==='unfolding'?'一块布，慢慢展开':'';
    $('observation-title').textContent=m.observation; $('observation-text').textContent=m.note;
    $('craft-note').textContent=m.craftNote; $('craft-source').href=m.source; $('craft-source').textContent=m.credit;
    if(revealed){
      const r=DyeArtwork.recipe(state.params),list=$('result-details');list.replaceChildren();
      for(const [key,value] of [...r.layers.map(p=>[p.name,p.detail]),['整块布',r.shared]]){
        const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;list.append(dt,dd);
      }
      const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='查看位置与纹理编号';details.append(summary);
      for(const p of r.layers.filter(p=>p.position)){const line=document.createElement('p');line.textContent=p.name+' · '+p.position;details.append(line);}
      const note=document.createElement('p');note.textContent='纹理编号 '+r.seed+'。大小、密度与松紧均为相对值；位置以画布宽高百分比表示。';details.append(note);$('recipe-positions')?.remove();details.id='recipe-positions';$('result-notes').append(details);
    }
    $('knot-help').textContent=revealed?'保存花纹，或回到白布，只改一个地方再试。':phase==='dye'?'下一步，亲手拆开，看看花纹。':busy?'正在为这次展开准备花纹。':activeParams().technique==='stitch'?'可以沿虚线拖动针尖，也可以点击上方按钮缝一圈。针尖支持回车逐针前进。':manyPoints()?'点击布面添一处，选中标记后可用方向键移动。白布支持回车添点。':'拖动布上的标记调整位置，也可以用方向键移动。';
    $('knot-help').hidden=revealed;
    cloth.tabIndex=phase==='tie'&&manyPoints()?0:-1;
    cloth.setAttribute('aria-label',phase==='tie'?(manyPoints()?'白布，点击空白处或按回车添加'+(activeParams().technique==='cloud'?'褶团':'线结'):'扎染布面，可调整布面标记'):revealed?m.name+'扎染成品':phase==='dye'?'已浸染、等待展开的布料':'正在制作的布料');
    const index=phase==='tie'?0:revealed?2:1;
    document.querySelectorAll('[data-step]').forEach((item,i)=>{
      item.classList.toggle('active',i===index);item.classList.toggle('complete',i<index);
      if(i===index)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
    });
    updateControls(); drawPreparation();
    updateLocks(); queueSample(); updateComparison(); updateTour(); historyUI();
    if(qa&&['dyeing','unfolding'].includes(phase)){
      const prefix=phase==='dyeing'?'dye':'unfold';
      let previous=0,count=0,maximum=0,slow=0;
      const record=now=>{
        if(state.phase!==phase)return;
        if(previous){const gap=now-previous;maximum=Math.max(maximum,gap);count++;if(gap>34)slow++;}
        previous=now;
        stage.dataset[prefix+'Frames']=String(count);
        stage.dataset[prefix+'MaxGap']=maximum.toFixed(1);
        stage.dataset[prefix+'SlowFrames']=String(slow);
        motionFrame=requestAnimationFrame(record);
      };
      motionFrame=requestAnimationFrame(record);
    }
  }
  function saveDraft() { drafts.set(state.params.technique,{params:clone(state.params),stitch:state.stitch,selected:state.selected}); }
  function rememberCurrentLayers(){for(const [type,saved] of DyeExperience.rememberLayers(state.params,state.stitch))layerCache.set(type,saved);}
  function cachedLayer(type){
    const saved=layerCache.get(type);
    const p=saved?clone(saved.params):DyePatterns.defaults(type);
    if(type==='stitch')p.stitchProgress=saved?saved.stitch:1;
    return p;
  }
  function useSingleTechnique(type){
    if(!modes[type]||importing||(!state.params.layers?.length&&type===state.params.technique))return;
    checkpoint();rememberCurrentLayers();saveDraft();
    const shared={seed:state.params.seed,tightness:state.params.tightness,dips:state.params.dips};
    const saved=layerCache.get(type)||drafts.get(type);
    const p=saved?clone(saved.params):DyePatterns.defaults(type);delete p.layers;delete p.stitchProgress;
    cancelWork();restoring=false;reference=null;state.params=DyePatterns.normalize({...p,...shared});
    state.stitch=saved?saved.stitch:0;state.editing=undefined;state.selected=0;state.guides=false;
    setPhase('tie');blank();checkpoint();announce('已单独使用'+meta().name+'，保留该染法的已有参数；其他染法参数已暂存，可重新勾选或撤销找回。');
  }
  function selectTechnique(type) {
    if(!modes[type]||type===activeParams().technique||importing)return;
    if([state.params.technique,...(state.params.layers||[]).map(layer=>layer.technique)].includes(type)){
      checkpoint();cancelWork();restoring=false;reference=null;state.editing=type;state.selected=0;state.guides=false;
      setPhase('tie');blank();checkpoint();announce('正在编辑'+meta().name+'，其他染法和参数仍保留。');return;
    }
    return;
  }
  function commit(message) {
    state.params=DyePatterns.normalize(state.params);
    state.revision+=1;updateControls();drawPreparation();
    updateLocks(); queueSample();
    if (reference) {
      $('comparison-label').textContent = parameterLabel(state.params, reference.key);
    }
    if(message)announce(message);
  }
  function movePoint(x,y) {
    if(reference)return;
    const bound=value=>Math.max(.16,Math.min(.84,value));
    const p=activeParams();
    if(manyPoints())p.points[state.selected]={x:bound(x),y:bound(y)};
    else{p.x=bound(x);p.y=bound(y);}
    commit();
  }
  function addPoint(x,y) {
    const p=activeParams();
    if(reference||!manyPoints()||p.points.length>=6)return false;
    if(x===undefined) {
      const options=[[.72,.27],[.25,.75],[.5,.5],[.77,.76],[.24,.25],[.5,.23],[.48,.8]];
      const best=options.sort((a,b)=>Math.min(...p.points.map(p=>Math.hypot(b[0]-p.x,b[1]-p.y)))-Math.min(...p.points.map(p=>Math.hypot(a[0]-p.x,a[1]-p.y))))[0];
      [x,y]=best;
    }
    p.points.push({x:Math.max(.16,Math.min(.84,x)),y:Math.max(.16,Math.min(.84,y))});
    state.selected=p.points.length-1;commit('已添上一处'+(p.technique==='cloud'?'褶团':'线结')+'。');updateTour();return true;
  }
  function removePoint() {
    const p=activeParams();if(reference||!manyPoints()||p.points.length<=1)return;
    p.points.splice(state.selected,1);state.selected=Math.max(0,state.selected-1);commit('已移除选中的位置。');
  }
  function pointerPosition(event) {
    const box=cloth.getBoundingClientRect();return{x:(event.clientX-box.left)/box.width,y:(event.clientY-box.top)/box.height};
  }
  function sewAt(point) {
    if(reference||!stitchSamples.length)return;
    let closest=null,distance=Infinity;
    for(const sample of stitchSamples){const d=Math.hypot(sample.x-point.x,sample.y-point.y);if(d<distance){distance=d;closest=sample;}}
    if(distance<.13&&closest.t<=getStitch()+.16&&closest.t>=getStitch()-.03){
      setStitch(Math.max(getStitch(),closest.t));if(getStitch()>.97)setStitch(1);
      updateTour();updateStitchProgress();if(getStitch()===1)announce('轮廓已经缝好。调一调松紧，就可以染色了。');
    }
  }
  function sewAutomatically() {
    if(state.phase!=='tie'||state.sewing||getStitch()>=.995)return;
    checkpoint();
    bringClothIntoView();
    state.sewing=true;const revision=++state.revision,from=getStitch(),started=performance.now(),duration=motion.matches?0:1100;
    $('controls').disabled=true;updatePrimary();historyUI();
    function frame(now){
      if(revision!==state.revision)return;
      const t=duration===0?1:Math.min(1,(now-started)/duration);
      setStitch(from+(1-from)*t);updateStitchProgress();
      if(t<1)stitchFrame=requestAnimationFrame(frame);
      else{stitchFrame=0;state.sewing=false;$('controls').disabled=false;drawHandles();updatePrimary();announce('轮廓已经缝好。现在可以抽紧缝线，浸入靛蓝。');checkpoint();}
    }
    stitchFrame=requestAnimationFrame(frame);
  }
  async function dye() {
    if(state.phase!=='tie'||state.sewing||needsStitch())return;
    checkpoint();
    bringClothIntoView();
    const revision=++state.revision, snapshot=clone(state.params);
    state.guides=false;setPhase('dyeing');
    announce('布料正在收拢，靛蓝慢慢进入。');
    try {
      const [result]=await Promise.all([render(snapshot,720),wait(motion.matches?0:1450)]);
      if(revision!==state.revision){dispose(result);return;}
      prepared=result;stage.dataset.renderMs=String(result.stats.durationMs);
      setPhase('dye');announce('染好了。拆开束缚，看看'+meta().name+'的展开效果。');checkpoint();
    } catch(error) {
      if(revision!==state.revision)return;
      setPhase('tie');blank();announce('这次染色没有完成，请再试一次。');historyUI();console.error(error);
    }
  }
  async function unfold() {
    if(state.phase!=='dye'||!prepared)return;
    bringClothIntoView();
    const revision=++state.revision;
    draw(fabric,prepared);dispose(prepared);prepared=null;
    fabric.setAttribute('aria-label',compositionName()+'扎染成品，蓝白纹样对应刚才的布料处理');
    setPhase('unfolding');await wait(motion.matches?0:950);
    if(revision!==state.revision)return;
    setPhase('unfold');announce('花纹已展开，可以保存这块布。');checkpoint();cloth.focus({preventScroll:true});bringClothIntoView(true);
  }
  function edit() { cancelWork();state.guides=false;setPhase('tie');blank();bringClothIntoView();announce('已回到这块白布，刚才的调整都还在。');checkpoint(); }
  function reset() {
    if(importing)return;
    checkpoint();
    const current=stablePhase()&&!state.sewing&&state.pointer===null?snapshot():clone(journal.current);
    const next=DyeExperience.reroll(current);journal.record(next);dirty=true;
    restoreSnapshot(next,'已换随机纹理，组合、位置和参数全部保留；可撤销回到上一种纹理。');
  }
  function restart(){
    if(importing)return;
    checkpoint();const seed=(state.params.seed+997)>>>0;cancelWork();restoring=false;reference=null;
    state.params=DyePatterns.defaults('circle');state.params.seed=seed;state.stitch=0;state.editing=undefined;
    state.selected=0;state.guides=false;layerCache.clear();drafts.clear();
    setPhase('tie');blank();checkpoint();document.querySelector('.draft-menu').open=false;
    announce('已全部重新开始，恢复默认圆花方案；刚才的组合与参数可以撤销找回。');primary.focus();
  }
  async function download() {
    if(state.phase!=='unfold'||$('download').disabled)return;
    const snapshot=clone(state.params),revision=state.revision,name=compositionName(),button=$('download');
    button.disabled=true;button.textContent='正在准备图片…';
    try {
      const result=await render(snapshot,1200),output=document.createElement('canvas');
      draw(output,result);dispose(result);
      const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));
      if(!blob)throw new Error('empty export');
      const url=URL.createObjectURL(blob),anchor=document.createElement('a');
      anchor.href=url;anchor.download='结里生花-'+name+'-'+snapshot.seed+'.png';anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
      if(revision===state.revision)announce('已生成 1200 × 1200 像素的布面图片。');
    }catch(error){if(revision===state.revision)announce('图片没有生成成功，请再试一次。');console.error(error);}
    finally{button.disabled=false;button.textContent='保存这块布 ↗';}
  }
  function bind() {
    $('open-poster').addEventListener('click',openPoster);
    $('poster-save').addEventListener('click',savePoster);
    $('poster-name').addEventListener('input',()=>{redrawPoster();if(posterImage)$('poster-status').textContent='名称已更新，可保存当前海报；布纹与配方保持不变。';});
    $('poster-dialog').addEventListener('close',()=>{posterTicket++;posterImage=null;posterParams=null;$('poster-save').textContent='保存海报 PNG';posterOpener?.focus({preventScroll:true});});
    $('view-artwork').addEventListener('click',openViewer);
    cloth.addEventListener('click',()=>{if(state.phase==='unfold')openViewer();});
    cloth.addEventListener('keydown',event=>{if(state.phase==='unfold'&&['Enter',' '].includes(event.key)){event.preventDefault();openViewer();}});
    $('viewer-more').addEventListener('click',()=>zoomViewer(.25));
    $('viewer-less').addEventListener('click',()=>zoomViewer(-.25));
    $('viewer-fit').addEventListener('click',()=>{viewerZoom=1;viewerLayout();$('artwork-viewport').scrollTo(0,0);});
    $('artwork-viewer').addEventListener('close',()=>{viewerTicket++;const target=viewerOpener?.isConnected&&viewerOpener!==document.body?viewerOpener:$('view-artwork');target.focus({preventScroll:true});});
    window.addEventListener('resize',()=>{if($('artwork-viewer').open)viewerLayout();});
    function changeCombination(type,checked) {
      if(importing||type===state.params.technique)return;
      checkpoint();
      const wasComparing=Boolean(reference);
      const layers=clone(state.params.layers||[]).filter(layer=>layer.technique!==type);
      if(checked&&layers.length>=2){updateLocks();announce('一次最多三种染法，请先取消一种叠加。');return;}
      rememberCurrentLayers();
      if(checked)layers.push(cachedLayer(type));
      cancelWork();restoring=false;reference=null;
      state.params=DyePatterns.normalize({...state.params,layers});
      if(![state.params.technique,...layers.map(layer=>layer.technique)].includes(state.editing))state.editing=undefined;
      setPhase('tie');blank();checkpoint();
      announce((wasComparing?'已退出单参数对比。':'')+'当前染法：'+compositionName()+'。取消的染法参数已暂存，重新勾选会接着使用。');
    }
    document.querySelectorAll('[data-mix]').forEach(input=>input.addEventListener('change',()=>changeCombination(input.dataset.mix,input.checked)));
    $('clear-mix').addEventListener('click',()=>{
      if(importing||!state.params.layers?.length)return;
      checkpoint();rememberCurrentLayers();cancelWork();restoring=false;reference=null;delete state.params.layers;state.editing=undefined;
      setPhase('tie');blank();checkpoint();announce('已回到'+meta().name+'单一染法，可撤销找回组合。');
    });
    document.querySelectorAll('.technique-choice').forEach(button=>button.addEventListener('click',()=>useSingleTechnique(button.dataset.technique)));
    for(const key of ['angle','petals','shape','motif'])$('method-'+key).addEventListener('change',event=>{
      if(state.phase!=='tie'||state.sewing||locked(key))return;
      activeParams()[key]=['shape','motif'].includes(key)?event.target.value:Number(event.target.value);
      if(key==='motif')setStitch(0);
      commit(key==='motif'?'换了一道轮廓，从第一针开始。':key==='dips'?'已设为'+state.params.dips+'遍浸染（'+dyeDepthNames[state.params.dips-1]+'），展开时会看到对应底色。':'已调整，染色后看看新的变化。');
      checkpoint();
    });
    document.querySelectorAll('[data-dips]').forEach(button=>button.addEventListener('click',()=>{
      if(state.phase!=='tie'||state.sewing||locked('dips'))return;
      state.params.dips=Number(button.dataset.dips);commit('已设为'+state.params.dips+'遍浸染，预计底色为'+dyeDepthNames[state.params.dips-1]+'。');checkpoint();
    }));
    for(const key of ['radius','tightness','density'])$(key).addEventListener('input',()=>{
      if(state.phase!=='tie'||state.sewing||locked(key))return;
      (key==='tightness'?state.params:activeParams())[key]=Number($(key).value)/(key==='density'?1:100);commit();
      updateTour();
    });
    for(const key of ['radius','tightness','density'])$(key).addEventListener('change',checkpoint);
    $('remove-point').addEventListener('click',()=>{removePoint();checkpoint();});
    cloth.addEventListener('keydown',event=>{
      if(event.target!==cloth||state.phase!=='tie'||!manyPoints()||reference)return;
      if(['Enter',' '].includes(event.key)){event.preventDefault();addPoint();checkpoint();handles.children[state.selected]?.focus({preventScroll:true});}
    });
    cloth.addEventListener('pointerdown',event=>{
      if(state.phase!=='tie'||state.sewing||reference||event.button>0||state.pointer!==null)return;
      event.preventDefault();state.pointer=event.pointerId;cloth.setPointerCapture(event.pointerId);
      const point=pointerPosition(event),handle=event.target.closest('.fabric-handle');
      if(activeParams().technique==='stitch'){sewAt(point);handles.firstElementChild?.focus({preventScroll:true});return;}
      if(manyPoints()){
        if(handle)state.selected=Number(handle.dataset.point);
        else if(!addPoint(point.x,point.y)){announce('这块布已经有六处了。拖动已有标记，或先移除一处。');state.pointer=null;cloth.releasePointerCapture(event.pointerId);return;}
      }
      movePoint(point.x,point.y);handles.children[state.selected]?.focus({preventScroll:true});
      updateTour();historyUI();
    });
    cloth.addEventListener('pointermove',event=>{
      if(event.pointerId!==state.pointer||state.phase!=='tie')return;
      const point=pointerPosition(event);if(activeParams().technique==='stitch')sewAt(point);else movePoint(point.x,point.y);
    });
    const release=event=>{if(event.pointerId!==state.pointer)return;state.pointer=null;if(cloth.hasPointerCapture(event.pointerId))cloth.releasePointerCapture(event.pointerId);checkpoint();};
    cloth.addEventListener('pointerup',release);cloth.addEventListener('pointercancel',release);cloth.addEventListener('lostpointercapture',release);
    handles.addEventListener('focusin',event=>{
      const button=event.target.closest('.fabric-handle');
      if(!button||state.phase!=='tie'||!manyPoints())return;
      const selected=Number(button.dataset.point);
      if(selected!==state.selected){state.selected=selected;updateControls();drawPreparation();}
    });
    handles.addEventListener('keydown',event=>{
      if(state.phase!=='tie'||state.sewing||reference)return;
      if(activeParams().technique==='stitch'&&['Enter',' '].includes(event.key)){event.preventDefault();setStitch(Math.min(1,getStitch()+.125));updateStitchProgress();checkpoint();return;}
      if(['Delete','Backspace'].includes(event.key)&&manyPoints()){event.preventDefault();state.selected=Number(event.target.closest('.fabric-handle').dataset.point);removePoint();checkpoint();handles.children[state.selected]?.focus();return;}
      const delta=event.shiftKey?.05:.01,directions={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]};
      if(!directions[event.key]||activeParams().technique==='stitch')return;
      event.preventDefault();state.selected=Number(event.target.closest('.fabric-handle').dataset.point);
      const point=selectedPoint(),[dx,dy]=directions[event.key];movePoint(point.x+dx,point.y+dy);checkpoint();
    });
    primary.addEventListener('click',()=>{if(state.phase==='tie'){if(needsStitch()){if(activeParams().technique!=='stitch')selectTechnique('stitch');else sewAutomatically();}else dye();}else if(state.phase==='dye')unfold();else if(state.phase==='unfold')edit();});
    document.querySelectorAll('[data-edit-layer]').forEach(button=>button.addEventListener('click',()=>selectTechnique(button.dataset.editLayer)));
    $('reset').addEventListener('click',reset);$('download').addEventListener('click',download);
    $('restart').addEventListener('click',restart);
    $('show-guides').addEventListener('change',event=>{state.guides=event.target.checked;cloth.classList.toggle('show-guides',state.guides);checkpoint();});
    $('undo').addEventListener('click',()=>travel('undo'));$('redo').addEventListener('click',()=>travel('redo'));
    document.addEventListener('keydown',event=>{
      if($('artwork-viewer').open||$('poster-dialog').open||document.body.dataset.view!=='studio'||event.altKey||!(event.ctrlKey||event.metaKey)||event.target.closest('input:not([type="range"]),select,textarea,[contenteditable="true"]'))return;
      if(event.key.toLowerCase()==='z'){event.preventDefault();travel(event.shiftKey?'redo':'undo');}
      else if(event.key.toLowerCase()==='y'){event.preventDefault();travel('redo');}
    });
    $('export-draft').addEventListener('click',downloadDraft);
    $('import-draft').addEventListener('click',()=>$('draft-file').click());
    $('draft-file').addEventListener('change',event=>importDraft(event.target.files[0]));
    $('start-compare').addEventListener('click',()=>{
      if(state.phase!=='unfold'||reference)return;
      const key=$('compare-key').value;
      reference={key,params:clone(state.params),...(key==='radius'?{target:activeParams().technique}:{})};edit();
      announce('已保留上一张。对比期间只开放'+(reference.key==='dips'?'浸染遍数':reference.key==='tightness'?'松紧':meta().radius)+'，其他条件固定。');
      if(matchMedia('(max-width: 779px)').matches){const target=reference.key==='dips'?document.querySelector('[data-dips][aria-pressed="true"]'):$(reference.key);target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:'instant'});}
    });
    document.querySelectorAll('[data-end-comparison]').forEach(button=>button.addEventListener('click',()=>{
      if(!reference||importing)return;
      if(!stablePhase()||state.sewing){cancelWork();restoring=false;setPhase('tie');blank();}
      reference=null;setPhase(state.phase);checkpoint();announce('已退出对比，当前布料和参数保留，可以自由编辑。');primary.focus();
    }));
    $('tour-open').addEventListener('click',()=>{document.querySelector('.draft-menu').open=false;tourVisible=true;updateTour();$('tour-title').tabIndex=-1;$('tour-title').focus({preventScroll:true});$('first-dye').scrollIntoView({block:'center',behavior:motion.matches?'instant':'smooth'});});
    document.addEventListener('pointerdown',event=>{const menu=document.querySelector('.draft-menu');if(!menu.contains(event.target))menu.open=false;});
    document.addEventListener('keydown',event=>{const menu=document.querySelector('.draft-menu');if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
    $('tour-skip').addEventListener('click',()=>{tourVisible=false;try{localStorage.setItem(tourKey,'done');}catch(_){}updateTour();$('stage-title').focus({preventScroll:true});});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){checkpoint();persist();}});
    window.addEventListener('pagehide',event=>{
      checkpoint();persist();
      // A cached page resumes with the same live Worker and ImageBitmaps.
      if(event.persisted)return;
      rendering.close();dispose(white);dispose(prepared);
    });
  }
  async function initialize() {
    if(!globalThis.DyePatterns)throw new Error('花纹生成器未能加载，请刷新页面。');
    state.params=DyePatterns.defaults('circle');
    let loaded=null,loadError='';
    try { const saved=localStorage.getItem(storageKey);if(saved)loaded=DyeExperience.readDocument(saved,DyePatterns.normalize);tourVisible=!loaded&&localStorage.getItem(tourKey)!=='done'; }
    catch(_){loadError='未能读取本机草稿，可导入已导出的 JSON 备份。';}
    journal=loaded?new DyeExperience.Journal(loaded.current,loaded.past,loaded.future):new DyeExperience.Journal(snapshot());
    bind();rendering.start();setPhase('tie');blank();
    if(loaded){$('enter-label').textContent='接着染';await restoreSnapshot(loaded.current,'已恢复上次的布料与撤销记录，可以接着染。');draftMessage('已恢复本机草稿与历史');}
    if(loadError)draftMessage(loadError,true);
    white=await render(state.params,720,false);
    if(state.phase==='tie')blank();
    for(const button of document.querySelectorAll('.technique-choice')){
      const result=await render(DyePatterns.defaults(button.dataset.technique),144);
      draw(button.querySelector('canvas'),result);dispose(result);button.classList.add('swatch-ready');
    }
    document.body.dataset.patternsReady='true';
    historyUI();
  }
  initialize().catch(error=>{
    console.error(error);const message=document.createElement('p');message.className='fatal-message';message.setAttribute('role','alert');message.textContent=error.message;document.body.append(message);
  });
})();
