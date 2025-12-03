import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, Clock, Loader2 } from 'lucide-react';
import { PlayerStatsModal } from './PlayerStatsModal';
import type { Player } from '../lib/mockData';
import { useLeaderboard } from '../lib/hooks/useLeaderboard';

export function TopPlayersRanking() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { players, loading, error } = useLeaderboard(20);
  
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
        <p className="text-red-400 text-center">Failed to load top players. Using cached data.</p>
      </Card>
    );
  }

  // Convert API data to Player format
  const top20Players: Player[] = players.slice(0, 20).map((apiPlayer, index) => ({
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

  const getRewardIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-6 text-amber-400" />;
    if (rank === 2) return <Medal className="size-6 text-slate-300" />;
    if (rank === 3) return <Award className="size-6 text-amber-700" />;
    return null;
  };

  const getRewardBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-amber-500 text-white">Golden Chest</Badge>;
    if (rank === 2) return <Badge className="bg-slate-400 text-white">Silver Chest</Badge>;
    if (rank === 3) return <Badge className="bg-amber-700 text-white">Normal Chest</Badge>;
    return null;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-amber-500 mb-2">Top 20 Players Ranking</h2>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="size-4" />
            <p>Season ends in 3 days</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          {/* 2nd Place */}
          <div className="mt-12">
            <Card className="bg-gradient-to-b from-slate-700 to-slate-800 border-slate-400 p-4 text-center cursor-pointer hover:border-slate-300 transition-all"
              onClick={() => setSelectedPlayer(top20Players[1])}>
              <Medal className="size-10 mx-auto mb-2 text-slate-300" />
              <div className="text-slate-300 mb-2">#2</div>
              <div className="text-slate-200 text-sm mb-1">{top20Players[1]?.username}</div>
              <div className="text-slate-400 text-xs mb-2">{top20Players[1]?.rating.toLocaleString()}</div>
              <Badge className="bg-slate-400 text-white text-xs">Silver Chest</Badge>
            </Card>
          </div>

          {/* 1st Place */}
          <div>
            <Card className="bg-gradient-to-b from-amber-600 to-amber-700 border-amber-400 p-4 text-center cursor-pointer hover:border-amber-300 transition-all shadow-lg shadow-amber-500/50"
              onClick={() => setSelectedPlayer(top20Players[0])}>
              <Trophy className="size-14 mx-auto mb-2 text-amber-200" />
              <div className="text-amber-100 mb-2">#1</div>
              <div className="text-white mb-1">{top20Players[0]?.username}</div>
              <div className="text-amber-100 text-sm mb-2">{top20Players[0]?.rating.toLocaleString()}</div>
              <Badge className="bg-amber-500 text-white">Golden Chest</Badge>
            </Card>
          </div>

          {/* 3rd Place */}
          <div className="mt-12">
            <Card className="bg-gradient-to-b from-amber-800 to-amber-900 border-amber-700 p-4 text-center cursor-pointer hover:border-amber-600 transition-all"
              onClick={() => setSelectedPlayer(top20Players[2])}>
              <Award className="size-10 mx-auto mb-2 text-amber-700" />
              <div className="text-amber-600 mb-2">#3</div>
              <div className="text-slate-200 text-sm mb-1">{top20Players[2]?.username}</div>
              <div className="text-slate-400 text-xs mb-2">{top20Players[2]?.rating.toLocaleString()}</div>
              <Badge className="bg-amber-700 text-white text-xs">Normal Chest</Badge>
            </Card>
          </div>
        </div>

        {/* Season Rewards Info */}
        <Card className="bg-slate-800/50 border-amber-500/30 p-4">
          <h3 className="text-amber-500 mb-3 text-center">Season Rewards (3 Days)</h3>
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

        {/* Rankings 4-20 */}
        <div className="space-y-2">
          <h3 className="text-amber-500 text-center mb-4">Rankings 4-20</h3>
          {top20Players.slice(3).map((player, index) => {
            const rank = index + 4;
            return (
              <Card
                key={player.id}
                className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer p-4"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    <span className="text-slate-400">#{rank}</span>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-200">{player.username}</span>
                      {player.seasonBanner === 'gold' && (
                        <Badge className="bg-amber-500 text-white text-xs">★ TOP 10</Badge>
                      )}
                      {player.seasonBanner === 'silver' && (
                        <Badge className="bg-slate-400 text-white text-xs">TOP 20</Badge>
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
                </div>
              </Card>
            );
          })}
        </div>
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