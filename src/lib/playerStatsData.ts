import { mockPlayers } from './mockData';
import type { Player } from './mockData';

// Rating thresholds for levels 1-10
export const RATING_LEVELS = [
  { level: 1, minRating: 0, maxRating: 1299, name: 'Novice', color: 'slate' },
  { level: 2, minRating: 1300, maxRating: 1499, name: 'Apprentice', color: 'blue' },
  { level: 3, minRating: 1500, maxRating: 1699, name: 'Warrior', color: 'cyan' },
  { level: 4, minRating: 1700, maxRating: 1899, name: 'Fighter', color: 'green' },
  { level: 5, minRating: 1900, maxRating: 2099, name: 'Champion', color: 'yellow' },
  { level: 6, minRating: 2100, maxRating: 2299, name: 'Hero', color: 'amber' },
  { level: 7, minRating: 2300, maxRating: 2499, name: 'Legend', color: 'orange' },
  { level: 8, minRating: 2500, maxRating: 2799, name: 'Master', color: 'red' },
  { level: 9, minRating: 2800, maxRating: 3099, name: 'Grandmaster', color: 'purple' },
  { level: 10, minRating: 3100, maxRating: Infinity, name: 'Immortal', color: 'pink' }
];

// Player Statistics Data
export interface PlayerStats {
  rating: number;
  bestRating: number;
  level: number;
  totalRaids: number;
  totalVictories: number;
  totalDefeats: number;
  totalDamage: number;
  totalRounds: number;
  firstPlaceFinishes: number;
  lastRaidResult?: RaidResult;
}

export interface RaidResult {
  victory: boolean;
  damageDealt: number;
  rounds: number;
  ratingGained: number;
  placement: number;
  bossName: string;
  timestamp: Date;
}

// Initial player stats
const initialStats: PlayerStats = {
  rating: 1250,
  bestRating: 1250,
  level: 1,
  totalRaids: 0,
  totalVictories: 0,
  totalDefeats: 0,
  totalDamage: 0,
  totalRounds: 0,
  firstPlaceFinishes: 0
};

// Load from localStorage or use initial
const loadPlayerStats = (): PlayerStats => {
  const stored = localStorage.getItem('playerStats');
  if (stored) {
    const stats = JSON.parse(stored);
    // Convert timestamp back to Date if it exists
    if (stats.lastRaidResult?.timestamp) {
      stats.lastRaidResult.timestamp = new Date(stats.lastRaidResult.timestamp);
    }
    return stats;
  }
  return { ...initialStats };
};

// Save to localStorage
const savePlayerStats = (stats: PlayerStats): void => {
  localStorage.setItem('playerStats', JSON.stringify(stats));
};

// Current player stats
let playerStats = loadPlayerStats();

export const getPlayerStats = (): PlayerStats => {
  return { ...playerStats };
};

export const updatePlayerStats = (raidResult: RaidResult): PlayerStats => {
  // Update stats based on raid result
  playerStats.totalRaids += 1;
  playerStats.totalDamage += raidResult.damageDealt;
  playerStats.totalRounds += raidResult.rounds;
  
  if (raidResult.victory) {
    playerStats.totalVictories += 1;
    playerStats.rating += raidResult.ratingGained;
    
    // Update best rating
    if (playerStats.rating > playerStats.bestRating) {
      playerStats.bestRating = playerStats.rating;
    }
    
    // Track first place
    if (raidResult.placement === 1) {
      playerStats.firstPlaceFinishes += 1;
    }
    
    // Update level based on rating
    playerStats.level = getPlayerLevel(playerStats.rating);
    
    // Update leaderboard
    updateLeaderboard(playerStats.rating, playerStats);
  } else {
    playerStats.totalDefeats += 1;
    // Lose some rating on defeat
    const ratingLoss = Math.floor(raidResult.ratingGained * 0.3);
    playerStats.rating = Math.max(0, playerStats.rating - ratingLoss);
    
    // Update level based on new rating
    playerStats.level = getPlayerLevel(playerStats.rating);
  }
  
  playerStats.lastRaidResult = raidResult;
  
  // Save to localStorage
  savePlayerStats(playerStats);
  
  return { ...playerStats };
};

