export type EnchantmentType = 'simple' | 'medium' | 'mythical';
export type EquipmentTypeForEnchant = 'weapon' | 'armor' | 'helm' | 'ranged' | 'magic' | 'all';

export interface Enchantment {
  id: string;
  name: string;
  type: EnchantmentType;
  description: string;
  availableOn: EquipmentTypeForEnchant[];
  power?: number; // Max power at level 52
  requirements: {
    greenOrbs?: number;
    redOrbs?: number;
    purpleOrbs?: number;
  };
  forgeTime: number; // in seconds
  skipCost: number; // Unverified gems to skip
  imageIcon?: string;
}

// Simple Enchantments (20 minutes, Green Orbs only)
export const simpleEnchantments: Enchantment[] = [
  {
    id: 'precision',
    name: 'Precision',
    type: 'simple',
    description: 'A chance to make a Critical Hit with 100% more damage. This chance depends on the power of the enchantment.',
    availableOn: ['weapon', 'ranged'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200, // 20 minutes
    skipCost: 50,
    imageIcon: '🎯'
  },
  {
    id: 'overheat',
    name: 'Overheat',
    type: 'simple',
    description: 'Each strike dealt or each hit taken has a chance to put a buff on you that makes your next strike inflict 200% more damage.',
    availableOn: ['all'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '🔥'
  },
  {
    id: 'poisoning',
    name: 'Poisoning',
    type: 'simple',
    description: 'A chance that your enemy will start to lose 3% health (10.2% for magic) per second over 5 seconds after being hit.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '☠️'
  },
  {
    id: 'weakness',
    name: 'Weakness',
    type: 'simple',
    description: "A chance to weaken your enemy's attacks by 75% from a successful hit.",
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '💔'
  },
  {
    id: 'magic-recharge',
    name: 'Magic Recharge',
    type: 'simple',
    description: 'A chance to increase your magic recharge from a successful hit by 300% and from taking a hit by 700%.',
    availableOn: ['weapon', 'armor', 'helm'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '⚡'
  },
  {
    id: 'bloodrage',
    name: 'Bloodrage',
    type: 'simple',
    description: 'A chance that you will deal 200% more damage on your hit, but would also lose 30% of damage dealt in own health.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '🩸'
  },
  {
    id: 'rejuvenation',
    name: 'Rejuvenation',
    type: 'simple',
    description: 'A chance to regenerate 3% of your health for 5 seconds after being hit.',
    availableOn: ['armor', 'helm'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '💚'
  },
  {
    id: 'damage-absorption',
    name: 'Damage Absorption',
    type: 'simple',
    description: 'A chance to absorb all damage dealt to your body or head by a single strike.',
    availableOn: ['armor', 'helm'],
    power: 1897,
    requirements: { greenOrbs: 3 },
    forgeTime: 1200,
    skipCost: 50,
    imageIcon: '🛡️'
  }
];

// Medium Enchantments (1 hour 20 minutes, Green + Red Orbs)
export const mediumEnchantments: Enchantment[] = [
  {
    id: 'lifesteal',
    name: 'Lifesteal',
    type: 'medium',
    description: 'A chance on every successful hit to replenish your health by 250% (100% for magic) of the damage dealt to the enemy.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800, // 1h 20min
    skipCost: 150,
    imageIcon: '🧛'
  },
  {
    id: 'bleeding',
    name: 'Bleeding',
    type: 'medium',
    description: 'A chance that the enemy will start to lose 6% health (3.4% for magic) per second over 5 seconds after being hit.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '🩸'
  },
  {
    id: 'enfeeble',
    name: 'Enfeeble',
    type: 'medium',
    description: "A chance to weaken your enemy's attacks by 75% for 10 seconds after a successful hit.",
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '😵'
  },
  {
    id: 'frenzy',
    name: 'Frenzy',
    type: 'medium',
    description: 'A chance to increase your melee damage by 150% for 5 seconds after dealing or receiving a hit.',
    availableOn: ['all'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '😤'
  },
  {
    id: 'stun',
    name: 'Stun',
    type: 'medium',
    description: 'A chance to stun your enemy for 3 seconds after a successful hit.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '💫'
  },
  {
    id: 'time-bomb',
    name: 'Time Bomb',
    type: 'medium',
    description: 'A chance to set a time bomb on your enemy, which will detonate after 2 seconds.',
    availableOn: ['weapon', 'ranged', 'magic'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '💣'
  },
  {
    id: 'regeneration',
    name: 'Regeneration',
    type: 'medium',
    description: 'A chance to regenerate 4.5% of your health for 5 seconds after being hit.',
    availableOn: ['armor', 'helm'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '💖'
  },
  {
    id: 'shielding',
    name: 'Shielding',
    type: 'medium',
    description: 'A chance to reduce incoming damage by 75% for 7 seconds after being hit.',
    availableOn: ['armor', 'helm'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '🛡️'
  },
  {
    id: 'damage-return',
    name: 'Damage Return',
    type: 'medium',
    description: 'A chance on each hit that the enemy will take 85% of damage received.',
    availableOn: ['armor', 'helm'],
    power: 1942,
    requirements: { greenOrbs: 5, redOrbs: 2 },
    forgeTime: 4800,
    skipCost: 150,
    imageIcon: '↩️'
  }
];

// Mythical Enchantments (2 hours, Green + Red + Purple Orbs)
export const mythicalEnchantments: Enchantment[] = [
  {
    id: 'tempest-rage',
    name: 'Tempest Rage',
    type: 'mythical',
    description: "Deliver hits, and your power will increase. It will descend if you get hit. Accumulate enough power to land a deadly blow.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200, // 2 hours
    skipCost: 300,
    imageIcon: '⚡'
  },
  {
    id: 'typhoon-spirits',
    name: 'Typhoon of Spirits',
    type: 'mythical',
    description: "Attack your foe, don't miss a hit, and your shield power will grow. Accumulate it enough and avenge when enemy hits you.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🌪️'
  },
  {
    id: 'crimson-corruption',
    name: 'Crimson Corruption',
    type: 'mythical',
    description: 'Successfully attacking your foe with a weapon will curse him. He will receive periodic damage.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🔴'
  },
  {
    id: 'icy-resistance',
    name: 'Icy Resistance',
    type: 'mythical',
    description: "As long as the blizzard is wrapped around you, damage is no threat. If anyone dares touch you, the blizzard will imbue you with strength.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '❄️'
  },
  {
    id: 'karma',
    name: 'Karma',
    type: 'mythical',
    description: "Make a strike combo and get a buff. The bigger the combo, the stronger the effect.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '☯️'
  },
  {
    id: 'squall',
    name: 'Squall',
    type: 'mythical',
    description: 'Kick your enemy in the legs and a gust of wind will knock them down. Strike them as they fall and deal them a crushing blow.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🌬️'
  },
  {
    id: 'plot-twist',
    name: 'Plot Twist',
    type: 'mythical',
    description: "Hit the enemy with magic. You'll see what happens.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🎬'
  },
  {
    id: 'time-shift',
    name: 'Time Shift',
    type: 'mythical',
    description: 'Hit the enemy with magic to slow him down. In this state, the enemy is more vulnerable to attack.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '⏱️'
  },
  {
    id: 'arcane-martial-art',
    name: 'Arcane Martial Art',
    type: 'mythical',
    description: 'A successful attack gives a chance for your power to increase. After accumulating power, you can use special attack.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🥋'
  },
  {
    id: 'cordyceps',
    name: 'Cordyceps',
    type: 'mythical',
    description: "This enchantment feeds on the enemy's pain. Once saturated, it'll spawn a spore in your enemy.",
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🍄'
  },
  {
    id: 'roaring-luminary',
    name: 'Roaring Luminary',
    type: 'mythical',
    description: 'Deal successful hits in a row to summon a lava puddle underneath opponent. Your attacks deal increased damage and cannot be blocked.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🌋'
  },
  {
    id: 'predator-fury',
    name: "Predator's Fury",
    type: 'mythical',
    description: 'Successfully hit the enemy with a series of blows to knock out some of their power. Picking it up will restore your health.',
    availableOn: ['all'],
    requirements: { greenOrbs: 10, redOrbs: 5, purpleOrbs: 1 },
    forgeTime: 7200,
    skipCost: 300,
    imageIcon: '🦁'
  }
];

export const allEnchantments: Enchantment[] = [
  ...simpleEnchantments,
  ...mediumEnchantments,
  ...mythicalEnchantments
];

// Helper function to check if enchantment is available for equipment type
export const isEnchantmentAvailableFor = (enchantment: Enchantment, equipmentType: string): boolean => {
  if (enchantment.availableOn.includes('all')) return true;
  return enchantment.availableOn.includes(equipmentType as EquipmentTypeForEnchant);
};

// Helper to get enchantments by type
export const getEnchantmentsByType = (type: EnchantmentType): Enchantment[] => {
  return allEnchantments.filter(e => e.type === type);
};
