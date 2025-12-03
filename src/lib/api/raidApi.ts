import { apiClient } from './client';

export interface RaidData {
  id: string;
  player_id: string;
  boss_id: string;
  boss_tier: number;
  victory: number;
  damage_dealt: number;
  rounds: number;
  rating_gained: number;
  placement: number;
  raid_date: string;
  created_at: string;
}

export interface RecordRaidRequest {
  player_username: string;
  boss_id: string;
  boss_tier: number;
  victory: boolean;
  damage_dealt: number;
  rounds: number;
  rating_gained: number;
  placement: number;
}

export interface RaidHistoryResponse {
  raids: RaidData[];
}

export interface RaidsTodayResponse {
  raids_today: number;
  date: string;
}

export const raidApi = {
  // Record a raid result
  async recordRaid(data: RecordRaidRequest) {
    return apiClient.post<{ raid_id: string; player: any; message: string }>('/raids', data);
  },

  // Get player raid history
  async getPlayerRaidHistory(username: string, limit: number = 50) {
    return apiClient.get<RaidData[]>(`/raids/player/${username}?limit=${limit}`);
  },

  // Get raids today for player
  async getRaidsToday(username: string) {
    return apiClient.get<RaidsTodayResponse>(`/raids/player/${username}/today`);
  },

  // Get raid statistics
  async getRaidStats(username: string) {
    return apiClient.get<any>(`/raids/stats/${username}`);
  },
};
