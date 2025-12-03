import { apiClient } from './client';

export interface LeaderboardPlayer {
  id: string;
  username: string;
  rating: number;
  best_rating: number;
  level: number;
  total_raids: number;
  total_victories: number;
  clan_name?: string;
  clan_tag?: string;
  season_banner?: string;
  rank: number;
  win_rate: string;
  avg_damage_per_round: number;
}

export interface LeaderboardClan {
  id: string;
  name: string;
  tag: string;
  total_rating: number;
  member_count: number;
  total_victories: number;
  win_rate: string;
  rank: number;
}

export const leaderboardApi = {
  // Get top 100 players
  async getPlayersLeaderboard(limit: number = 100) {
    return apiClient.get<LeaderboardPlayer[]>(`/leaderboard/players?limit=${limit}`);
  },

  // Get top 100 clans
  async getClansLeaderboard(limit: number = 100) {
    return apiClient.get<LeaderboardClan[]>(`/leaderboard/clans?limit=${limit}`);
  },

  // Get player rank
  async getPlayerRank(username: string) {
    return apiClient.get<{ rank: number; rating: number }>(`/leaderboard/players/${username}/rank`);
  },

  // Get top 20 for rewards display
  async getTop20() {
    return apiClient.get<any[]>('/leaderboard/top20');
  },
};
