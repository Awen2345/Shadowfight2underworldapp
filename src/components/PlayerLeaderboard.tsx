import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { PlayerStatsModal } from './PlayerStatsModal';
import type { Player } from '../lib/mockData';
import { useLeaderboard } from '../lib/hooks/useLeaderboard';

export function PlayerLeaderboard() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { players, loading, error } = useLeaderboard(100);

  const getRewardIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-5 text-amber-400" />;
    if (rank === 2) return <Medal className="size-5 text-slate-300" />;
    if (rank === 3) return <Award className="size-5 text-amber-700" />;
    return null;
  };

  const getRewardBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-amber-500 text-white">Golden Chest</Badge>;
    if (rank === 2) return <Badge className="bg-slate-400 text-white">Silver Chest</Badge>;
    if (rank === 3) return <Badge className="bg-amber-700 text-white">Normal Chest</Badge>;
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500/30 p-6">
        <p className="text-red-400 text-center">Failed to load leaderboard. Using cached data.</p>
      </Card>
    );
  }

  // Convert API data to Player format
  const convertedPlayers: Player[] = players.map((apiPlayer, index) => ({
    id: apiPlayer.id,
    username: apiPlayer.username,
    rating: apiPlayer.rating,
    clan: apiPlayer.clan_name || undefined,
    clanTag: apiPlayer.clan_tag || undefined,
    bestRatingPerSeason: apiPlayer.best_rating || apiPlayer.rating,
    avgDamagePerRound: Math.floor(parseFloat(apiPlayer.avg_damage_per_round || '0')),
    totalRaids: apiPlayer.total_raids || 0,
    victoriousRaids: apiPlayer.total_victories || 0,
    firstPlaces: apiPlayer.first_place_finishes || 0,
    lastPresence: apiPlayer.last_presence || 'Unknown',
    equipment: {
      weapon: 'Unknown',
      armor: 'Unknown',
      helm: 'Unknown'
    },
    medals: [],
    seasonBanner: index < 10 ? 'gold' : index < 100 ? 'silver' : undefined
  }));

  return (
    <>
      <div className="space-y-2">
        {/* Top 3 Rewards Info */}
        <Card className="bg-slate-800/50 border-amber-500/30 p-4 mb-4">
          <h3 className="text-amber-500 mb-3">Season Rewards (3 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <Trophy className="size-6 text-amber-400" />
              <div>
                <div className="text-slate-300">1st Place</div>
                <div className="text-amber-400">Golden Chest</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-500/10 rounded-lg border border-slate-500/30">
              <Medal className="size-6 text-slate-300" />
              <div>
                <div className="text-slate-300">2nd Place</div>
                <div className="text-slate-300">Silver Chest</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-700/10 rounded-lg border border-amber-700/30">
              <Award className="size-6 text-amber-700" />
              <div>
                <div className="text-slate-300">3rd Place</div>
                <div className="text-amber-700">Normal Chest</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Player List */}
        {convertedPlayers.map((player, index) => {
          const rank = index + 1;
          return (
            <Card
              key={player.id}
              className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer p-4"
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                  {getRewardIcon(rank) || (
                    <span className="text-slate-400">#{rank}</span>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-200">{player.username}</span>
                    {player.seasonBanner === 'gold' && (
                      <Badge className="bg-amber-500 text-white text-xs">★ TOP 10</Badge>
                    )}
                    {player.seasonBanner === 'silver' && (
                      <Badge className="bg-slate-400 text-white text-xs">TOP 100</Badge>
                    )}
                  </div>
                  {player.clan && (
                    <div className="text-slate-400 text-sm">
                      {player.clanTag} {player.clan}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="text-right">
                  <div className="text-amber-500">{player.rating.toLocaleString()}</div>
                  <div className="text-slate-500 text-sm">Rating</div>
                </div>

                {/* Reward Badge */}
                <div className="w-32 flex justify-end">
                  {getRewardBadge(rank)}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedPlayer && (
        <PlayerStatsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}