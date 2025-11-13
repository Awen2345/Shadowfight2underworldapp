// Player's inventory - stores quantities of items
export interface InventoryItem {
  itemId: string;
  quantity: number;
}

// Mock player inventory
export const playerInventory: InventoryItem[] = [
  { itemId: 'steel-keys', quantity: 15 },
  { itemId: 'verified-gems', quantity: 150 },
  { itemId: 'unverified-gems', quantity: 500000 },
  { itemId: 'coins', quantity: 100000 },
  { itemId: 'minor-charge', quantity: 50 },
  { itemId: 'medium-charge', quantity: 20 },
  { itemId: 'large-charge', quantity: 5 },
  { itemId: 'magic-source', quantity: 3 },
  { itemId: 'steel-hedgehog', quantity: 5 },
  { itemId: 'crag', quantity: 4 },
  { itemId: 'healing-vine', quantity: 6 },
  { itemId: 'phoenix', quantity: 1 },
  { itemId: 'explosive-vigor', quantity: 2 },
  { itemId: 'star-clarity', quantity: 3 },
  { itemId: 'monk-shards', quantity: 25 },
  { itemId: 'sentinel-shards', quantity: 12 },
  { itemId: 'mystical-coupons', quantity: 3 },
  // Shadow Orbs for enchanting
  { itemId: 'green-orbs', quantity: 50 },
  { itemId: 'red-orbs', quantity: 20 },
  { itemId: 'purple-orbs', quantity: 5 }
];

export const getInventoryItem = (itemId: string): number => {
  const item = playerInventory.find(i => i.itemId === itemId);
  return item ? item.quantity : 0;
};

export const hasEnoughItems = (itemId: string, required: number): boolean => {
  return getInventoryItem(itemId) >= required;
};

export const addInventoryItem = (itemId: string, quantity: number): void => {
  const item = playerInventory.find(i => i.itemId === itemId);
  if (item) {
    item.quantity += quantity;
  } else {
    playerInventory.push({ itemId, quantity });
  }
};

export const removeInventoryItem = (itemId: string, quantity: number): void => {
  const item = playerInventory.find(i => i.itemId === itemId);
  if (item) {
    item.quantity = Math.max(0, item.quantity - quantity);
  }
};