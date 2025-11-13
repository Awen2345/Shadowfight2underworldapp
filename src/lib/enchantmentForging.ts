import { Enchantment } from './enchantmentData';

export interface ForgeSlot {
  slotId: string;
  enchantment: Enchantment | null;
  targetEquipmentId: string | null;
  startTime: number | null;
  endTime: number | null;
  isForging: boolean;
}

export interface EquipmentEnchantment {
  equipmentId: string;
  enchantmentId: string;
  enchantmentType: 'simple' | 'medium' | 'mythical';
  power?: number; // For simple/medium enchantments
}

// Active forge slots (max 3 slots)
export const forgeSlots: ForgeSlot[] = [
  { slotId: 'slot-1', enchantment: null, targetEquipmentId: null, startTime: null, endTime: null, isForging: false },
  { slotId: 'slot-2', enchantment: null, targetEquipmentId: null, startTime: null, endTime: null, isForging: false },
  { slotId: 'slot-3', enchantment: null, targetEquipmentId: null, startTime: null, endTime: null, isForging: false }
];

// Equipment enchantments storage
export const equipmentEnchantments: EquipmentEnchantment[] = [];

// Start forging an enchantment
export const startForging = (
  slotId: string,
  enchantment: Enchantment,
  targetEquipmentId: string
): boolean => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot || slot.isForging) return false;

  const now = Date.now();
  slot.enchantment = enchantment;
  slot.targetEquipmentId = targetEquipmentId;
  slot.startTime = now;
  slot.endTime = now + (enchantment.forgeTime * 1000);
  slot.isForging = true;

  return true;
};

// Complete forging
export const completeForging = (slotId: string): void => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot || !slot.enchantment || !slot.targetEquipmentId) return;

  // Remove old enchantment of same or lower type if exists
  const existingIndex = equipmentEnchantments.findIndex(e => e.equipmentId === slot.targetEquipmentId);
  if (existingIndex !== -1) {
    const existing = equipmentEnchantments[existingIndex];
    // Mythical can only be replaced by mythical
    if (existing.enchantmentType === 'mythical' && slot.enchantment.type !== 'mythical') {
      return; // Cannot replace mythical with simple/medium
    }
    equipmentEnchantments.splice(existingIndex, 1);
  }

  // Add new enchantment
  const newEnchantment: EquipmentEnchantment = {
    equipmentId: slot.targetEquipmentId,
    enchantmentId: slot.enchantment.id,
    enchantmentType: slot.enchantment.type,
    power: slot.enchantment.power
  };
  equipmentEnchantments.push(newEnchantment);

  // Reset slot
  slot.enchantment = null;
  slot.targetEquipmentId = null;
  slot.startTime = null;
  slot.endTime = null;
  slot.isForging = false;
};

// Speed up forging (skip with gems)
export const speedUpForging = (slotId: string): void => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot || !slot.isForging) return;

  completeForging(slotId);
};

// Cancel forging
export const cancelForging = (slotId: string): void => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot) return;

  slot.enchantment = null;
  slot.targetEquipmentId = null;
  slot.startTime = null;
  slot.endTime = null;
  slot.isForging = false;
};

// Get remaining time for forging
export const getRemainingForgeTime = (slotId: string): number => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot || !slot.isForging || !slot.endTime) return 0;

  const remaining = Math.max(0, slot.endTime - Date.now());
  return Math.ceil(remaining / 1000);
};

// Get forge progress percentage
export const getForgeProgress = (slotId: string): number => {
  const slot = forgeSlots.find(s => s.slotId === slotId);
  if (!slot || !slot.isForging || !slot.startTime || !slot.endTime) return 0;

  const total = slot.endTime - slot.startTime;
  const elapsed = Date.now() - slot.startTime;
  return Math.min(100, (elapsed / total) * 100);
};

// Get enchantment for equipment
export const getEquipmentEnchantment = (equipmentId: string): EquipmentEnchantment | null => {
  return equipmentEnchantments.find(e => e.equipmentId === equipmentId) || null;
};

// Check if any slot is available
export const hasAvailableForgeSlot = (): boolean => {
  return forgeSlots.some(s => !s.isForging);
};

// Get available forge slot
export const getAvailableForgeSlot = (): ForgeSlot | null => {
  return forgeSlots.find(s => !s.isForging) || null;
};
