import { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import type { PlayerStats } from '../playerStatsData';

interface UsePlayerStatsReturn {
  stats: PlayerStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  winRate: number;
  avgDamagePerRound: number;
  raidsToday: number;
}

export const usePlayerStats = (): UsePlayerStatsReturn => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winRate, setWinRate] = useState(0);
  const [avgDamagePerRound, setAvgDamagePerRound] = useState(0);
  const [raidsToday, setRaidsToday] = useState(0);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const playerStats = await playerService.getStatsWithCalculations();
      
      if (playerStats) {
        setStats(playerStats);
        setWinRate(playerStats.winRate || 0);
        setAvgDamagePerRound(playerStats.avgDamagePerRound || 0);
        setRaidsToday(playerStats.raidsToday || 0);
      }
    } catch (err) {
      console.error('Error loading player stats:', err);
      setError('Failed to load player stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Subscribe to stats changes
    const unsubscribe = playerService.subscribe((updatedStats) => {
      setStats(updatedStats);
      
      // Recalculate derived values
      if (updatedStats.totalRaids > 0) {
        setWinRate((updatedStats.totalVictories / updatedStats.totalRaids) * 100);
      }
      
      if (updatedStats.totalRounds > 0) {
        setAvgDamagePerRound(
          Math.floor((updatedStats.totalDamage / updatedStats.totalRounds) * 10)
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
    winRate,
    avgDamagePerRound,
    raidsToday,
  };
};
