import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Skull, 
  Heart, 
  Swords, 
  Clock,
  Flame,
  Sparkles,
  X,
  User
} from 'lucide-react';
import type { Boss } from '../lib/bossData';
import type { RaidPlayer } from './MatchmakingPopup';

interface RaidBattleScreenProps {
  boss: Boss;
  players: RaidPlayer[];
  charge: string | null;
  elixir: string | null;
  currentBossShield: number;
  onBattleComplete: (regularDamage: number, chargeDamage: number, timeUsed: number, remainingShield: number, isFinalBattleWon: boolean) => void;
  onClose: () => void;
}

export function RaidBattleScreen({ 
  boss, 
  players, 
  charge, 
  elixir, 
  currentBossShield,
  onBattleComplete,
  onClose 
}: RaidBattleScreenProps) {
  const timeLimit = 45; // Round time is always 45 seconds
  const isFinalBattle = currentBossShield <= 0;
  
  const [roundTime, setRoundTime] = useState(timeLimit);
  const [bossShield, setBossShield] = useState(currentBossShield);
  const [bossHP, setBossHP] = useState(5000); // Final battle HP
  const [playerHealth, setPlayerHealth] = useState(1000);
  const [regularDamage, setRegularDamage] = useState(0);
  const [chargeDamage, setChargeDamage] = useState(0);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [elixirActive, setElixirActive] = useState(false);
  const [chargeCooldown, setChargeCooldown] = useState(0);

  // Round timer
  useEffect(() => {
    if (!isRoundActive || roundTime <= 0) return;

    const timer = setInterval(() => {
      setRoundTime(prev => {
        if (prev <= 1) {
          setIsRoundActive(false);
          // Time's up - battle complete
          setTimeout(() => {
            if (isFinalBattle) {
              onBattleComplete(regularDamage, chargeDamage, timeLimit, 0, false);
            } else {
              onBattleComplete(regularDamage, chargeDamage, timeLimit, bossShield, false);
            }
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRoundActive, roundTime, regularDamage, chargeDamage, bossShield, onBattleComplete, timeLimit, isFinalBattle]);

  // Auto damage from bots
  useEffect(() => {
    if (!isRoundActive) return;

    const botDamageInterval = setInterval(() => {
      const botDamage = Math.floor(Math.random() * 50) + 30;
      
      if (isFinalBattle) {
        // Final battle - damage boss HP
        setBossHP(prev => {
          const newHP = Math.max(0, prev - botDamage);
          
          if (newHP <= 0) {
            setIsRoundActive(false);
            setTimeout(() => {
              onBattleComplete(regularDamage + botDamage, chargeDamage, timeLimit - roundTime, 0, true);
            }, 500);
          }
          
          return newHP;
        });
      } else {
        // Regular battle - damage boss shield
        setBossShield(prev => {
          const newShield = Math.max(0, prev - botDamage);
          
          if (newShield <= 0) {
            setIsRoundActive(false);
            setTimeout(() => {
              onBattleComplete(regularDamage + botDamage, chargeDamage, timeLimit - roundTime, 0, false);
            }, 500);
          }
          
          return newShield;
        });
      }
      
      setRegularDamage(prev => prev + botDamage);
    }, 2000);

    return () => clearInterval(botDamageInterval);
  }, [isRoundActive, isFinalBattle, regularDamage, chargeDamage, roundTime, onBattleComplete, timeLimit]);

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 50) + 80;
    
    if (isFinalBattle) {
      setBossHP(prev => {
        const newHP = Math.max(0, prev - damage);
        
        if (newHP <= 0) {
          setIsRoundActive(false);
          setTimeout(() => {
            onBattleComplete(regularDamage + damage, chargeDamage, timeLimit - roundTime, 0, true);
          }, 500);
        }
        
        return newHP;
      });
    } else {
      setBossShield(prev => {
        const newShield = Math.max(0, prev - damage);
        
        if (newShield <= 0) {
          setIsRoundActive(false);
          setTimeout(() => {
            onBattleComplete(regularDamage + damage, chargeDamage, timeLimit - roundTime, 0, false);
          }, 500);
        }
        
        return newShield;
      });
    }
    
    setRegularDamage(prev => prev + damage);
  };

  const handleUseCharge = () => {
    if (!charge || chargeCooldown > 0) return;
    
    let damage = 0;
    let cooldown = 5;
    
    if (charge === 'minor-charge') {
      damage = Math.floor(Math.random() * 17) + 72;
      cooldown = 3;
    } else if (charge === 'medium-charge') {
      damage = Math.floor(Math.random() * 64) + 488;
      cooldown = 5;
    } else if (charge === 'large-charge') {
      damage = Math.floor(Math.random() * 82) + 990;
      cooldown = 7;
    }
    
    setChargeCooldown(cooldown);
    
    if (isFinalBattle) {
      setBossHP(prev => {
        const newHP = Math.max(0, prev - damage);
        
        if (newHP <= 0) {
          setIsRoundActive(false);
          setTimeout(() => {
            onBattleComplete(regularDamage, chargeDamage + damage, timeLimit - roundTime, 0, true);
          }, 500);
        }
        
        return newHP;
      });
    } else {
      setBossShield(prev => {
        const newShield = Math.max(0, prev - damage);
        
        if (newShield <= 0) {
          setIsRoundActive(false);
          setTimeout(() => {
            onBattleComplete(regularDamage, chargeDamage + damage, timeLimit - roundTime, 0, false);
          }, 500);
        }
        
        return newShield;
      });
    }
    
    setChargeDamage(prev => prev + damage);
  };

  const handleDrinkElixir = () => {
    if (elixir && !elixirActive) {
      setElixirActive(true);
    }
  };

  // Player takes damage
  useEffect(() => {
    if (!isRoundActive) return;

    const bossDamageInterval = setInterval(() => {
      const damage = Math.floor(Math.random() * 40) + 20;
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        
        // Player died
        if (newHealth <= 0) {
          setIsRoundActive(false);
          setTimeout(() => {
            if (isFinalBattle) {
              onBattleComplete(regularDamage, chargeDamage, timeLimit - roundTime, 0, false);
            } else {
              onBattleComplete(regularDamage, chargeDamage, timeLimit - roundTime, bossShield, false);
            }
          }, 500);
        }
        
        return newHealth;
      });
    }, 3000);

    return () => clearInterval(bossDamageInterval);
  }, [isRoundActive, regularDamage, chargeDamage, roundTime, bossShield, onBattleComplete, timeLimit, isFinalBattle]);

  // Charge cooldown
  useEffect(() => {
    if (chargeCooldown > 0) {
      const cooldownTimer = setInterval(() => {
        setChargeCooldown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(cooldownTimer);
    }
  }, [chargeCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bossHealthPercent = isFinalBattle 
    ? (bossHP / 5000) * 100 
    : (bossShield / currentBossShield) * 100;
  const playerHealthPercent = (playerHealth / 1000) * 100;
  const totalDamage = regularDamage + chargeDamage;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="size-8 text-red-500" />
            <div>
              <h2 className="text-amber-500">{boss.name}</h2>
              <Badge className={isFinalBattle ? 'bg-amber-500' : 'bg-red-500'}>
                {isFinalBattle ? 'FINAL BATTLE' : `Tier ${boss.tier} Raid`}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Card className={`px-4 py-2 ${
              roundTime < 10 ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className={`size-4 ${roundTime < 10 ? 'text-red-400' : 'text-amber-500'}`} />
                <span className={roundTime < 10 ? 'text-red-400' : 'text-amber-500'}>{formatTime(roundTime)}</span>
              </div>
            </Card>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={onClose}
            >
              <X className="size-4 mr-2" />
              Retreat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left - Players List */}
          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Raid Party</h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div 
                    key={player.id}
                    className="flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                  >
                    <div className="text-amber-500 text-sm">{index + 1}</div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      player.isBot ? 'bg-slate-600' : 'bg-green-600'
                    }`}>
                      <User className="size-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 text-sm">{player.name}</div>
                      <Progress value={Math.random() * 40 + 60} className="h-1 bg-slate-600 mt-1" />
                    </div>
                    <div className="text-slate-400 text-xs">
                      {Math.floor(Math.random() * 500 + 200)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center - Boss */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-b from-red-900/30 to-slate-800/50 border-red-500/30 p-6">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center border-4 border-red-500 mb-3">
                  <Skull className="size-16 text-red-200" />
                </div>
                <h3 className="text-red-400 mb-2">{boss.name}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{isFinalBattle ? 'HP' : 'Shield'}</span>
                  <span className="text-red-400">
                    {isFinalBattle ? `${bossHP.toLocaleString()}` : `${bossShield.toLocaleString()}`}
                  </span>
                </div>
                <Progress value={bossHealthPercent} className="h-2 bg-slate-700" />
                {isFinalBattle && (
                  <div className="text-center">
                    <div className="text-slate-400 text-xs">x1</div>
                  </div>
                )}
                <div className="text-center text-slate-400 text-sm">
                  {bossHealthPercent.toFixed(1)}%
                </div>
              </div>
            </Card>

            {/* Player Health */}
            <Card className="bg-gradient-to-b from-green-900/30 to-slate-800/50 border-green-500/30 p-4">
              <div className="flex items-center justify-between mb-2 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-green-400" />
                  <span className="text-slate-400">Your Health</span>
                </div>
                <span className="text-green-400">{playerHealth} / 1000</span>
              </div>
              <Progress value={playerHealthPercent} className="h-3 bg-slate-700" />
              
              {elixirActive && elixir && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Sparkles className="size-4 text-purple-400" />
                  <span className="text-purple-400 text-sm">Elixir Active</span>
                </div>
              )}
            </Card>

            {/* Damage Stats */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Regular Damage</span>
                  <span className="text-blue-400">{regularDamage.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Charge Damage</span>
                  <span className="text-purple-400">{chargeDamage.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                  <span className="text-amber-400">Total Damage</span>
                  <span className="text-amber-400">{totalDamage.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Actions */}
          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Actions</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleAttack}
                  disabled={!isRoundActive}
                >
                  <Swords className="size-4 mr-2" />
                  Attack
                </Button>
                
                {charge && (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleUseCharge}
                    disabled={!isRoundActive || chargeCooldown > 0}
                  >
                    <Flame className="size-4 mr-2" />
                    {chargeCooldown > 0 ? `Charge Cooldown (${chargeCooldown}s)` : 'Use Charge'}
                  </Button>
                )}

                {elixir && !elixirActive && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleDrinkElixir}
                    disabled={!isRoundActive}
                  >
                    <Sparkles className="size-4 mr-2" />
                    Drink Elixir
                  </Button>
                )}
              </div>
            </Card>

            {/* Round Info */}
            <Card className="bg-slate-800/50 border-amber-500/30 p-4">
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-1">Round Time</div>
                <div className={`text-3xl mb-2 ${roundTime < 10 ? 'text-red-400' : 'text-amber-500'}`}>{roundTime}s</div>
                <Progress 
                  value={(roundTime / timeLimit) * 100} 
                  className="h-2 bg-slate-700"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}