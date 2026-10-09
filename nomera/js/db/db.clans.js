window.NM = window.NM || {};
NM.DB = NM.DB || {};
NM.DB.clans = {
  createCost: 1000000000,      // 1 млрд на создание клана
  baseSlotCost: 50000000,      // первый доп. слот — 50 млн
  slotGrowth: 2.2,
  maxSlots: 50,
  bonusPerMember: 0.02,        // +2% доход за участника
  bonusCap: 0.5,               // максимум +50% от участников
  // прокачка клана
  levelCostBase: 100000000,    // 100 млн за 2-й уровень
  levelCostGrowth: 1.8,
  maxLevel: 20,
  incomeBonusPerLevel: 0.05,   // +5% к доходу за уровень клана
  invSlotsPerLevel: 20         // +20 слотов инвентаря за уровень клана
};
