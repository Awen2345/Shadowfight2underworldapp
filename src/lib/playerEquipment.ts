import { Equipment } from './equipmentData';

export interface EquippedItems {
  weapon: string | null;
  armor: string | null;
  helm: string | null;
  ranged: string | null;
  magic: string | null;
}

export interface OwnedEquipment {
  equipmentId: string;
  level: number;
  isUpgrading: boolean;
  upgradeEndTime?: number; // timestamp
}

export interface UpgradeQueue {
  equipmentId: string;
  startTime: number;
  endTime: number;
  speedUpCost: number; // unverified gems needed to speed up
}

// Player's equipped items
export const equippedItems: EquippedItems = {
  weapon: 'knives', // Starting weapon
  armor: null,
  helm: null,
  ranged: null,
  magic: null
};

// Player's owned equipment (what they bought/earned)
export const ownedEquipment: OwnedEquipment[] = [
  {
    equipmentId: 'knives',
    level: 1,
    isUpgrading: false
  }
];

// Active upgrade queue
export const upgradeQueue: UpgradeQueue[] = [];

// Player level (for equipment requirements)
export let playerLevel = 52; // Current player level - MAX LEVEL
export const MAX_PLAYER_LEVEL = 52; // Max level in Shadow Fight 2

export const setPlayerLevel = (level: number) => {
  playerLevel = Math.min(level, MAX_PLAYER_LEVEL);
};

export const getPlayerLevel = () => playerLevel;

export const getMaxPlayerLevel = () => MAX_PLAYER_LEVEL;

// Equipment management functions
export const hasEquipment = (equipmentId: string): boolean => {
  return ownedEquipment.some(eq => eq.equipmentId === equipmentId);
};

export const addEquipment = (equipmentId: string): void => {
  if (!hasEquipment(equipmentId)) {
    ownedEquipment.push({
      equipmentId,
      level: 1,
      isUpgrading: false
    });
  }
};

export const equipItem = (equipmentId: string, category: 'weapon' | 'armor' | 'helm' | 'ranged' | 'magic'): void => {
  if (hasEquipment(equipmentId)) {
    equippedItems[category] = equipmentId;
  }
};

export const unequipItem = (category: 'weapon' | 'armor' | 'helm' | 'ranged' | 'magic'): void => {
  equippedItems[category] = null;
};

export const getEquippedItem = (category: 'weapon' | 'armor' | 'helm' | 'ranged' | 'magic'): string | null => {
  return equippedItems[category];
};

export const getOwnedEquipmentLevel = (equipmentId: string): number => {
  const equipment = ownedEquipment.find(eq => eq.equipmentId === equipmentId);
  return equipment ? equipment.level : 0;
};

export const startUpgrade = (equipmentId: string, durationSeconds: number, costInUnverifiedGems: number): void => {
  const equipment = ownedEquipment.find(eq => eq.equipmentId === equipmentId);
  if (!equipment) return;

  const now = Date.now();
  const endTime = now + (durationSeconds * 1000);

  equipment.isUpgrading = true;
  equipment.upgradeEndTime = endTime;

  upgradeQueue.push({
    equipmentId,
    startTime: now,
    endTime,
    speedUpCost: costInUnverifiedGems
  });
};

export const completeUpgrade = (equipmentId: string): void => {
  const equipment = ownedEquipment.find(eq => eq.equipmentId === equipmentId);
  if (!equipment) return;

  equipment.level += 1;
  equipment.isUpgrading = false;
  equipment.upgradeEndTime = undefined;

  const queueIndex = upgradeQueue.findIndex(q => q.equipmentId === equipmentId);
  if (queueIndex !== -1) {
    upgradeQueue.splice(queueIndex, 1);
  }
};

// Get current stats for equipment at current level
export const getEquipmentCurrentStats = (equipmentId: string, baseStats: any, statsPerLevel: any): any => {
  const ownedEq = ownedEquipment.find(eq => eq.equipmentId === equipmentId);
  const currentLevel = ownedEq ? ownedEq.level : 1;
  
  const currentStats: any = { ...baseStats };
  
  if (statsPerLevel && currentLevel > 1) {
    const levelBonus = currentLevel - 1;
    if (statsPerLevel.damage) currentStats.damage = (currentStats.damage || 0) + (statsPerLevel.damage * levelBonus);
    if (statsPerLevel.defense) currentStats.defense = (currentStats.defense || 0) + (statsPerLevel.defense * levelBonus);
    if (statsPerLevel.unarmedDamage) currentStats.unarmedDamage = (currentStats.unarmedDamage || 0) + (statsPerLevel.unarmedDamage * levelBonus);
    if (statsPerLevel.magicPower) currentStats.magicPower = (currentStats.magicPower || 0) + (statsPerLevel.magicPower * levelBonus);
  }
  
  return currentStats;
};

// Calculate upgrade cost for current level
export const getUpgradeCostForLevel = (baseCost: number, currentLevel: number): number => {
  // Cost increases by 20% per level
  return Math.ceil(baseCost * Math.pow(1.2, currentLevel - 1));
};

export const speedUpUpgrade = (equipmentId: string): void => {
  completeUpgrade(equipmentId);
};

export const getUpgradeProgress = (equipmentId: string): number => {
  const queue = upgradeQueue.find(q => q.equipmentId === equipmentId);
  if (!queue) return 0;

  const now = Date.now();
  const total = queue.endTime - queue.startTime;
  const elapsed = now - queue.startTime;
  
  return Math.min(100, (elapsed / total) * 100);
};

export const getRemainingTime = (equipmentId: string): number => {
  const queue = upgradeQueue.find(q => q.equipmentId === equipmentId);
  if (!queue) return 0;

  const now = Date.now();
  const remaining = Math.max(0, queue.endTime - now);
  
  return Math.ceil(remaining / 1000); // return in seconds
};

export const calculateTotalStats = (): { damage: number, defense: number, magicPower: number } => {
  let totalDamage = 0;
  let totalDefense = 0;
  let totalMagicPower = 0;

  // This would calculate based on equipped items
  // For now, return placeholder values
  
  return {
    damage: totalDamage,
    defense: totalDefense,
    magicPower: totalMagicPower
  };
};