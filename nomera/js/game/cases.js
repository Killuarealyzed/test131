window.NM = window.NM || {};
NM.cases={
  render(){
    const grid=document.getElementById('casesGrid'); if(!grid)return;
    grid.innerHTML='';
    NM.DB.cases.forEach(cs=>{
      const locked=NM.profile && NM.profile.level<cs.lvl;
      const el=document.createElement('div');
      el.className='case-card panel';
      const odds=Object.keys(cs.pool).map(k=>'<span style="color:var(--c-'+k+')">'+NM.DB.rarities.data[k].name+': '+cs.pool[k]+'%</span>').join(' · ');
      let status;
      if(locked){
        status='<button class="btn btn-sm" disabled style="width:100%">🔒 Нужен '+cs.lvl+' уровень</button>';
      } else {
        status='<button class="btn btn-primary btn-sm" data-case="'+cs.id+'" style="width:100%">Открыть · '+fmtShort(cs.price)+' ₽</button>';
      }
      el.innerHTML='<div class="case-art"><span>'+cs.emo+'</span></div>'+
        '<div class="case-name">'+cs.name+'</div>'+
        '<div class="case-odds">'+odds+'</div>'+status;
      if(!locked){
        el.querySelector('[data-case]').onclick=()=>this.open(cs.id);
      }
      grid.appendChild(el);
    });
  },
  weightedPool(pool){
    const keys=Object.keys(pool),total=keys.reduce((s,k)=>s+pool[k],0);
    let r=Math.random()*total;
    for(const k of keys){if(r<pool[k])return k;r-=pool[k];}
    return keys[0];
  },
  open(id){
    const cs=NM.DB.cases.find(c=>c.id===id); if(!cs)return;
    const me=NM.profile; if(!me)return;
    if(me.level<cs.lvl){NM.ui.toast('Нужен '+cs.lvl+' уровень','error');return;}
    if(me.money<cs.price){NM.ui.toast('Не хватает денег','error');NM.sound.err();return;}
    addMoney(-cs.price);
    me.stats.cases=(me.stats.cases||0)+1;
    // сразу выдаём и регистрируем номер (не потеряется даже если закрыть окно)
    const winPlate=NM.plates.makePlate(this.weightedPool(cs.pool));
    NM.inventory.addPlate(winPlate);
    NM.save.registerPlate(winPlate,me.name);
    NM.save.persist();
    const ITEMS=55,TARGET=44;
    const items=[];
    for(let i=0;i<ITEMS;i++) items.push(i===TARGET?winPlate:NM.plates.makeDisplayPlate(this.weightedPool(cs.pool)));
    const m=modal('<h3 style="text-align:center">'+cs.emo+' '+cs.name+'</h3>'+
      '<div class="reel-window" id="reelWin"><div class="reel-marker"></div>'+
      '<div class="reel-strip" id="reelStrip">'+items.map(p=>'<div class="reel-item">'+plateHTML(p,'sm')+'</div>').join('')+'</div></div>'+
      '<div id="caseResultBox"></div>',{static:true,statik:true});
    const strip=m.ov.querySelector('#reelStrip');
    const win=m.ov.querySelector('#reelWin');
    requestAnimationFrame(()=>{
      const itemW=strip.children[0].offsetWidth;
      const gap=parseFloat(getComputedStyle(strip).gap)||8;
      const STEP=itemW+gap;                 // точный шаг = ширина + отступ
      const winW=win.clientWidth;
      const dist=TARGET*STEP+itemW/2-winW/2+rnd(-18,18);
      const dur=4000; const start=performance.now();
      const frame=(now)=>{
        const t=Math.min(1,(now-start)/dur);
        const ease=1-Math.pow(1-t,4);
        strip.style.transform='translateX('+(-dist*ease)+'px)';
        if(t<1)requestAnimationFrame(frame);
        else { strip.children[TARGET].classList.add('win'); this.showResult(m,winPlate); }
      };
      requestAnimationFrame(frame);
    });
  },
  showResult(m,winPlate){
    const idx=NM.DB.rarities.order.indexOf(winPlate.rar);
    NM.sound.win(idx); if(idx>=2)NM.ui.confetti(winPlate.rar);
    addXP(10);
    m.ov.querySelector('#caseResultBox').innerHTML='<div class="case-result">'+
      '<span class="chip-rar rar-'+winPlate.rar+'">'+NM.DB.rarities.data[winPlate.rar].name+'</span>'+
      plateHTML(winPlate,'lg')+
      '<div class="rz-feats">'+winPlate.feats.map(f=>'<span>✦ '+f+'</span>').join('')+'</div>'+
      '<div class="rz-value">'+fmt(winPlate.value)+' ₽</div>'+
      '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+
        '<button class="btn btn-gold btn-sm" id="csSell">Продать за '+fmt(winPlate.value)+' ₽</button>'+
        '<button class="btn btn-sm" id="csTake">Забрать</button>'+
      '</div></div>';
    m.ov.querySelector('#csSell').onclick=()=>{
      NM.save.unregisterPlate(winPlate);
      NM.inventory.sellPlates([winPlate.id],plateText(winPlate));
      m.close();
    };
    m.ov.querySelector('#csTake').onclick=()=>{ m.close(); };
    NM.inventory.render(); NM.save.persist();
  }
};
