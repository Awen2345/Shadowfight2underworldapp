import { playerApi } from '../api/playerApi';
import { raidApi } from '../api/raidApi';
import type { PlayerStats, RaidResult } from '../playerStatsData';
import { getPlayerLevel, calculateRatingGain } from '../playerStatsData';

const CURRENT_USERNAME = 'You';

// Player Service - handles all player-related operations
export class PlayerService {
  private static instance: PlayerService;
  private playerStats: PlayerStats | null = null;
  private listeners: Array<(stats: PlayerStats) => void> = [];

  private constructor() {
    this.initializePlayer();
  }

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  // Subscribe to player stats changes
  subscribe(listener: (stats: PlayerStats) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    if (this.playerStats) {
      this.listeners.forEach(listener => listener(this.playerStats!));
    }
  }

  // Initialize player - create if doesn't exist
  async initializePlayer() {
    try {
      const response = await playerApi.getPlayer(CURRENT_USERNAME);
      
      if (response.error) {
        // Player doesn't exist, create new one
        const createResponse = await playerApi.createOrUpdatePlayer(CURRENT_USERNAME, {
          rating: 1250,
          best_rating: 1250,
          level: 1,
          total_raids: 0,
          total_victories: 0,
          total_defeats: 0,
          total_damage: 0,
          total_rounds: 0,
          first_place_finishes: 0,
        });

        if (createResponse.data) {
          this.playerStats = this.convertToPlayerStats(createResponse.data);
        }
      } else if (response.data) {
        this.playerStats = this.convertToPlayerStats(response.data);
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize player:', error);
    }
  }

  // Get current player stats
  async getStats(): Promise<PlayerStats | null> {
    if (!this.playerStats) {
      await this.initializePlayer();
    }
    return this.playerStats;
  }

  // Get stats with additional calculated fields
  async getStatsWithCalculations() {
    const stats = await this.getStats();
    if (!stats) return null;

    const winRate = stats.totalRaids > 0 
      ? (stats.totalVictories / stats.totalRaids) * 100 
      : 0;

    const avgDamagePerRound = stats.totalRounds > 0
      ? Math.floor((stats.totalDamage / stats.totalRounds) * 10)
      : 0;

    // Get raids today from backend
    const raidsResponse = await raidApi.getRaidsToday(CURRENT_USERNAME);
    const raidsToday = raidsResponse.data?.raids_today || 0;

    return {
      ...stats,
      winRate,
      avgDamagePerRound,
      raidsToday,
    };
  }

  // Update stats after raid
  async updateAfterRaid(raidResult: RaidResult): Promise<PlayerStats | null> {
    try {
      // Record raid in backend
      const raidResponse = await raidApi.recordRaid({
        player_username: CURRENT_USERNAME,
        boss_id: raidResult.bossName,
        boss_tier: 1, // You'll need to pass this
        victory: raidResult.victory,
        damage_dealt: raidResult.damageDealt,
        rounds: raidResult.rounds,
        rating_gained: raidResult.ratingGained,
        placement: raidResult.placement,
      });

      if (raidResponse.data?.player) {
        // Update local stats with backend response
        this.playerStats = this.convertToPlayerStats(raidResponse.data.player);
        this.notifyListeners();
        return this.playerStats;
      }

      return null;
    } catch (error) {
      console.error('Failed to update after raid:', error);
      return null;
    }
  }

  // Convert API response to PlayerStats format
  private convertToPlayerStats(apiData: any): PlayerStats {
    return {
      rating: apiData.rating,
      bestRating: apiData.best_rating,
      level: apiData.level,
      totalRaids: apiData.total_raids,
      totalVictories: apiData.total_victories,
      totalDefeats: apiData.total_defeats,
      totalDamage: apiData.total_damage,
      totalRounds: apiData.total_rounds,
      firstPlaceFinishes: apiData.first_place_finishes,
    };
  }

  // Get win rate
  async getWinRate(): Promise<number> {
    const stats = await this.getStats();
    if (!stats || stats.totalRaids === 0) return 0;
    return (stats.totalVictories / stats.totalRaids) * 100;
  }

  // Get average damage
  async getAvgDamage(): Promise<number> {
    const stats = await this.getStats();
    if (!stats || stats.totalRounds === 0) return 0;
    return (stats.totalDamage / stats.totalRounds) * 10;
  }

  // Reset stats (for testing)
  async resetStats() {
    try {
      await playerApi.deletePlayer(CURRENT_USERNAME);
      await this.initializePlayer();
    } catch (error) {
      console.error('Failed to reset stats:', error);
    }
  }
}

// Export singleton instance
export const playerService = PlayerService.getInstance();
