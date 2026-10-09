window.NM = window.NM || {};
NM.notify={
  items:[],
  push(icon,text,type){
    this.items.unshift({icon,text,type,time:Date.now()});
    if(this.items.length>30)this.items.pop();
    this.badge();
    NM.ui.toast(icon+' '+text, type==='warn'?'error':(type==='gold'?'gold':'info'));
  },
  badge(){
    const el=document.getElementById('notifCount'); if(!el)return;
    el.textContent=this.items.length;
    el.style.display=this.items.length>0?'inline-block':'none';
  },
  open(){
    const rows=this.items.length?this.items.map(i=>
      '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px;background:#fafaf7">'+
      '<span style="font-size:18px">'+i.icon+'</span><div style="font-size:13px">'+i.text+
      '<div style="font-size:11px;color:var(--mute)">'+new Date(i.time).toLocaleTimeString()+'</div></div></div>').join('')
      :'<p style="color:var(--mute);text-align:center;padding:20px">Пока пусто</p>';
    const m=modal('<button class="x" data-close>✕</button><h3>🔔 Уведомления</h3>'+
      '<div style="max-height:400px;overflow:auto">'+rows+'</div>'+
      '<button class="btn btn-sm" id="clearNotif" style="margin-top:10px;width:100%">Очистить</button>');
    m.ov.querySelector('#clearNotif').onclick=()=>{this.items=[];this.badge();m.close();};
  }
};
NM.map={
  built:false,
  view:{x:3000,y:3000,zoom:0.5},
  player:{x:3000,y:3000},
  keys:{}, walkTarget:null, follow:true, moved:false,
  speed:360, bizMarkers:{}, propMarkers:{},
  mk(t){return document.createElementNS('http://www.w3.org/2000/svg',t);},
  init(){
    if(this.built)return;
    this.svg=document.getElementById('mapSvg');
    this.wrap=document.getElementById('mapWrap');
    this.world=this.mk('g'); this.svg.appendChild(this.world);
    this.gBlocks=this.mk('g'); this.gRoads=this.mk('g'); this.gLabels=this.mk('g');
    this.gMarkers=this.mk('g'); this.gPlayer=this.mk('g');
    [this.gBlocks,this.gRoads,this.gLabels,this.gMarkers,this.gPlayer].forEach(g=>this.world.appendChild(g));
    this.player.x=NM.DB.map.playerStart.x; this.player.y=NM.DB.map.playerStart.y;
    this.view.x=this.player.x; this.view.y=this.player.y;
    this.buildStatic(); this.buildMarkers(); this.buildPlayer(); this.bind();
    this.built=true; this.applyCamera();
  },
  seeded(n){let t=n+0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;},
  buildStatic(){
    const M=NM.DB.map, mg=M.grid.margin, step=M.grid.step, rh=M.grid.road/2;
    const bg=this.mk('rect'); bg.setAttribute('x',0);bg.setAttribute('y',0);
    bg.setAttribute('width',M.width);bg.setAttribute('height',M.height);bg.setAttribute('fill','#1c202a');
    this.gBlocks.appendChild(bg);
    const xs=[],ys=[];
    for(let v=mg;v<=M.width-mg;v+=step)xs.push(v);
    for(let v=mg;v<=M.height-mg;v+=step)ys.push(v);
    const has=(arr,i,j)=>arr.some(c=>c[0]===i&&c[1]===j);
    for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
      const x0=xs[i]+rh,y0=ys[j]+rh,x1=xs[i+1]-rh,y1=ys[j+1]-rh;
      let fill='#2b3140', special=false;
      if(has(M.parkCells,i,j)){fill='#20402e';special=true;}
      else if(has(M.waterCells,i,j)){fill='#1e3a52';special=true;}
      else if(has(M.plazaCells,i,j)){fill='#3a3f4d';special=true;}
      const r=this.mk('rect');
      r.setAttribute('x',x0);r.setAttribute('y',y0);
      r.setAttribute('width',x1-x0);r.setAttribute('height',y1-y0);
      r.setAttribute('rx',10);r.setAttribute('fill',fill);
      this.gBlocks.appendChild(r);
      if(!special){
        const seed=i*100+j;
        for(let k=0;k<3;k++){
          const bw=40+this.seeded(seed+k)*60, bh=40+this.seeded(seed+k+7)*60;
          const bx=x0+15+this.seeded(seed+k+3)*(x1-x0-bw-30);
          const by=y0+15+this.seeded(seed+k+5)*(y1-y0-bh-30);
          const br=this.mk('rect');
          br.setAttribute('x',bx);br.setAttribute('y',by);br.setAttribute('width',bw);br.setAttribute('height',bh);
          br.setAttribute('rx',3);br.setAttribute('fill','#232836');
          this.gBlocks.appendChild(br);
        }
      }
    }
    xs.forEach(x=>{const l=this.mk('line');l.setAttribute('x1',x);l.setAttribute('y1',mg);l.setAttribute('x2',x);l.setAttribute('y2',M.height-mg);
      l.setAttribute('stroke','#3a4152');l.setAttribute('stroke-width',3);l.setAttribute('stroke-dasharray','20 30');this.gRoads.appendChild(l);});
    ys.forEach(y=>{const l=this.mk('line');l.setAttribute('x1',mg);l.setAttribute('y1',y);l.setAttribute('x2',M.width-mg);l.setAttribute('y2',y);
      l.setAttribute('stroke','#3a4152');l.setAttribute('stroke-width',3);l.setAttribute('stroke-dasharray','20 30');this.gRoads.appendChild(l);});
    M.districts.forEach(d=>{
      const t=this.mk('text');t.setAttribute('x',d.x);t.setAttribute('y',d.y);
      t.setAttribute('text-anchor','middle');t.setAttribute('font-size',54);t.setAttribute('font-weight',800);
      t.setAttribute('fill','rgba(255,255,255,0.06)');t.setAttribute('letter-spacing','4');t.textContent=d.name;
      this.gLabels.appendChild(t);
    });
  },
  bizColor(b,st){
    if(!NM.profile)return '#6b7280';
    if(st.auction)return '#2563eb';
    if(st.owner===NM.profile.name)return st.supplies>20?'#16a34a':'#d97706';
    if(st.owner)return '#dc2626';
    return '#6b7280';
  },
  propColor(pr){
    const owner=NM.properties.ownerOf(pr.id);
    if(!NM.profile)return '#6b7280';
    if(owner===NM.profile.name)return '#16a34a';
    if(owner)return '#dc2626';
    return '#6b7280';
  },
  makeMarker(icon,onClick){
    const g=this.mk('g'); g.style.cursor='pointer';
    const dash=this.mk('circle');dash.setAttribute('r',32);dash.setAttribute('fill','none');
    dash.setAttribute('stroke','#2563eb');dash.setAttribute('stroke-width',3);dash.setAttribute('stroke-dasharray','8 8');
    dash.setAttribute('class','ring-spin');dash.style.display='none';
    const ring=this.mk('circle');ring.setAttribute('r',26);ring.setAttribute('fill','none');ring.setAttribute('stroke-width',3);
    const bgc=this.mk('circle');bgc.setAttribute('r',20);
    const ic=this.mk('text');ic.textContent=icon;ic.setAttribute('text-anchor','middle');ic.setAttribute('dy',7);ic.setAttribute('font-size',20);
    g.appendChild(dash);g.appendChild(ring);g.appendChild(bgc);g.appendChild(ic);
    g.addEventListener('click',()=>{if(this.moved)return;onClick();});
    this.gMarkers.appendChild(g);
    return {g,dash,ring,bg:bgc};
  },
  buildMarkers(){
    this.gMarkers.innerHTML=''; this.bizMarkers={}; this.propMarkers={};
    NM.DB.businesses.forEach(b=>{
      const mk=this.makeMarker(b.icon,()=>this.openBiz(b.id));
      const label=this.mk('text');label.textContent=b.name;label.setAttribute('text-anchor','middle');label.setAttribute('y',44);
      label.setAttribute('font-size',12);label.setAttribute('font-weight',700);label.setAttribute('fill','#e8ecf7');
      mk.g.appendChild(label);
      this.bizMarkers[b.id]=mk;
    });
    NM.DB.properties.forEach(pr=>{
      const mk=this.makeMarker(pr.icon,()=>this.openProp(pr.id));
      this.propMarkers[pr.id]=mk;
    });
    this.updateMarkers();
  },
  updateMarkers(){
    const w=worldBiz(), z=this.view.zoom, inv=1/z;
    NM.DB.businesses.forEach(b=>{
      const m=this.bizMarkers[b.id]; if(!m)return;
      const st=w[b.id]||{owner:null,supplies:100,auction:null};
      const col=this.bizColor(b,st);
      m.g.setAttribute('transform','translate('+b.x+' '+b.y+') scale('+inv+')');
      m.bg.setAttribute('fill',col); m.ring.setAttribute('stroke',col);
      m.dash.style.display=st.auction?'block':'none';
    });
    NM.DB.properties.forEach(pr=>{
      const m=this.propMarkers[pr.id]; if(!m)return;
      const col=this.propColor(pr);
      m.g.setAttribute('transform','translate('+pr.x+' '+pr.y+') scale('+inv+')');
      m.bg.setAttribute('fill',col); m.ring.setAttribute('stroke',col);
      m.dash.style.display='none';
    });
  },
  buildPlayer(){
    const g=this.mk('g');
    const c=this.mk('circle');c.setAttribute('r',16);c.setAttribute('fill','#7c3aed');c.setAttribute('stroke','#fff');c.setAttribute('stroke-width',3);
    const t=this.mk('text');t.textContent='🙂';t.setAttribute('text-anchor','middle');t.setAttribute('dy',6);t.setAttribute('font-size',16);
    g.appendChild(c);g.appendChild(t); this.gPlayer.appendChild(g); this.playerEl=g;
  },
  applyCamera(){
    if(!this.wrap)return;
    const w=this.wrap.clientWidth,h=this.wrap.clientHeight,z=this.view.zoom;
    const tx=w/2-this.view.x*z, ty=h/2-this.view.y*z;
    this.world.setAttribute('transform','translate('+tx+' '+ty+') scale('+z+')');
    this.updateMarkers();
    this.playerEl.setAttribute('transform','translate('+this.player.x+' '+this.player.y+') scale('+(1/z)+')');
    const pos=document.getElementById('mapPos'); if(pos)pos.textContent=Math.round(this.player.x)+', '+Math.round(this.player.y);
  },
  clampView(){const M=NM.DB.map;this.view.x=clamp(this.view.x,0,M.width);this.view.y=clamp(this.view.y,0,M.height);},
  frame(dt){
    if(!NM.profile)return;
    let dx=0,dy=0; const k=this.keys;
    if(k['w']||k['arrowup'])dy-=1;
    if(k['s']||k['arrowdown'])dy+=1;
    if(k['a']||k['arrowleft'])dx-=1;
    if(k['d']||k['arrowright'])dx+=1;
    const M=NM.DB.map;
    if(dx||dy){
      this.walkTarget=null; this.follow=true;
      const n=Math.hypot(dx,dy);dx/=n;dy/=n;
      this.player.x=clamp(this.player.x+dx*this.speed*dt,20,M.width-20);
      this.player.y=clamp(this.player.y+dy*this.speed*dt,20,M.height-20);
    } else if(this.walkTarget){
      const t=this.walkTarget,ddx=t.x-this.player.x,ddy=t.y-this.player.y,d=Math.hypot(ddx,ddy);
      if(d<8)this.walkTarget=null;
      else{this.player.x+=ddx/d*this.speed*dt;this.player.y+=ddy/d*this.speed*dt;this.follow=true;}
    }
    if(this.follow){this.view.x=this.player.x;this.view.y=this.player.y;}
    if(NM.activeTab==='map')this.applyCamera();
  },
  bind(){
    window.addEventListener('keydown',e=>{
      const a=document.activeElement;
      if(a&&['INPUT','TEXTAREA'].includes(a.tagName))return;
      const kk=e.key.toLowerCase();
      if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(kk)){
        this.keys[kk]=true; if(NM.activeTab==='map')e.preventDefault();
      }
    });
    window.addEventListener('keyup',e=>{this.keys[e.key.toLowerCase()]=false;});
    let dragging=false,lx=0,ly=0,sx=0,sy=0;
    this.wrap.addEventListener('pointerdown',e=>{dragging=true;this.moved=false;lx=sx=e.clientX;ly=sy=e.clientY;this.follow=false;this.wrap.setPointerCapture(e.pointerId);});
    this.wrap.addEventListener('pointermove',e=>{
      if(!dragging)return;
      if(Math.hypot(e.clientX-sx,e.clientY-sy)>5)this.moved=true;
      const z=this.view.zoom;
      this.view.x-=(e.clientX-lx)/z; this.view.y-=(e.clientY-ly)/z;
      lx=e.clientX;ly=e.clientY; this.clampView();
      if(NM.activeTab==='map')this.applyCamera();
    });
    this.wrap.addEventListener('pointerup',()=>{dragging=false;});
    this.wrap.addEventListener('wheel',e=>{e.preventDefault();this.zoomAt(e.clientX,e.clientY,e.deltaY<0?1.15:0.87);},{passive:false});
    window.addEventListener('resize',()=>{if(this.built&&NM.activeTab==='map')this.applyCamera();});
  },
  zoomAt(cx,cy,f){
    const rect=this.wrap.getBoundingClientRect();
    const mx=cx-rect.left,my=cy-rect.top,z=this.view.zoom;
    const nz=clamp(z*f,0.2,2.2);
    const wx=this.view.x+(mx-this.wrap.clientWidth/2)/z;
    const wy=this.view.y+(my-this.wrap.clientHeight/2)/z;
    this.view.zoom=nz;
    this.view.x=wx-(mx-this.wrap.clientWidth/2)/nz;
    this.view.y=wy-(my-this.wrap.clientHeight/2)/nz;
    this.clampView(); if(NM.activeTab==='map')this.applyCamera();
  },
  near(x,y){return Math.hypot(this.player.x-x,this.player.y-y)<=NM.DB.map.interactRadius;},
  dist(x,y){return Math.round(Math.hypot(this.player.x-x,this.player.y-y));},
  goTo(x,y){this.walkTarget={x,y};this.follow=true;switchTab('map');},
  openBiz(id){
    const b=NM.DB.businesses.find(x=>x.id===id); const st=worldBiz()[id]||{owner:null,supplies:100,auction:null};
    const near=this.near(b.x,b.y), myName=NM.profile?NM.profile.name:null;
    const bonuses=[];
    if(b.inc)bonuses.push('<span class="bbonus">+'+fmtShort(b.inc)+'/с</span>');
    if(b.cap)bonuses.push('<span class="bbonus blue">+'+b.cap+' слотов</span>');
    if(b.disc)bonuses.push('<span class="bbonus amber">−'+b.disc+'% крутка</span>');
    if(b.mult)bonuses.push('<span class="bbonus purple">+'+b.mult+'% доход</span>');
    let stateHtml='', actionsHtml='';
    if(st.owner===myName){
      const sup=Math.max(0,Math.round(st.supplies));
      const col=sup>50?'#16a34a':sup>20?'#d97706':'#dc2626';
      stateHtml='<div class="biz-status" style="color:#16a34a;font-weight:700">🏢 Твой бизнес · запас '+sup+'%</div>'+
        '<div class="supbar"><i style="width:'+sup+'%;background:'+col+'"></i></div>';
      actionsHtml='<button class="btn btn-gold" id="mbRestock" style="width:100%;margin-top:8px">📦 Закупить — '+fmtShort(b.restock)+' ₽</button>';
    } else if(st.owner){
      stateHtml='<div class="biz-status" style="font-size:14px">👤 Владелец: <b>'+st.owner+'</b></div>';
      actionsHtml='<div class="biz-status" style="margin-top:8px">Бизнес занят другим игроком.</div>';
    } else if(st.auction){
      const a=st.auction,left=Math.max(0,a.endAt-Date.now());
      const mm=Math.floor(left/60000),ss=Math.floor(left%60000/1000);
      const youLead=a.leader===myName;
      const mb=NM.business.minBidFor(b,a);
      stateHtml='<div class="auc-bidline"><span>Ставка</span><b>'+fmtShort(a.bid)+' ₽</b></div>'+
        '<div class="biz-status">Лидер: '+(youLead?'🙂 Ты':(a.leader||'—'))+' · <span class="auc-timer">'+mm+':'+String(ss).padStart(2,'0')+'</span></div>';
      actionsHtml= youLead
        ? '<div class="biz-status" style="margin-top:8px;color:#16a34a">Ты лидируешь — перебивать себя нельзя.</div>'
        : '<button class="btn btn-primary" id="mbBid" style="width:100%;margin-top:8px">🔨 Поставить · '+fmtShort(mb)+' ₽</button>';
    } else {
      stateHtml='<div class="biz-status">🏛️ Государственный · старт '+fmtShort(b.start)+' ₽</div>';
      actionsHtml='<button class="btn btn-primary" id="mbStart" style="width:100%;margin-top:8px">Начать аукцион</button>';
    }
    const goBtn=near?'':'<button class="btn" id="mbGo" style="width:100%;margin-top:6px">🚶 Подойти ('+this.dist(b.x,b.y)+' м)</button>';
    const html='<button class="x" data-close>✕</button>'+
      '<div class="biz-top" style="margin-bottom:10px"><span class="biz-icon">'+b.icon+'</span>'+
      '<div><div class="biz-name">'+b.name+' <span class="biz-tier">ТИР '+b.tier+'</span></div>'+
      '<div class="biz-desc">'+b.desc+' · '+b.zone+'</div></div></div>'+
      '<div class="biz-bonuses" style="margin-bottom:10px">'+bonuses.join('')+'</div>'+
      stateHtml+actionsHtml+goBtn;
    const m=modal(html);
    const need=()=>NM.ui.toast('🚶 Сначала подойди к бизнесу','error');
    const g=m.ov.querySelector('#mbGo'); if(g)g.onclick=()=>{this.goTo(b.x,b.y);m.close();};
    const s=m.ov.querySelector('#mbStart'); if(s)s.onclick=()=>{if(!near){need();return;}NM.business.startAuction(id);m.close();this.openBiz(id);};
    const bb=m.ov.querySelector('#mbBid'); if(bb)bb.onclick=()=>{if(!near){need();return;}NM.business.bid(id);m.close();this.openBiz(id);};
    const r=m.ov.querySelector('#mbRestock'); if(r)r.onclick=()=>{if(!near){need();return;}NM.business.restock(id);m.close();this.openBiz(id);};
  },
  openProp(id){
    const pr=NM.DB.properties.find(x=>x.id===id);
    const owner=NM.properties.ownerOf(id);
    const near=this.near(pr.x,pr.y), myName=NM.profile?NM.profile.name:null;
    let stateHtml='',actionsHtml='';
    if(owner===myName){
      stateHtml='<div class="biz-status" style="color:#16a34a;font-weight:700">🏠 Твоя недвижимость · +'+fmtShort(pr.income)+'/с</div>';
      actionsHtml='<button class="btn btn-sm" id="mpSell" style="width:100%;margin-top:8px">Продать за '+fmtShort(Math.round(pr.price*0.7))+' ₽</button>';
    } else if(owner){
      stateHtml='<div class="biz-status" style="font-size:14px">👤 Владелец: <b>'+owner+'</b></div>';
    } else {
      stateHtml='<div class="biz-status">Свободна · +'+fmtShort(pr.income)+'/с</div>';
      actionsHtml='<button class="btn btn-primary" id="mpBuy" style="width:100%;margin-top:8px">Купить · '+fmtShort(pr.price)+' ₽</button>';
    }
    const goBtn=near?'':'<button class="btn" id="mpGo" style="width:100%;margin-top:6px">🚶 Подойти ('+this.dist(pr.x,pr.y)+' м)</button>';
    const html='<button class="x" data-close>✕</button>'+
      '<div class="biz-top" style="margin-bottom:10px"><span class="biz-icon">'+pr.icon+'</span>'+
      '<div><div class="biz-name">'+pr.name+'</div><div class="biz-desc">'+pr.desc+'</div></div></div>'+
      '<div class="biz-bonuses" style="margin-bottom:10px"><span class="bbonus">+'+fmtShort(pr.income)+'/с</span></div>'+
      stateHtml+actionsHtml+goBtn;
    const m=modal(html);
    const need=()=>NM.ui.toast('🚶 Сначала подойди','error');
    const g=m.ov.querySelector('#mpGo'); if(g)g.onclick=()=>{this.goTo(pr.x,pr.y);m.close();};
    const buy=m.ov.querySelector('#mpBuy'); if(buy)buy.onclick=()=>{if(!near){need();return;}NM.properties.buy(id);m.close();this.openProp(id);};
    const sell=m.ov.querySelector('#mpSell'); if(sell)sell.onclick=()=>{if(!near){need();return;}NM.properties.sell(id);m.close();};
  }
};
function switchTab(name){const b=document.querySelector('#tabs button[data-tab="'+name+'"]');if(b)b.click();}
