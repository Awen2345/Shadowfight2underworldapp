import { useState, useEffect } from 'react';
import { leaderboardApi } from '../api/leaderboardApi';
import type { LeaderboardPlayer, LeaderboardClan } from '../api/leaderboardApi';

interface UseLeaderboardReturn {
  players: LeaderboardPlayer[];
  clans: LeaderboardClan[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useLeaderboard = (limit: number = 100): UseLeaderboardReturn => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [clans, setClans] = useState<LeaderboardClan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [playersResponse, clansResponse] = await Promise.all([
        leaderboardApi.getPlayersLeaderboard(limit),
        leaderboardApi.getClansLeaderboard(limit),
      ]);

      if (playersResponse.data) {
        setPlayers(playersResponse.data);
      }

      if (clansResponse.data) {
        setClans(clansResponse.data);
      }

      if (playersResponse.error || clansResponse.error) {
        setError('Failed to load some leaderboard data');
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [limit]);

  return {
    players,
    clans,
    loading,
    error,
    refresh: loadLeaderboard,
  };
};
