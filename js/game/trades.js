window.NM = window.NM || {};
NM.trades={
  list(){
    if(!NM.save.data.world)NM.save.data.world={businesses:{}};
    if(!NM.save.data.world.trades)NM.save.data.world.trades=[];
    return NM.save.data.world.trades;
  },
  incoming(){ const me=NM.profile?NM.profile.name:null; if(!me)return[];
    return this.list().filter(t=>t.to===me&&t.status==='pending'); },
  outgoing(){ const me=NM.profile?NM.profile.name:null; if(!me)return[];
    return this.list().filter(t=>t.from===me&&t.status==='pending'); },
  badge(){ const el=document.getElementById('tradeBadge'); if(!el)return;
    const n=this.incoming().length; el.textContent=n; el.style.display=n>0?'inline-block':'none'; },
  findPlate(profileName,id){ const p=NM.save.getProfile(profileName); if(!p)return null;
    return p.plates.find(x=>x.id===id)||null; },
  assignedIn(prof,pid){ return Object.keys(prof.cars).some(k=>prof.cars[k].plateId===pid); },
  plateLabel(p){ return p.l[0]+' '+p.d.join('')+' '+p.l[1]+p.l[2]+' ('+NM.DB.rarities.data[p.rar].name+')'; },
  render(){
    const box=document.getElementById('tradeBox'); if(!box||!NM.profile)return;
    const inc=this.incoming(), out=this.outgoing();
    let html='<div style="margin-bottom:16px"><button class="btn btn-primary" id="newTrade">➕ Создать трейд</button></div>';
    html+='<h4 style="margin-bottom:8px">Входящие ('+inc.length+')</h4>';
    if(!inc.length)html+='<div class="inv-summary">Нет входящих трейдов.</div>';
    inc.forEach(t=>{html+=this.tradeCard(t,true);});
    html+='<h4 style="margin:14px 0 8px">Мои трейды ('+out.length+')</h4>';
    if(!out.length)html+='<div class="inv-summary">Нет исходящих трейдов.</div>';
    out.forEach(t=>{html+=this.tradeCard(t,false);});
    box.innerHTML=html;
    box.querySelector('#newTrade').onclick=()=>this.openCreate();
    box.querySelectorAll('[data-tact]').forEach(b=>{
      b.onclick=()=>{ const id=b.dataset.tid,act=b.dataset.tact;
        if(act==='accept')this.accept(id); else if(act==='reject')this.reject(id); else this.cancel(id); };
    });
    this.badge();
  },
  tradeCard(t,isIncoming){
    const givePlates=t.givePlates.map(id=>this.findPlate(t.from,id)).filter(Boolean);
    const wantPlates=t.wantPlates.map(id=>this.findPlate(t.to,id)).filter(Boolean);
    let html='<div class="panel" style="margin-bottom:10px">';
    html+='<div class="biz-status" style="margin-bottom:8px">'+(isIncoming?('От <b>'+t.from+'</b>'):('Для <b>'+t.to+'</b>'))+' · '+new Date(t.createdAt).toLocaleString()+'</div>';
    html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
    html+='<div><div style="font-size:12px;color:var(--mute);margin-bottom:4px">'+(isIncoming?'Он отдаёт':'Ты отдаёшь')+'</div>';
    html+=(givePlates.map(p=>'<div style="font-size:12px">'+this.plateLabel(p)+' — '+fmtShort(p.value)+' ₽</div>').join('')||'<div style="font-size:12px;color:var(--mute)">ничего</div>');
    if(t.giveMoney)html+='<div style="font-size:12px;color:#16a34a">+'+fmtShort(t.giveMoney)+' ₽</div>';
    html+='</div>';
    html+='<div><div style="font-size:12px;color:var(--mute);margin-bottom:4px">'+(isIncoming?'Он хочет':'Ты хочешь')+'</div>';
    html+=(wantPlates.map(p=>'<div style="font-size:12px">'+this.plateLabel(p)+' — '+fmtShort(p.value)+' ₽</div>').join('')||'<div style="font-size:12px;color:var(--mute)">ничего</div>');
    if(t.wantMoney)html+='<div style="font-size:12px;color:#dc2626">+'+fmtShort(t.wantMoney)+' ₽</div>';
    html+='</div></div>';
    html+='<div style="display:flex;gap:6px;margin-top:10px">';
    if(isIncoming){
      html+='<button class="btn btn-gold btn-sm" data-tact="accept" data-tid="'+t.id+'">Принять</button>';
      html+='<button class="btn btn-sm" data-tact="reject" data-tid="'+t.id+'">Отклонить</button>';
    } else {
      html+='<button class="btn btn-sm" data-tact="cancel" data-tid="'+t.id+'">Отменить</button>';
    }
    html+='</div></div>';
    return html;
  },
  openCreate(){
    const others=NM.save.getProfiles().filter(p=>p.name!==NM.profile.name);
    if(!others.length){NM.ui.toast('Нет других игроков для трейда','error');return;}
    const me=NM.profile;
    let giveSel=new Set(), wantSel=new Set(), recipient=others[0].name;
    const m=modal('<button class="x" data-close>✕</button><h3>➕ Новый трейд</h3>'+
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:var(--mute)">Кому:</label>'+
      '<select class="name-input" id="tRecip">'+others.map(o=>'<option value="'+o.name+'">'+o.name+'</option>').join('')+'</select></div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'+
        '<div><div style="font-size:12px;color:var(--mute);margin-bottom:6px">Ты отдаёшь (твои номера):</div>'+
        '<div id="tGiveList" style="max-height:200px;overflow:auto"></div>'+
        '<input class="name-input" id="tGiveMoney" type="number" min="0" placeholder="Деньги в придачу (₽)" style="margin-top:8px"></div>'+
        '<div><div style="font-size:12px;color:var(--mute);margin-bottom:6px">Ты хочешь (номера получателя):</div>'+
        '<div id="tWantList" style="max-height:200px;overflow:auto"></div>'+
        '<input class="name-input" id="tWantMoney" type="number" min="0" placeholder="Деньги запросить (₽)" style="margin-top:8px"></div>'+
      '</div>'+
      '<button class="btn btn-primary" style="width:100%;margin-top:12px" id="tSubmit">Отправить трейд</button>');
    const renderLists=()=>{
      const gl=m.ov.querySelector('#tGiveList');
      gl.innerHTML=me.plates.map(p=>{
        const locked=this.assignedIn(me,p.id);
        if(locked)return '<div class="pick-row" style="opacity:.45"><div class="pr-info"><b>'+this.plateLabel(p)+'</b><span>🔑 закреплён на технике</span></div></div>';
        const on=giveSel.has(p.id);
        return '<div class="pick-row" data-g="'+p.id+'" style="cursor:pointer;'+(on?'border-color:#16a34a;background:#f0fdf4':'')+'">'+
          '<div class="pr-info"><b>'+this.plateLabel(p)+'</b><span>'+fmtShort(p.value)+' ₽</span></div>'+
          '<span>'+(on?'✅':'⬜')+'</span></div>';
      }).join('')||'<div style="color:var(--mute);font-size:12px">Нет номеров</div>';
      gl.querySelectorAll('[data-g]').forEach(r=>r.onclick=()=>{const id=r.dataset.g; if(giveSel.has(id))giveSel.delete(id);else giveSel.add(id); renderLists();});
      const rp=NM.save.getProfile(recipient);
      const wl=m.ov.querySelector('#tWantList');
      wl.innerHTML=(rp?rp.plates:[]).map(p=>{
        const locked=this.assignedIn(rp,p.id);
        if(locked)return '<div class="pick-row" style="opacity:.45"><div class="pr-info"><b>'+this.plateLabel(p)+'</b><span>🔑 закреплён</span></div></div>';
        const on=wantSel.has(p.id);
        return '<div class="pick-row" data-w="'+p.id+'" style="cursor:pointer;'+(on?'border-color:#2563eb;background:#eff6ff':'')+'">'+
          '<div class="pr-info"><b>'+this.plateLabel(p)+'</b><span>'+fmtShort(p.value)+' ₽</span></div>'+
          '<span>'+(on?'✅':'⬜')+'</span></div>';
      }).join('')||'<div style="color:var(--mute);font-size:12px">У получателя нет номеров</div>';
      wl.querySelectorAll('[data-w]').forEach(r=>r.onclick=()=>{const id=r.dataset.w; if(wantSel.has(id))wantSel.delete(id);else wantSel.add(id); renderLists();});
    };
    renderLists();
    m.ov.querySelector('#tRecip').onchange=(e)=>{recipient=e.target.value; wantSel.clear(); renderLists();};
    m.ov.querySelector('#tSubmit').onclick=()=>{
      const giveMoney=parseInt(m.ov.querySelector('#tGiveMoney').value)||0;
      const wantMoney=parseInt(m.ov.querySelector('#tWantMoney').value)||0;
      if(giveSel.size===0&&wantSel.size===0&&giveMoney<=0&&wantMoney<=0){NM.ui.toast('Трейд пустой','error');return;}
      if(giveMoney>me.money){NM.ui.toast('Не хватает денег','error');return;}
      const t={id:genId(),from:me.name,to:recipient,givePlates:[...giveSel],giveMoney,wantPlates:[...wantSel],wantMoney,status:'pending',createdAt:Date.now()};
      this.list().push(t); NM.save.persist();
      NM.ui.toast('Трейд отправлен игроку '+recipient,'ok');
      m.close(); this.render();
    };
  },
  accept(id){
    const t=this.list().find(x=>x.id===id); if(!t||t.status!=='pending')return;
    const from=NM.save.getProfile(t.from), to=NM.save.getProfile(t.to);
    if(!from||!to){t.status='cancelled';NM.save.persist();this.render();return;}
    for(const pid of t.givePlates){ if(!from.plates.find(p=>p.id===pid)){NM.ui.toast('У отправителя уже нет одного из номеров','error');t.status='rejected';NM.save.persist();this.render();return;} }
    for(const pid of t.wantPlates){ if(!to.plates.find(p=>p.id===pid)){NM.ui.toast('У тебя уже нет одного из запрошенных номеров','error');t.status='rejected';NM.save.persist();this.render();return;} }
    if(from.money<t.giveMoney){NM.ui.toast('У отправителя не хватает денег','error');t.status='rejected';NM.save.persist();this.render();return;}
    if(to.money<t.wantMoney){NM.ui.toast('У тебя не хватает денег','error');t.status='rejected';NM.save.persist();this.render();return;}
    // обмен
    t.givePlates.forEach(pid=>{ this.unassign(from,pid); const i=from.plates.findIndex(p=>p.id===pid); if(i>=0){const [pl]=from.plates.splice(i,1); to.plates.push(pl);} });
    t.wantPlates.forEach(pid=>{ this.unassign(to,pid); const i=to.plates.findIndex(p=>p.id===pid); if(i>=0){const [pl]=to.plates.splice(i,1); from.plates.push(pl);} });
    from.money-=t.giveMoney; to.money+=t.giveMoney;
    to.money-=t.wantMoney; from.money+=t.wantMoney;
    t.status='accepted';
    NM.sound.cash(); NM.ui.toast('✅ Трейд принят! Обмен выполнен','gold');
    NM.save.persist(); renderAll();
  },
  unassign(prof,pid){ for(const k in prof.cars){ if(prof.cars[k].plateId===pid)prof.cars[k].plateId=null; } },
  reject(id){ const t=this.list().find(x=>x.id===id); if(!t)return; t.status='rejected'; NM.save.persist(); this.render(); },
  cancel(id){ const t=this.list().find(x=>x.id===id); if(!t)return; t.status='cancelled'; NM.save.persist(); this.render(); }
};
