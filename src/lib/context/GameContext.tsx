import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { playerService } from '../services/playerService';
import type { PlayerStats, RaidResult } from '../playerStatsData';

interface GameContextType {
  // Player stats
  playerStats: PlayerStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshStats: () => Promise<void>;
  updateAfterRaid: (raidResult: RaidResult) => Promise<void>;
  
  // Backend status
  backendConnected: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Check backend connection
  const checkBackendConnection = async () => {
    try {
      const apiUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL as string
        : undefined;
        
      if (!apiUrl) {
        setBackendConnected(false);
        return;
      }

      const healthUrl = apiUrl.replace('/api', '/health');
      const response = await fetch(healthUrl);
      setBackendConnected(response.ok);
    } catch (error) {
      console.warn('Backend not connected, using localStorage fallback');
      setBackendConnected(false);
    }
  };

  // Load player stats
  const refreshStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stats = await playerService.getStats();
      setPlayerStats(stats);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load player stats');
    } finally {
      setIsLoading(false);
    }
  };

  // Update stats after raid
  const updateAfterRaid = async (raidResult: RaidResult) => {
    try {
      const updatedStats = await playerService.updateAfterRaid(raidResult);
      setPlayerStats(updatedStats);
    } catch (err) {
      console.error('Error updating stats:', err);
      setError('Failed to update stats after raid');
    }
  };

  // Initialize on mount
  useEffect(() => {
    checkBackendConnection();
    refreshStats();

    // Subscribe to player stats changes
    const unsubscribe = playerService.subscribe((stats) => {
      setPlayerStats(stats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value: GameContextType = {
    playerStats,
    isLoading,
    error,
    refreshStats,
    updateAfterRaid,
    backendConnected,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};