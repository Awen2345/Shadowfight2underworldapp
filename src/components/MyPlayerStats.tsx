import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Sword, 
  Shield, 
  Trophy, 
  Target, 
  Calendar, 
  Clock,
  Award,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { MedalsModal } from './MedalsModal';
import type { Player } from '../lib/mockData';
import { PlayerLevelBadge } from './PlayerLevelBadge';
import { getPlayerStats } from '../lib/playerStatsData';

export function MyPlayerStats() {
  const [showMedals, setShowMedals] = useState(false);
  const [playerStats, setPlayerStats] = useState(getPlayerStats());

  // Refresh stats when component mounts or comes into view
  useEffect(() => {
    setPlayerStats(getPlayerStats());
  }, []);

  // Current player data (mockup)
  const myPlayer: Player = {
    id: 'player-me',
    username: 'Shadow_Fighter_1000',
    rating: playerStats.rating,
    clan: 'Shadow Warriors',
    clanTag: '[SHA]',
    bestRatingPerSeason: playerStats.bestRating,
    avgDamagePerRound: Math.floor(
      playerStats.totalRounds > 0 ? (playerStats.totalDamage / playerStats.totalRounds) * 10 : 0
    ),
    totalRaids: playerStats.totalRaids,
    victoriousRaids: playerStats.totalVictories,
    firstPlaces: playerStats.firstPlaceFinishes,
    lastPresence: 'Online',
    equipment: {
      weapon: 'Dragon Sword',
      armor: 'Samurai Armor',
      helm: 'Dragon Helm'
    },
    medals: [
      { season: 14, rank: 8, type: 'gold' },
      { season: 13, rank: 15, type: 'silver' },
      { season: 12, rank: 42, type: 'bronze' },
      { season: 11, rank: 7, type: 'gold' },
      { season: 10, rank: 23, type: 'silver' },
    ],
    seasonBanner: 'silver'
  };

  const winRate = playerStats.totalRaids > 0 
    ? ((playerStats.totalVictories / playerStats.totalRaids) * 100).toFixed(1)
    : '0.0';

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-amber-500 mb-2">My Stats</h2>
          <p className="text-slate-400">View your performance and achievements</p>
        </div>

        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-slate-800/80 to-slate-800/50 border-amber-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center border-4 border-amber-500/30">
                <Sword className="size-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-amber-500">{myPlayer.username}</h3>
                  {myPlayer.seasonBanner === 'silver' && (
                    <Badge className="bg-slate-400 text-white">TOP 100</Badge>
                  )}
                </div>
                <div className="mb-2">
                  <PlayerLevelBadge 
                    rating={playerStats.rating} 
                    level={playerStats.level} 
                    showProgress={true}
                    size="md"
                  />
                </div>
                {myPlayer.clan && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="size-4" />
                    <span>{myPlayer.clanTag} {myPlayer.clan}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-1">Current Rating</div>
              <div className="text-amber-500">{myPlayer.rating.toLocaleString()}</div>
              <div className="text-green-400 text-sm flex items-center justify-end gap-1 mt-1">
                <TrendingUp className="size-3" />
                <span>Level {playerStats.level}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Equipment & Character */}
          <div className="space-y-6">
            {/* Equipment */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-amber-500 mb-4 flex items-center gap-2">
                <Sword className="size-4" />
                Character Equipment
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2">
                    <Sword className="size-4 text-amber-400" />
                    <span className="text-slate-400">Weapon</span>
                  </div>
                  <span className="text-slate-200">{myPlayer.equipment.weapon}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-blue-400" />
                    <span className="text-slate-400">Armor</span>
                  </div>
                  <span className="text-slate-200">{myPlayer.equipment.armor}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-purple-400" />
                    <span className="text-slate-400">Helm</span>
                  </div>
                  <span className="text-slate-200">{myPlayer.equipment.helm}</span>
                </div>
              </div>
            </Card>

            {/* Character Preview */}
            <Card className="bg-gradient-to-b from-slate-800/50 to-slate-700/50 border-slate-700 p-6">
              <h3 className="text-amber-500 mb-4">Character</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-3 bg-slate-600/30 rounded-full flex items-center justify-center border-2 border-amber-500/30">
                    <Sword className="size-16 text-amber-500/50" />
                  </div>
                  <div className="text-slate-500">Character Preview</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Combat Stats */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-amber-500 mb-4 flex items-center gap-2">
                <Trophy className="size-4" />
                Combat Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <TrendingUp className="size-3" />
                    Best rating
                  </div>
                  <div className="text-amber-500">{myPlayer.bestRatingPerSeason.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Target className="size-3" />
                    Avg. damage
                  </div>
                  <div className="text-red-400">{myPlayer.avgDamagePerRound.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Calendar className="size-3" />
                    Total raids
                  </div>
                  <div className="text-slate-200">{myPlayer.totalRaids.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Trophy className="size-3" />
                    Victories
                  </div>
                  <div className="text-green-400">{myPlayer.victoriousRaids.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Target className="size-3" />
                    Win rate
                  </div>
                  <div className="text-blue-400">{winRate}%</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <Award className="size-3" />
                    First places
                  </div>
                  <div className="text-amber-400">{myPlayer.firstPlaces.toLocaleString()}</div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-amber-500 mb-4 flex items-center gap-2">
                <Star className="size-4" />
                Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded border border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <Trophy className="size-5 text-amber-400" />
                    <div>
                      <div className="text-slate-200">Top 100 Player</div>
                      <div className="text-slate-400 text-xs">Season 14</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-500 text-white">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="size-5 text-slate-400" />
                    <div>
                      <div className="text-slate-200">Raid Master</div>
                      <div className="text-slate-400 text-xs">100+ victories</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Earned</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex items-center gap-2">
                    <Star className="size-5 text-slate-400" />
                    <div>
                      <div className="text-slate-200">Elite Fighter</div>
                      <div className="text-slate-400 text-xs">5000+ rating</div>
                    </div>
                  </div>
                  <Badge className="bg-slate-600 text-slate-300">Locked</Badge>
                </div>
              </div>
            </Card>

            {/* Medals Button */}
            <Button 
              onClick={() => setShowMedals(true)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
            >
              <Trophy className="size-5 mr-2" />
              View Medals Collection ({myPlayer.medals.length})
            </Button>
          </div>
        </div>
      </div>

      {showMedals && (
        <MedalsModal
          player={myPlayer}
          onClose={() => setShowMedals(false)}
        />
      )}
    </>
  );
}