window.NM = window.NM || {};
NM.DB = NM.DB || {};
// Ставки делают ТОЛЬКО игроки. Игра никого не перебивает.
NM.DB.businesses = [
  {id:'biz1', tier:1, name:'Мойка «Пена»',            icon:'🚿', desc:'Самообслуживание.',       zone:'Спальный район', x:1500, y:1100, start:120000,   inc:300,   cap:20,  disc:0,  mult:0,  restock:18000,   deplete:14, dur:180},
  {id:'biz2', tier:1, name:'Шиномонтаж у Толика',     icon:'🛞', desc:'Переобувка и баланс.',    zone:'Спальный район', x:1900, y:1400, start:180000,   inc:450,   cap:0,   disc:5,  mult:0,  restock:27000,   deplete:14, dur:180},
  {id:'biz3', tier:1, name:'Кофейня «Пит-стоп»',      icon:'☕', desc:'Кофе для водителей.',     zone:'Рынок',          x:2300, y:2500, start:220000,   inc:550,   cap:0,   disc:0,  mult:2,  restock:33000,   deplete:14, dur:180},
  {id:'biz4', tier:1, name:'Парковка «Карман»',       icon:'🅿️', desc:'Место всегда найдётся.',  zone:'Центр',          x:2800, y:2800, start:260000,   inc:650,   cap:10,  disc:0,  mult:0,  restock:39000,   deplete:14, dur:180},
  {id:'biz5', tier:2, name:'Автосервис «Гараж»',      icon:'🔧', desc:'Чиним всё, что ездит.',   zone:'Промзона',       x:4900, y:1300, start:600000,   inc:1500,  cap:40,  disc:0,  mult:0,  restock:90000,   deplete:18, dur:240},
  {id:'biz6', tier:2, name:'Автозапчасти «Поршень»',  icon:'⚙️', desc:'Запчасти на любой мотор.',zone:'Промзона',       x:5200, y:1600, start:900000,   inc:2200,  cap:0,   disc:8,  mult:0,  restock:135000,  deplete:18, dur:240},
  {id:'biz7', tier:2, name:'Автомойка «Блеск»',       icon:'💦', desc:'Детальная мойка.',        zone:'Бизнес-центр',   x:4500, y:4100, start:1100000,  inc:2700,  cap:20,  disc:0,  mult:0,  restock:165000,  deplete:18, dur:240},
  {id:'biz8', tier:2, name:'Шаурмичная «У Ашота»',    icon:'🌯', desc:'Легенда района.',         zone:'Рынок',          x:2500, y:2800, start:1300000,  inc:3200,  cap:0,   disc:0,  mult:4,  restock:195000,  deplete:18, dur:240},
  {id:'biz9', tier:3, name:'Таксопарк «Шашечка»',     icon:'🚕', desc:'Город всегда спешит.',    zone:'Центр',          x:3100, y:3200, start:2500000,  inc:6000,  cap:0,   disc:0,  mult:8,  restock:375000,  deplete:22, dur:300},
  {id:'biz10',tier:3, name:'Автосалон б/у «Пробег»',  icon:'🚗', desc:'Продаём то, что купили.', zone:'Бизнес-центр',   x:4700, y:4300, start:4000000,  inc:9500,  cap:80,  disc:0,  mult:0,  restock:600000,  deplete:22, dur:300},
  {id:'biz11',tier:3, name:'Тюнинг-ателье «Форсаж»',  icon:'🔩', desc:'Обвесы, выхлоп, чип.',    zone:'Промзона',       x:5000, y:1800, start:5500000,  inc:13000, cap:0,   disc:10, mult:0,  restock:825000,  deplete:22, dur:300},
  {id:'biz12',tier:3, name:'Автомойка премиум',       icon:'✨', desc:'Детейлинг и керамика.',   zone:'Бизнес-центр',   x:4400, y:4400, start:6500000,  inc:15500, cap:40,  disc:0,  mult:0,  restock:975000,  deplete:22, dur:300},
  {id:'biz13',tier:3, name:'Ломбард «Залог»',         icon:'💍', desc:'Деньги под залог.',       zone:'Старый город',   x:2600, y:4500, start:7500000,  inc:18000, cap:0,   disc:0,  mult:10, restock:1125000, deplete:22, dur:300},
  {id:'biz14',tier:4, name:'Сеть АЗС «Полный бак»',   icon:'⛽', desc:'Топливо — кровь дорог.',  zone:'Набережная',     x:800,  y:3100, start:9000000,  inc:21000, cap:0,   disc:0,  mult:12, restock:1350000, deplete:26, dur:360},
  {id:'biz15',tier:4, name:'Автодром «Вишня»',        icon:'🏁', desc:'Гонки и дрифт.',          zone:'Аэропорт',       x:5100, y:5100, start:14000000, inc:33000, cap:0,   disc:12, mult:0,  restock:2100000, deplete:26, dur:360},
  {id:'biz16',tier:4, name:'Логистика «Магистраль»',  icon:'🚛', desc:'Грузоперевозки.',         zone:'Порт',           x:1300, y:4900, start:18000000, inc:43000, cap:60,  disc:0,  mult:0,  restock:2700000, deplete:26, dur:360},
  {id:'biz17',tier:4, name:'Автостраховка «Гарант»',  icon:'🛡️', desc:'КАСКО и ОСАГО.',          zone:'Бизнес-центр',   x:4600, y:4000, start:22000000, inc:53000, cap:0,   disc:0,  mult:14, restock:3300000, deplete:26, dur:360},
  {id:'biz18',tier:4, name:'Паркинг «Вертикаль»',     icon:'🏗️', desc:'Многоуровневый.',         zone:'Центр',          x:3200, y:2900, start:26000000, inc:63000, cap:120, disc:0,  mult:0,  restock:3900000, deplete:26, dur:360},
  {id:'biz19',tier:5, name:'Официальный дилерцентр',  icon:'🏢', desc:'Новые авто с гарантией.', zone:'Бизнес-центр',   x:4800, y:4500, start:30000000, inc:70000, cap:150, disc:0,  mult:15, restock:4500000, deplete:30, dur:420},
  {id:'biz20',tier:5, name:'Импорт суперкаров',       icon:'🛃', desc:'Эксклюзив со всего мира.',zone:'Порт',           x:1100, y:5200, start:40000000, inc:95000, cap:0,   disc:15, mult:10, restock:6000000, deplete:30, dur:420},
  {id:'biz21',tier:5, name:'Автосалон люкс «Бриллиант»',icon:'💎',desc:'Только премиум.',         zone:'Центр',          x:3000, y:3400, start:55000000, inc:130000,cap:100, disc:0,  mult:12, restock:8250000, deplete:30, dur:420},
  {id:'biz22',tier:5, name:'Банк «АвтоКредит»',       icon:'🏦', desc:'Кредиты на тачки.',       zone:'Бизнес-центр',   x:4500, y:4600, start:70000000, inc:165000,cap:0,   disc:0,  mult:20, restock:10500000,deplete:30, dur:420},
  {id:'biz23',tier:5, name:'Аукционный дом «Молот»',  icon:'🔨', desc:'Редкие лоты.',            zone:'Старый город',   x:2700, y:4700, start:90000000, inc:215000,cap:80,  disc:10, mult:0,  restock:13500000,deplete:30, dur:420},
  {id:'biz24',tier:5, name:'Терминал «Аэро-Карго»',   icon:'✈️', desc:'Авиадоставка.',           zone:'Аэропорт',       x:5400, y:5300, start:120000000,inc:285000,cap:0,   disc:0,  mult:18, restock:18000000,deplete:30, dur:420}
];
