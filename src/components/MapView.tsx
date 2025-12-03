import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skull, Swords, Lock, Star, MapPin, Clock, Users, Shield as ShieldIcon, Flame, Sparkles, Key } from 'lucide-react';
import { bosses, getTierBosses, type Boss } from '../lib/bossData';
import { getItemById } from '../lib/itemsData';
import { getInventoryItem, hasEnoughItems, removeInventoryItem } from '../lib/inventoryData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { RaidOrchestrator } from './RaidOrchestrator';
import { getPlayerStats, getWinRate } from '../lib/playerStatsData';
import { getRaidsToday } from '../lib/playerEquipment';

export function MapView() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [raidBoss, setRaidBoss] = useState<Boss | null>(null);
  const [keysCount, setKeysCount] = useState(getInventoryItem('steel-keys'));
  const [playerStats, setPlayerStats] = useState(getPlayerStats());
  const [raidsToday, setRaidsToday] = useState(getRaidsToday());
  const [winRate, setWinRate] = useState(getWinRate());

  // Update stats in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerStats(getPlayerStats());
      setRaidsToday(getRaidsToday());
      setWinRate(getWinRate());
      setKeysCount(getInventoryItem('steel-keys'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tierBosses = getTierBosses(selectedTier);
  const playerDan = playerStats.level; // Use actual player level from stats

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'from-orange-900/30 to-red-900/30 border-orange-500/30';
      case 2: return 'from-purple-900/30 to-indigo-900/30 border-purple-500/30';
      case 3: return 'from-slate-900/30 to-slate-800/30 border-slate-500/30';
      case 4: return 'from-cyan-900/30 to-blue-900/30 border-cyan-500/30';
      default: return 'from-slate-900/30 to-slate-800/30 border-slate-500/30';
    }
  };

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return <Flame className="size-5 text-orange-500" />;
      case 2: return <Sparkles className="size-5 text-purple-500" />;
      case 3: return <Skull className="size-5 text-slate-400" />;
      case 4: return <Swords className="size-5 text-cyan-500" />;
      default: return <Skull className="size-5" />;
    }
  };

  const canChallengeBoss = (boss: Boss) => {
    return playerDan >= boss.minDan;
  };

  const handleStartRaid = () => {
    if (selectedBoss && hasEnoughItems(selectedBoss.keyRequired, selectedBoss.keysPerEntry)) {
      // Deduct keys
      removeInventoryItem(selectedBoss.keyRequired, selectedBoss.keysPerEntry);
      setKeysCount(getInventoryItem('steel-keys'));
      
      // Start raid
      setSelectedBoss(null);
      setRaidBoss(selectedBoss);
    }
  };

  const handleRaidComplete = () => {
    // Refresh keys count when returning from raid (rewards may have been added)
    setKeysCount(getInventoryItem('steel-keys'));
    setRaidBoss(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-amber-500 mb-2">Underworld Map</h2>
          <p className="text-slate-400">Select a tier and challenge the bosses</p>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Star className="size-6 text-amber-500" />
              </div>
              <div>
                <div className="text-slate-400 text-sm">Your Dan Level</div>
                <div className="text-amber-500 flex items-center gap-2">
                  <span className="line-through text-slate-500">5</span>
                  <span>→</span>
                  <span className="text-xl">{playerDan}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <Skull className="size-6 text-red-500" />
              </div>
              <div>
                <div className="text-slate-400 text-sm">Raids Today</div>
                <div className="text-red-400">{raidsToday} / 10</div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Swords className="size-6 text-green-500" />
              </div>
              <div>
                <div className="text-slate-400 text-sm">Win Rate</div>
                <div className="text-green-400">{winRate.toFixed(1)}%</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tier Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((tier) => (
            <Button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`
                h-auto py-4 flex flex-col items-center gap-2
                ${selectedTier === tier 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-400' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
                }
              `}
            >
              {getTierIcon(tier)}
              <div>
                <div className="text-sm">Tier {tier}</div>
                <div className="text-xs opacity-70">{getTierBosses(tier).length} Bosses</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Tier Info */}
        <Card className={`bg-gradient-to-r ${getTierColor(selectedTier)} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierIcon(selectedTier)}
              <div>
                <h3 className="text-amber-500">
                  {selectedTier === 1 && 'Underworld: First Floor'}
                  {selectedTier === 2 && 'Underworld: Tier 2'}
                  {selectedTier === 3 && 'Underworld: Tier 3 - Deepest Layer'}
                  {selectedTier === 4 && "Underworld: Tier 4 - Immortals' World"}
                </h3>
                <p className="text-slate-400 text-sm">
                  {selectedTier === 1 && 'The first floor bosses'}
                  {selectedTier === 2 && 'Fights carry random rules in each round'}
                  {selectedTier === 3 && 'The deepest layer with random rules'}
                  {selectedTier === 4 && 'Beyond the Portal - Immortals dimension'}
                </p>
              </div>
            </div>
            <Badge className="bg-amber-500 text-white">
              {tierBosses.length} Bosses
            </Badge>
          </div>
        </Card>

        {/* Bosses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tierBosses.map((boss) => {
            const canChallenge = canChallengeBoss(boss);
            
            return (
              <Card
                key={boss.id}
                className={`
                  p-6 transition-all cursor-pointer
                  ${canChallenge 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50 hover:shadow-lg' 
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }
                `}
                onClick={() => canChallenge && setSelectedBoss(boss)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-16 h-16 rounded-full border-2 flex items-center justify-center
                      ${canChallenge 
                        ? 'bg-gradient-to-br from-red-900 to-red-700 border-red-500' 
                        : 'bg-slate-700 border-slate-600'
                      }
                    `}>
                      {canChallenge ? (
                        <Skull className="size-8 text-red-200" />
                      ) : (
                        <Lock className="size-8 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3 className={`mb-1 ${canChallenge ? 'text-amber-500' : 'text-slate-500'}`}>
                        {boss.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${canChallenge ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                          Dan {boss.minDan}+
                        </Badge>
                        {!canChallenge && (
                          <Badge className="bg-red-500 text-white text-xs">Locked</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldIcon className="size-3" />
                    <span className="text-slate-300">{boss.shield.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="size-3" />
                    <span className="text-slate-300">{boss.timeLimit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="size-3" />
                    <span className="text-slate-300">Max {boss.maxPlayers}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Swords className="size-3" />
                    <span className="text-slate-300">{boss.weapon}</span>
                  </div>
                </div>

                {canChallenge && (
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
                    <Swords className="size-4 mr-2" />
                    Challenge Boss
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Boss Detail Modal */}
      {selectedBoss && (
        <Dialog open={!!selectedBoss} onOpenChange={() => setSelectedBoss(null)}>
          <DialogContent className="bg-slate-900 border-amber-500/30 text-slate-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-amber-500 flex items-center gap-2">
                <Skull className="size-6" />
                {selectedBoss.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Tier {selectedBoss.tier} Boss - Minimum Dan {selectedBoss.minDan} Required
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Boss Stats */}
              <Card className="bg-slate-800/50 border-slate-700 p-4">
                <h3 className="text-amber-500 mb-3">Boss Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Shield</span>
                    <span className="text-slate-200">{selectedBoss.shield.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Time Limit</span>
                    <span className="text-slate-200">{selectedBoss.timeLimit}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Max Players</span>
                    <span className="text-slate-200">{selectedBoss.maxPlayers}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Min Dan</span>
                    <span className="text-amber-500">{selectedBoss.minDan}</span>
                  </div>
                </div>
              </Card>

              {/* Key Requirement */}
              <Card className="bg-slate-800/50 border-slate-700 p-4">
                <h3 className="text-amber-500 mb-3 flex items-center gap-2">
                  <Key className="size-4" />
                  Entry Requirement
                </h3>
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div className="flex items-center gap-2">
                    <Key className="size-5 text-amber-400" />
                    <div>
                      <div className="text-slate-200">{getItemById(selectedBoss.keyRequired)?.name}</div>
                      <div className="text-slate-400 text-xs">Required per entry</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${hasEnoughItems(selectedBoss.keyRequired, selectedBoss.keysPerEntry) ? 'text-green-400' : 'text-red-400'}`}>
                      {getInventoryItem(selectedBoss.keyRequired)} / {selectedBoss.keysPerEntry}
                    </div>
                    {hasEnoughItems(selectedBoss.keyRequired, selectedBoss.keysPerEntry) ? (
                      <Badge className="bg-green-500 text-white text-xs mt-1">Available</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white text-xs mt-1">Not enough</Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Equipment */}
              <Card className="bg-slate-800/50 border-slate-700 p-4">
                <h3 className="text-amber-500 mb-3">Boss Equipment</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Weapon</span>
                    <span className="text-slate-200">{selectedBoss.weapon}</span>
                  </div>
                  {selectedBoss.rangedWeapon && selectedBoss.rangedWeapon !== 'None' && (
                    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-slate-400 text-sm">Ranged Weapon</span>
                      <span className="text-slate-200">{selectedBoss.rangedWeapon}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-400 text-sm">Magic</span>
                    <span className="text-purple-400">{selectedBoss.magic}</span>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                  onClick={handleStartRaid}
                  disabled={!hasEnoughItems(selectedBoss.keyRequired, selectedBoss.keysPerEntry)}
                >
                  <Swords className="size-4 mr-2" />
                  Start Raid
                </Button>
                <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setSelectedBoss(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Raid Orchestrator */}
      {raidBoss && (
        <RaidOrchestrator
          boss={raidBoss}
          onRaidComplete={handleRaidComplete}
          onCancel={() => setRaidBoss(null)}
        />
      )}
    </>
  );
}