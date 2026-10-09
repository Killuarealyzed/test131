window.NM = window.NM || {};
NM.properties={
  ownerOf(id){
    for(const p of NM.save.getProfiles()){ if(p.properties&&p.properties[id])return p.name; }
    return null;
  },
  render(){
    const grid=document.getElementById('propGrid'); if(!grid)return;
    const me=NM.profile?NM.profile.name:null;
    grid.innerHTML='';
    NM.DB.properties.forEach(pr=>{
      const owner=this.ownerOf(pr.id); const mine=owner===me;
      const el=document.createElement('div');
      el.className='biz-card panel'+(mine?' owned':'');
      let status;
      if(mine){
        status='<div class="biz-status" style="color:#16a34a;font-weight:700">🏠 Твоя · +'+fmtShort(pr.income)+'/с</div>'+
          '<button class="btn btn-sm" data-act="sell" style="margin-top:8px;width:100%">Продать за '+fmtShort(Math.round(pr.price*0.7))+' ₽</button>';
      } else if(owner){
        status='<div class="biz-status">Владелец: <b>'+owner+'</b></div>';
      } else {
        status='<div class="biz-status">Свободна · +'+fmtShort(pr.income)+'/с</div>'+
          '<button class="btn btn-primary btn-sm" data-act="buy" style="margin-top:8px;width:100%">Купить · '+fmtShort(pr.price)+' ₽</button>';
      }
      el.innerHTML='<div class="biz-top"><span class="biz-icon">'+pr.icon+'</span>'+
        '<div><div class="biz-name">'+pr.name+'</div><div class="biz-desc">'+pr.desc+'</div></div></div>'+
        '<div class="biz-bonuses"><span class="bbonus">+'+fmtShort(pr.income)+'/с</span></div>'+status;
      el.querySelectorAll('[data-act]').forEach(btn=>{
        btn.onclick=()=>{ if(btn.dataset.act==='buy')this.buy(pr.id); else this.sell(pr.id); };
      });
      grid.appendChild(el);
    });
  },
  renderIfActive(){ if(NM.activeTab==='property')this.render(); },
  buy(id){
    const pr=NM.DB.properties.find(x=>x.id===id);
    if(this.ownerOf(id)){NM.ui.toast('Уже куплена','error');return;}
    if(NM.profile.money<pr.price){NM.ui.toast('Не хватает денег','error');NM.sound.err();return;}
    addMoney(-pr.price); NM.profile.properties[id]=true;
    NM.sound.cash(); NM.ui.toast('🏠 Куплено: <b>'+pr.name+'</b> (+'+fmtShort(pr.income)+'/с)','gold');
    addXP(30); this.render(); updateHeader(); NM.save.persist();
  },
  sell(id){
    const pr=NM.DB.properties.find(x=>x.id===id);
    if(this.ownerOf(id)!==NM.profile.name)return;
    const refund=Math.round(pr.price*0.7);
    delete NM.profile.properties[id]; addMoney(refund);
    NM.sound.cash(); NM.ui.toast('Продано за '+fmtShort(refund)+' ₽','ok');
    this.render(); updateHeader(); NM.save.persist();
  }
};
