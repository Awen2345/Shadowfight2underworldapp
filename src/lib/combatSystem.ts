import { getEquipmentEnchantment } from './enchantmentForging';
import { allEnchantments } from './enchantmentData';
import { ownedEquipment, getEquippedItem } from './playerEquipment';
import { allEquipment } from './equipmentData';

// Combat state types
export interface CombatEntity {
  id: string;
  name: string;
  maxHealth: number;
  currentHealth: number;
  damage: number;
  defense: number;
  magicPower: number;
  rangedDamage: number;
  activeBuffs: Buff[];
  activeDebuffs: Debuff[];
  enchantmentStacks: Map<string, number>; // For mythical enchantments
}

export interface Buff {
  id: string;
  name: string;
  type: 'damage' | 'defense' | 'heal' | 'magic-recharge';
  multiplier: number;
  duration: number; // in seconds
  remainingDuration: number;
  stackCount?: number;
}

export interface Debuff {
  id: string;
  name: string;
  type: 'dot' | 'weaken' | 'stun' | 'slow' | 'curse';
  effect: number;
  duration: number;
  remainingDuration: number;
  tickRate?: number; // for DOT effects
}

export interface AttackResult {
  damage: number;
  isCritical: boolean;
  isBlocked: boolean;
  healed: number;
  buffsApplied: Buff[];
  debuffsApplied: Debuff[];
  specialEffects: string[];
  enchantmentTriggered?: string;
}

export interface CombatLog {
  timestamp: number;
  attacker: string;
  defender: string;
  action: string;
  result: AttackResult;
  message: string;
}

// Get player's active enchantments
export const getPlayerActiveEnchantments = (): Map<string, any> => {
  const enchantments = new Map();
  const categories = ['weapon', 'armor', 'helm', 'ranged', 'magic'];
  
  categories.forEach(category => {
    const equippedId = getEquippedItem(category as any);
    if (equippedId) {
      const enchantment = getEquipmentEnchantment(equippedId);
      if (enchantment) {
        const enchantmentData = allEnchantments.find(e => e.id === enchantment.enchantmentId);
        if (enchantmentData) {
          enchantments.set(category, {
            ...enchantmentData,
            power: enchantment.power,
            equipmentId: equippedId
          });
        }
      }
    }
  });
  
  return enchantments;
};

// Check if mythical enchantment set is complete
export const hasMythicalSetBonus = (mythicalId: string): boolean => {
  const categories = ['weapon', 'armor', 'helm', 'ranged', 'magic'];
  let matchCount = 0;
  
  categories.forEach(category => {
    const equippedId = getEquippedItem(category as any);
    if (equippedId) {
      const enchantment = getEquipmentEnchantment(equippedId);
      if (enchantment && enchantment.enchantmentId === mythicalId) {
        matchCount++;
      }
    }
  });
  
  return matchCount === 5; // All 5 equipment must have same mythical
};

// Calculate enchantment trigger chance based on power
const calculateTriggerChance = (power: number): number => {
  // Power ranges from ~1900 at level 52
  // Convert to percentage (roughly 0-50% chance)
  return Math.min(50, (power / 1900) * 40);
};

// Random chance calculator
const rollChance = (percentage: number): boolean => {
  return Math.random() * 100 < percentage;
};

// SIMPLE ENCHANTMENTS LOGIC

export const applyPrecision = (attacker: CombatEntity, defender: CombatEntity, baseDamage: number, power: number): AttackResult => {
  const triggerChance = calculateTriggerChance(power);
  const isCritical = rollChance(triggerChance);
  
  const finalDamage = isCritical ? baseDamage * 2 : baseDamage; // 100% more damage
  
  return {
    damage: finalDamage,
    isCritical,
    isBlocked: false,
    healed: 0,
    buffsApplied: [],
    debuffsApplied: [],
    specialEffects: isCritical ? ['💥 Critical Hit!'] : [],
    enchantmentTriggered: isCritical ? 'Precision' : undefined
  };
};

export const applyOverheat = (entity: CombatEntity, power: number, isAttacking: boolean): Buff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `overheat-${Date.now()}`,
      name: 'Overheat',
      type: 'damage',
      multiplier: 2.0, // 200% damage on next strike
      duration: 0, // Single use
      remainingDuration: 0
    };
  }
  
  return null;
};

