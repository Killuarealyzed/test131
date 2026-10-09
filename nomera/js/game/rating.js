window.NM = window.NM || {};
NM.rating={
  render(){
    const body=document.getElementById('ratingBody'); if(!body)return;
    const profiles=[...NM.save.getProfiles()].sort((a,b)=>totalWealth(b)-totalWealth(a));
    if(!profiles.length){body.innerHTML='<tr><td colspan="9" style="text-align:center;color:var(--mute);padding:30px">Пока нет игроков.</td></tr>';return;}
    body.innerHTML=profiles.map((p,i)=>{
      const rank=i+1;
      const rankCls=rank===1?'gold':rank===2?'silver':rank===3?'bronze':'';
      const isMe=NM.profile&&p.name===NM.profile.name;
      return '<tr class="'+(isMe?'me':'')+'">'+
        '<td><span class="rating-rank '+rankCls+'">'+rank+'</span></td>'+
        '<td>'+(isMe?'🙂':'👤')+' <b>'+(p.pass?'🔒 ':'')+p.name+'</b></td>'+
        '<td>⭐'+(p.prestige||0)+'</td>'+
        '<td>'+p.level+'</td>'+
        '<td>'+Object.keys(p.cars).length+'</td>'+
        '<td>'+bizCountFor(p)+'</td>'+
        '<td>'+propCountFor(p)+'</td>'+
        '<td><b>'+fmtShort(totalWealth(p))+' ₽</b></td>'+
        '<td>'+(isMe?'<span style="font-size:11px;color:var(--mute)">ты</span>':'<span title="Защищено паролем — переключение через вход">🔒</span>')+'</td>'+
      '</tr>';
    }).join('');
  }
};
