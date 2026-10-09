window.NM = window.NM || {};
NM.prestige={
  cfg(){return NM.DB.prestige;},
  hasPlate(){ const c=this.cfg(); return NM.profile&&NM.profile.plates.some(p=>p.rar===c.reqRarity); },
  hasMoney(){ const c=this.cfg(); return NM.profile&&NM.profile.money>=c.reqMoney; },
  hasCar(){ const c=this.cfg(); if(!NM.profile)return false;
    return Object.keys(NM.profile.cars).some(k=>{const v=NM.DB.vehicles.find(x=>x.id===k);return v&&v.price>=c.reqCarPrice;}); },
  canAll(){ return this.hasPlate()&&this.hasMoney()&&this.hasCar(); },
  render(){
    const box=document.getElementById('prestigeBox'); if(!box||!NM.profile)return;
    const p=NM.profile; const c=this.cfg();
    const rarName=NM.DB.rarities.data[c.reqRarity].name;
    const row=(ok,txt)=>'<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px;background:'+(ok?'#f0fdf4':'#fafaf7')+'">'+
      '<span style="font-size:18px">'+(ok?'✅':'⬜')+'</span><div style="font-size:13px">'+txt+'</div></div>';
    box.innerHTML='<div class="panel" style="max-width:600px">'+
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'+
        '<div style="font-size:40px">⭐</div>'+
        '<div><div style="font-family:JetBrains Mono;font-size:18px;font-weight:800">Престиж: '+(p.prestige||0)+'</div>'+
        '<div style="font-size:12.5px;color:var(--mute)">Множитель дохода: ×'+prestigeMult(p).toFixed(2)+' · Престиж НЕ сбрасывает прогресс</div></div></div>'+
      '<div style="font-size:12.5px;color:var(--mute);margin-bottom:10px">Условия для престижа:</div>'+
      row(this.hasPlate(),'Нужен номер редкости «'+rarName+'» (жертвуется лучший)')+
      row(this.hasMoney(),'Нужно '+fmtShort(c.reqMoney)+' ₽ (жертвуется '+fmtShort(c.moneyCost)+' ₽)')+
      row(this.hasCar(),'Нужна машина от '+fmtShort(c.reqCarPrice)+' ₽')+
      '<div style="font-size:12px;color:var(--mute);margin:12px 0">За престиж: <b>+1 ⭐</b>, <b>+50% к доходу навсегда</b>. Техника, бизнесы, квартиры и остальные номера остаются.</div>'+
      '<button class="btn '+(this.canAll()?'btn-gold':'btn-primary')+'" id="prestigeGo" '+(this.canAll()?'':'disabled')+'>'+
      (this.canAll()?'⭐ Сделать престиж':'Условия не выполнены')+'</button>'+
      '</div>';
    const btn=box.querySelector('#prestigeGo');
    if(btn&&!btn.disabled)btn.onclick=()=>this.doPrestige();
  },
  renderIfActive(){ if(NM.activeTab==='prestige')this.render(); },
  doPrestige(){
    const p=NM.profile; if(!p)return;
    const c=this.cfg();
    if(!this.canAll()){NM.ui.toast('Не выполнены условия','error');return;}
    const rarName=NM.DB.rarities.data[c.reqRarity].name;
    const m=modal('<h3>⭐ Престиж</h3>'+
      '<p style="color:var(--mute);font-size:13px;margin-bottom:14px">Ты пожертвуешь лучший номер «'+rarName+'» и '+fmtShort(c.moneyCost)+' ₽. '+
      'Всё остальное (техника, бизнесы, квартиры, номера) останется. Получишь <b>⭐ '+(p.prestige+1)+'</b> и множитель <b>×'+(1+(p.prestige+1)*c.multPerLevel).toFixed(2)+'</b>. Продолжить?</p>'+
      '<div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn" data-close>Отмена</button><button class="btn btn-gold" id="confP">Да, престиж</button></div>');
    m.ov.querySelector('#confP').onclick=()=>{
      // жертвуем лучший номер нужной редкости
      let best=null,bi=-1;
      p.plates.forEach((pl,i)=>{ if(pl.rar===c.reqRarity && (!best||pl.value>best.value)){best=pl;bi=i;} });
      if(bi>=0)p.plates.splice(bi,1);
      addMoney(-c.moneyCost);
      p.prestige=(p.prestige||0)+1;
      NM.sound.win(3); NM.ui.confetti('mythic');
      NM.notify.push('⭐','Престиж '+(p.prestige)+'! Доход ×'+prestigeMult(p).toFixed(2),'gold');
      renderAll(); NM.save.persist(); m.close();
    };
  }
};