export const applyPoisoning = (defender: CombatEntity, damageDealt: number, power: number, isMagic: boolean): Debuff | null => {
  // Chance proportional to damage dealt
  const triggerChance = Math.min(50, (damageDealt / 100) * calculateTriggerChance(power));
  
  if (rollChance(triggerChance)) {
    const percentPerTick = isMagic ? 10.2 : 3; // 10.2% for magic, 3% for others
    
    return {
      id: `poison-${Date.now()}`,
      name: 'Poisoning',
      type: 'dot',
      effect: percentPerTick,
      duration: 5,
      remainingDuration: 5,
      tickRate: 1 // Every second
    };
  }
  
  return null;
};

export const applyWeakness = (defender: CombatEntity, power: number): Debuff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `weakness-${Date.now()}`,
      name: 'Weakness',
      type: 'weaken',
      effect: 0.75, // 75% damage reduction
      duration: 0, // Single hit
      remainingDuration: 0
    };
  }
  
  return null;
};

export const applyMagicRecharge = (entity: CombatEntity, power: number, isTakingHit: boolean): Buff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    const rechargeBonus = isTakingHit ? 7.0 : 3.0; // 700% or 300%
    
    return {
      id: `magic-recharge-${Date.now()}`,
      name: 'Magic Recharge',
      type: 'magic-recharge',
      multiplier: rechargeBonus,
      duration: 0,
      remainingDuration: 0
    };
  }
  
  return null;
};

export const applyBloodrage = (attacker: CombatEntity, baseDamage: number, power: number): AttackResult => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    const boostedDamage = baseDamage * 2; // 200% more damage
    const healthLoss = boostedDamage * 0.3; // 30% of damage dealt
    
    // Don't trigger if it would cause loss
    if (attacker.currentHealth - healthLoss <= 0) {
      return {
        damage: baseDamage,
        isCritical: false,
        isBlocked: false,
        healed: 0,
        buffsApplied: [],
        debuffsApplied: [],
        specialEffects: [],
      };
    }
    
    return {
      damage: boostedDamage,
      isCritical: false,
      isBlocked: false,
      healed: -healthLoss, // Negative healing = self damage
      buffsApplied: [],
      debuffsApplied: [],
      specialEffects: ['🩸 Bloodrage! +200% damage, -30% HP'],
      enchantmentTriggered: 'Bloodrage'
    };
  }
  
  return {
    damage: baseDamage,
    isCritical: false,
    isBlocked: false,
    healed: 0,
    buffsApplied: [],
    debuffsApplied: [],
    specialEffects: []
  };
};

export const applyRejuvenation = (defender: CombatEntity, damageReceived: number, power: number): Buff | null => {
  const triggerChance = Math.min(50, (damageReceived / 100) * calculateTriggerChance(power));
  
  if (rollChance(triggerChance)) {
    return {
      id: `rejuvenation-${Date.now()}`,
      name: 'Rejuvenation',
      type: 'heal',
      multiplier: 0.03, // 3% per second
      duration: 5,
      remainingDuration: 5
    };
  }
  
  return null;
};

export const applyDamageAbsorption = (defender: CombatEntity, power: number): boolean => {
  const triggerChance = calculateTriggerChance(power);
  return rollChance(triggerChance);
};

// MEDIUM ENCHANTMENTS LOGIC

export const applyLifesteal = (attacker: CombatEntity, damageDealt: number, power: number, isMagic: boolean): number => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    const healMultiplier = isMagic ? 1.0 : 2.5; // 100% for magic, 250% for others
    const healAmount = damageDealt * healMultiplier;
    return Math.min(healAmount, attacker.maxHealth - attacker.currentHealth);
  }
  
  return 0;
};

export const applyBleeding = (defender: CombatEntity, damageDealt: number, power: number, isMagic: boolean): Debuff | null => {
  const triggerChance = Math.min(50, (damageDealt / 100) * calculateTriggerChance(power));
  
  if (rollChance(triggerChance)) {
    const percentPerTick = isMagic ? 3.4 : 6; // 3.4% for magic, 6% for others
    
    return {
      id: `bleeding-${Date.now()}`,
      name: 'Bleeding',
      type: 'dot',
      effect: percentPerTick,
      duration: 5,
      remainingDuration: 5,
      tickRate: 1
    };
  }
  
  return null;
};

export const applyEnfeeble = (defender: CombatEntity, power: number): Debuff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `enfeeble-${Date.now()}`,
      name: 'Enfeeble',
      type: 'weaken',
      effect: 0.75, // 75% damage reduction
      duration: 10,
      remainingDuration: 10
    };
  }
  
  return null;
};

