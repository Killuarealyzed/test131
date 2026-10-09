window.NM = window.NM || {};
NM.ui = NM.ui || {};
NM.ui.toast=function(msg,type='info'){
  const box=document.getElementById('toasts'); const el=document.createElement('div');
  el.className='toast '+type; el.innerHTML=msg; box.appendChild(el);
  while(box.children.length>5)box.firstChild.remove();
  setTimeout(()=>{el.classList.add('out'); setTimeout(()=>el.remove(),320);},3600);
};
const CONF_COLORS={common:['#a3a3a3','#d4d4d4'],rare:['#2563eb','#93c5fd'],epic:['#7c3aed','#c4b5fd'],legend:['#d97706','#fde68a'],mythic:['#dc2626','#fbbf24','#7c3aed']};
NM.ui.confetti=function(rar){
  const cols=CONF_COLORS[rar]||CONF_COLORS.legend;
  for(let i=0;i<60;i++){
    const d=document.createElement('div'); d.className='cf';
    const s=rnd(4,9);
    d.style.cssText='left:'+rnd(5,95)+'vw;width:'+s+'px;height:'+(s*rnd(.5,1.5))+'px;background:'+pick(cols)+';--dx:'+rnd(-120,120)+'px;--rot:'+rnd(-720,720)+'deg;--d:'+rnd(1.4,2.6)+'s;animation-delay:'+rnd(0,.3)+'s';
    document.body.appendChild(d); setTimeout(()=>d.remove(),3200);
  }
};
function modal(html,opt){
  opt=opt||{};
  const root=document.getElementById('modalRoot'); const ov=document.createElement('div');
  ov.className='overlay'; ov.innerHTML='<div class="modal '+(opt.cls||'')+'">'+html+'</div>';
  root.appendChild(ov);
  const close=()=>ov.remove();
  ov.addEventListener('click',e=>{if(e.target===ov&&!opt.statik)close();});
  ov.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',close));
  return {ov,close};
}
function floatMoney(v){
  const host=document.querySelector('.chip.money'); if(!host)return;
  const el=document.createElement('span');
  el.className='float-cash'+(v<0?' minus':'');
  el.textContent=(v>0?'+':'')+fmtShort(v)+' ₽';
  host.appendChild(el); setTimeout(()=>el.remove(),1100);
}
