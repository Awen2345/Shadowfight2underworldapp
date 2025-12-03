import { apiClient } from './client';

export interface PlayerData {
  id: string;
  username: string;
  rating: number;
  best_rating: number;
  level: number;
  total_raids: number;
  total_victories: number;
  total_defeats: number;
  total_damage: number;
  total_rounds: number;
  first_place_finishes: number;
  clan_id?: string;
  season_banner?: string;
  last_presence: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  rating: number;
  best_rating: number;
  level: number;
  total_raids: number;
  total_victories: number;
  total_defeats: number;
  total_damage: number;
  total_rounds: number;
  first_place_finishes: number;
  win_rate: number;
  avg_damage_per_round: number;
  raids_today: number;
}

export const playerApi = {
  // Get player by username
  async getPlayer(username: string) {
    return apiClient.get<PlayerData>(`/players/${username}`);
  },

  // Create or update player
  async createOrUpdatePlayer(username: string, data: Partial<PlayerData>) {
    return apiClient.post<PlayerData>('/players', { username, ...data });
  },

  // Update player stats
  async updateStats(username: string, stats: Partial<PlayerData>) {
    return apiClient.patch<PlayerData>(`/players/${username}/stats`, stats);
  },

  // Get player statistics
  async getStats(username: string) {
    return apiClient.get<PlayerStats>(`/stats/${username}`);
  },

  // Delete player
  async deletePlayer(username: string) {
    return apiClient.delete(`/players/${username}`);
  },
};
