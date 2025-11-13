import { mockPlayers } from './mockData';
import type { Player } from './mockData';

// Function to update player in leaderboard based on rating
export const updatePlayerInLeaderboard = (rating: number): void => {
  // Find "You" player
  const playerIndex = mockPlayers.findIndex(p => p.username === 'You');
  
  if (playerIndex !== -1) {
    // Update the player's rating
    mockPlayers[playerIndex].rating = rating;
    mockPlayers[playerIndex].bestRatingPerSeason = Math.max(
      mockPlayers[playerIndex].bestRatingPerSeason,
      rating
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

export const getPlayerRank = (): number => {
  const playerIndex = mockPlayers.findIndex(p => p.username === 'You');
  return playerIndex !== -1 ? playerIndex + 1 : 999;
};

export const getPlayerFromLeaderboard = (): Player | undefined => {
  return mockPlayers.find(p => p.username === 'You');
};