// Update leaderboard when rating changes
const updateLeaderboard = (rating: number, stats: PlayerStats): void => {
  // Find "You" player
  const playerIndex = mockPlayers.findIndex(p => p.username === 'You');
  
  if (playerIndex !== -1) {
    // Update the player's stats in leaderboard
    mockPlayers[playerIndex].rating = rating;
    mockPlayers[playerIndex].bestRatingPerSeason = stats.bestRating;
    mockPlayers[playerIndex].totalRaids = stats.totalRaids;
    mockPlayers[playerIndex].victoriousRaids = stats.totalVictories;
    mockPlayers[playerIndex].firstPlaces = stats.firstPlaceFinishes;
    mockPlayers[playerIndex].avgDamagePerRound = Math.floor(
      stats.totalRounds > 0 ? (stats.totalDamage / stats.totalRounds) * 10 : 0
    );
    
    // Re-sort the leaderboard by rating
    mockPlayers.sort((a, b) => b.rating - a.rating);
    
    // Update banners based on new positions
    mockPlayers.forEach((player, index) => {
      if (index < 10) {
        player.seasonBanner = 'gold';
      } else if (index < 100) {
        player.seasonBanner = 'silver';
      } else {
        player.seasonBanner = undefined;
      }
    });
  }
};

export const getWinRate = (): number => {
  if (playerStats.totalRaids === 0) return 0;
  return (playerStats.totalVictories / playerStats.totalRaids) * 100;
};

export const getAvgDamagePer10Rounds = (): number => {
  if (playerStats.totalRounds === 0) return 0;
  return (playerStats.totalDamage / playerStats.totalRounds) * 10;
};

export const resetPlayerStats = (): void => {
  playerStats = { ...initialStats };
  savePlayerStats(playerStats);
};

// Calculate rating gain based on performance
export const calculateRatingGain = (
  damageDealt: number,
  bossShield: number,
  placement: number,
  isVictory: boolean
): number => {
  if (!isVictory) return 0;
  
  // Base rating from placement
  const placementBonus = {
    1: 100,
    2: 70,
    3: 50,
    4: 40,
    5: 30
  }[placement] || 20;
  
  // Bonus from damage percentage
  const damagePercent = (damageDealt / bossShield) * 100;
  const damageBonus = Math.floor(damagePercent * 0.5);
  
  return placementBonus + damageBonus;
};

// Get player level based on rating
export const getPlayerLevel = (rating: number): number => {
  for (const level of RATING_LEVELS) {
    if (rating >= level.minRating && rating <= level.maxRating) {
      return level.level;
    }
  }
  return 1;
};

// Get level info for current rating
export const getLevelInfo = (rating: number) => {
  const currentLevel = RATING_LEVELS.find(
    level => rating >= level.minRating && rating <= level.maxRating
  ) || RATING_LEVELS[0];
  
  const nextLevel = RATING_LEVELS[currentLevel.level]; // Next level index
  
  // Calculate progress to next level
  const progress = nextLevel 
    ? ((rating - currentLevel.minRating) / (nextLevel.minRating - currentLevel.minRating)) * 100
    : 100;
  
  return {
    currentLevel,
    nextLevel,
    progress: Math.min(100, Math.max(0, progress)),
    ratingToNext: nextLevel ? nextLevel.minRating - rating : 0
  };
};

// Get level color classes
export const getLevelColorClass = (level: number): string => {
  const levelInfo = RATING_LEVELS.find(l => l.level === level);
  if (!levelInfo) return 'text-slate-400 border-slate-500';
  
  const colorMap: Record<string, string> = {
    slate: 'text-slate-400 border-slate-500 bg-slate-500/20',
    blue: 'text-blue-400 border-blue-500 bg-blue-500/20',
    cyan: 'text-cyan-400 border-cyan-500 bg-cyan-500/20',
    green: 'text-green-400 border-green-500 bg-green-500/20',
    yellow: 'text-yellow-400 border-yellow-500 bg-yellow-500/20',
    amber: 'text-amber-400 border-amber-500 bg-amber-500/20',
    orange: 'text-orange-400 border-orange-500 bg-orange-500/20',
    red: 'text-red-400 border-red-500 bg-red-500/20',
    purple: 'text-purple-400 border-purple-500 bg-purple-500/20',
    pink: 'text-pink-400 border-pink-500 bg-pink-500/20'
  };
  
  return colorMap[levelInfo.color] || 'text-slate-400 border-slate-500';
};