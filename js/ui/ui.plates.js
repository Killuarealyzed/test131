window.NM = window.NM || {};
function plateText(p){return p.l[0]+' '+p.d.join('')+' '+p.l[1]+p.l[2];}
function plateHTML(p,sz='md'){
  const cls=p.country==='RUS'?'':p.country==='BY'?' by':p.country==='KZ'?' kz':' ua';
  return '<div class="pw '+sz+' rar-'+p.rar+'"><div class="plate'+cls+'">'+
    '<div class="pm">'+p.l[0]+p.d.join('')+p.l[1]+p.l[2]+'</div>'+
    '<div class="pr"><b>'+p.region+'</b><span>'+NM.DB.regions[p.country].name+'</span></div>'+
  '</div></div>';
}
