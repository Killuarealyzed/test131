window.NM = window.NM || {};
NM.activeTab=NM.activeTab||'spin';
NM.business={
  minBidFor(b,a){ const minRaise=Math.max(Math.round(b.start*0.05),100);
    return a.leader? a.bid+minRaise : b.start; },
  durFor(b){ const t={1:180,2:600,3:3600,4:21600,5:86400}; return (t[b.tier]||180)*1000; },
  bonusesHtml(b){
    const arr=[];
    if(b.inc)arr.push('<span class="bbonus">+'+fmtShort(b.inc)+'/с</span>');
    if(b.cap)arr.push('<span class="bbonus blue">+'+b.cap+' слотов</span>');
    if(b.mult)arr.push('<span class="bbonus purple">+'+b.mult+'% доход</span>');
    return arr.join('');
  },
  render(){
    const grid=document.getElementById('bizGrid'); if(!grid)return;
    const w=worldBiz(); const name=NM.profile?NM.profile.name:null;
    grid.innerHTML='';
    NM.DB.businesses.forEach(b=>{
      const st=w[b.id]||{owner:null,supplies:100,auction:null};
      const el=document.createElement('div');
      el.className='biz-card panel'+(st.owner===name?' owned':'');
      let status='';
      if(st.owner===name){
        status='<div class="biz-status" style="color:#16a34a;font-weight:700">🏢 Твой бизнес · +'+fmtShort(b.inc)+'/с</div>'+
          '<div class="biz-status" style="margin-top:6px">Управление — во вкладке «Мои бизнесы».</div>';
      } else if(st.owner){
        status='<div class="biz-status">Владелец: <b>'+st.owner+'</b></div>';
      } else if(st.auction){
        const a=st.auction,left=Math.max(0,a.endAt-Date.now());
        const youLead=a.leader===name;
        const mb=this.minBidFor(b,a);
        status='<div class="auc-bidline"><span>Ставка</span><b>'+fmtShort(a.bid)+' ₽</b></div>'+
          '<div class="biz-status">Лидер: '+(youLead?'🙂 Ты':(a.leader||'—'))+' · <span class="auc-timer">'+formatDur(left)+'</span></div>'+
          '<div class="biz-status" style="margin-top:2px">Мин. цена: '+fmtShort(b.start)+' ₽</div>'+
          (youLead?'<div class="biz-status" style="color:#16a34a;margin-top:6px">Ты лидируешь — перебивать себя нельзя.</div>'
            :'<button class="btn btn-primary btn-sm" data-act="bid" style="margin-top:8px;width:100%">🔨 Поставить · '+fmtShort(mb)+' ₽</button>');
      } else {
        status='<div class="biz-status">🏛️ Государственный · мин. цена '+fmtShort(b.start)+' ₽ · аукцион '+formatDur(this.durFor(b))+'</div>'+
          '<button class="btn btn-primary btn-sm" data-act="start" style="margin-top:8px;width:100%">Начать аукцион</button>';
      }
      el.innerHTML='<div class="biz-top"><span class="biz-icon">'+b.icon+'</span>'+
        '<div><div class="biz-name">'+b.name+' <span class="biz-tier">ТИР '+b.tier+'</span></div>'+
        '<div class="biz-desc">'+b.desc+' · '+b.zone+'</div></div></div>'+
        '<div class="biz-bonuses">'+this.bonusesHtml(b)+'</div>'+status;
      el.querySelectorAll('[data-act]').forEach(btn=>{
        btn.onclick=()=>{
          const act=btn.dataset.act;
          if(act==='start')this.startAuction(b.id);
          else if(act==='bid')this.bid(b.id);
        };
      });
      grid.appendChild(el);
    });
  },
  renderMine(){
    const grid=document.getElementById('myBizGrid'); if(!grid)return;
    const w=worldBiz(); const me=NM.profile?NM.profile.name:null;
    const mine=NM.DB.businesses.filter(b=>w[b.id]&&w[b.id].owner===me);
    const actInc=mine.reduce((s,b)=>w[b.id].supplies>0?s+b.inc:s,0);
    grid.innerHTML='';
    const head=document.createElement('div');
    head.className='inv-summary'; head.style.marginBottom='14px';
    head.innerHTML='Твоих бизнесов: <b>'+mine.length+'</b> · Активный доход: <b>+'+fmtShort(actInc)+'/с</b>';
    grid.appendChild(head);
    if(!mine.length){
      const e=document.createElement('div'); e.className='inv-empty';
      e.textContent='У тебя пока нет бизнесов. Выкупи их на аукционе во вкладке «Бизнес».';
      grid.appendChild(e); return;
    }
    const wrap=document.createElement('div'); wrap.className='biz-grid';
    mine.forEach(b=>{
      const st=w[b.id];
      const sup=Math.max(0,Math.round(st.supplies));
      const col=sup>50?'#16a34a':sup>20?'#d97706':'#dc2626';
      let warn='';
      if(st.supplies<=0&&st.shutdownAt){const left=Math.max(0,st.shutdownAt-Date.now());
        warn='<div style="color:#dc2626;font-weight:700;margin-top:4px">⚠️ Закроется через '+formatDur(left)+' — закупись!</div>';}
      const el=document.createElement('div'); el.className='biz-card panel owned';
      el.innerHTML='<div class="biz-top"><span class="biz-icon">'+b.icon+'</span>'+
        '<div><div class="biz-name">'+b.name+' <span class="biz-tier">ТИР '+b.tier+'</span></div>'+
        '<div class="biz-desc">'+b.zone+' · +'+fmtShort(b.inc)+'/с</div></div></div>'+
        '<div class="biz-status">Запас продуктов: '+sup+'%'+(st.supplies>0?'':' · <b style="color:#dc2626">простой</b>')+'</div>'+
        '<div class="supbar"><i style="width:'+sup+'%;background:'+col+'"></i></div>'+warn+
        '<div style="display:flex;gap:6px;margin-top:8px">'+
          '<button class="btn btn-gold btn-sm" data-mact="restock" style="flex:1">📦 Закупить · '+fmtShort(b.restock)+' ₽</button>'+
          '<button class="btn btn-sm" data-mact="sell" style="color:#dc2626">Продать</button>'+
        '</div>';
      el.querySelectorAll('[data-mact]').forEach(btn=>{
        btn.onclick=()=>{ if(btn.dataset.mact==='restock')this.restock(b.id); else this.sell(b.id); };
      });
      wrap.appendChild(el);
    });
    grid.appendChild(wrap);
  },
  renderIfActive(){ if(NM.activeTab==='business')this.render(); if(NM.activeTab==='mybusiness')this.renderMine(); },
  startAuction(id){
    const b=NM.DB.businesses.find(x=>x.id===id); const st=worldBiz()[id];
    if(!st||st.owner||st.auction)return;
    const now=Date.now();
    st.auction={bid:0,leader:null,locked:{},endAt:now+this.durFor(b),warnEnd:false};
    NM.ui.toast('🔨 Аукцион за «'+b.name+'» начался! Длится '+formatDur(this.durFor(b))+'. Мин. цена '+fmtShort(b.start)+' ₽.','info'); NM.sound.click();
    this.render(); NM.save.persist();
  },
  bid(id,amount){
    const b=NM.DB.businesses.find(x=>x.id===id); const st=worldBiz()[id]; const a=st.auction;
    if(!a||!NM.profile)return;
    const name=NM.profile.name;
    if(a.leader===name){NM.ui.toast('Ты уже лидируешь — свою ставку перебивать нельзя','error');NM.sound.err();return;}
    const minBid=this.minBidFor(b,a);
    let amt=(amount&&amount>=minBid)?amount:minBid;
    const already=a.locked[name]||0;
    const need=amt-already;
    if(NM.profile.money<need){NM.ui.toast('Не хватает денег','error');NM.sound.err();return;}
    addMoney(-need);
    if(a.leader&&a.leader!==name){
      const prev=NM.save.getProfile(a.leader);
      if(prev)prev.money+=a.locked[a.leader];
      delete a.locked[a.leader];
    }
    a.locked[name]=amt; a.bid=amt; a.leader=name;
    const now=Date.now(); const minLeft=10*60*1000;
    if(a.endAt-now<minLeft)a.endAt=now+minLeft;
    NM.sound.click(); this.render(); NM.save.persist();
  },
  restock(id){
    const b=NM.DB.businesses.find(x=>x.id===id); const st=worldBiz()[id];
    if(!st||!NM.profile||st.owner!==NM.profile.name)return;
    if(NM.profile.money<b.restock){NM.ui.toast('Не хватает денег на закупку','error');NM.sound.err();return;}
    addMoney(-b.restock); st.supplies=100; st.shutdownAt=null;
    NM.sound.cash(); NM.ui.toast('📦 «'+b.name+'» закуплен, запас 100%','ok');
    this.renderMine(); updateHeader(); NM.save.persist();
  },
  sell(id){
    const b=NM.DB.businesses.find(x=>x.id===id); const st=worldBiz()[id];
    if(!st||!NM.profile||st.owner!==NM.profile.name)return;
    const refund=Math.round(b.start*0.6);
    st.owner=null; st.supplies=100; st.auction=null; st.shutdownAt=null;
    addMoney(refund);
    NM.sound.cash(); NM.ui.toast('Бизнес «'+b.name+'» продан за '+fmtShort(refund)+' ₽','ok');
    this.renderMine(); updateHeader(); NM.save.persist();
  }
};
// мировой тик: аукционы только между игроками + запас продуктов
function worldTick(){
  const data=NM.save.data; if(!data||!data.world)return;
  const w=data.world.businesses; const now=Date.now();
  const me=NM.profile?NM.profile.name:null;
  NM.DB.businesses.forEach(b=>{
    let st=w[b.id];
    if(!st){st=w[b.id]={owner:null,supplies:100,shutdownAt:null,auction:null};}
    if(st.auction){
      const a=st.auction;
      if(now>=a.endAt){
        if(a.leader){
          st.owner=a.leader; st.supplies=100; st.shutdownAt=null;
          if(me===a.leader){NM.notify.push('🏢','Ты выкупил «'+b.name+'» за '+fmt(a.bid)+' ₽','gold');NM.sound.win(2);NM.ui.confetti('legend');}
        }
        st.auction=null; NM.save.persist();
      } else if(me&&a.leader===me){
        const left=a.endAt-now;
        if(left<=60000&&!a.warnEnd){a.warnEnd=true;NM.notify.push('⏱','Аукцион за «'+b.name+'» заканчивается — ты лидируешь!','gold');}
      }
    }
    if(st.owner){
      st.supplies=Math.max(0,st.supplies-b.deplete/60);
      if(st.owner===me){
        if(st.supplies<=20&&st.supplies>0&&!st.warnLow){st.warnLow=true;NM.notify.push('📉','Запас «'+b.name+'» низкий — закупись!','warn');}
        if(st.supplies>20)st.warnLow=false;
        if(st.supplies<=0&&!st.warnClose){st.warnClose=true;NM.notify.push('⚠️','«'+b.name+'» простаивает и скоро закроется!','warn');}
      }
      if(st.supplies<=0){
        if(!st.shutdownAt)st.shutdownAt=now+120000;
        else if(now>=st.shutdownAt){
          if(me===st.owner)NM.notify.push('🔒','«'+b.name+'» закрылся и вернулся государству','warn');
          st.owner=null; st.supplies=100; st.shutdownAt=null; st.auction=null; st.warnLow=false; st.warnClose=false;
          NM.save.persist();
        }
      } else {st.shutdownAt=null; st.warnClose=false;}
    }
  });
  NM.business.renderIfActive();
}
