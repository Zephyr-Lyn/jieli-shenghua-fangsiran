/* Shared, factual recipes and a cotton / indigo / cinnabar artwork print. */
((root)=>{
  'use strict';
  const names={circle:'圆花',stripe:'条纹',snowflake:'雪花',clamp:'夹扎',stitch:'缝花',cloud:'云雾'};
  const sizes={circle:'大小',stripe:'宽度',snowflake:'大小',clamp:'大小',stitch:'留白宽度',cloud:'聚拢范围'};
  const number=v=>Math.round(v*100),point=p=>number(p.x)+'% / '+number(p.y)+'%';
  function recipe(params){
    const layers=[params,...(params.layers||[])].map(p=>{
      let detail;
      switch(p.technique){
        case 'circle':detail=p.points.length+'处线结';break;
        case 'cloud':detail=p.points.length+'处褶团 · 密度'+p.density;break;
        case 'stripe':detail=p.angle+'°条纹 · 密度'+p.density;break;
        case 'snowflake':detail=p.petals+'瓣对称';break;
        case 'clamp':detail=({square:'方形',diamond:'菱形',circle:'圆形'}[p.shape])+'夹板 · 密度'+p.density;break;
        case 'stitch':detail=({flower:'团花',leaf:'叶片',butterfly:'蝴蝶'}[p.motif])+'轮廓';break;
      }
      return {name:names[p.technique],detail:detail+' · '+sizes[p.technique]+number(p.radius),
        position:p.technique==='stitch'?'':p.technique==='circle'||p.technique==='cloud'?'位置（横 / 纵）：'+p.points.map(point).join('；'):'位置（横 / 纵）：'+point(p)};
    });
    return {title:layers.map(p=>p.name).join('＋'),layers,
      shared:'松紧'+number(params.tightness)+' · '+params.dips+'遍'+['浅靛','中靛','深靛'][params.dips-1],seed:String(params.seed)};
  }
  function poster(canvas,image,params,title){
    canvas.width=1600;canvas.height=2200;
    const c=canvas.getContext('2d'),r=recipe(params),font='"Microsoft YaHei", "PingFang SC", sans-serif';
    const text=(value,x,y,size=28,color='#183f63',weight=400)=>{c.fillStyle=color;c.font=weight+' '+size+'px '+font;c.fillText(value,x,y);};
    c.fillStyle='#f3f2e8';c.fillRect(0,0,1600,2200);
    // A quiet ruled border frames the actual rendered cloth, rather than a mockup.
    c.strokeStyle='#183f63';c.lineWidth=2;c.strokeRect(62,62,1476,2076);
    text('结里生花 / 放肆染',116,127,28,'#183f63',700);
    text('自由扎染实验',1275,127,24);
    const clean=Array.from((title||'').trim()).slice(0,20).join('')||'这一染，属于你。';
    let size=88;c.font='700 '+size+'px '+font;
    while(c.measureText(clean).width>1368&&size>36){size--;c.font='700 '+size+'px '+font;}
    text(clean,116,258,size,'#183f63',700);
    c.fillStyle='#b64236';c.fillRect(116,286,110,8);
    text(r.title,116,354,28);
    c.fillStyle='#183f63';c.fillRect(120,403,1364,1364);
    c.drawImage(image,116,395,1368,1368);
    text('这一染的配方',116,1830,30,'#183f63',700);
    text(r.shared,1000,1830,26);
    r.layers.forEach((layer,i)=>{
      const y=1890+i*50;
      text(layer.name,116,y,28,'#183f63',700);text(layer.detail,244,y,26);
    });
    c.strokeStyle='#183f6340';c.beginPath();c.moveTo(116,2060);c.lineTo(1484,2060);c.stroke();
    text('纹理编号 '+r.seed,116,2108,22);
    text('二维视觉模拟 · 大小与松紧为相对值',964,2108,22);
    return r;
  }
  const api={recipe,poster};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DyeArtwork=api;
})(globalThis);
