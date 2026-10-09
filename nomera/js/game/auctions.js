window.NM = window.NM || {};
NM.auctions={
  list(){
    if(!NM.save.data.world)NM.save.data.world={businesses:{}};
    if(!NM.save.data.world.auctions)NM.save.data.world.auctions=[];
    return NM.save.data.world.auctions;
  },
  active(){ return this.list().filter(a=>a.status==='active'); },
  plateLabel(p){ return p.l[0]+' '+p.d.join('')+' '+p.l[1]+p.l[2]+' ('+NM.DB.rarities.data[p.rar].name+')'; },
  badge(){ const el=document.getElementById('aucBadge'); if(!el)return;
    const me=NM.profile?NM.profile.name:null;
    const n=this.active().filter(a=>a.seller!==me).length;
    el.textContent=n; el.style.display=n>0?'inline-block':'none'; },
  render(){
    const box=document.getElementById('auctionBox'); if(!box||!NM.profile)return;
    const me=NM.profile.name;
    const act=this.active();
    const others=act.filter(a=>a.seller!==me);
    const mine=act.filter(a=>a.seller===me);
    let html='<div style="margin-bottom:16px"><button class="btn btn-primary" id="newAuc">➕ Выставить номер на аукцион</button></div>';
    html+='<h4 style="margin-bottom:8px">Торги других игроков ('+others.length+')</h4>';
    if(!others.length)html+='<div class="inv-summary">Сейчас нет чужих аукционов. Выставь свой номер — другие игроки смогут за него побороться.</div>';
    others.forEach(a=>{html+=this.lotCard(a,true);});
    html+='<h4 style="margin:16px 0 8px">Мои лоты ('+mine.length+')</h4>';
    if(!mine.length)html+='<div class="inv-summary">У тебя нет активных лотов.</div>';
    mine.forEach(a=>{html+=this.lotCard(a,false);});
    box.innerHTML=html;
    box.querySelector('#newAuc').onclick=()=>this.openCreate();
    box.querySelectorAll('[data-aact]').forEach(b=>{
      b.onclick=()=>{const id=b.dataset.aid,ac=b.dataset.aact;
        if(ac==='bid')this.bid(id); else if(ac==='cancel')this.cancel(id);};
    });
    this.badge();
  },
  lotCard(a,canBid){
    const p=a.plate, me=NM.profile.name;
    const left=Math.max(0,a.endAt-Date.now());
    const youLead=a.leader===me;
    let html='<div class="auc-lot'+(a.seller===me?' mine':'')+'">';
    html+='<div class="auc-plate-wrap">'+plateHTML(p,'md')+'</div>';
    html+='<div class="auc-lot-info">';
    html+='<div class="biz-status">Продавец: <b>'+a.seller+'</b> · осталось <span class="auc-timer">'+formatDur(left)+'</span></div>';
    html+='<div class="auc-bidline" style="margin-top:6px"><span>Ставка</span><b>'+(a.bid?fmtShort(a.bid)+' ₽':'нет · мин. '+fmtShort(a.start)+' ₽')+'</b></div>';
    if(a.leader)html+='<div class="biz-status" style="margin-top:4px">Лидер: '+(youLead?'🙂 Ты':a.leader)+'</div>';
    html+='</div>';
    html+='<div class="auc-lot-actions">';
    if(canBid){
      if(youLead)html+='<div class="biz-status" style="color:var(--green);font-weight:700">Вы лидируете</div>';
      else html+='<button class="btn btn-primary btn-sm" data-aact="bid" data-aid="'+a.id+'">🔨 Сделать ставку</button>';
    } else {
      if(!a.leader)html+='<button class="btn btn-sm" data-aact="cancel" data-aid="'+a.id+'" style="color:var(--red)">Отменить лот</button>';
      else html+='<div class="biz-status">Идут торги</div>';
    }
    html+='</div></div>';
    return html;
  },
  openCreate(){
    const me=NM.profile;
    if(!me.plates.length){NM.ui.toast('Нет свободных номеров для аукциона','error');return;}
    let selId=null;
    const durs=[[60000,'1 минута'],[300000,'5 минут'],[900000,'15 минут'],[3600000,'1 час'],[21600000,'6 часов'],[86400000,'24 часа']];
    const m=modal('<button class="x" data-close>✕</button><h3>➕ Выставить номер на аукцион</h3>'+
      '<div style="font-size:12px;color:var(--muted);margin-bottom:8px">Выбери номер (он будет снят с инвентаря до конца торгов):</div>'+
      '<div id="aucPlates" style="max-height:220px;overflow:auto;margin-bottom:10px"></div>'+
      '<input class="name-input" id="aucPrice" type="number" min="100" placeholder="Минимальная цена (₽)">'+
      '<select class="name-input" id="aucDur">'+durs.map(d=>'<option value="'+d[0]+'">'+d[1]+'</option>').join('')+'</select>'+
      '<button class="btn btn-primary" style="width:100%" id="aucGo">Выставить на аукцион</button>');
    const renderPlates=()=>{
      const list=m.ov.querySelector('#aucPlates');
      list.innerHTML=me.plates.map(p=>{
        const on=selId===p.id;
        return '<div class="pick-row" data-ap="'+p.id+'" style="cursor:pointer;'+(on?'border-color:var(--gold);background:var(--gold-soft)':'')+'">'+
          '<div class="pr-info"><b>'+this.plateLabel(p)+'</b><span>рыночная '+fmtShort(p.value)+' ₽</span></div>'+(on?'✅':'')+'</div>';
      }).join('');
      list.querySelectorAll('[data-ap]').forEach(r=>r.onclick=()=>{selId=r.dataset.ap;renderPlates();});
    };
    renderPlates();
    m.ov.querySelector('#aucGo').onclick=()=>{
      if(!selId){NM.ui.toast('Выбери номер','error');return;}
      const idx=me.plates.findIndex(p=>p.id===selId);
      if(idx<0){NM.ui.toast('Номер не найден','error');return;}
      const price=parseInt(m.ov.querySelector('#aucPrice').value)||0;
      if(price<100){NM.ui.toast('Минимальная цена от 100 ₽','error');return;}
      const dur=parseInt(m.ov.querySelector('#aucDur').value)||300000;
      const [plate]=me.plates.splice(idx,1);
      this.list().push({id:genId(),seller:me.name,plate,start:price,duration:dur,endAt:Date.now()+dur,bid:0,leader:null,locked:{},status:'active',createdAt:Date.now()});
      NM.save.persist(); NM.ui.toast('Лот выставлен на аукцион','ok'); m.close(); this.render();
    };
  },
  bid(id){
    const a=this.list().find(x=>x.id===id); if(!a||a.status!=='active')return;
    const me=NM.profile; if(!me)return;
    if(a.seller===me.name){NM.ui.toast('Нельзя ставить на свой лот','error');return;}
    if(a.leader===me.name){NM.ui.toast('Вы уже лидируете','error');return;}
    const minBid=a.leader? (a.bid+Math.max(Math.round(a.start*0.05),100)) : a.start;
    const m=modal('<button class="x" data-close>✕</button><h3>🔨 Сделать ставку</h3>'+
      '<div class="biz-status" style="margin-bottom:10px">Текущая ставка: <b>'+(a.bid?fmtShort(a.bid)+' ₽':'нет')+'</b><br>Минимальная следующая: <b>'+fmtShort(minBid)+' ₽</b></div>'+
      '<input class="name-input" id="bidAmt" type="number" min="'+minBid+'" value="'+minBid+'" placeholder="Ваша ставка (₽)">'+
      '<button class="btn btn-primary" style="width:100%" id="bidGo">Поставить</button>');
    m.ov.querySelector('#bidGo').onclick=()=>{
      const amt=parseInt(m.ov.querySelector('#bidAmt').value)||0;
      if(amt<minBid){NM.ui.toast('Минимум '+fmtShort(minBid)+' ₽','error');return;}
      if(me.money<amt){NM.ui.toast('Не хватает денег','error');return;}
      if(a.leader){ const prev=NM.save.getProfile(a.leader); if(prev)prev.money+=(a.locked[a.leader]||0); delete a.locked[a.leader]; }
      addMoney(-amt);
      a.locked[me.name]=amt; a.bid=amt; a.leader=me.name;
      NM.sound.click(); NM.save.persist(); m.close(); this.render();
      NM.ui.toast('Ставка '+fmtShort(amt)+' ₽ принята','ok');
    };
  },
  cancel(id){
    const a=this.list().find(x=>x.id===id); if(!a||a.status!=='active')return;
    if(a.seller!==NM.profile.name)return;
    if(a.leader){NM.ui.toast('Нельзя отменить — уже есть ставки','error');return;}
    NM.profile.plates.push(a.plate);
    a.status='cancelled';
    NM.save.persist(); NM.ui.toast('Лот снят, номер возвращён','info'); this.render();
  },
  tick(){
    const now=Date.now(); let changed=false;
    this.list().forEach(a=>{
      if(a.status!=='active')return;
      if(now>=a.endAt){
        const seller=NM.save.getProfile(a.seller);
        if(a.leader){
          const buyer=NM.save.getProfile(a.leader);
          if(seller&&buyer){
            buyer.plates.push(a.plate);
            seller.money+=a.bid;
            a.status='sold'; a.winner=a.leader;
            if(NM.profile&&a.seller===NM.profile.name)NM.ui.toast('💰 Ваш лот продан за '+fmtShort(a.bid)+' ₽','gold');
            if(NM.profile&&a.winner===NM.profile.name){NM.ui.toast('🏆 Вы выиграли аукцион!','gold');NM.ui.confetti('legend');}
          } else { if(seller)seller.plates.push(a.plate); a.status='expired'; }
        } else {
          if(seller)seller.plates.push(a.plate);
          a.status='expired';
        }
        changed=true;
      }
    });
    if(changed)NM.save.persist();
  }
};
