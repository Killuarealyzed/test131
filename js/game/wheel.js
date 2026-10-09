window.NM = window.NM || {};
NM.wheel={
  angle:0, spinning:false,
  draw(){
    const svg=document.getElementById('wheelSvg'),N=NM.DB.wheel.length,cx=200,cy=200,r=195;
    let html=''; const colors=['#0a0a0a','#d97706','#7c3aed','#2563eb','#dc2626','#16a34a','#a3a3a3','#f59e0b'];
    for(let i=0;i<N;i++){
      const a1=(i/N)*Math.PI*2-Math.PI/2,a2=((i+1)/N)*Math.PI*2-Math.PI/2;
      const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
      html+='<path d="M '+cx+' '+cy+' L '+x1+' '+y1+' A '+r+' '+r+' 0 0 1 '+x2+' '+y2+' Z" fill="'+colors[i%colors.length]+'" stroke="#fff" stroke-width="2"/>';
      const mid=(a1+a2)/2,tx=cx+r*.65*Math.cos(mid),ty=cy+r*.65*Math.sin(mid);
      html+='<g transform="translate('+tx+' '+ty+') rotate('+((mid+Math.PI/2)*180/Math.PI)+')">'+
        '<text x="0" y="-6" font-size="22" text-anchor="middle" fill="#fff">'+NM.DB.wheel[i].emo+'</text>'+
        '<text x="0" y="12" font-size="10" font-weight="700" text-anchor="middle" fill="#fff">'+NM.DB.wheel[i].name+'</text></g>';
    }
    svg.innerHTML=html; svg.style.transform='rotate('+this.angle+'deg)';
  },
  renderPrizes(){
    document.getElementById('wheelPrizes').innerHTML=NM.DB.wheel.map(p=>'<div class="wp-item"><span style="font-size:18px">'+p.emo+'</span><div><b>'+p.name+'</b><div class="wp-sub">'+p.sub+'</div></div></div>').join('');
  },
  updateTimer(){
    const btn=document.getElementById('wheelSpinBtn'),timer=document.getElementById('wheelTimer');
    const left=Math.max(0,(NM.profile.wheelAt||0)+24*3600*1000-Date.now());
    if(left>0){btn.disabled=true;
      const h=Math.floor(left/3600000),m=Math.floor((left%3600000)/60000),s=Math.floor((left%60000)/1000);
      timer.textContent=h>0?(h+'ч '+m+'м'):(m+'м '+s+'с');
    } else {btn.disabled=false;timer.textContent='готово';}
  },
  spin(){
    if(this.spinning)return;
    const left=Math.max(0,(NM.profile.wheelAt||0)+24*3600*1000-Date.now());
    if(left>0){NM.ui.toast('Колесо через '+Math.ceil(left/60000)+' мин','error');return;}
    this.spinning=true;
    const idx=Math.floor(Math.random()*NM.DB.wheel.length),N=NM.DB.wheel.length;
    const midAngle=(idx+0.5)/N*360;
    const base=Math.ceil(this.angle/360)*360;
    this.angle=base+360*8+(360-midAngle);
    document.getElementById('wheelSvg').style.transform='rotate('+this.angle+'deg)';
    setTimeout(()=>{
      const prize=NM.DB.wheel[idx];
      if(prize.type==='money'){addMoney(prize.amount);NM.ui.toast('+'+fmt(prize.amount)+' ₽ от колеса','gold');}
      else if(prize.type==='spins'){NM.profile.freeSpins+=prize.amount;NM.ui.toast('+'+prize.amount+' бесплатных круток!','gold');NM.ui.updateFreeSpins();}
      else if(prize.type==='plate'){const pl=NM.plates.makePlate(prize.rar);NM.inventory.addPlate(pl);NM.ui.toast('Выпал '+plateText(pl)+' ('+fmt(pl.value)+' ₽)','gold');NM.ui.confetti(prize.rar);NM.inventory.render();}
      else if(prize.type==='boost'){NM.profile.boostUntil=Date.now()+3600000;NM.ui.toast('Буст ×2 на час!','gold');}
      addXP(30); NM.profile.wheelAt=Date.now();
      this.spinning=false; updateHeader(); NM.save.persist(); this.updateTimer();
    },5100);
  }
};
