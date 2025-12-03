import { apiClient } from './client';

export interface InventoryItem {
  id: number;
  player_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export const inventoryApi = {
  // Get player inventory
  async getInventory(username: string) {
    return apiClient.get<InventoryItem[]>(`/inventory/${username}`);
  },

  // Get specific item quantity
  async getItem(username: string, itemId: string) {
    return apiClient.get<{ item_id: string; quantity: number }>(`/inventory/${username}/item/${itemId}`);
  },

  // Add or update item in inventory
  async addItem(username: string, itemId: string, quantity: number) {
    return apiClient.post<InventoryItem>(`/inventory/${username}/item`, { item_id: itemId, quantity });
  },

  // Remove items from inventory
  async removeItem(username: string, itemId: string, quantity: number) {
    return apiClient.delete<{ item_id: string; quantity: number; removed: number }>(
      `/inventory/${username}/item/${itemId}`,
      { quantity }
    );
  },
};
