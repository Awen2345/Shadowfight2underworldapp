/**
 * API Adapter - Provides backward compatibility layer
 * Allows existing code to work with both localStorage and backend API
 */

import { playerService } from './services/playerService';
import { 
  getPlayerStats as getLocalStats, 
  updatePlayerStats as updateLocalStats,
  getWinRate as getLocalWinRate,
  getAvgDamagePer10Rounds as getLocalAvgDamage,
  type PlayerStats,
  type RaidResult
} from './playerStatsData';

// Safe access to environment variables
const getApiUrl = (): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL as string;
  }
  return undefined;
};

// Feature flag to switch between localStorage and API
const USE_BACKEND_API = getApiUrl() ? true : false;

/**
 * Get player stats - works with both localStorage and API
 */
export const getPlayerStats = async (): Promise<PlayerStats> => {
  if (USE_BACKEND_API) {
    const stats = await playerService.getStats();
    if (stats) return stats;
  }
  
  // Fallback to localStorage
  return getLocalStats();
};

/**
 * Update player stats after raid - works with both localStorage and API
 */
export const updatePlayerStats = async (raidResult: RaidResult): Promise<PlayerStats> => {
  if (USE_BACKEND_API) {
    try {
      const stats = await playerService.updateAfterRaid(raidResult);
      if (stats) return stats;
    } catch (error) {
      console.error('API update failed, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  return updateLocalStats(raidResult);
};

/**
 * Get win rate - works with both localStorage and API
 */
export const getWinRate = async (): Promise<number> => {
  if (USE_BACKEND_API) {
    try {
      return await playerService.getWinRate();
    } catch (error) {
      console.error('API call failed, falling back to localStorage:', error);
    }
  }
  
  return getLocalWinRate();
};

/**
 * Get average damage - works with both localStorage and API
 */
export const getAvgDamagePer10Rounds = async (): Promise<number> => {
  if (USE_BACKEND_API) {
    try {
      return await playerService.getAvgDamage();
    } catch (error) {
      console.error('API call failed, falling back to localStorage:', error);
    }
  }
  
  return getLocalAvgDamage();
};

/**
 * Check if backend API is enabled
 */
export const isBackendEnabled = (): boolean => {
  return USE_BACKEND_API;
};

/**
 * Get backend status
 */
export const getBackendStatus = async (): Promise<{
  enabled: boolean;
  connected: boolean;
  url?: string;
}> => {
  if (!USE_BACKEND_API) {
    return { enabled: false, connected: false };
  }

  try {
    const response = await fetch(getApiUrl()!.replace('/api', '/health'));
    const connected = response.ok;
    
    return {
      enabled: true,
      connected,
      url: getApiUrl(),
    };
  } catch (error) {
    return {
      enabled: true,
      connected: false,
      url: getApiUrl(),
    };
  }
};