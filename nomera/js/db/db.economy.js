window.NM = window.NM || {};
NM.DB = NM.DB || {};
NM.DB.economy = {
  start:{ money:0, freeSpins:15 },
  spinCost:2500,            // одна цена за полную крутку (скидки от бизнесов)
  baseCap:400,              // базовая вместимость инвентаря
  maxMult:4,
  job:{ amount:2000, cooldown:45000 },
  protection:[
    {spins:15,  max:'rare'},
    {spins:50,  max:'epic'},
    {spins:120, max:'legend'}
  ],
  plateMult:{common:1.08,rare:1.2,epic:1.4,legend:1.75,mythic:2.3},
  upgrade:{ costMul:0.5, grow:1.38, incomeGrow:0.5 }
};
