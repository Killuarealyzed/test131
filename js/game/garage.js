window.NM = window.NM || {};
NM.garage={
  cat:'all',
  upCost(veh,lvl){const u=NM.DB.economy.upgrade;return Math.round(veh.price*u.costMul*Math.pow(u.grow,lvl-1)/10)*10;},
  renderCats(){
    const box=document.getElementById('garageCats');
    box.innerHTML=NM.DB.vehicleCats.map(([k,n])=>{
      const cnt=k==='all'?NM.DB.vehicles.length:NM.DB.vehicles.filter(v=>v.cat===k).length;
      return '<button class="fchip '+(this.cat===k?'active':'')+'" data-cat="'+k+'">'+n+' <span style="opacity:.6">'+cnt+'</span></button>';
    }).join('');
    box.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{this.cat=b.dataset.cat;NM.sound.click();this.render();});
  },
  render(){
    if(!NM.profile)return;
    this.renderCats();
    const p=NM.profile;
    const list=this.cat==='all'?NM.DB.vehicles:NM.DB.vehicles.filter(v=>v.cat===this.cat);
    const ownedAll=Object.keys(p.cars).length;
    const income=totalIncome();
    document.getElementById('garageCount').innerHTML='Куплено: <b>'+ownedAll+'</b>/'+NM.DB.vehicles.length+' · Доход: <b>+'+fmtShort(income)+'/с</b>';
    const g=document.getElementById('garageGrid'); g.innerHTML='';
    list.forEach(v=>{
      const st=p.cars[v.id]; const owned=!!st;
      const lvl=st?st.lvl:1;
      const plate=st&&st.plateId?p.plates.find(x=>x.id===st.plateId):null;
      const upCost=this.upCost(v,lvl);
      const refund=Math.round(v.price*0.6+(st?st.spent||0:0)*0.5);
      const catName=(NM.DB.vehicleCats.find(c=>c[0]===v.cat)||['',''])[1];
      const stage=v.body?carSVG(v.body,v.color):('<div class="veh-emoji">'+v.icon+'</div>');
      const el=document.createElement('div'); el.className='car-card panel'+(owned?' owned':'');
      el.innerHTML='<div class="car-stage">'+stage+'</div>'+
        '<div><div class="car-name">'+v.name+(owned?' <span class="lvl-badge">ур. '+lvl+'</span>':'')+' <span class="cat-badge">'+catName+'</span></div>'+
        '<div class="car-desc">'+v.desc+'</div>'+
        '<div class="car-inc">+'+fmt(carIncome(v,st))+' ₽/с'+(owned?'':' (после покупки)')+
          (plate?'<span class="plate-bonus">🔑 '+plateText(plate)+' · +'+Math.round((NM.DB.economy.plateMult[plate.rar]-1)*100)+'%</span>':'')+'</div></div>'+
        (owned&&!plate?'<div class="car-plate-slot">🔑 Слот свободен — закрепи номер для бонуса</div>':'')+
        '<div class="car-foot">'+(owned?
          '<button class="btn btn-primary btn-sm" data-act="up">⬆ Улучшить · '+fmtShort(upCost)+' ₽</button>'+
          '<button class="btn btn-sm" data-act="plate">🔑</button>'+
          '<button class="btn btn-sm" data-act="sell" style="color:#dc2626">Продать</button>'
        :'<button class="btn btn-primary btn-sm" data-act="buy">Купить · '+fmtShort(v.price)+' ₽</button>')+'</div>';
      el.querySelectorAll('[data-act]').forEach(btn=>{
        btn.onclick=()=>{
          const act=btn.dataset.act;
          if(act==='buy'){
            if(p.money<v.price){NM.ui.toast('Не хватает денег','error');NM.sound.err();return;}
            addMoney(-v.price); p.cars[v.id]={lvl:1,plateId:null,spent:0};
            NM.sound.win(1); NM.ui.toast('🚗 Куплено: <b>'+v.name+'</b>!','ok'); addXP(25);
            this.render(); updateHeader(); NM.save.persist();
          }else if(act==='up'){
            const cost=this.upCost(v,st.lvl);
            if(p.money<cost){NM.ui.toast('Не хватает денег на улучшение','error');NM.sound.err();return;}
            addMoney(-cost); st.spent=(st.spent||0)+cost; st.lvl++;
            NM.sound.win(1); NM.ui.toast('⬆ '+v.name+' → ур. <b>'+st.lvl+'</b>','ok'); addXP(15);
            this.render(); updateHeader(); NM.save.persist();
          }else if(act==='sell'){
            const mm=modal('<h3>Продать '+v.name+'?</h3>'+
              '<p style="color:var(--mute);font-size:13px;margin-bottom:14px">Вернётся <b>'+fmt(refund)+' ₽</b>.</p>'+
              '<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn" data-close>Отмена</button><button class="btn btn-red" id="cs">Продать</button></div>');
            mm.ov.querySelector('#cs').onclick=()=>{
              addMoney(refund); delete p.cars[v.id]; NM.sound.cash();
              this.render(); updateHeader(); NM.save.persist(); mm.close();
            };
          }else if(act==='plate'){ this.openPicker(v,st); }
        };
      });
      g.appendChild(el);
    });
  },
  openPicker(veh,st){
    const p=NM.profile;
    const list=[...p.plates].sort((a,b)=>b.value-a.value);
    const rows=list.length?list.map(pl=>{
      const here=st.plateId===pl.id;
      return '<div class="pick-row">'+plateHTML(pl,'sm')+
        '<div class="pr-info"><b>'+plateText(pl)+'</b><span>'+NM.DB.rarities.data[pl.rar].name+' · +'+Math.round((NM.DB.economy.plateMult[pl.rar]-1)*100)+'%'+(here?' · <b style="color:#16a34a">закреплён</b>':'')+'</span></div>'+
        '<button class="btn btn-primary btn-sm" data-pick="'+pl.id+'">'+(here?'✓':'Закрепить')+'</button></div>';
    }).join(''):'<p style="color:var(--mute);text-align:center;padding:18px 0">Нет номеров — крутани в автомате 🎰</p>';
    const m=modal('<button class="x" data-close>✕</button><h3>🔑 Номер для «'+veh.name+'»</h3>'+
      (st.plateId?'<button class="btn btn-sm" id="unpin" style="margin-bottom:10px">Снять текущий</button>':'')+
      '<div style="max-height:400px;overflow:auto">'+rows+'</div>');
    const unpin=m.ov.querySelector('#unpin');
    if(unpin)unpin.onclick=()=>{st.plateId=null;this.render();updateHeader();NM.save.persist();m.close();};
    m.ov.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
      const pid=b.dataset.pick;
      for(const k in p.cars){if(p.cars[k].plateId===pid)p.cars[k].plateId=null;}
      st.plateId=st.plateId===pid?null:pid;
      NM.sound.cash(); this.render(); updateHeader(); NM.save.persist(); m.close();
    });
  }
};
