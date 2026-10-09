window.NM = window.NM || {};
function carSVG(body,color){
  const glass='rgba(168,216,255,.92)';
  const wheel=(x,y,r)=>'<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#0a0a0a"/><circle cx="'+x+'" cy="'+y+'" r="'+(r*.5)+'" fill="#525252"/><circle cx="'+x+'" cy="'+y+'" r="'+(r*.18)+'" fill="#a3a3a3"/></g>';
  let b='';
  if(body==='classic'){
    b='<ellipse cx="110" cy="84" rx="94" ry="4" fill="rgba(0,0,0,.3)"/>'+
    '<path d="M22 68 L22 50 Q22 44 30 43 L60 41 Q66 29 80 28 L140 28 Q154 29 160 41 L192 43 Q200 44 200 50 L200 68 Q200 71 195 71 L25 71 Q20 71 20 68 Z" fill="'+color+'"/>'+
    '<path d="M64 41 Q68 31 80 31 L140 31 Q152 31 156 41 Z" fill="'+glass+'"/>'+
    '<rect x="14" y="62" width="192" height="3" rx="1.5" fill="#d4d4d4"/>'+
    '<circle cx="196" cy="52" r="3.5" fill="#ffd97a"/><circle cx="24" cy="52" r="3" fill="#ff6b6b"/>'+
    wheel(58,71,11)+wheel(162,71,11);
  } else if(body==='sedan'){
    b='<ellipse cx="110" cy="82" rx="96" ry="4" fill="rgba(0,0,0,.3)"/>'+
    '<path d="M16 64 L16 57 Q16 47 30 45 L62 41 Q82 25 110 25 Q138 25 158 41 L190 45 Q204 47 204 57 L204 64 Q204 69 198 69 L22 69 Q16 69 16 64 Z" fill="'+color+'"/>'+
    '<path d="M68 41 Q85 29 110 29 Q135 29 152 41 Z" fill="'+glass+'"/>'+
    '<circle cx="200" cy="54" r="3.5" fill="#ffd97a"/><circle cx="20" cy="54" r="3" fill="#ff6b6b"/>'+
    wheel(60,69,12.5)+wheel(160,69,12.5);
  } else if(body==='coupe'){
    b='<ellipse cx="110" cy="82" rx="96" ry="4" fill="rgba(0,0,0,.3)"/>'+
    '<path d="M18 64 L18 54 Q18 46 32 44 L70 41 Q90 28 120 28 Q150 29 168 42 L192 44 Q204 46 204 56 L204 64 Q204 69 198 69 L22 69 Q18 69 18 64 Z" fill="'+color+'"/>'+
    '<path d="M76 41 Q95 30 122 30 Q148 30 164 42 Z" fill="'+glass+'"/>'+
    '<circle cx="200" cy="54" r="3.5" fill="#ffd97a"/><circle cx="22" cy="54" r="3" fill="#ff6b6b"/>'+
    wheel(58,69,12.5)+wheel(164,69,12.5);
  } else if(body==='suv'){
    b='<ellipse cx="110" cy="85" rx="94" ry="4" fill="rgba(0,0,0,.3)"/>'+
    '<rect x="32" y="22" width="156" height="4" rx="2" fill="#525252"/>'+
    '<path d="M22 70 L22 34 Q22 28 28 28 L192 28 Q198 28 198 34 L198 70 Q198 72 194 72 L26 72 Q22 72 22 70 Z" fill="'+color+'"/>'+
    '<rect x="34" y="34" width="40" height="15" rx="2" fill="'+glass+'"/>'+
    '<rect x="82" y="34" width="40" height="15" rx="2" fill="'+glass+'"/>'+
    '<rect x="130" y="34" width="52" height="15" rx="2" fill="'+glass+'"/>'+
    '<circle cx="194" cy="58" r="3.5" fill="#ffd97a"/><circle cx="26" cy="58" r="3" fill="#ff6b6b"/>'+
    wheel(62,72,13)+wheel(158,72,13);
  } else {
    b='<ellipse cx="112" cy="82" rx="98" ry="4" fill="rgba(0,0,0,.3)"/>'+
    '<rect x="192" y="36" width="22" height="4" rx="2" fill="#525252"/>'+
    '<rect x="202" y="40" width="4" height="9" fill="#525252"/>'+
    '<path d="M10 63 Q10 52 28 49 L72 43 Q94 27 124 29 Q160 32 184 46 L206 52 Q214 55 214 62 L214 66 Q214 69 208 69 L16 69 Q10 69 10 63 Z" fill="'+color+'"/>'+
    '<path d="M80 43 Q98 32 122 33 Q148 35 166 46 Z" fill="'+glass+'"/>'+
    '<circle cx="210" cy="57" r="3" fill="#ffd97a"/><circle cx="14" cy="58" r="3" fill="#ff6b6b"/>'+
    wheel(58,69,12.5)+wheel(164,69,12.5);
  }
  return '<svg viewBox="0 0 220 92" xmlns="http://www.w3.org/2000/svg">'+b+'</svg>';
}
