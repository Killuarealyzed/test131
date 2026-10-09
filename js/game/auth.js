window.NM = window.NM || {};
NM.auth={
  pending:null,
  show(){
    const ov=document.getElementById('authOverlay');
    if(!ov) return;
    ov.style.display='flex';
    this.pending=null;
    const tl=document.getElementById('authTabLogin');
    const tr=document.getElementById('authTabReg');
    if(tl) tl.onclick=()=>this.tab('login');
    if(tr) tr.onclick=()=>this.tab('reg');
    const rg=document.getElementById('regGo');
    if(rg) rg.onclick=()=>this.register();
    this.tab('login');
  },
  hide(){ const ov=document.getElementById('authOverlay'); if(ov) ov.style.display='none'; },
  tab(t){
    const l=document.getElementById('authTabLogin'),r=document.getElementById('authTabReg');
    const lb=document.getElementById('authLogin'),rb=document.getElementById('authReg');
    if(!l||!r||!lb||!rb) return;
    if(t==='login'){
      l.classList.add('active'); r.classList.remove('active');
      lb.style.display='block'; rb.style.display='none';
      this.renderLogin();
    } else {
      r.classList.add('active'); l.classList.remove('active');
      rb.style.display='block'; lb.style.display='none';
    }
  },
  esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },
  renderLogin(){
    const box=document.getElementById('authLogin');
    if(!box) return;
    if(this.pending){ this.renderPassForm(box); return; }
    const list=NM.save.getProfiles();
    if(!list.length){
      box.innerHTML='<p style="color:var(--muted);text-align:center;padding:16px;font-size:13px">Аккаунтов пока нет.<br>Создай первый во вкладке «Регистрация».</p>';
      return;
    }
    box.innerHTML=list.map(pr=>
      '<div class="profile-row"><div><b>'+(pr.pass?'🔒 ':'')+this.esc(pr.name)+' ⭐'+(pr.prestige||0)+'</b>'+
      '<div class="sub">'+pr.level+' ур. · '+fmtShort(totalWealth(pr))+' ₽</div></div>'+
      '<button class="btn btn-sm btn-primary" data-login="'+this.esc(pr.name)+'">Войти</button></div>').join('');
    box.querySelectorAll('[data-login]').forEach(b=>{
      b.onclick=()=>{
        const prof=NM.save.getProfile(b.dataset.login);
        if(!prof) return;
        if(prof.pass){ this.pending=prof.name; this.renderLogin(); }
        else this.finish(prof);
      };
    });
  },
  renderPassForm(box){
    const name=this.pending;
    box.innerHTML='<div class="auth-pass-box">'+
      '<div class="auth-pass-title">🔒 Вход: '+this.esc(name)+'</div>'+
      '<div class="sub" style="margin-bottom:12px">Введи пароль, чтобы продолжить</div>'+
      '<input type="password" class="name-input" id="alPass" placeholder="Пароль">'+
      '<button class="btn btn-primary" style="width:100%;margin-bottom:8px" id="alGo">Войти</button>'+
      '<button class="btn" style="width:100%" id="alBack">← Назад к списку</button>'+
      '</div>';
    const inp=box.querySelector('#alPass');
    const go=()=>{
      const prof=NM.save.getProfile(name);
      if(prof && NM.save.checkPass(prof,inp.value)){ this.pending=null; this.finish(prof); }
      else{
        if(NM.ui&&NM.ui.toast) NM.ui.toast('Неверный пароль','error');
        if(NM.sound&&NM.sound.err) NM.sound.err();
        inp.value=''; inp.focus();
      }
    };
    box.querySelector('#alGo').onclick=go;
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
    box.querySelector('#alBack').onclick=()=>{ this.pending=null; this.renderLogin(); };
    setTimeout(()=>{ if(inp) inp.focus(); },60);
  },
  register(){
    const nameEl=document.getElementById('regName');
    const p1El=document.getElementById('regPass');
    const p2El=document.getElementById('regPass2');
    if(!nameEl||!p1El||!p2El) return;
    const name=nameEl.value.trim();
    const p1=p1El.value, p2=p2El.value;
    if(!name){ if(NM.ui)NM.ui.toast('Введи имя','error'); return; }
    if(NM.save.getProfile(name)){ if(NM.ui)NM.ui.toast('Такой игрок уже есть','error'); return; }
    if(p1.length<4){ if(NM.ui)NM.ui.toast('Пароль минимум 4 символа','error'); return; }
    if(p1!==p2){ if(NM.ui)NM.ui.toast('Пароли не совпадают','error'); return; }
    const prof=NM.save.createProfile(name,p1);
    NM.save.persist();
    if(NM.ui)NM.ui.toast('Аккаунт создан. Добро пожаловать, <b>'+this.esc(name)+'</b>! 🎁','gold');
    this.finish(prof);
  },
  finish(prof){
    NM.profile=prof;
    NM.save.selectProfile(prof.name);
    NM.save.persist();
    this.hide();
    if(typeof renderAll==='function') renderAll();
    if(NM.trades){
      const n=NM.trades.incoming().length;
      if(n>0) setTimeout(()=>{ if(NM.ui)NM.ui.toast('📨 Входящих трейдов: '+n+'. Загляни во вкладку «Трейд»','info'); },600);
      if(NM.trades.badge) NM.trades.badge();
    }
    if(NM.auctions && NM.auctions.badge) NM.auctions.badge();
  },
  logout(){
    NM.save.persist();
    NM.profile=null;
    const pn=document.getElementById('playerName');
    if(pn) pn.textContent='—';
    this.show();
  }
};
