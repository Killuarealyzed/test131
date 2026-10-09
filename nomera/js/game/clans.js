window.NM = window.NM || {};
NM.clans={
  list(){ return NM.save.data.world.clans||[]; },
  myClan(){ if(!NM.profile||!NM.profile.clanId)return null;
    return this.list().find(c=>c.id===NM.profile.clanId)||null; },
  slotCost(clan){
    const cfg=NM.DB.clans;
    const n=clan.slots-clan.baseSlots;
    return Math.round(cfg.baseSlotCost*Math.pow(cfg.slotGrowth,n));
  },
  levelCost(clan){
    const cfg=NM.DB.clans;
    return Math.round(cfg.levelCostBase*Math.pow(cfg.levelCostGrowth,(clan.level||1)-1));
  },
  memberBonus(clan){
    const cfg=NM.DB.clans;
    return Math.min(cfg.bonusCap, clan.members.length*cfg.bonusPerMember);
  },
  levelIncomeBonus(clan){ return (clan.level||1)*NM.DB.clans.incomeBonusPerLevel; },
  levelInvBonus(clan){ return (clan.level||1)*NM.DB.clans.invSlotsPerLevel; },
  esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },
  render(){
    const box=document.getElementById('clanBox'); if(!box||!NM.profile)return;
    const me=NM.profile; const myC=this.myClan();
    const clans=this.list();
    let html='';
    if(myC){
      const bonus=Math.round(this.memberBonus(myC)*100);
      const lvlBonus=Math.round(this.levelIncomeBonus(myC)*100);
      const invBonus=this.levelInvBonus(myC);
      const nextSlotCost=this.slotCost(myC);
      const nextLvlCost=this.levelCost(myC);
      const isLeader=myC.leader===me.name;
      const lvl=myC.level||1;
      html+='<div class="panel" style="margin-bottom:16px;border-color:rgba(26,158,99,.4)">';
      html+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">';
      html+='<h3 style="margin:0">'+this.esc(myC.name)+'</h3>';
      html+='<div style="display:flex;gap:6px;align-items:center">';
      html+='<span class="biz-tier">УР '+lvl+'</span>';
      html+='<span class="biz-tier">'+myC.members.length+'/'+myC.slots+'</span>';
      if(!isLeader) html+='<button class="btn btn-sm" id="leaveClan" style="color:var(--red)">Покинуть</button>';
      html+='</div></div>';
      html+='<div class="sub" style="margin-bottom:10px">Лидер: <b>'+this.esc(myC.leader)+'</b></div>';
      html+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">';
      html+='<span class="bbonus">👥 +'+bonus+'% доход</span>';
      html+='<span class="bbonus purple">📈 +'+lvlBonus+'% доход (ур.)</span>';
      html+='<span class="bbonus blue">📦 +'+invBonus+' слотов</span>';
      html+='</div>';
      if(isLeader){
        html+='<div style="display:flex;gap:8px;flex-wrap:wrap">';
        html+='<button class="btn btn-gold btn-sm" id="buySlot">🔓 Слот · '+fmtShort(nextSlotCost)+' ₽</button>';
        if(lvl<NM.DB.clans.maxLevel) html+='<button class="btn btn-primary btn-sm" id="upgradeClan">⬆️ Прокачать · '+fmtShort(nextLvlCost)+' ₽</button>';
        else html+='<span class="biz-status" style="color:var(--gold-deep);align-self:center">Макс. уровень</span>';
        html+='<button class="btn btn-sm" id="renameClan">✏️</button>';
        html+='<button class="btn btn-sm" id="disbandClan" style="color:var(--red)">Распустить</button>';
        html+='</div>';
      }
      html+='<div style="margin-top:12px;font-size:12px;color:var(--muted)">Участники:</div>';
      html+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">';
      myC.members.forEach(mn=>{
        const isMe=mn===me.name;
        html+='<span class="chip" style="font-size:11px;padding:5px 10px">'+(isMe?'🙂 ':'')+this.esc(mn)+(isMe?' (ты)':'')+'</span>';
      });
      html+='</div></div>';
    } else {
      html+='<div class="panel" style="margin-bottom:16px;text-align:center;padding:24px">';
      html+='<div style="font-size:32px;margin-bottom:8px">⚔️</div>';
      html+='<div style="font-weight:700;margin-bottom:8px">Ты не состоишь в клане</div>';
      html+='<div class="sub" style="margin-bottom:12px">Вступи в существующий или создай свой за '+fmtShort(NM.DB.clans.createCost)+' ₽</div>';
      html+='<button class="btn btn-primary" id="createClanBtn">➕ Создать клан</button>';
      html+='</div>';
    }
    const available=clans.filter(c=>c.members.length<c.slots && (!myC || myC.id!==c.id));
    if(available.length){
      html+='<h4 style="margin-bottom:10px">Доступные кланы ('+available.length+')</h4>';
      html+='<div class="biz-grid">';
      available.forEach(c=>{
        const bonus=Math.round(this.memberBonus(c)*100);
        const full=c.members.length>=c.slots;
        html+='<div class="biz-card panel">';
        html+='<div class="biz-name">'+this.esc(c.name)+' <span class="biz-tier">УР '+(c.level||1)+'</span> <span class="biz-tier">'+c.members.length+'/'+c.slots+'</span></div>';
        html+='<div class="biz-desc">Лидер: '+this.esc(c.leader)+' · +'+bonus+'% доход</div>';
        if(!myC && !full){
          html+='<button class="btn btn-primary btn-sm" data-join="'+c.id+'" style="margin-top:8px;width:100%">Вступить</button>';
        } else if(full){
          html+='<div class="biz-status" style="margin-top:8px;color:var(--muted)">Нет мест</div>';
        }
        html+='</div>';
      });
      html+='</div>';
    }
    box.innerHTML=html;
    const leave=box.querySelector('#leaveClan'); if(leave)leave.onclick=()=>this.leave();
    const buySlot=box.querySelector('#buySlot'); if(buySlot)buySlot.onclick=()=>this.buySlot();
    const up=box.querySelector('#upgradeClan'); if(up)up.onclick=()=>this.upgrade();
    const rename=box.querySelector('#renameClan'); if(rename)rename.onclick=()=>this.rename();
    const disband=box.querySelector('#disbandClan'); if(disband)disband.onclick=()=>this.disband();
    const create=box.querySelector('#createClanBtn'); if(create)create.onclick=()=>this.create();
    box.querySelectorAll('[data-join]').forEach(b=>{ b.onclick=()=>this.join(b.dataset.join); });
  },
  create(){
    const me=NM.profile; const cost=NM.DB.clans.createCost;
    if(me.money<cost){NM.ui.toast('Нужно '+fmtShort(cost)+' ₽ для создания клана','error');return;}
    const m=modal('<button class="x" data-close>✕</button><h3>➕ Создать клан</h3>'+
      '<div class="sub" style="margin-bottom:10px">Стоимость: '+fmtShort(cost)+' ₽. Ты станешь лидером.</div>'+
      '<input class="name-input" id="clanName" placeholder="Название клана" maxlength="20">'+
      '<button class="btn btn-primary" style="width:100%" id="clanGo">Создать</button>');
    m.ov.querySelector('#clanGo').onclick=()=>{
      const name=m.ov.querySelector('#clanName').value.trim();
      if(!name){NM.ui.toast('Введи название','error');return;}
      if(this.list().some(c=>c.name.toLowerCase()===name.toLowerCase())){NM.ui.toast('Название занято','error');return;}
      addMoney(-cost);
      const clan={id:genId(),name,leader:me.name,members:[me.name],slots:1,baseSlots:1,level:1,createdAt:Date.now()};
      this.list().push(clan);
      me.clanId=clan.id;
      NM.save.persist(); NM.ui.toast('Клан «'+name+'» создан!','gold'); NM.sound.win(1);
      m.close(); this.render(); updateHeader();
    };
  },
  join(clanId){
    const me=NM.profile; const clan=this.list().find(c=>c.id===clanId);
    if(!clan){NM.ui.toast('Клан не найден','error');return;}
    if(clan.members.length>=clan.slots){NM.ui.toast('Нет мест','error');return;}
    if(me.clanId){NM.ui.toast('Сначала покинь текущий клан','error');return;}
    clan.members.push(me.name);
    me.clanId=clan.id;
    NM.save.persist(); NM.ui.toast('Ты вступил в клан «'+clan.name+'»','ok'); NM.sound.click();
    this.render(); updateHeader();
  },
  leave(){
    const me=NM.profile; const clan=this.myClan(); if(!clan)return;
    if(clan.leader===me.name){NM.ui.toast('Лидер не может покинуть — распусти клан','error');return;}
    clan.members=clan.members.filter(m=>m!==me.name);
    me.clanId=null;
    NM.save.persist(); NM.ui.toast('Ты покинул клан','info'); this.render(); updateHeader();
  },
  buySlot(){
    const me=NM.profile; const clan=this.myClan(); if(!clan||clan.leader!==me.name)return;
    const cost=this.slotCost(clan);
    if(me.money<cost){NM.ui.toast('Не хватает денег','error');return;}
    addMoney(-cost); clan.slots++;
    NM.save.persist(); NM.ui.toast('Куплен слот! Теперь '+clan.slots+' мест','gold'); NM.sound.cash();
    this.render();
  },
  upgrade(){
    const me=NM.profile; const clan=this.myClan(); if(!clan||clan.leader!==me.name)return;
    const lvl=clan.level||1;
    if(lvl>=NM.DB.clans.maxLevel){NM.ui.toast('Максимальный уровень клана','error');return;}
    const cost=this.levelCost(clan);
    if(me.money<cost){NM.ui.toast('Не хватает денег','error');return;}
    addMoney(-cost); clan.level=lvl+1;
    NM.save.persist(); NM.ui.toast('Клан прокачан до '+clan.level+' уровня!','gold'); NM.sound.win(1);
    this.render(); updateHeader();
  },
  rename(){
    const me=NM.profile; const clan=this.myClan(); if(!clan||clan.leader!==me.name)return;
    const m=modal('<button class="x" data-close>✕</button><h3>✏️ Переименовать клан</h3>'+
      '<input class="name-input" id="newClanName" placeholder="Новое название" maxlength="20" value="'+this.esc(clan.name)+'">'+
      '<button class="btn btn-primary" style="width:100%" id="renameGo">Сохранить</button>');
    m.ov.querySelector('#renameGo').onclick=()=>{
      const name=m.ov.querySelector('#newClanName').value.trim();
      if(!name){NM.ui.toast('Введи название','error');return;}
      clan.name=name; NM.save.persist(); NM.ui.toast('Клан переименован','ok'); m.close(); this.render();
    };
  },
  disband(){
    const me=NM.profile; const clan=this.myClan(); if(!clan||clan.leader!==me.name)return;
    const mm=modal('<h3>Распустить клан «'+this.esc(clan.name)+'»?</h3>'+
      '<p class="sub">Все участники будут исключены. Клан удалён навсегда.</p>'+
      '<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn" data-close>Отмена</button><button class="btn btn-red" id="disbandGo">Распустить</button></div>');
    mm.ov.querySelector('#disbandGo').onclick=()=>{
      clan.members.forEach(mn=>{const p=NM.save.getProfile(mn);if(p)p.clanId=null;});
      NM.save.data.world.clans=NM.save.data.world.clans.filter(c=>c.id!==clan.id);
      me.clanId=null;
      NM.save.persist(); NM.ui.toast('Клан распущен','info'); mm.close(); this.render(); updateHeader();
    };
  }
};
