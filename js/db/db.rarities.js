window.NM = window.NM || {};
NM.DB = NM.DB || {};
// ВЕСА = 100. Мифик всего 0.1% и с капом множителя ×4 — раньше выпасть не может.
NM.DB.rarities = {
  order:['common','rare','epic','legend','mythic'],
  data:{
    common:{name:'Обычный',     c:'#525252', w:80,   base:[8000,35000]},
    rare:  {name:'Редкий',      c:'#2563eb', w:15,   base:[55000,210000]},
    epic:  {name:'Эпический',   c:'#7c3aed', w:4,    base:[320000,1500000]},
    legend:{name:'Легендарный', c:'#d97706', w:0.9,  base:[1800000,8500000]},
    mythic:{name:'Мифический',  c:'#dc2626', w:0.1,  base:[12000000,60000000]}
  },
  features:{
    sameDigit7:3, sameDigit0:2, sameDigit:2.5, sequence:1.8, mirror:1.5,
    short:1.6, round:1.5, sameLetter:2, rareRegion:1.3
  }
};
