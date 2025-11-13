import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
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
  Users,
  TrendingUp
} from 'lucide-react';
import type { Player } from '../lib/mockData';
import { MedalsModal } from './MedalsModal';

interface PlayerStatsModalProps {
  player: Player;
  onClose: () => void;
}

export function PlayerStatsModal({ player, onClose }: PlayerStatsModalProps) {
  const [showMedals, setShowMedals] = useState(false);
  const winRate = ((player.victoriousRaids / player.totalRaids) * 100).toFixed(1);

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl bg-slate-900 border-amber-500/30 text-slate-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-amber-500">{player.username}</span>
                {player.seasonBanner === 'gold' && (
                  <Badge className="bg-amber-500 text-white">★ TOP 10</Badge>
                )}
                {player.seasonBanner === 'silver' && (
                  <Badge className="bg-slate-400 text-white">TOP 100</Badge>
                )}
              </div>
              {player.clan && (
                <Badge className="bg-slate-700 text-slate-300">
                  <Users className="size-3 mr-1" />
                  {player.clanTag} {player.clan}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Detailed statistics and achievements of {player.username}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left Side - Character */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
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
                    <span className="text-slate-200">{player.equipment.weapon}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-blue-400" />
                      <span className="text-slate-400">Armor</span>
                    </div>
                    <span className="text-slate-200">{player.equipment.armor}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-purple-400" />
                      <span className="text-slate-400">Helm</span>
                    </div>
                    <span className="text-slate-200">{player.equipment.helm}</span>
                  </div>
                </div>
              </div>

              {/* Character Visual Placeholder */}
              <div className="bg-gradient-to-b from-slate-800/50 to-slate-700/50 border border-slate-700 rounded-lg p-6 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-3 bg-slate-600/30 rounded-full flex items-center justify-center border-2 border-amber-500/30">
                    <Sword className="size-16 text-amber-500/50" />
                  </div>
                  <div className="text-slate-500">Character Preview</div>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-amber-500 mb-4 flex items-center gap-2">
                  <Trophy className="size-4" />
                  Player's Info
                </h3>
                <div className="space-y-3">
                  {/* Best Rating */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <TrendingUp className="size-3" />
                      Best rating per season
                    </div>
                    <div className="text-amber-500">{player.bestRatingPerSeason.toLocaleString()}</div>
                  </div>

                  {/* Average Damage */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Target className="size-3" />
                      Average damage per round
                    </div>
                    <div className="text-red-400">{player.avgDamagePerRound.toLocaleString()}</div>
                  </div>

                  {/* Total Raids */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Calendar className="size-3" />
                      Total raids
                    </div>
                    <div className="text-slate-200">{player.totalRaids.toLocaleString()}</div>
                  </div>

                  {/* Victorious Raids */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Trophy className="size-3" />
                      Victorious raids
                    </div>
                    <div className="text-green-400">{player.victoriousRaids.toLocaleString()}</div>
                  </div>

                  {/* Win Rate */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Target className="size-3" />
                      Win rate
                    </div>
                    <div className="text-blue-400">{winRate}%</div>
                  </div>

                  {/* First Places */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Award className="size-3" />
                      First places in raids
                    </div>
                    <div className="text-amber-400">{player.firstPlaces.toLocaleString()}</div>
                  </div>

                  {/* In-game Presence */}
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Clock className="size-3" />
                      In-game presence
                    </div>
                    <div className={player.lastPresence === 'Online' ? 'text-green-400' : 'text-slate-400'}>
                      {player.lastPresence}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medals Button */}
              <Button 
                onClick={() => setShowMedals(true)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Trophy className="size-4 mr-2" />
                View Medals Collection ({player.medals.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showMedals && (
        <MedalsModal
          player={player}
          onClose={() => setShowMedals(false)}
        />
      )}
    </>
  );
}