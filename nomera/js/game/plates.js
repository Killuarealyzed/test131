window.NM = window.NM || {};
NM.plates={
  maxRarityFor(totalSpins){
    for(const p of NM.DB.economy.protection){ if(totalSpins<p.spins)return p.max; }
    return 'mythic';
  },
  rollRarity(maxRar){
    const order=NM.DB.rarities.order;
    const maxIdx=maxRar?order.indexOf(maxRar):order.length-1;
    const allowed=order.slice(0,maxIdx+1);
    const total=allowed.reduce((s,k)=>s+NM.DB.rarities.data[k].w,0);
    let r=Math.random()*total;
    for(const k of allowed){ if(r<NM.DB.rarities.data[k].w)return k; r-=NM.DB.rarities.data[k].w; }
    return allowed[allowed.length-1];
  },
  calcFeats(p){
    const F=NM.DB.rarities.features;
    let m=1,f=[]; const a=p.d[0],b=p.d[1],c=p.d[2]; const num=a*100+b*10+c;
    if(a===b&&b===c){
      if(a===7){m*=F.sameDigit7;f.push('Три семёрки');}
      else if(a===0){m*=F.sameDigit0;f.push('Три нуля');}
      else{m*=F.sameDigit;f.push('Одинаковые цифры');}
    } else if((b===a+1&&c===b+1)||(b===a-1&&c===b-1)){m*=F.sequence;f.push('Порядковые');}
    else if(a===c&&a!==0){m*=F.mirror;f.push('Зеркальные');}
    else if(num>0&&num<10){m*=F.short;f.push('Короткий');}
    else if(num===100||num===500){m*=F.round;f.push('Круглый');}
    if(p.l[0]===p.l[1]&&p.l[1]===p.l[2]){m*=F.sameLetter;f.push('Совп. буквы');}
    if(NM.DB.regions[p.country].rare.includes(p.region)){m*=F.rareRegion;f.push('Редкий регион');}
    return {m:Math.min(m,NM.DB.economy.maxMult),f};
  },
  makePlate(rar,country){
    const MAX_ATTEMPTS=200;
    for(let attempt=0;attempt<MAX_ATTEMPTS;attempt++){
      const p=this._generateRaw(rar,country);
      if(!NM.save.isPlateRegistered(p)) return p;
    }
    return this._generateRaw(rar,country);
  },
  // для визуального барабана (не занимает уникальный номер)
  makeDisplayPlate(rar,country){ return this._generateRaw(rar,country); },
  _generateRaw(rar,country){
    const L=['А','В','Е','К','М','Н','О','Р','С','Т','У','Х'];
    country=country||pick(Object.keys(NM.DB.regions));
    const l=[pick(L),pick(L),pick(L)];
    let d=[ri(0,9),ri(0,9),ri(0,9)];
    let region=pick(NM.DB.regions[country].regions);
    const sameD=v=>{d=[v,v,v];};
    const seqD=()=>{if(Math.random()<.5){const s=ri(0,7);d=[s,s+1,s+2];}else{const s=ri(2,9);d=[s,s-1,s-2];}};
    const mirD=()=>{const x=ri(1,9),y=ri(0,9);d=[x,y,x];};
    const sameL=()=>{const x=pick(L);l[0]=l[1]=l[2]=x;};
    if(rar==='rare'){const r=Math.random();if(r<.35)sameD(ri(1,9));else if(r<.55)mirD();
      if(Math.random()<.2)sameL(); if(Math.random()<.1)region=pick(NM.DB.regions[country].rare);}
    else if(rar==='epic'){const r=Math.random();if(r<.45)sameD(ri(1,9));else if(r<.72)seqD();else mirD();
      if(Math.random()<.35)sameL(); if(Math.random()<.2)region=pick(NM.DB.regions[country].rare);}
    else if(rar==='legend'){if(Math.random()<.6)sameD(ri(1,9));else seqD();
      if(Math.random()<.6)sameL(); if(Math.random()<.35)region=pick(NM.DB.regions[country].rare);}
    else if(rar==='mythic'){sameD(7); if(Math.random()<.85)sameL();
      region=NM.DB.regions[country].myth.length?pick(NM.DB.regions[country].myth):pick(NM.DB.regions[country].rare);}
    else {if(Math.random()<.04)sameD(ri(1,9)); if(Math.random()<.03)sameL();}
    const p={id:genId(),l,d,region,rar,country};
    const ft=this.calcFeats(p);
    p.mult=ft.m; p.feats=ft.f;
    const base=NM.DB.rarities.data[rar].base;
    p.value=round10(rnd(base[0],base[1])*ft.m);
    return p;
  }
};
