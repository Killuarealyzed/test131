window.NM = window.NM || {};
NM.DB = NM.DB || {};
NM.DB.vehicleCats = [
  ['all','Все'],['cars','Машины'],['bikes','Мотоциклы'],['trucks','Грузовики'],
  ['planes','Самолёты'],['helis','Вертолёты'],['yachts','Яхты'],['space','Космос']
];
NM.DB.vehicles = [
  // --- МАШИНЫ (SVG) ---
  {id:'v1', cat:'cars', name:'ВАЗ 2101 «Копейка»', price:120000,     income:300,     body:'classic',color:'#d8c7a0',icon:'🚗',desc:'Легенда двора'},
  {id:'v2', cat:'cars', name:'ВАЗ 2106',           price:260000,     income:620,     body:'classic',color:'#3d3a32',icon:'🚗',desc:'Шестёрка'},
  {id:'v3', cat:'cars', name:'ВАЗ 2107 «Семёрка»', price:420000,     income:1000,    body:'classic',color:'#e9edf3',icon:'🚗',desc:'Русский мерин'},
  {id:'v4', cat:'cars', name:'Lada Niva «Нива»',   price:700000,     income:1700,    body:'suv',    color:'#4a6741',icon:'🚙',desc:'Вездеход'},
  {id:'v5', cat:'cars', name:'ГАЗ 24 «Волга»',     price:1500000,    income:3700,    body:'sedan',  color:'#1c1f28',icon:'🚘',desc:'Машина директора'},
  {id:'v6', cat:'cars', name:'BMW 3 E36',          price:2800000,    income:7000,    body:'coupe',  color:'#2b2b2b',icon:'🚗',desc:'Боевая классика'},
  {id:'v7', cat:'cars', name:'BMW M5 E34 «Бумер»', price:5000000,    income:12500,   body:'sedan',  color:'#31548f',icon:'🚗',desc:'Братская любовь'},
  {id:'v8', cat:'cars', name:'Mercedes W140 «Кабан»',price:9000000,  income:22500,   body:'sedan',  color:'#141414',icon:'🚘',desc:'Авторитет 90-х'},
  {id:'v9', cat:'cars', name:'Toyota Supra MK4',   price:15000000,   income:37500,   body:'coupe',  color:'#f39200',icon:'🚗',desc:'Легенда JDM'},
  {id:'v10',cat:'cars', name:'Nissan GT-R R35',    price:25000000,   income:62500,   body:'super',  color:'#c9ced6',icon:'🏎️',desc:'Годзилла'},
  {id:'v11',cat:'cars', name:'Mercedes W222',      price:40000000,   income:100000,  body:'sedan',  color:'#1a1d25',icon:'🚘',desc:'Немецкий комфорт'},
  {id:'v12',cat:'cars', name:'BMW M5 F90',         price:60000000,   income:150000,  body:'sedan',  color:'#0f4a94',icon:'🚗',desc:'Бизнес-ракета'},
  {id:'v13',cat:'cars', name:'Porsche 911 Turbo S',price:90000000,   income:225000,  body:'coupe',  color:'#c92a2a',icon:'🏎️',desc:'Икона спорта'},
  {id:'v14',cat:'cars', name:'Mercedes G63 «Гелик»',price:140000000, income:350000,  body:'suv',    color:'#0a0a0a',icon:'🚙',desc:'Квадратный авторитет'},
  {id:'v15',cat:'cars', name:'Lamborghini Huracán',price:200000000,  income:500000,  body:'super',  color:'#f1c40f',icon:'🏎️',desc:'Итальянский бык'},
  {id:'v16',cat:'cars', name:'Ferrari 488 GTB',    price:280000000,  income:700000,  body:'super',  color:'#dc2626',icon:'🏎️',desc:'Россо Корса'},
  {id:'v17',cat:'cars', name:'McLaren 720S',       price:260000000,  income:650000,  body:'super',  color:'#ff6600',icon:'🏎️',desc:'Британский хищник'},
  {id:'v18',cat:'cars', name:'Lamborghini Urus',   price:320000000,  income:800000,  body:'suv',    color:'#7fb800',icon:'🚙',desc:'Дикий бык'},
  {id:'v19',cat:'cars', name:'Rolls-Royce Cullinan',price:400000000, income:1000000, body:'suv',    color:'#1c1f28',icon:'🚙',desc:'Вершина роскоши'},
  {id:'v20',cat:'cars', name:'Bugatti Chiron',     price:1000000000, income:2500000, body:'super',  color:'#2f6fe4',icon:'🏎️',desc:'Вершина всего'},
  {id:'v21',cat:'cars', name:'Koenigsegg Jesko',   price:1800000000, income:4500000, body:'super',  color:'#0a0a0a',icon:'🏎️',desc:'Шведская комета'},
  {id:'v22',cat:'cars', name:'Rolls-Royce Boat Tail',price:3000000000,income:7500000,body:'coupe',  color:'#3a7d7c',icon:'🚗',desc:'Единственный в мире'},
  // --- МОТОЦИКЛЫ ---
  {id:'b1', cat:'bikes', name:'Мотоцикл «Минск»',   price:80000,    income:200,    icon:'🏍️',desc:'Первый байк'},
  {id:'b2', cat:'bikes', name:'Yamaha YZF-R1',      price:1200000,  income:3000,   icon:'🏍️',desc:'Спортивный'},
  {id:'b3', cat:'bikes', name:'BMW S1000RR',        price:2500000,  income:6200,   icon:'🏍️',desc:'Немецкий спорт'},
  {id:'b4', cat:'bikes', name:'Harley-Davidson',    price:3500000,  income:8700,   icon:'🏍️',desc:'Круизёр'},
  {id:'b5', cat:'bikes', name:'Ducati Panigale V4', price:4500000,  income:11200,  icon:'🏍️',desc:'Итальянец'},
  // --- ГРУЗОВИКИ ---
  {id:'t1', cat:'trucks', name:'ГАЗель',            price:900000,   income:2200,   icon:'🚚',desc:'Рабочая лошадка'},
  {id:'t2', cat:'trucks', name:'КамАЗ',             price:6000000,  income:15000,  icon:'🚛',desc:'Дальнобой'},
  {id:'t3', cat:'trucks', name:'Фура Volvo FH',     price:12000000, income:30000,  icon:'🚛',desc:'Магистральная'},
  {id:'t4', cat:'trucks', name:'БелАЗ-75710',       price:45000000, income:112000, icon:'🚚',desc:'Карьерный гигант'},
  // --- САМОЛЁТЫ ---
  {id:'p1', cat:'planes', name:'Як-52',             price:8000000,   income:20000,   icon:'🛩️',desc:'Пилотажка'},
  {id:'p2', cat:'planes', name:'Cessna 172',        price:20000000,  income:50000,   icon:'🛩️',desc:'Частный'},
  {id:'p3', cat:'planes', name:'Bombardier Learjet',price:150000000, income:375000,  icon:'✈️',desc:'Бизнес-джет'},
  {id:'p4', cat:'planes', name:'Gulfstream G650',   price:450000000, income:1125000, icon:'✈️',desc:'Дальний бизнес-джет'},
  {id:'p5', cat:'planes', name:'Boeing 747',        price:2500000000,income:6250000, icon:'✈️',desc:'Джамбо-джет'},
  {id:'p6', cat:'planes', name:'Airbus A380',       price:3500000000,income:8750000, icon:'✈️',desc:'Гигант'},
  {id:'p7', cat:'planes', name:'Конкорд (ретро)',   price:5000000000,income:12500000,icon:'✈️',desc:'Сверхзвук'},
  // --- ВЕРТОЛЁТЫ ---
  {id:'h1', cat:'helis', name:'Robinson R44',       price:30000000,  income:75000,   icon:'🚁',desc:'Лёгкий'},
  {id:'h2', cat:'helis', name:'Airbus H125',        price:70000000,  income:175000,  icon:'🚁',desc:'Рабочий'},
  {id:'h3', cat:'helis', name:'Bell 429',           price:120000000, income:300000,  icon:'🚁',desc:'Бизнес'},
  {id:'h4', cat:'helis', name:'Ми-8',               price:250000000, income:625000,  icon:'🚁',desc:'Легенда'},
  {id:'h5', cat:'helis', name:'Sikorsky S-92',      price:500000000, income:1250000, icon:'🚁',desc:'VIP'},
  // --- ЯХТЫ ---
  {id:'y1', cat:'yachts', name:'Катер «Казанка»',   price:150000,    income:370,     icon:'🚤',desc:'Речной'},
  {id:'y2', cat:'yachts', name:'Яхта «Корвет»',     price:12000000,  income:30000,   icon:'🛥️',desc:'Прогулочная'},
  {id:'y3', cat:'yachts', name:'Моторная яхта 30м', price:180000000, income:450000,  icon:'🛥️',desc:'Морская'},
  {id:'y4', cat:'yachts', name:'Суперяхта 60м',     price:900000000, income:2250000, icon:'🛥️',desc:'Супер'},
  {id:'y5', cat:'yachts', name:'Яхта «Эклипс»',     price:8000000000,income:20000000,icon:'🛥️',desc:'Мегаяхта'},
  // --- КОСМОС ---
  {id:'s1', cat:'space', name:'Суборбитальный шаттл',price:15000000000,  income:37500000,  icon:'🚀',desc:'Край космоса'},
  {id:'s2', cat:'space', name:'Ракета «Союз»',      price:40000000000,  income:100000000, icon:'🚀',desc:'Классика'},
  {id:'s3', cat:'space', name:'Starship',           price:120000000000, income:300000000, icon:'🚀',desc:'На Марс'},
  {id:'s4', cat:'space', name:'Межзвёздный лайнер', price:500000000000, income:1250000000,icon:'🛸',desc:'К другим звёздам'}
];