export const applyFrenzy = (entity: CombatEntity, power: number): Buff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `frenzy-${Date.now()}`,
      name: 'Frenzy',
      type: 'damage',
      multiplier: 1.5, // 150% melee damage
      duration: 5,
      remainingDuration: 5
    };
  }
  
  return null;
};

export const applyStun = (defender: CombatEntity, damageDealt: number, power: number): Debuff | null => {
  const triggerChance = Math.min(50, (damageDealt / 100) * calculateTriggerChance(power));
  
  if (rollChance(triggerChance)) {
    return {
      id: `stun-${Date.now()}`,
      name: 'Stun',
      type: 'stun',
      effect: 1,
      duration: 3,
      remainingDuration: 3
    };
  }
  
  return null;
};

export const applyTimeBomb = (defender: CombatEntity, power: number, baseDamage: number): Debuff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `timebomb-${Date.now()}`,
      name: 'Time Bomb',
      type: 'dot',
      effect: baseDamage * 1.5, // Explodes for 150% of original damage
      duration: 2,
      remainingDuration: 2,
      tickRate: 2 // Detonates after 2 seconds
    };
  }
  
  return null;
};

export const applyRegeneration = (defender: CombatEntity, damageReceived: number, power: number): Buff | null => {
  const triggerChance = Math.min(50, (damageReceived / 100) * calculateTriggerChance(power));
  
  if (rollChance(triggerChance)) {
    return {
      id: `regeneration-${Date.now()}`,
      name: 'Regeneration',
      type: 'heal',
      multiplier: 0.045, // 4.5% per second
      duration: 5,
      remainingDuration: 5
    };
  }
  
  return null;
};

export const applyShielding = (defender: CombatEntity, power: number): Buff | null => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return {
      id: `shielding-${Date.now()}`,
      name: 'Shielding',
      type: 'defense',
      multiplier: 0.25, // Reduce damage to 25% (75% reduction)
      duration: 7,
      remainingDuration: 7
    };
  }
  
  return null;
};

export const applyDamageReturn = (attacker: CombatEntity, damageReceived: number, power: number): number => {
  const triggerChance = calculateTriggerChance(power);
  
  if (rollChance(triggerChance)) {
    return damageReceived * 0.85; // Return 85% of damage
  }
  
  return 0;
};

// MYTHICAL ENCHANTMENTS LOGIC

export const applyTempestRage = (attacker: CombatEntity, isHit: boolean): { stacks: number; damage: number } => {
  const currentStacks = attacker.enchantmentStacks.get('tempest-rage') || 0;
  let newStacks = currentStacks;
  
  if (isHit) {
    // Landing hits increases stacks
    if (rollChance(60)) { // 60% chance per hit
      newStacks = Math.min(4, currentStacks + 1);
    }
  } else {
    // Taking hits decreases stacks
    if (rollChance(70)) { // 70% chance to lose stack
      newStacks = Math.max(0, currentStacks - 1);
    }
  }
  
  attacker.enchantmentStacks.set('tempest-rage', newStacks);
  
  // If at max stacks (4), next hit deals massive damage
  if (newStacks === 4 && isHit) {
    attacker.enchantmentStacks.set('tempest-rage', 0); // Reset after use
    return { stacks: 0, damage: 3.5 }; // 350% damage multiplier
  }
  
  return { stacks: newStacks, damage: 1 };
};

export const applyTyphoonOfSpirits = (defender: CombatEntity, isAttacking: boolean): { stacks: number; reflects: boolean } => {
  const currentStacks = defender.enchantmentStacks.get('typhoon-spirits') || 0;
  let newStacks = currentStacks;
  
  if (isAttacking) {
    // Successful attacks build stacks
    if (rollChance(60)) {
      newStacks = Math.min(3, currentStacks + 1);
    }
  } else {
    // Taking hits while not fully charged reduces stacks
    if (currentStacks < 3 && rollChance(70)) {
      newStacks = Math.max(0, currentStacks - 1);
    }
  }
  
  defender.enchantmentStacks.set('typhoon-spirits', newStacks);
  
  // If fully charged (3), reflects damage
  if (newStacks === 3 && !isAttacking) {
    defender.enchantmentStacks.set('typhoon-spirits', 0); // Reset after use
    return { stacks: 0, reflects: true }; // Reflects 300% damage
  }
  
  return { stacks: newStacks, reflects: false };
};

