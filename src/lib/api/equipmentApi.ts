import { apiClient } from './client';

export interface EquipmentData {
  id: string;
  player_id: string;
  equipment_id: string;
  equipment_type: string;
  level: number;
  is_upgrading: number;
  upgrade_end_time?: number;
  is_equipped: number;
  created_at: string;
  updated_at: string;
}

export const equipmentApi = {
  // Get player equipment
  async getEquipment(username: string) {
    return apiClient.get<EquipmentData[]>(`/equipment/${username}`);
  },

  // Get equipped items
  async getEquippedItems(username: string) {
    return apiClient.get<EquipmentData[]>(`/equipment/${username}/equipped`);
  },

  // Add equipment to player
  async addEquipment(username: string, equipmentId: string, equipmentType: string, level: number = 1) {
    return apiClient.post<EquipmentData>(`/equipment/${username}`, {
      equipment_id: equipmentId,
      equipment_type: equipmentType,
      level,
    });
  },

  // Equip/Unequip item
  async equipItem(username: string, equipmentId: string, isEquipped: boolean) {
    return apiClient.patch<EquipmentData>(`/equipment/${username}/${equipmentId}/equip`, {
      is_equipped: isEquipped,
    });
  },

  // Start upgrade
  async startUpgrade(username: string, equipmentId: string, durationSeconds: number) {
    return apiClient.patch<EquipmentData>(`/equipment/${username}/${equipmentId}/upgrade`, {
      duration_seconds: durationSeconds,
    });
  },

  // Complete upgrade
  async completeUpgrade(username: string, equipmentId: string) {
    return apiClient.patch<EquipmentData>(`/equipment/${username}/${equipmentId}/complete-upgrade`);
  },
};
