window.NM = window.NM || {};
NM.DB = NM.DB || {};
// Цены пересчитаны: кейсы теперь ~в минусе, экономику не ломают.
NM.DB.cases = [
  {id:'bronze', name:'Бронзовый кейс', price:200000,   lvl:1,  emo:'🥉', pool:{common:60,rare:32,epic:8}},
  {id:'silver', name:'Серебряный кейс', price:900000,   lvl:3,  emo:'🥈', pool:{common:25,rare:45,epic:26,legend:4}},
  {id:'gold',   name:'Золотой кейс',   price:6500000,  lvl:6,  emo:'🥇', pool:{rare:25,epic:48,legend:24,mythic:3}},
  {id:'diamond',name:'Алмазный кейс',  price:20000000, lvl:10, emo:'💎', pool:{epic:40,legend:46,mythic:14}},
  {id:'mythic', name:'Мифический кейс',price:55000000, lvl:15, emo:'🔮', pool:{legend:55,mythic:45}}
];
