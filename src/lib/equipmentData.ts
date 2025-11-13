export type EquipmentCategory = 'weapon' | 'armor' | 'helm' | 'ranged' | 'magic';
export type EquipmentRarity = 'common' | 'super' | 'special' | 'boss' | 'set' | 'challenger';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  levelRequired: number;
  rarity: EquipmentRarity;
  stats: {
    damage?: number;
    defense?: number;
    unarmedDamage?: number;
    magicPower?: number;
  };
  cost: number;
  costType: 'coins' | 'gems';
  enchantment?: string;
  abilityStats?: number;
  description?: string;
  imageUrl?: string;
  upgradeCost?: number;
  upgradeTime?: number; // in seconds
  maxLevel?: number; // Maximum upgrade level for this equipment
  statsPerLevel?: { // Stats gain per level
    damage?: number;
    defense?: number;
    unarmedDamage?: number;
    magicPower?: number;
  };
}

// WEAPONS DATA
export const weaponsData: Equipment[] = [
  // Standard Weapons
  {
    id: 'knives',
    name: 'Knives',
    category: 'weapon',
    levelRequired: 1,
    rarity: 'common',
    stats: { damage: 5 },
    cost: 50,
    costType: 'coins',
    description: 'Basic dual knives for beginners'
  },
  {
    id: 'knuckles',
    name: 'Knuckles',
    category: 'weapon',
    levelRequired: 2,
    rarity: 'common',
    stats: { damage: 20 },
    cost: 200,
    costType: 'coins',
    upgradeCost: 12,
    upgradeTime: 300
  },
  {
    id: 'sai',
    name: 'Sai',
    category: 'weapon',
    levelRequired: 3,
    rarity: 'common',
    stats: { damage: 30 },
    cost: 510,
    costType: 'coins',
    upgradeCost: 20,
    upgradeTime: 600
  },
  {
    id: 'ninja-sword',
    name: 'Ninja Sword',
    category: 'weapon',
    levelRequired: 4,
    rarity: 'common',
    stats: { damage: 55 },
    cost: 33,
    costType: 'gems',
    enchantment: 'Precision',
    abilityStats: 115
  },
  {
    id: 'machetes',
    name: 'Machetes',
    category: 'weapon',
    levelRequired: 5,
    rarity: 'common',
    stats: { damage: 80 },
    cost: 1500,
    costType: 'coins',
    upgradeCost: 28,
    upgradeTime: 900,
    enchantment: 'Weakness',
    abilityStats: 115
  },
  {
    id: 'daggers',
    name: 'Daggers',
    category: 'weapon',
    levelRequired: 6,
    rarity: 'common',
    stats: { damage: 105 },
    cost: 2500,
    costType: 'coins',
    upgradeCost: 32,
    upgradeTime: 1200,
    enchantment: 'Poisoning',
    abilityStats: 150
  },
  {
    id: 'blood-reaper',
    name: 'Blood Reaper',
    category: 'weapon',
    levelRequired: 6,
    rarity: 'super',
    stats: { damage: 105 },
    cost: 125,
    costType: 'gems',
    enchantment: 'Bleeding',
    abilityStats: 230
  },
  {
    id: 'staff',
    name: 'Staff',
    category: 'weapon',
    levelRequired: 9,
    rarity: 'common',
    stats: { damage: 186 },
    cost: 6040,
    costType: 'coins',
    upgradeCost: 28,
    upgradeTime: 1800,
    enchantment: 'Precision',
    abilityStats: 115
  },
  {
    id: 'krises',
    name: 'Krises',
    category: 'weapon',
    levelRequired: 10,
    rarity: 'common',
    stats: { damage: 211 },
    cost: 9240,
    costType: 'coins',
    upgradeCost: 34,
    upgradeTime: 2100,
    enchantment: 'Bloodrage',
    abilityStats: 290
  },
  {
    id: 'swords',
    name: 'Swords',
    category: 'weapon',
    levelRequired: 11,
    rarity: 'common',
    stats: { damage: 236 },
    cost: 14200,
    costType: 'coins',
    upgradeCost: 39,
    upgradeTime: 2400,
    enchantment: 'Stun',
    abilityStats: 325
  },
  {
    id: 'grim-scythe',
    name: 'Grim Scythe',
    category: 'weapon',
    levelRequired: 12,
    rarity: 'super',
    stats: { damage: 261 },
    cost: 250,
    costType: 'gems',
    enchantment: 'Lifesteal',
    abilityStats: 446
  },
  // Boss Weapons
  {
    id: 'lynx-claws',
    name: "Lynx's Claws",
    category: 'weapon',
    levelRequired: 6,
    rarity: 'boss',
    stats: { damage: 105 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Time Bomb',
    abilityStats: 323,
    description: 'Obtained by defeating Lynx in Eclipse mode'
  },
  {
    id: 'hermit-swords',
    name: "Hermit's Swords",
    category: 'weapon',
    levelRequired: 12,
    rarity: 'boss',
    stats: { damage: 261 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Enfeeble',
    abilityStats: 541,
    description: 'Obtained by defeating Hermit in Eclipse mode'
  },
  // Set Weapons
  {
    id: 'monk-katars',
    name: "Monk's Katars",
    category: 'weapon',
    levelRequired: 5,
    rarity: 'set',
    stats: { damage: 80 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Tempest Rage',
    abilityStats: 0,
    description: 'Part of Monk Set - Obtained from Underworld chests'
  },
  {
    id: 'sentinel-hand',
    name: "Sentinel's Hand",
    category: 'weapon',
    levelRequired: 5,
    rarity: 'set',
    stats: { damage: 80 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Typhoon of Spirits',
    abilityStats: 0,
    description: 'Part of Sentinel Set - Obtained from Soul Keeper chest'
  }
];

// ARMORS DATA
export const armorsData: Equipment[] = [
  {
    id: 'robe',
    name: 'Robe',
    category: 'armor',
    levelRequired: 2,
    rarity: 'common',
    stats: { defense: 22, unarmedDamage: 8 },
    cost: 150,
    costType: 'coins',
    upgradeCost: 12,
    upgradeTime: 300
  },
  {
    id: 'old-leather-jacket',
    name: 'Old Leather Jacket',
    category: 'armor',
    levelRequired: 3,
    rarity: 'common',
    stats: { defense: 30, unarmedDamage: 18 },
    cost: 630,
    costType: 'coins',
    upgradeCost: 25,
    upgradeTime: 600
  },
  {
    id: 'fury-carapace',
    name: 'Fury Carapace',
    category: 'armor',
    levelRequired: 4,
    rarity: 'super',
    stats: { defense: 55, unarmedDamage: 43 },
    cost: 90,
    costType: 'gems',
    enchantment: 'Frenzy',
    abilityStats: 160
  },
  {
    id: 'red-doublet',
    name: 'Red Doublet',
    category: 'armor',
    levelRequired: 5,
    rarity: 'common',
    stats: { defense: 80, unarmedDamage: 68 },
    cost: 1900,
    costType: 'coins',
    upgradeCost: 35,
    upgradeTime: 900
  },
  {
    id: 'leather-jacket',
    name: 'Leather Jacket',
    category: 'armor',
    levelRequired: 6,
    rarity: 'common',
    stats: { defense: 105, unarmedDamage: 93 },
    cost: 3100,
    costType: 'coins',
    upgradeCost: 40,
    upgradeTime: 1200
  },
  {
    id: 'snake-harness',
    name: 'Snake Harness',
    category: 'armor',
    levelRequired: 6,
    rarity: 'super',
    stats: { defense: 105, unarmedDamage: 93 },
    cost: 52,
    costType: 'gems',
    enchantment: 'Rejuvenation',
    abilityStats: 185
  },
  {
    id: 'chainmail',
    name: 'Chainmail',
    category: 'armor',
    levelRequired: 12,
    rarity: 'common',
    stats: { defense: 261, unarmedDamage: 249 },
    cost: 27100,
    costType: 'coins',
    upgradeCost: 56,
    upgradeTime: 2400
  },
  // Set Armors
  {
    id: 'monk-robe',
    name: "Monk's Robe",
    category: 'armor',
    levelRequired: 5,
    rarity: 'set',
    stats: { defense: 80, unarmedDamage: 68 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Tempest Rage',
    description: 'Part of Monk Set - Obtained from Underworld'
  },
  {
    id: 'sentinel-armor',
    name: "Sentinel's Armor",
    category: 'armor',
    levelRequired: 5,
    rarity: 'set',
    stats: { defense: 80, unarmedDamage: 68 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Typhoon of Spirits',
    description: 'Part of Sentinel Set - Obtained from Chest of Souls Keeper'
  }
];

// HELMS DATA
export const helmsData: Equipment[] = [
  {
    id: 'light-helm',
    name: 'Light Helm',
    category: 'helm',
    levelRequired: 2,
    rarity: 'common',
    stats: { defense: 18 },
    cost: 180,
    costType: 'coins',
    upgradeCost: 12,
    upgradeTime: 300
  },
  {
    id: 'kendo-mask',
    name: 'Kendo Mask',
    category: 'helm',
    levelRequired: 3,
    rarity: 'common',
    stats: { defense: 28 },
    cost: 380,
    costType: 'coins',
    upgradeCost: 15,
    upgradeTime: 600
  },
  {
    id: 'conical-hat',
    name: 'Conical Hat',
    category: 'helm',
    levelRequired: 3,
    rarity: 'super',
    stats: { defense: 28 },
    cost: 21,
    costType: 'gems',
    enchantment: 'Damage Absorption',
    abilityStats: 90
  },
  {
    id: 'pointed-helm',
    name: 'Pointed Helm',
    category: 'helm',
    levelRequired: 5,
    rarity: 'common',
    stats: { defense: 78 },
    cost: 1100,
    costType: 'coins',
    upgradeCost: 21,
    upgradeTime: 900
  },
  {
    id: 'snake-mask',
    name: 'Snake Mask',
    category: 'helm',
    levelRequired: 5,
    rarity: 'super',
    stats: { defense: 78 },
    cost: 28,
    costType: 'gems',
    enchantment: 'Overheat',
    abilityStats: 150
  },
  // Set Helms
  {
    id: 'monk-helm',
    name: "Monk's Helm",
    category: 'helm',
    levelRequired: 5,
    rarity: 'set',
    stats: { defense: 78 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Tempest Rage',
    description: 'Part of Monk Set - Obtained from Underworld'
  }
];

// RANGED WEAPONS DATA
export const rangedWeaponsData: Equipment[] = [
  {
    id: 'throwing-daggers',
    name: 'Throwing Daggers',
    category: 'ranged',
    levelRequired: 8,
    rarity: 'super',
    stats: { damage: 166 },
    cost: 21,
    costType: 'gems',
    enchantment: 'Precision',
    abilityStats: 261,
    description: 'Kunai type ranged weapon'
  },
  {
    id: 'shurikens',
    name: 'Shurikens',
    category: 'ranged',
    levelRequired: 10,
    rarity: 'common',
    stats: { damage: 216 },
    cost: 5780,
    costType: 'coins',
    upgradeCost: 21,
    upgradeTime: 2100,
    description: 'Standard ninja stars'
  },
  {
    id: 'kunai',
    name: 'Kunai',
    category: 'ranged',
    levelRequired: 12,
    rarity: 'common',
    stats: { damage: 266 },
    cost: 13500,
    costType: 'coins',
    upgradeCost: 28,
    upgradeTime: 2400,
    description: 'Traditional throwing knives'
  },
  {
    id: 'chakram',
    name: 'Chakram',
    category: 'ranged',
    levelRequired: 19,
    rarity: 'super',
    stats: { damage: 453 },
    cost: 27,
    costType: 'gems',
    enchantment: 'Bloodrage',
    description: 'Circular throwing blade'
  },
  // Set Ranged
  {
    id: 'monk-shuriken',
    name: "Monk's Shuriken",
    category: 'ranged',
    levelRequired: 5,
    rarity: 'set',
    stats: { damage: 85 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Tempest Rage',
    description: 'Part of Monk Set - Obtained from Underworld'
  }
];

// MAGIC DATA
export const magicData: Equipment[] = [
  {
    id: 'fire-ball',
    name: 'Fire Ball',
    category: 'magic',
    levelRequired: 14,
    rarity: 'super',
    stats: { magicPower: 322 },
    cost: 29,
    costType: 'gems',
    enchantment: 'Weakness',
    abilityStats: 477
  },
  {
    id: 'energy-ball',
    name: 'Energy Ball',
    category: 'magic',
    levelRequired: 16,
    rarity: 'common',
    stats: { magicPower: 372 },
    cost: 25400,
    costType: 'coins',
    upgradeCost: 30,
    upgradeTime: 3000
  },
  {
    id: 'dark-blast',
    name: 'Dark Blast',
    category: 'magic',
    levelRequired: 19,
    rarity: 'common',
    stats: { magicPower: 453 },
    cost: 10400,
    costType: 'coins',
    upgradeCost: 18,
    upgradeTime: 3600
  },
  {
    id: 'dark-implosion',
    name: 'Dark Implosion',
    category: 'magic',
    levelRequired: 21,
    rarity: 'super',
    stats: { magicPower: 503 },
    cost: 42,
    costType: 'gems',
    enchantment: 'Overheat',
    abilityStats: 728
  },
  // Set Magic
  {
    id: 'monk-amulet',
    name: "Monk's Amulet",
    category: 'magic',
    levelRequired: 7,
    rarity: 'set',
    stats: { magicPower: 141 },
    cost: 0,
    costType: 'coins',
    enchantment: 'Tempest Rage',
    description: 'Part of Monk Set - Obtained from Underworld'
  }
];

// Combine all equipment
export const allEquipment: Equipment[] = [
  ...weaponsData,
  ...armorsData,
  ...helmsData,
  ...rangedWeaponsData,
  ...magicData
];

// Add default upgrade properties to all equipment
allEquipment.forEach(eq => {
  // Set max level (52 for most, or based on rarity)
  if (!eq.maxLevel) {
    eq.maxLevel = eq.rarity === 'boss' || eq.rarity === 'set' ? 52 : 52;
  }
  
  // Set stats per level (10% of base stats)
  if (!eq.statsPerLevel) {
    eq.statsPerLevel = {
      damage: eq.stats.damage ? Math.ceil(eq.stats.damage * 0.1) : undefined,
      defense: eq.stats.defense ? Math.ceil(eq.stats.defense * 0.1) : undefined,
      unarmedDamage: eq.stats.unarmedDamage ? Math.ceil(eq.stats.unarmedDamage * 0.1) : undefined,
      magicPower: eq.stats.magicPower ? Math.ceil(eq.stats.magicPower * 0.1) : undefined,
    };
  }
  
  // Set base upgrade cost if not set (based on equipment level requirement)
  if (!eq.upgradeCost && eq.cost > 0) {
    eq.upgradeCost = eq.costType === 'gems' ? 5 : eq.levelRequired * 100;
  }
  
  // Set upgrade time if not set (5 minutes base)
  if (!eq.upgradeTime) {
    eq.upgradeTime = 300; // 5 minutes
  }
});

export const getEquipmentByCategory = (category: EquipmentCategory): Equipment[] => {
  return allEquipment.filter(eq => eq.category === category);
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  return allEquipment.find(eq => eq.id === id);
};

export const getAvailableEquipment = (playerLevel: number, category?: EquipmentCategory): Equipment[] => {
  let equipment = category ? getEquipmentByCategory(category) : allEquipment;
  return equipment.filter(eq => eq.levelRequired <= playerLevel);
};

export const getRarityColor = (rarity: EquipmentRarity): string => {
  switch (rarity) {
    case 'common': return 'text-slate-400 border-slate-500';
    case 'super': return 'text-blue-400 border-blue-500';
    case 'special': return 'text-purple-400 border-purple-500';
    case 'boss': return 'text-orange-400 border-orange-500';
    case 'set': return 'text-pink-400 border-pink-500';
    case 'challenger': return 'text-green-400 border-green-500';
  }
};