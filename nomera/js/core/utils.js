window.NM = window.NM || {};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function rnd(a,b){return a+Math.random()*(b-a);}
function ri(a,b){return Math.floor(rnd(a,b+1));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function fmt(n){return Math.round(n).toLocaleString('ru-RU');}
function round10(n){return Math.max(10,Math.round(n/10)*10);}
let __id=1; function genId(){return 'p'+Date.now().toString(36)+(__id++);}
function fmtShort(n){
  if(n>=1e12) return (n/1e12).toFixed(1).replace('.0','')+' трлн';
  if(n>=1e9)  return (n/1e9 ).toFixed(1).replace('.0','')+' млрд';
  if(n>=1e6)  return (n/1e6 ).toFixed(1).replace('.0','')+' млн';
  if(n>=100000)return Math.round(n/1e3)+' тыс';
  return fmt(n);
}
function formatDur(ms){
  if(ms<=0)return '0с';
  const s=Math.floor(ms/1000);
  const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sec=s%60;
  if(d>0)return d+'д '+h+'ч';
  if(h>0)return h+'ч '+m+'м';
  if(m>0)return m+'м '+sec+'с';
  return sec+'с';
}
function hashStr(s){
  let h1=5381,h2=52711;
  for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);
    h1=((h1<<5)+h1+c)>>>0; h2=((h2<<5)^h2^c)>>>0;}
  return h1.toString(36)+'.'+h2.toString(36)+'.'+s.length;
}
NM.utils={rnd,ri,pick,clamp,fmt,round10,genId,fmtShort,formatDur,hashStr};
