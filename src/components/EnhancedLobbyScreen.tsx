import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skull, Clock, Shield as ShieldIcon, User, Flame, Droplet, Swords, Trophy, X, ChevronUp, ChevronDown } from 'lucide-react';
import type { Boss } from '../lib/bossData';
import type { RaidPlayer } from './MatchmakingPopup';
import { Progress } from './ui/progress';
import { getItemById } from '../lib/itemsData';
import { getInventoryItem } from '../lib/inventoryData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EnhancedLobbyScreenProps {
  boss: Boss;
  players: RaidPlayer[];
  currentBossShield: number;
  bossTimerRemaining: number;
  onStartBattle: (charge: string | null, elixir: string | null) => void;
  onTimerExpired: () => void;
  onExit: () => void;
  battleCooldown: number;
}

export function EnhancedLobbyScreen({ 
  boss, 
  players, 
  currentBossShield,
  bossTimerRemaining,
  onStartBattle,
  onTimerExpired,
  onExit,
  battleCooldown
}: EnhancedLobbyScreenProps) {
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const [selectedElixir, setSelectedElixir] = useState<string | null>(null);

  // Check if boss timer expired
  useEffect(() => {
    if (bossTimerRemaining <= 0) {
      onTimerExpired();
    }
  }, [bossTimerRemaining, onTimerExpired]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bossHealthPercent = (currentBossShield / boss.shield) * 100;
  const isFinalBattleReady = currentBossShield <= 0;

  const getItemImage = (itemId: string) => {
    const imageMap: Record<string, string> = {
      'minor-charge': 'https://static.wikia.nocookie.net/shadowfight/images/2/2b/Sphere1.png',
      'medium-charge': 'https://static.wikia.nocookie.net/shadowfight/images/b/bb/Sphere2.png',
      'large-charge': 'https://static.wikia.nocookie.net/shadowfight/images/e/ec/Sphere3.png',
      'crag': 'https://static.wikia.nocookie.net/shadowfight/images/7/7b/Potion_rock.png',
      'steel-hedgehog': 'https://static.wikia.nocookie.net/shadowfight/images/f/f0/Potion_spikes.png',
      'magic-source': 'https://static.wikia.nocookie.net/shadowfight/images/e/eb/Potion_magic.png',
      'phoenix': 'https://static.wikia.nocookie.net/shadowfight/images/3/3a/Potion_phoenix.png',
      'explosive-vigor': 'https://static.wikia.nocookie.net/shadowfight/images/2/2f/RaidItems4.png',
      'star-clarity': 'https://static.wikia.nocookie.net/shadowfight/images/0/05/Potion3.png',
      'healing-vine': 'https://static.wikia.nocookie.net/shadowfight/images/1/1f/Potion_healing.png'
    };
    return imageMap[itemId] || '';
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skull className="size-8 text-red-500" />
            <div>
              <h2 className="text-amber-500">{boss.name} Raid</h2>
              <Badge className="bg-red-500 text-white">Tier {boss.tier}</Badge>
            </div>
          </div>
          
          {/* Boss Global Timer */}
          <Card className={`px-6 py-3 ${
            bossTimerRemaining < 60 ? 'bg-red-900/50 border-red-500' : 'bg-slate-800/50 border-amber-500'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-amber-400" />
              <div className="text-center">
                <div className="text-amber-400">{formatTime(bossTimerRemaining)}</div>
                <div className="text-slate-400 text-xs">Boss Timer</div>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={onExit}
          >
            <X className="size-4 mr-2" />
            Leave Raid
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Players & Boss Info */}
          <div className="space-y-4">
            {/* Boss Status */}
            <Card className="bg-gradient-to-b from-red-900/30 to-slate-800/50 border-red-500/30 p-6">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center border-4 border-red-500 mb-3">
                  <Skull className="size-16 text-red-200" />
                </div>
                <h3 className="text-red-400 mb-2">{boss.name}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="size-4 text-slate-400" />
                    <span className="text-slate-400">Shield</span>
                  </div>
                  <span className="text-red-400">{currentBossShield.toLocaleString()}</span>
                </div>
                <Progress value={bossHealthPercent} className="h-3 bg-slate-700" />
                <div className="text-center text-slate-400 text-sm">
                  {bossHealthPercent.toFixed(1)}% Remaining
                </div>
              </div>
            </Card>

            {/* Players List */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <h3 className="text-amber-500 mb-3">Raid Party ({players.length}/{boss.maxPlayers})</h3>
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
                      <div className="text-slate-200 text-sm">
                        {player.name}
                        {!player.isBot && <Badge className="ml-2 bg-green-500 text-white text-xs">You</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center - Equipment Selection */}
          <div>
            <Card className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 border-amber-900 border-4 p-6 relative shadow-xl">
              {/* Decorative border */}
              <div className="absolute inset-0 border-4 border-amber-900/20 pointer-events-none" style={{
                background: 'radial-gradient(circle at center, transparent 0%, rgba(139, 69, 19, 0.1) 100%)'
              }} />
              
              <div className="relative">
                <h3 className="text-amber-900 mb-6 text-center" style={{
                  textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)',
                  letterSpacing: '0.1em'
                }}>PREPARATION OF EQUIPMENT</h3>

                {/* Equipment Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Charge Column */}
                  <div className="text-center">
                    <h4 className="text-amber-900 mb-4" style={{ letterSpacing: '0.05em' }}>Charge</h4>
                    
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-6 h-6"
                        onClick={() => {
                          const currentIndex = availableCharges.findIndex(c => c.id === selectedCharge);
                          const newIndex = currentIndex > 0 ? currentIndex - 1 : availableCharges.length - 1;
                          setSelectedCharge(availableCharges[newIndex]?.id || null);
                        }}
                        disabled={availableCharges.length <= 1}
                      >
                        <ChevronUp className="size-4" strokeWidth={3} />
                      </Button>

                      <div className="relative">
                        {selectedCharge ? (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 border-4 border-amber-900 flex items-center justify-center shadow-lg relative overflow-hidden p-3">
                            <ImageWithFallback 
                              src={getItemImage(selectedCharge)}
                              alt={getItemById(selectedCharge)?.name || 'Charge'}
                              className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-4 border-slate-600 flex items-center justify-center">
                            <Flame className="size-12 text-slate-300" />
                          </div>
                        )}
                        
                        {selectedCharge && (
                          <>
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-900 flex items-center justify-center shadow">
                              <span className="text-amber-900 text-xs">?</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-900 border-2 border-amber-900 px-2 py-0.5 rounded-full shadow text-xs">
                              {getInventoryItem(selectedCharge)}
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-6 h-6"
                        onClick={() => {
                          const currentIndex = availableCharges.findIndex(c => c.id === selectedCharge);
                          const newIndex = currentIndex < availableCharges.length - 1 ? currentIndex + 1 : 0;
                          setSelectedCharge(availableCharges[newIndex]?.id || null);
                        }}
                        disabled={availableCharges.length <= 1}
                      >
                        <ChevronDown className="size-4" strokeWidth={3} />
                      </Button>
                    </div>

                    {selectedCharge && (
                      <div className="mt-3">
                        <div className="text-amber-900 text-xs mb-2">
                          {getItemById(selectedCharge)?.description.includes('72-88') && 'Damage: 72 - 88'}
                          {getItemById(selectedCharge)?.description.includes('488-552') && 'Damage: 488 - 552'}
                          {getItemById(selectedCharge)?.description.includes('990-1072') && 'Damage: 990 - 1072'}
                        </div>
                        <Button
                          className="bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-amber-900 border-2 border-amber-900 rounded-full px-3 py-1 shadow h-auto text-xs"
                          style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
                        >
                          <Flame className="size-3 mr-1 text-orange-600" />
                          {getInventoryItem(selectedCharge)}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Elixir Column */}
                  <div className="text-center">
                    <h4 className="text-amber-900 mb-4" style={{ letterSpacing: '0.05em' }}>Elixir</h4>
                    
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-6 h-6"
                        onClick={() => {
                          const currentIndex = availableElixirs.findIndex(e => e.id === selectedElixir);
                          const newIndex = currentIndex > 0 ? currentIndex - 1 : availableElixirs.length - 1;
                          setSelectedElixir(availableElixirs[newIndex]?.id || null);
                        }}
                        disabled={availableElixirs.length <= 1}
                      >
                        <ChevronUp className="size-4" strokeWidth={3} />
                      </Button>

                      <div className="relative">
                        {selectedElixir ? (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 border-4 border-amber-900 flex items-center justify-center shadow-lg relative overflow-hidden p-3">
                            <ImageWithFallback 
                              src={getItemImage(selectedElixir)}
                              alt={getItemById(selectedElixir)?.name || 'Elixir'}
                              className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-4 border-slate-600 flex items-center justify-center">
                            <Droplet className="size-12 text-slate-300" />
                          </div>
                        )}
                        
                        {selectedElixir && (
                          <>
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-900 flex items-center justify-center shadow">
                              <span className="text-amber-900 text-xs">?</span>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-900 border-2 border-amber-900 px-2 py-0.5 rounded-full shadow text-xs">
                              {getInventoryItem(selectedElixir)}
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-6 h-6"
                        onClick={() => {
                          const currentIndex = availableElixirs.findIndex(e => e.id === selectedElixir);
                          const newIndex = currentIndex < availableElixirs.length - 1 ? currentIndex + 1 : 0;
                          setSelectedElixir(availableElixirs[newIndex]?.id || null);
                        }}
                        disabled={availableElixirs.length <= 1}
                      >
                        <ChevronDown className="size-4" strokeWidth={3} />
                      </Button>
                    </div>

                    {selectedElixir && (
                      <div className="mt-3">
                        <div className="text-amber-900 text-xs mb-2">3 effects in 1</div>
                        <Button
                          className="bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-amber-900 border-2 border-amber-900 rounded-full px-4 py-1 shadow h-auto text-xs"
                          style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
                        >
                          DRINK
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Horn Column */}
                  <div className="text-center">
                    <h4 className="text-amber-900 mb-4" style={{ letterSpacing: '0.05em' }}>Horn</h4>
                    
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 w-6 h-6"
                        disabled
                      >
                        <ChevronUp className="size-4" strokeWidth={3} />
                      </Button>

                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-4 border-slate-600 flex items-center justify-center shadow-lg">
                        <svg className="size-12 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 14c.83.48 2.16.95 3 .95 2.29 0 5.28-1.3 7-2.95 2.28 1.95 5.6 3.95 8 3.95.84 0 2.17-.48 3-.95v-2.29c-.83.48-2.16.95-3 .95-2.4 0-5.72-2-8-3.95C11.28 11.7 8.29 13 6 13c-.84 0-2.17-.48-3-.95v2.29z"/>
                        </svg>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 w-6 h-6"
                        disabled
                      >
                        <ChevronDown className="size-4" strokeWidth={3} />
                      </Button>
                    </div>

                    <div className="mt-3 text-slate-500 text-xs">No horn equipped</div>
                  </div>
                </div>

                {/* Battle Buttons */}
                <div className="space-y-3">
                  {isFinalBattleReady ? (
                    <Button
                      className="w-full bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-amber-900 border-4 border-amber-900 shadow-lg h-12"
                      style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
                      onClick={() => onStartBattle(selectedCharge, selectedElixir)}
                    >
                      <Trophy className="size-5 mr-2" />
                      FINAL BATTLE
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-amber-900 border-4 border-amber-900 shadow-lg h-12"
                      style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
                      onClick={() => onStartBattle(selectedCharge, selectedElixir)}
                      disabled={battleCooldown > 0}
                    >
                      <Swords className="size-5 mr-2" />
                      {battleCooldown > 0 ? `FIGHT! (${battleCooldown}s)` : 'FIGHT!'}
                    </Button>
                  )}

                  {battleCooldown > 0 && !isFinalBattleReady && (
                    <div className="text-center">
                      <Progress value={((battleCooldown > 15 ? 60 : 15) - battleCooldown) / (battleCooldown > 15 ? 60 : 15) * 100} className="h-2 bg-amber-900/20" />
                      <div className="text-amber-900 text-xs mt-1">Cooldown: {battleCooldown}s</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Boss Details */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-amber-500 mb-4">Boss Information</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-slate-400 text-sm mb-1">Weapon</div>
                  <div className="text-slate-200">{boss.weapon}</div>
                </div>

                {boss.rangedWeapon && boss.rangedWeapon !== 'None' && (
                  <div className="p-3 bg-slate-700/30 rounded">
                    <div className="text-slate-400 text-sm mb-1">Ranged Weapon</div>
                    <div className="text-slate-200">{boss.rangedWeapon}</div>
                  </div>
                )}

                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-slate-400 text-sm mb-1">Magic</div>
                  <div className="text-purple-400">{boss.magic}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-slate-400 text-sm mb-1">Round Time Limit</div>
                  <div className="text-amber-400">{boss.timeLimit}</div>
                </div>

                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-slate-400 text-sm mb-1">Max Shield</div>
                  <div className="text-red-400">{boss.shield.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}