export const applyCrimsonCorruption = (defender: CombatEntity, damageReceived: number): number => {
  const currentStacks = defender.enchantmentStacks.get('crimson-corruption') || 0;
  
  // Every 25 damage adds a stack (max 3)
  const stacksToAdd = Math.floor(damageReceived / 25);
  const newStacks = Math.min(3, currentStacks + stacksToAdd);
  
  defender.enchantmentStacks.set('crimson-corruption', newStacks);
  
  // Calculate DOT based on stacks
  let dotPercent = 0;
  if (newStacks === 1) dotPercent = 3;
  else if (newStacks === 2) dotPercent = 4.5;
  else if (newStacks === 3) dotPercent = 6;
  
  return dotPercent;
};

export const applyIcyResistance = (defender: CombatEntity): { nullified: boolean; stacks: number; buffUses: number } => {
  const currentStacks = defender.enchantmentStacks.get('icy-resistance-stacks') || 3; // Start with 3
  const currentBuffUses = defender.enchantmentStacks.get('icy-resistance-buff') || 0;
  
  if (currentStacks > 0) {
    // Nullify damage and give buff
    const newStacks = currentStacks - 1;
    defender.enchantmentStacks.set('icy-resistance-stacks', newStacks);
    defender.enchantmentStacks.set('icy-resistance-buff', 3); // 3 buffed attacks
    
    return { nullified: true, stacks: newStacks, buffUses: 3 };
  }
  
  return { nullified: false, stacks: 0, buffUses: currentBuffUses };
};

export const applyKarma = (attacker: CombatEntity, comboHits: number): { buffType: 'damage' | 'heal' | null; level: number } => {
  if (comboHits < 3) return { buffType: null, level: 0 };
  
  const healthPercent = (attacker.currentHealth / attacker.maxHealth) * 100;
  let level = 1;
  
  if (comboHits >= 9) level = 3;
  else if (comboHits >= 6) level = 2;
  
  if (healthPercent > 50) {
    // Damage buff (but lose health)
    return { buffType: 'damage', level };
  } else {
    // Heal buff
    return { buffType: 'heal', level };
  }
};

export const applySquall = (attacker: CombatEntity, hitLeg: boolean, midAir: boolean): { knockup: boolean; boostedDamage: number } => {
  const currentStacks = attacker.enchantmentStacks.get('squall-stacks') || 3;
  
  if (currentStacks > 0 && hitLeg) {
    attacker.enchantmentStacks.set('squall-stacks', currentStacks - 1);
    return { knockup: true, boostedDamage: midAir ? 2.5 : 1 }; // 250% if hit while airborne
  }
  
  return { knockup: false, boostedDamage: 1 };
};

export const applyPlotTwist = (defender: CombatEntity, hitByMagic: boolean): boolean => {
  // Steals enemy magic
  return hitByMagic;
};

export const applyTimeShift = (defender: CombatEntity, hitByMagic: boolean): boolean => {
  if (hitByMagic) {
    // Slows enemy for 5 seconds, all attacks are critical with +10% max HP damage
    return true;
  }
  return false;
};

export const applyArcaneMartialArt = (attacker: CombatEntity, comboHits: number): { stacks: number; canUseSpecial: boolean } => {
  const currentStacks = attacker.enchantmentStacks.get('arcane-martial-art') || 0;
  
  if (comboHits >= 3) {
    const chanceToCharge = Math.min(30 + (comboHits * 5), 80); // Higher combo = higher chance
    
    if (rollChance(chanceToCharge)) {
      const newStacks = Math.min(4, currentStacks + 1);
      attacker.enchantmentStacks.set('arcane-martial-art', newStacks);
      
      if (newStacks === 4) {
        return { stacks: newStacks, canUseSpecial: true };
      }
      
      return { stacks: newStacks, canUseSpecial: false };
    }
  }
  
  return { stacks: currentStacks, canUseSpecial: false };
};

export const applyCordyceps = (defender: CombatEntity, damageReceived: number, isBlocked: boolean, isCritical: boolean): number => {
  const currentPoints = defender.enchantmentStacks.get('cordyceps-points') || 0;
  
  // Add points based on base damage
  let pointsToAdd = damageReceived;
  if (isBlocked) pointsToAdd *= 0.1;
  if (isCritical) pointsToAdd *= 1.5; // Next attack after crit adds 50% more
  
  const newPoints = currentPoints + pointsToAdd;
  defender.enchantmentStacks.set('cordyceps-points', newPoints);
  
  if (newPoints >= 100) {
    // Spawn spore - deals 30% max HP damage and heals user
    defender.enchantmentStacks.set('cordyceps-points', 0);
    return 30; // Return percentage
  }
  
  // Decay 1 point per second (handled elsewhere)
  return 0;
};

