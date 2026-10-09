window.NM = window.NM || {};
NM.save={
  KEY:'nomera-magnat-v6',
  data:null,
  load(){
    let raw=null; try{raw=localStorage.getItem(this.KEY);}catch(e){}
    if(raw){try{this.data=JSON.parse(raw);}catch(e){this.data=null;}}
    if(!this.data||!Array.isArray(this.data.profiles)){
      this.data={version:6,muted:false,current:null,profiles:[]};
    }
    if(!this.data.world) this.data.world={businesses:{},auctions:[],trades:[],clans:[],plateRegistry:{}};
    if(!this.data.world.businesses) this.data.world.businesses={};
    if(!this.data.world.auctions) this.data.world.auctions=[];
    if(!this.data.world.trades) this.data.world.trades=[];
    if(!this.data.world.clans) this.data.world.clans=[];
    if(!this.data.world.plateRegistry) this.data.world.plateRegistry={};
    this.data.world.clans.forEach(c=>{ if(c.level===undefined)c.level=1; });
    this.data.profiles.forEach(p=>{
      if(p.properties===undefined) p.properties={};
      if(p.prestige===undefined) p.prestige=0;
      if(p.clanId===undefined) p.clanId=null;
      if(p.prestigeSlots===undefined) p.prestigeSlots=1;
    });
    return this.data;
  },
  persist(){ if(!this.data)return;
    try{localStorage.setItem(this.KEY,JSON.stringify(this.data));
      const d=document.getElementById('saveDot'); if(d)d.textContent='●';}catch(e){} },
  getProfiles(){return this.data.profiles;},
  getProfile(name){return this.data.profiles.find(p=>p.name===name)||null;},
  createProfile(name,pass){
    const p=this.defaultProfile(name);
    if(pass)p.pass=hashStr(pass);
    this.data.profiles.push(p);
    this.data.current=name;
    return p;
  },
  selectProfile(name){ if(this.getProfile(name)){this.data.current=name;return true;} return false; },
  checkPass(prof,pass){ if(!prof.pass)return true; return hashStr(pass)===prof.pass; },
  setPass(prof,pass){ prof.pass=pass?hashStr(pass):null; },
  defaultProfile(name){
    const eco=NM.DB.economy.start;
    return {
      id:genId(), name, createdAt:Date.now(), pass:null,
      money:eco.money, freeSpins:eco.freeSpins,
      xp:0, level:1, plates:[], cars:{}, hist:[], best:null,
      properties:{}, prestige:0, prestigeSlots:1, clanId:null,
      stats:{spins:0,cases:0,earned:0,sold:0},
      wheelAt:0, boostUntil:0, jobAt:0, savedAt:Date.now()
    };
  },
  plateKey(p){ return p.country+'|'+p.l[0]+p.d.join('')+p.l[1]+p.l[2]+'|'+p.region; },
  isPlateRegistered(p){ return !!this.data.world.plateRegistry[this.plateKey(p)]; },
  registerPlate(p,ownerName){ this.data.world.plateRegistry[this.plateKey(p)]={owner:ownerName,ts:Date.now()}; },
  unregisterPlate(p){ delete this.data.world.plateRegistry[this.plateKey(p)]; },
  registeredCount(){ return Object.keys(this.data.world.plateRegistry).length; }
};
NM.profile=null;
