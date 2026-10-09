window.NM = window.NM || {};
NM.spin={
  spinning:false,
  buildStageSlots(){
    const m=document.getElementById('slotMain'); m.innerHTML='';
    ['l','d','d','d','l','l'].forEach(()=>{const s=document.createElement('span');s.className='sch';s.textContent='–';m.appendChild(s);});
  },
  updateCosts(){
    document.getElementById('spin1Cost').textContent=fmt(spinCost(1));
    document.getElementById('spin5Cost').textContent=fmt(spinCost(5));
    document.getElementById('spin10Cost').textContent=fmt(spinCost(10));
    const d=spinDiscount();
    document.getElementById('spinDiscLabel').textContent=d>0?('Полная крутка · скидка −'+d+'% от бизнесов'):'Полная крутка номера';
  },
  job(){
    const p=NM.profile; const eco=NM.DB.economy.job; const now=Date.now();
    if(now-(p.jobAt||0)<eco.cooldown){NM.ui.toast('Подработка ещё не готова','error');return;}
    p.jobAt=now; addMoney(eco.amount);
    NM.ui.toast('💼 +'+eco.amount+' ₽ за подработку','ok'); NM.sound.cash();
    updateHeader(); NM.save.persist();
  },
  animateSpin(plate){
    return new Promise(res=>{
      const wrap=document.getElementById('stageWrap');
      wrap.className='pw xl';
      const cls=plate.country==='RUS'?'':plate.country==='BY'?' by':plate.country==='KZ'?' kz':' ua';
      wrap.querySelector('.plate').className='plate'+cls;
      const els=$$('#slotMain .sch'), reg=document.getElementById('slotRegion');
      reg.parentElement.querySelector('span:last-child').textContent=NM.DB.regions[plate.country].name;
      const L=['А','В','Е','К','М','Н','О','Р','С','Т','У','Х'];
      const sets=['l','d','d','d','l','l'].map(t=>t==='l'?L:'0123456789');
      const finals=[plate.l[0],plate.d[0],plate.d[1],plate.d[2],plate.l[1],plate.l[2]];
      const ivs=els.map((el,i)=>setInterval(()=>{el.textContent=pick(sets[i]);el.classList.add('rolling');},42));
      const regIv=setInterval(()=>{reg.textContent=pick(NM.DB.regions[plate.country].regions);},80);
      let stopped=0;
      els.forEach((el,ix)=>{
        setTimeout(()=>{
          clearInterval(ivs[ix]); el.textContent=finals[ix];
          el.classList.remove('rolling'); el.classList.add('hit');
          NM.sound.hit(ix);
          if(++stopped===els.length){
            setTimeout(()=>{
              clearInterval(regIv); reg.textContent=plate.region;
              wrap.classList.add('rar-'+plate.rar);
              const idx=NM.DB.rarities.order.indexOf(plate.rar);
              NM.sound.win(idx); if(idx>=3)NM.ui.confetti(plate.rar);
              res();
            },280);
          }
        },600+ix*300);
      });
    });
  },
  async doSpin(count){
    if(this.spinning||!NM.profile)return;
    const p=NM.profile;
    const cap=inventoryCap();
    if(p.plates.length+count>cap){NM.ui.toast('Инвентарь полон ('+cap+')! Продай номера','error');NM.sound.err();return;}
    const freeUse=Math.min(count,p.freeSpins);
    const moneyCost=spinCost(count-freeUse);
    if(p.money<moneyCost){NM.ui.toast('Не хватает денег 😔','error');NM.sound.err();return;}
    p.freeSpins-=freeUse;
    if(moneyCost>0){addMoney(-moneyCost,true);floatMoney(-moneyCost);}
    this.spinning=true;
    ['spin1','spin5','spin10'].forEach(id=>document.getElementById(id).disabled=true);
    document.getElementById('resultZone').innerHTML='<span style="color:var(--mute);font-size:12.5px">Крутим…</span>';
    const plates=[];
    for(let i=0;i<count;i++){
      const rar=NM.plates.rollRarity(NM.plates.maxRarityFor(p.stats.spins+i));
      plates.push(NM.plates.makePlate(rar));
    }
    await this.animateSpin(plates[0]);
    plates.forEach(pl=>NM.inventory.addPlate(pl));
    p.stats.spins+=count; addXP(8*count);
    plates.forEach(pl=>{p.hist.unshift({id:pl.id,l:pl.l,d:pl.d,region:pl.region,rar:pl.rar,value:pl.value,country:pl.country});});
    p.hist=p.hist.slice(0,14);
    NM.ui.renderHist(); this.showResult(plates);
    this.spinning=false;
    ['spin1','spin5','spin10'].forEach(id=>document.getElementById(id).disabled=false);
    NM.ui.updateFreeSpins(); this.updateCosts(); updateHeader(); NM.save.persist();
  },
  showResult(plates){
    const rz=document.getElementById('resultZone');
    const total=plates.reduce((s,p)=>s+p.value,0);
    const ids=plates.map(p=>p.id);
    if(plates.length===1){
      const p=plates[0],r=NM.DB.rarities.data[p.rar];
      rz.innerHTML='<div class="rz-title" style="color:'+r.c+'">'+r.name.toUpperCase()+'</div>'+
        plateHTML(p,'lg')+
        '<div class="rz-feats">'+p.feats.map(f=>'<span>✦ '+f+'</span>').join('')+'</div>'+
        '<div class="rz-value">'+fmt(p.value)+' ₽</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+
          '<button class="btn btn-gold btn-sm" id="rzSell">Продать за '+fmt(p.value)+' ₽</button>'+
          '<button class="btn btn-sm" id="rzKeep">Оставить</button></div>';
      rz.querySelector('#rzSell').onclick=()=>{NM.inventory.sellPlates(ids,plateText(p));rz.innerHTML='<span style="color:var(--mute);font-size:12.5px">Продано ✅</span>';};
      rz.querySelector('#rzKeep').onclick=()=>{rz.innerHTML='<span style="color:var(--mute);font-size:12.5px">В коллекции ✅</span>';};
    }else{
      rz.innerHTML='<div class="rz-title">ВЫПАЛО '+plates.length+' НОМЕРОВ</div>'+
        '<div class="rz-multi">'+plates.map(p=>plateHTML(p,'sm')).join('')+'</div>'+
        '<div class="rz-value">'+fmt(total)+' ₽</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+
          '<button class="btn btn-gold btn-sm" id="rzSell">Продать всё за '+fmtShort(total)+' ₽</button>'+
          '<button class="btn btn-sm" id="rzKeep">Оставить</button></div>';
      rz.querySelector('#rzSell').onclick=()=>{NM.inventory.sellPlates(ids,'связка');rz.innerHTML='<span style="color:var(--mute);font-size:12.5px">Продано ✅</span>';};
      rz.querySelector('#rzKeep').onclick=()=>{rz.innerHTML='<span style="color:var(--mute);font-size:12.5px">В коллекции ✅</span>';};
    }
    NM.inventory.render();
  }
};
NM.ui.renderHist=function(){
  const box=document.getElementById('histBox'); const p=NM.profile;
  if(!p||!p.hist.length){box.innerHTML='<span style="color:var(--mute);font-size:11.5px">крутни первый номер!</span>';return;}
  box.innerHTML=p.hist.map(x=>'<div class="hist-item">'+plateHTML(x,'xs')+'<span>'+fmtShort(x.value)+' ₽</span></div>').join('');
};
NM.ui.renderBest=function(){
  const box=document.getElementById('bestBox'); const p=NM.profile;
  if(!p||!p.best){box.innerHTML='<span style="color:var(--mute);font-size:12px">пока пусто…</span>';return;}
  box.innerHTML='<div style="display:flex;flex-direction:column;gap:7px;align-items:center">'+plateHTML(p.best,'md')+
    '<b style="color:#0a0a0a;font-family:JetBrains Mono">'+fmt(p.best.value)+' ₽</b></div>';
};
NM.ui.updateFreeSpins=function(){const c=document.getElementById('freeSpinsCount');if(c)c.textContent=NM.profile?NM.profile.freeSpins:0;};
