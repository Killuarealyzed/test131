window.NM = window.NM || {};
function xpNeed(l){return Math.round(150*Math.pow(l,1.4));}
function addMoney(v,silent=false){
  const p=NM.profile; if(!p)return;
  p.money=Math.max(0,p.money+v);
  if(!silent&&Math.abs(v)>=1)floatMoney(v);
  if(v>0)p.stats.earned+=v;
}
function addXP(n){
  const p=NM.profile; if(!p)return;
  p.xp+=n;
  while(p.xp>=xpNeed(p.level)){
    p.xp-=xpNeed(p.level); p.level++;
    const bonus=p.level*5000;
    addMoney(bonus,true);
    NM.ui.toast('🎉 Уровень <b>'+p.level+'</b>! Бонус +'+fmt(bonus)+' ₽','gold');
    NM.sound.win(2); NM.ui.confetti('legend');
  }
  if(typeof updateHeader==='function')updateHeader();
}
function carIncome(veh,st){
  const u=NM.DB.economy.upgrade;
  const lvl=st?st.lvl:1;
  let inc=veh.income*(1+u.incomeGrow*(lvl-1));
  if(st&&st.plateId){
    const pl=NM.profile.plates.find(x=>x.id===st.plateId);
    if(pl)inc*=NM.DB.economy.plateMult[pl.rar];
  }
  if(Date.now()<(NM.profile.boostUntil||0))inc*=2;
  return Math.round(inc);
}
function worldBiz(){ if(NM.save&&NM.save.data&&NM.save.data.world)return NM.save.data.world.businesses; return {}; }
function myBusinesses(){
  if(!NM.profile)return [];
  const w=worldBiz();
  return NM.DB.businesses.filter(b=>w[b.id]&&w[b.id].owner===NM.profile.name);
}
function myActiveBiz(){ const w=worldBiz(); return myBusinesses().filter(b=>w[b.id].supplies>0); }
function spinDiscount(){ return 0; }
function clanOf(){ if(NM.clans&&NM.profile&&NM.profile.clanId)return NM.clans.myClan(); return null; }
function inventoryCap(){
  let cap=NM.DB.economy.baseCap+myActiveBiz().reduce((s,b)=>s+(b.cap||0),0);
  const c=clanOf();
  if(c) cap+=(c.level||1)*NM.DB.clans.invSlotsPerLevel;
  return cap;
}
function businessFlat(){ return myActiveBiz().reduce((s,b)=>s+b.inc,0); }
function incomeMult(){
  let m=1+myActiveBiz().reduce((s,b)=>s+(b.mult||0),0)/100;
  const c=clanOf();
  if(c){
    m+=NM.clans.memberBonus(c);
    m+=(c.level||1)*NM.DB.clans.incomeBonusPerLevel;
  }
  return m;
}
function spinCost(count){ return Math.round(NM.DB.economy.spinCost*count*(1-spinDiscount()/100)); }
function propertyIncome(){
  const p=NM.profile; if(!p||!p.properties)return 0;
  return NM.DB.properties.reduce((s,pr)=>p.properties[pr.id]?s+pr.income:s,0);
}
function prestigeMult(p){ p=p||NM.profile; if(!p)return 1; return 1+(p.prestige||0)*NM.DB.prestige.multPerLevel; }
function bizCountFor(prof){ const w=worldBiz(); return NM.DB.businesses.filter(b=>w[b.id]&&w[b.id].owner===prof.name).length; }
function propCountFor(prof){ if(!prof.properties)return 0; return Object.keys(prof.properties).length; }
function vehicleIncome(){
  let s=0; const p=NM.profile; if(!p)return 0;
  for(const k in p.cars){const v=NM.DB.vehicles.find(x=>x.id===k); if(v)s+=carIncome(v,p.cars[k]);}
  return s;
}
function totalIncome(){
  const p=NM.profile; if(!p)return 0;
  return Math.round((vehicleIncome()+businessFlat()+propertyIncome())*incomeMult()*prestigeMult(p));
}
function totalWealth(prof){
  let w=prof.money+prof.plates.reduce((s,p)=>s+p.value,0);
  for(const k in prof.cars){const v=NM.DB.vehicles.find(x=>x.id===k);
    if(v)w+=v.price+(prof.cars[k].spent||0)*0.8;}
  const wb=worldBiz();
  NM.DB.businesses.forEach(b=>{if(wb[b.id]&&wb[b.id].owner===prof.name)w+=b.start;});
  NM.DB.properties.forEach(pr=>{if(prof.properties&&prof.properties[pr.id])w+=pr.price;});
  return w;
}