export const applyRoaringLuminary = (attacker: CombatEntity, hitSuccessful: boolean, blocked: boolean): { charges: number; zoneActive: boolean } => {
  const currentCharges = attacker.enchantmentStacks.get('roaring-luminary-charges') || 0;
  
  if (blocked || !hitSuccessful) {
    // Reset charges
    attacker.enchantmentStacks.set('roaring-luminary-charges', 0);
    return { charges: 0, zoneActive: false };
  }
  
  const newCharges = currentCharges + 1;
  attacker.enchantmentStacks.set('roaring-luminary-charges', newCharges);
  
  if (newCharges >= 4) {
    // Activate lava zone
    attacker.enchantmentStacks.set('roaring-luminary-charges', 0);
    attacker.enchantmentStacks.set('roaring-luminary-zone', 8); // 8 seconds duration
    return { charges: 0, zoneActive: true };
  }
  
  return { charges: newCharges, zoneActive: false };
};

export const applyPredatorFury = (attacker: CombatEntity, hitLanded: boolean): { stacks: number; orbReady: boolean } => {
  const currentStacks = attacker.enchantmentStacks.get('predator-fury-stacks') || 4;
  
  if (hitLanded && currentStacks > 0) {
    const newStacks = currentStacks - 1;
    attacker.enchantmentStacks.set('predator-fury-stacks', newStacks);
    
    if (newStacks === 0) {
      return { stacks: 0, orbReady: true };
    }
    
    return { stacks: newStacks, orbReady: false };
  }
  
  return { stacks: currentStacks, orbReady: false };
};

// Calculate total damage with all enchantments and buffs
export const calculateFinalDamage = (
  attacker: CombatEntity,
  defender: CombatEntity,
  baseDamage: number,
  attackType: 'melee' | 'ranged' | 'magic',
  activeEnchantments: Map<string, any>
): AttackResult => {
  let finalDamage = baseDamage;
  let isCritical = false;
  let isBlocked = false;
  const healed = 0;
  const buffsApplied: Buff[] = [];
  const debuffsApplied: Debuff[] = [];
  const specialEffects: string[] = [];
  let enchantmentTriggered: string | undefined;
  
  // Apply attacker buffs
  attacker.activeBuffs.forEach(buff => {
    if (buff.type === 'damage') {
      finalDamage *= buff.multiplier;
      specialEffects.push(`⚡ ${buff.name} boost!`);
    }
  });
  
  // Apply defender debuffs (weakness/enfeeble)
  defender.activeDebuffs.forEach(debuff => {
    if (debuff.type === 'weaken') {
      finalDamage *= (1 - debuff.effect);
      specialEffects.push(`💔 ${debuff.name} reduces damage!`);
    }
  });
  
  // Apply defender buffs (shielding)
  defender.activeBuffs.forEach(buff => {
    if (buff.type === 'defense') {
      finalDamage *= buff.multiplier;
      specialEffects.push(`🛡️ ${buff.name} active!`);
    }
  });
  
  return {
    damage: Math.max(0, finalDamage),
    isCritical,
    isBlocked,
    healed,
    buffsApplied,
    debuffsApplied,
    specialEffects,
    enchantmentTriggered
  };
};

// Apply DOT effects
export const applyDOTEffects = (entity: CombatEntity): number => {
  let totalDamage = 0;
  
  entity.activeDebuffs.forEach(debuff => {
    if (debuff.type === 'dot' && debuff.remainingDuration > 0) {
      const damage = (entity.maxHealth * debuff.effect) / 100;
      totalDamage += damage;
      debuff.remainingDuration--;
    }
  });
  
  // Remove expired debuffs
  entity.activeDebuffs = entity.activeDebuffs.filter(d => d.remainingDuration > 0);
  
  return totalDamage;
};

// Apply healing buffs
export const applyHealingBuffs = (entity: CombatEntity): number => {
  let totalHealing = 0;
  
  entity.activeBuffs.forEach(buff => {
    if (buff.type === 'heal' && buff.remainingDuration > 0) {
      const healing = (entity.maxHealth * buff.multiplier);
      totalHealing += healing;
      buff.remainingDuration--;
    }
  });
  
  // Remove expired buffs
  entity.activeBuffs = entity.activeBuffs.filter(b => b.remainingDuration > 0);
  
  return Math.min(totalHealing, entity.maxHealth - entity.currentHealth);
};
