window.NM = window.NM || {};
NM.inventory={
  filter:'all', sort:'value',
  addPlate(p){
    const prof=NM.profile; prof.plates.push(p);
    if(!prof.best||p.value>prof.best.value){prof.best=p; NM.ui.renderBest();}
    const b=document.getElementById('invBadge'); if(b)b.textContent=prof.plates.length;
  },
  removePlates(ids){
    const set=new Set(ids); const prof=NM.profile;
    prof.plates=prof.plates.filter(p=>!set.has(p.id));
    for(const k in prof.cars){if(prof.cars[k].plateId&&set.has(prof.cars[k].plateId))prof.cars[k].plateId=null;}
    document.getElementById('invBadge').textContent=prof.plates.length;
  },
  sellPlates(ids,label){
    label=label||'Номер';
    const set=new Set(ids);
    const items=NM.profile.plates.filter(p=>set.has(p.id));
    if(!items.length)return 0;
    const sum=items.reduce((s,p)=>s+p.value,0);
    this.removePlates(ids);
    addMoney(sum); NM.profile.stats.sold+=items.length;
    NM.sound.cash();
    NM.ui.toast('💰 Продано: '+label+' за <b>'+fmt(sum)+' ₽</b>','ok');
    this.render(); NM.garage.render(); updateHeader(); NM.save.persist();
    return sum;
  },
  renderChips(){
    const defs=[['all','Все']].concat(NM.DB.rarities.order.map(k=>[k,NM.DB.rarities.data[k].name]));
    document.getElementById('invChips').innerHTML=defs.map(([k,n])=>{
      const cnt=k==='all'?NM.profile.plates.length:NM.profile.plates.filter(p=>p.rar===k).length;
      return '<button class="fchip '+(this.filter===k?'active':'')+'" data-f="'+k+'">'+n+' <span style="opacity:.6">'+cnt+'</span></button>';
    }).join('');
    document.getElementById('invChips').querySelectorAll('.fchip').forEach(b=>b.onclick=()=>{this.filter=b.dataset.f;NM.sound.click();this.render();});
  },
  render(){
    if(!NM.profile)return;
    this.renderChips();
    let list=this.filter==='all'?[...NM.profile.plates]:NM.profile.plates.filter(p=>p.rar===this.filter);
    list.sort(this.sort==='value'?(a,b)=>b.value-a.value:(a,b)=>b.id>a.id?1:-1);
    const total=list.reduce((s,p)=>s+p.value,0);
    const cap=inventoryCap();
    const label=this.filter==='all'?'Продать всё':('Продать «'+(NM.DB.rarities.data[this.filter]?NM.DB.rarities.data[this.filter].name:'')+'»');
    document.getElementById('invSummary').innerHTML='Номеров: <b>'+NM.profile.plates.length+'</b> / '+cap+' · В фильтре: <b>'+list.length+'</b> на <b>'+fmtShort(total)+' ₽</b>';
    document.getElementById('invSellAllBtn').textContent=label+' ('+fmtShort(total)+' ₽)';
    document.getElementById('invSellAllBtn').disabled=!list.length;
    const grid=document.getElementById('invGrid');
    if(!list.length){grid.innerHTML='<div class="inv-empty">Пока пусто. Крути номера в автомате 🎰 или открывай кейсы 📦</div>';return;}
    grid.innerHTML=list.map(p=>{
      const assigned=Object.keys(NM.profile.cars).some(k=>NM.profile.cars[k].plateId===p.id);
      return '<div class="inv-card">'+
        (assigned?'<span class="ic-assigned">🔑</span>':'')+
        plateHTML(p,'sm')+
        '<span class="chip-rar rar-'+p.rar+'">'+NM.DB.rarities.data[p.rar].name+'</span>'+
        '<div class="ic-feats">'+p.feats.slice(0,2).map(f=>'✦ '+f).join(' ')+'</div>'+
        '<div class="ic-val">'+fmt(p.value)+' ₽</div>'+
        '<button class="btn btn-sm" data-sell="'+p.id+'" style="width:100%">Продать</button>'+
      '</div>';
    }).join('');
    grid.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{
      const p=NM.profile.plates.find(x=>x.id===b.dataset.sell);
      if(p)this.sellPlates([p.id],plateText(p));
    });
  }
};
