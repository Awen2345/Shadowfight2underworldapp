import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skull, Clock, Shield as ShieldIcon, CheckCircle, XCircle, User } from 'lucide-react';
import type { Boss } from '../lib/bossData';
import type { RaidPlayer } from './MatchmakingPopup';
import { Progress } from './ui/progress';

interface LobbyScreenProps {
  boss: Boss;
  players: RaidPlayer[];
  onStartRaid: () => void;
  onCancel: () => void;
}

export function LobbyScreen({ boss, players, onStartRaid, onCancel }: LobbyScreenProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const allReady = players.every(p => p.isReady);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Players List */}
          <div>
            <Card className="bg-gradient-to-b from-amber-900/20 to-slate-800/50 border-amber-500/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-amber-500">Raid Party</h2>
                <Badge className="bg-amber-500 text-white">
                  {players.length} / {boss.maxPlayers} Players
                </Badge>
              </div>

              {/* Players List */}
              <div className="space-y-2">
                {players.map((player, index) => (
                  <Card 
                    key={player.id}
                    className="bg-slate-800/50 border-slate-700 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-amber-500 text-xl min-w-[30px]">
                          {index + 1}
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          player.isBot ? 'bg-slate-600' : 'bg-green-600'
                        }`}>
                          <User className="size-4 text-white" />
                        </div>
                        <div>
                          <div className="text-slate-200 flex items-center gap-2">
                            {player.name}
                            {!player.isBot && (
                              <Badge className="bg-green-500 text-white text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-slate-400 text-sm">
                            Level {player.level}
                          </div>
                        </div>
                      </div>
                      
                      {player.isReady ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : (
                        <XCircle className="size-5 text-red-500" />
                      )}
                    </div>
                  </Card>
                ))}

                {/* Empty slots */}
                {Array.from({ length: boss.maxPlayers - players.length }).map((_, i) => (
                  <Card 
                    key={`empty-${i}`}
                    className="bg-slate-800/30 border-slate-700/50 p-4 opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-600 text-xl min-w-[30px]">
                        {players.length + i + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="size-4 text-slate-500" />
                      </div>
                      <div className="text-slate-500">Waiting for player...</div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Side - Boss Info */}
          <div>
            <Card className="bg-gradient-to-b from-red-900/30 to-slate-800/50 border-red-500/30 p-6">
              {/* Boss Image/Icon */}
              <div className="text-center mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center border-4 border-red-500 mb-4">
                  <Skull className="size-24 text-red-200" />
                </div>
                <h2 className="text-red-400 mb-2">{boss.name}</h2>
                <Badge className="bg-red-500 text-white">Tier {boss.tier}</Badge>
              </div>

              {/* Boss Stats */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <ShieldIcon className="size-4" />
                      <span>Shield</span>
                    </div>
                    <span className="text-red-400">{boss.shield.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-700" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="size-4" />
                    <span>Time Limit</span>
                  </div>
                  <span className="text-amber-400">{boss.timeLimit}</span>
                </div>

                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-slate-400 text-sm mb-1">Equipment</div>
                  <div className="text-slate-200">{boss.weapon}</div>
                  {boss.rangedWeapon && boss.rangedWeapon !== 'None' && (
                    <div className="text-slate-300 text-sm">{boss.rangedWeapon}</div>
                  )}
                  <div className="text-purple-400 text-sm">{boss.magic}</div>
                </div>
              </div>

              {/* Start Battle Countdown */}
              <Card className="bg-slate-800/50 border-amber-500/50 p-4 mb-4">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-2">Battle starts in</div>
                  <div className="text-3xl text-amber-500">{countdown}s</div>
                </div>
              </Card>

              {/* Fight Button */}
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14"
                onClick={onStartRaid}
                disabled={!allReady}
              >
                <Skull className="size-5 mr-2" />
                FIGHT!
              </Button>

              {!allReady && (
                <p className="text-center text-slate-400 text-sm mt-2">
                  Waiting for all players to be ready...
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}