window.NM = window.NM || {};
function updateHeader(){
  const p=NM.profile;
  const pn=document.getElementById('playerName');
  if(!p){ if(pn)pn.textContent='—'; return; }
  pn.textContent=p.name;
  document.getElementById('lvlVal').textContent=p.level;
  document.getElementById('xpChip').textContent=fmt(p.xp)+'/'+fmt(xpNeed(p.level));
  document.getElementById('invBadge').textContent=p.plates.length;
  document.getElementById('prestigeVal').textContent=p.prestige||0;
  const inc=totalIncome();
  document.getElementById('incomeChip').textContent=inc>0?('+'+fmtShort(inc)+'/с'):'';
  const sorted=[...NM.save.getProfiles()].sort((a,b)=>totalWealth(b)-totalWealth(a));
  const pos=sorted.findIndex(x=>x.name===p.name)+1;
  document.getElementById('rankVal').textContent=pos||'—';
}
NM.ui.promptPass=function(prof,onOk){
  const m=modal('<button class="x" data-close>✕</button>'+
    '<h3>🔒 '+prof.name+'</h3>'+
    '<p style="color:var(--mute);font-size:13px;margin-bottom:12px">Аккаунт защищён паролем.</p>'+
    '<input type="password" class="name-input" id="pp" placeholder="Пароль">'+
    '<button class="btn btn-primary" style="width:100%" id="ppGo">Войти</button>');
  const go=()=>{
    const v=m.ov.querySelector('#pp').value;
    if(NM.save.checkPass(prof,v)){onOk();m.close();}
    else{NM.ui.toast('Неверный пароль','error');NM.sound.err();}
  };
  m.ov.querySelector('#ppGo').onclick=go;
  m.ov.querySelector('#pp').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
};
NM.ui.trySwitch=function(name){
  const prof=NM.save.getProfile(name); if(!prof)return;
  const doIt=()=>{
    NM.save.selectProfile(name); NM.profile=prof; NM.save.persist();
    renderAll(); NM.ui.toast('Игрок: <b>'+prof.name+'</b>','info');
  };
  if(prof.pass){NM.ui.promptPass(prof,doIt);} else doIt();
};
NM.ui.openProfileModal=function(){
  const list=NM.save.getProfiles();
  const rows=list.map(pr=>
    '<div class="profile-row '+(NM.profile&&pr.name===NM.profile.name?'cur':'')+'">'+
      '<div><b style="font-family:\'JetBrains Mono\'">'+(pr.pass?'🔒 ':'')+pr.name+' ⭐'+(pr.prestige||0)+'</b>'+
      '<div style="font-size:11px;color:var(--mute)">Ур. '+pr.level+' · '+fmtShort(totalWealth(pr))+' ₽</div></div>'+
      '<button class="btn btn-sm btn-primary" data-sel="'+pr.name+'">Играть</button>'+
    '</div>').join('');
  const m=modal('<button class="x" data-close>✕</button><h3>Игроки</h3>'+
    '<div style="max-height:280px;overflow:auto;margin-bottom:14px">'+(rows||'<p style="color:var(--mute)">Пока никого нет</p>')+'</div>'+
    '<div class="divider"></div>'+
    '<h4 style="font-size:13px;margin-bottom:8px">Новый игрок</h4>'+
    '<input class="name-input" id="npName" placeholder="Имя" maxlength="16">'+
    '<input type="password" class="name-input" id="npPass" placeholder="Пароль">'+
    '<input type="password" class="name-input" id="npPass2" placeholder="Повтори пароль">'+
    '<button class="btn btn-primary" style="width:100%" id="npCreate">Создать и играть</button>');
  m.ov.querySelectorAll('[data-sel]').forEach(b=>b.onclick=()=>{NM.ui.trySwitch(b.dataset.sel);m.close();});
  m.ov.querySelector('#npCreate').onclick=()=>{
    const name=m.ov.querySelector('#npName').value.trim();
    const p1=m.ov.querySelector('#npPass').value,p2=m.ov.querySelector('#npPass2').value;
    if(!name){NM.ui.toast('Введи имя','error');return;}
    if(NM.save.getProfile(name)){NM.ui.toast('Такой игрок уже есть','error');return;}
    if(p1!==p2){NM.ui.toast('Пароли не совпадают','error');return;}
    if(p1&&p1.length<4){NM.ui.toast('Пароль минимум 4 символа','error');return;}
    NM.profile=NM.save.createProfile(name,p1||null); NM.save.persist();
    renderAll(); m.close(); NM.ui.toast('Добро пожаловать, <b>'+name+'</b>!','gold');
  };
};
