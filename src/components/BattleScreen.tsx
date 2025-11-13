import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Skull, 
  Heart, 
  Zap, 
  Swords, 
  Shield as ShieldIcon,
  Clock,
  Flame,
  Sparkles,
  X
} from 'lucide-react';
import { BattleSimulator, type BattleLog } from '../lib/battleSystem';
import { getItemById } from '../lib/itemsData';
import { getInventoryItem } from '../lib/inventoryData';
import type { Boss } from '../lib/bossData';

interface BattleScreenProps {
  boss: Boss;
  onClose: (victory: boolean) => void;
}

export function BattleScreen({ boss, onClose }: BattleScreenProps) {
  const [simulator] = useState(() => new BattleSimulator(boss.id, boss.shield, boss.timeLimit));
  const [battleState, setBattleState] = useState(simulator.getState());
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const [selectedElixir, setSelectedElixir] = useState<string | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Available items in inventory
  const availableCharges = [
    { id: 'minor-charge', count: getInventoryItem('minor-charge') },
    { id: 'medium-charge', count: getInventoryItem('medium-charge') },
    { id: 'large-charge', count: getInventoryItem('large-charge') }
  ].filter(item => item.count > 0);

  const availableElixirs = [
    { id: 'magic-source', count: getInventoryItem('magic-source') },
    { id: 'steel-hedgehog', count: getInventoryItem('steel-hedgehog') },
    { id: 'crag', count: getInventoryItem('crag') },
    { id: 'healing-vine', count: getInventoryItem('healing-vine') },
    { id: 'phoenix', count: getInventoryItem('phoenix') },
    { id: 'explosive-vigor', count: getInventoryItem('explosive-vigor') },
    { id: 'star-clarity', count: getInventoryItem('star-clarity') }
  ].filter(item => item.count > 0);

  // Auto-play simulation
  useEffect(() => {
    if (!isAutoPlay || battleState.isComplete) return;

    const interval = setInterval(() => {
      simulator.simulateTurn();
      setBattleState(simulator.getState());
      setLogs(simulator.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoPlay, battleState.isComplete, simulator]);

  // Check if battle is complete
  useEffect(() => {
    if (battleState.isComplete) {
      setIsAutoPlay(false);
      setTimeout(() => {
        onClose(battleState.isVictory);
      }, 3000);
    }
  }, [battleState.isComplete, battleState.isVictory, onClose]);

  const handleAttack = () => {
    simulator.playerAttack();
    setBattleState(simulator.getState());
    setLogs(simulator.getLogs());
    
    // Boss counter-attack
    setTimeout(() => {
      simulator.bossAttack();
      setBattleState(simulator.getState());
      setLogs(simulator.getLogs());
    }, 500);
  };

  const handleUseCharge = (chargeId: string) => {
    if (simulator.useCharge(chargeId)) {
      setSelectedCharge(null);
      setBattleState(simulator.getState());
      setLogs(simulator.getLogs());
    }
  };

  const handleUseElixir = (elixirId: string) => {
    if (simulator.useElixir(elixirId)) {
      setSelectedElixir(null);
      setBattleState(simulator.getState());
      setLogs(simulator.getLogs());
    }
  };

  const handleEndRound = () => {
    simulator.endRound();
    setBattleState(simulator.getState());
    setLogs(simulator.getLogs());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bossHealthPercent = (battleState.bossCurrentShield / battleState.bossMaxShield) * 100;
  const playerHealthPercent = (battleState.playerHealth / battleState.playerMaxHealth) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="size-8 text-red-500" />
            <div>
              <h2 className="text-amber-500">Battle: {boss.name}</h2>
              <p className="text-slate-400 text-sm">Tier {boss.tier}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={() => onClose(false)}
          >
            <X className="size-4 mr-2" />
            Retreat
          </Button>
        </div>

        {/* Battle Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-4 text-amber-500" />
              <span className="text-slate-400 text-sm">Time Remaining</span>
            </div>
            <div className="text-amber-500">{formatTime(battleState.timeRemaining)}</div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="size-4 text-red-500" />
              <span className="text-slate-400 text-sm">Round</span>
            </div>
            <div className="text-red-400">{battleState.currentRound} / {battleState.maxRounds}</div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Swords className="size-4 text-green-500" />
              <span className="text-slate-400 text-sm">Damage Dealt</span>
            </div>
            <div className="text-green-400">{battleState.damageDealt.toLocaleString()}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left - Boss & Player Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Boss */}
            <Card className="bg-gradient-to-b from-red-900/30 to-slate-800/50 border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500">
                    <Skull className="size-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-red-400">{boss.name}</h3>
                    <p className="text-slate-400 text-sm">{boss.weapon}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-400">{battleState.bossCurrentShield.toLocaleString()}</div>
                  <div className="text-slate-500 text-sm">Shield</div>
                </div>
              </div>
              <Progress value={bossHealthPercent} className="h-4 bg-slate-700" />
              <div className="text-center text-slate-400 text-sm mt-2">
                {bossHealthPercent.toFixed(1)}%
              </div>
            </Card>

            {/* Player */}
            <Card className="bg-gradient-to-b from-green-900/30 to-slate-800/50 border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500">
                    <ShieldIcon className="size-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-green-400">Shadow_Fighter_1000</h3>
                    <p className="text-slate-400 text-sm">Your Character</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">{battleState.playerHealth} / {battleState.playerMaxHealth}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Zap className="size-3 text-purple-400" />
                    <span className="text-purple-400 text-sm">{battleState.magicCharge}%</span>
                  </div>
                </div>
              </div>
              <Progress value={playerHealthPercent} className="h-4 bg-slate-700" />
              <div className="text-center text-slate-400 text-sm mt-2">
                {playerHealthPercent.toFixed(1)}%
              </div>

              {/* Active Elixirs */}
              {battleState.activeElixirs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-slate-400 text-sm mb-2">Active Effects:</div>
                  <div className="flex flex-wrap gap-2">
                    {battleState.activeElixirs.map((elixir, idx) => (
                      <Badge key={idx} className="bg-purple-500 text-white">
                        <Sparkles className="size-3 mr-1" />
                        {getItemById(elixir.elixirId)?.name} ({elixir.roundsRemaining}r)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Battle Log */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Battle Log</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {logs.slice(-8).reverse().map((log, idx) => (
                  <div 
                    key={idx}
                    className={`text-sm p-2 rounded ${
                      log.type === 'player_attack' ? 'bg-green-500/10 text-green-400' :
                      log.type === 'boss_attack' ? 'bg-red-500/10 text-red-400' :
                      log.type === 'charge_used' ? 'bg-purple-500/10 text-purple-400' :
                      log.type === 'elixir_used' ? 'bg-blue-500/10 text-blue-400' :
                      log.type === 'effect_triggered' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-700/30 text-slate-400'
                    }`}
                  >
                    {log.message}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - Actions */}
          <div className="space-y-4">
            {/* Combat Actions */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Actions</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleAttack}
                  disabled={battleState.isComplete}
                >
                  <Swords className="size-4 mr-2" />
                  Attack
                </Button>
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={battleState.magicCharge < 100 || battleState.isComplete}
                >
                  <Zap className="size-4 mr-2" />
                  Magic Attack ({battleState.magicCharge}%)
                </Button>

                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={handleEndRound}
                  disabled={battleState.isComplete}
                >
                  <Flame className="size-4 mr-2" />
                  End Round
                </Button>

                <Button 
                  className="w-full bg-slate-600 hover:bg-slate-700"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  disabled={battleState.isComplete}
                >
                  {isAutoPlay ? 'Stop Auto' : 'Auto Battle'}
                </Button>
              </div>
            </Card>

            {/* Charges */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Charges of Darkness</h3>
              <div className="space-y-2">
                {availableCharges.map(charge => {
                  const item = getItemById(charge.id);
                  return (
                    <Button
                      key={charge.id}
                      className="w-full bg-purple-600 hover:bg-purple-700 justify-between"
                      onClick={() => handleUseCharge(charge.id)}
                      disabled={battleState.isComplete}
                    >
                      <span className="text-sm">{item?.name}</span>
                      <Badge className="bg-purple-800 text-white">{charge.count}</Badge>
                    </Button>
                  );
                })}
                {availableCharges.length === 0 && (
                  <p className="text-slate-500 text-sm text-center">No charges available</p>
                )}
              </div>
            </Card>

            {/* Elixirs */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Elixirs</h3>
              <div className="space-y-2">
                {availableElixirs.map(elixir => {
                  const item = getItemById(elixir.id);
                  const isActive = battleState.activeElixirs.some(e => e.elixirId === elixir.id);
                  return (
                    <Button
                      key={elixir.id}
                      className="w-full bg-blue-600 hover:bg-blue-700 justify-between text-sm"
                      onClick={() => handleUseElixir(elixir.id)}
                      disabled={battleState.isComplete || isActive}
                    >
                      <span className="truncate">{item?.name}</span>
                      <Badge className="bg-blue-800 text-white">{elixir.count}</Badge>
                    </Button>
                  );
                })}
                {availableElixirs.length === 0 && (
                  <p className="text-slate-500 text-sm text-center">No elixirs available</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Battle Complete Overlay */}
        {battleState.isComplete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className={`p-8 text-center ${battleState.isVictory ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
              <div className="mb-4">
                {battleState.isVictory ? (
                  <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500">
                    <ShieldIcon className="size-12 text-green-400" />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500">
                    <Skull className="size-12 text-red-400" />
                  </div>
                )}
              </div>
              <h2 className={battleState.isVictory ? 'text-green-400 mb-4' : 'text-red-400 mb-4'}>
                {battleState.isVictory ? 'Victory!' : 'Defeat!'}
              </h2>
              <div className="space-y-2 text-slate-300">
                <p>Damage Dealt: {battleState.damageDealt.toLocaleString()}</p>
                <p>Damage Received: {battleState.damageReceived.toLocaleString()}</p>
                <p>Hits: {battleState.hits}</p>
              </div>
              <p className="text-slate-400 text-sm mt-4">Returning to map...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}