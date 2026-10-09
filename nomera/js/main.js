'use strict';
function renderAll(){
  if(!NM.profile)return;
  updateHeader();
  NM.ui.renderHist(); NM.ui.renderBest(); NM.ui.updateFreeSpins();
  NM.spin.updateCosts();
  NM.cases.render(); NM.garage.render(); NM.inventory.render();
  NM.business.render(); NM.business.renderMine();
  NM.trades.render();
  NM.auctions.render();
  NM.properties.render(); NM.prestige.render(); NM.rating.render();
  NM.wheel.renderPrizes(); NM.wheel.updateTimer();
}
function wireTabs(){
  document.getElementById('tabs').addEventListener('click',e=>{
    const b=e.target.closest('button[data-tab]'); if(!b)return;
    NM.sound.click();
    $$('#tabs button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    $$('.tab').forEach(t=>t.classList.remove('active'));
    NM.activeTab=b.dataset.tab;
    document.getElementById('tab-'+b.dataset.tab).classList.add('active');
    if(b.dataset.tab==='rating')NM.rating.render();
    if(b.dataset.tab==='garage')NM.garage.render();
    if(b.dataset.tab==='business')NM.business.render();
    if(b.dataset.tab==='mybusiness')NM.business.renderMine();
    if(b.dataset.tab==='trade')NM.trades.render();
    if(b.dataset.tab==='auction')NM.auctions.render();
    if(b.dataset.tab==='property')NM.properties.render();
    if(b.dataset.tab==='prestige')NM.prestige.render();
  });
}
function wireSpin(){
  document.getElementById('spin1').onclick=()=>NM.spin.doSpin(1);
  document.getElementById('spin5').onclick=()=>NM.spin.doSpin(5);
  document.getElementById('spin10').onclick=()=>NM.spin.doSpin(10);
  document.getElementById('jobBtn').onclick=()=>NM.spin.job();
  document.getElementById('jobAmount').textContent=NM.DB.economy.job.amount;
}
function wireInv(){
  document.getElementById('invSortBtn').onclick=()=>{NM.inventory.sort=NM.inventory.sort==='value'?'new':'value';
    document.getElementById('invSortBtn').textContent=NM.inventory.sort==='value'?'Сначала дорогие':'Сначала новые';
    NM.sound.click(); NM.inventory.render();};
  document.getElementById('invSellAllBtn').onclick=()=>{
    const list=NM.inventory.filter==='all'?[...NM.profile.plates]:NM.profile.plates.filter(p=>p.rar===NM.inventory.filter);
    if(!list.length)return;
    const total=list.reduce((s,p)=>s+p.value,0);
    const m=modal('<h3>Продать '+list.length+' номеров?</h3>'+
      '<p style="color:var(--muted);font-size:13px;margin-bottom:14px">Получишь <b>'+fmt(total)+' ₽</b>.</p>'+
      '<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn" data-close>Отмена</button><button class="btn btn-gold" id="cSell">Продать</button></div>');
    m.ov.querySelector('#cSell').onclick=()=>{NM.inventory.sellPlates(list.map(p=>p.id),'опт');m.close();};
  };
}
function startIntervals(){
  setInterval(()=>{const inc=totalIncome(); if(inc>0)addMoney(inc,true);},1000);
  setInterval(()=>{worldTick(); NM.auctions.tick(); if(NM.activeTab==='auction')NM.auctions.render();},1000);
  setInterval(()=>NM.save.persist(),8000);
  setInterval(()=>{ if(NM.profile){NM.wheel.updateTimer(); NM.rating.render(); updateHeader(); NM.prestige.renderIfActive(); NM.trades.badge(); NM.auctions.badge();} },3000);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)NM.save.persist();});
  setInterval(()=>{
    const btn=document.getElementById('jobBtn'); if(!btn||!NM.profile)return;
    const left=(NM.profile.jobAt||0)+NM.DB.economy.job.cooldown-Date.now();
    if(left>0){btn.disabled=true;btn.textContent='💼 Готово через '+Math.ceil(left/1000)+'с';}
    else{btn.disabled=false;btn.innerHTML='💼 Подработать +<span>'+NM.DB.economy.job.amount+'</span> ₽';}
  },500);
  let shown=0;
  (function loop(){
    const target=NM.profile?NM.profile.money:0;
    shown+=(target-shown)*0.16; if(Math.abs(target-shown)<0.6)shown=target;
    const el=document.getElementById('moneyVal'); if(el)el.textContent=fmtShort(shown);
    requestAnimationFrame(loop);
  })();
}
function init(){
  NM.save.load();
  NM.spin.buildStageSlots();
  document.getElementById('oddsBox').innerHTML=NM.DB.rarities.order.map(k=>{
    const r=NM.DB.rarities.data[k];
    return '<div class="odd-row"><span><span class="dot" style="background:'+r.c+'"></span>'+r.name+'</span><b style="color:'+r.c+';font-family:JetBrains Mono">'+r.w+'%</b></div>';
  }).join('');
  wireTabs(); wireSpin(); wireInv();
  NM.wheel.draw();
  document.getElementById('wheelSpinBtn').onclick=()=>{if(!NM.profile){NM.ui.toast('Сначала войди','error');return;}NM.wheel.spin();};
  document.getElementById('playerChip').onclick=()=>NM.ui.openProfileModal();
  document.getElementById('newPlayerBtn').onclick=()=>NM.ui.openProfileModal();
  document.getElementById('sndBtn').onclick=()=>{NM.save.data.muted=!NM.save.data.muted;document.getElementById('sndBtn').textContent=NM.save.data.muted?'✕':'♪';NM.save.persist();};
  document.getElementById('sndBtn').textContent=NM.save.data.muted?'✕':'♪';
  document.getElementById('logoutBtn').onclick=()=>NM.auth.logout();
  document.getElementById('statsBtn').onclick=()=>{
    if(!NM.profile){NM.ui.toast('Сначала войди','error');return;}
    const s=NM.profile.stats;
    modal('<button class="x" data-close>✕</button><h3>◧ Статистика</h3>'+
      '<div class="stat-grid">'+
        '<div class="stat-cell"><div class="v">'+fmt(s.spins)+'</div><div class="k">круток</div></div>'+
        '<div class="stat-cell"><div class="v">'+fmt(s.cases)+'</div><div class="k">кейсов</div></div>'+
        '<div class="stat-cell"><div class="v">'+fmt(s.sold)+'</div><div class="k">продано номеров</div></div>'+
        '<div class="stat-cell"><div class="v">'+fmtShort(s.earned)+' ₽</div><div class="k">заработано</div></div>'+
      '</div>'+
      '<div style="margin-top:14px;text-align:center">'+
        '<div style="color:var(--muted);font-size:11px;margin-bottom:6px">ЛУЧШИЙ НОМЕР</div>'+
        (NM.profile.best?plateHTML(NM.profile.best,'md')+'<div style="margin-top:6px;font-family:JetBrains Mono;font-weight:700">'+fmt(NM.profile.best.value)+' ₽</div>':'<span style="color:var(--muted)">нет</span>')+
      '</div>');
  };
  startIntervals();
  NM.auth.show();
}
init();
