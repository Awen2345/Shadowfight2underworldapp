import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Hourglass, Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { Boss } from '../lib/bossData';

interface MatchmakingPopupProps {
  boss: Boss;
  onMatchmakingComplete: (players: RaidPlayer[]) => void;
  onCancel: () => void;
}

export interface RaidPlayer {
  id: string;
  name: string;
  level: number;
  isBot: boolean;
  isReady: boolean;
}

export function MatchmakingPopup({ boss, onMatchmakingComplete, onCancel }: MatchmakingPopupProps) {
  const [playersFound, setPlayersFound] = useState(0);

  useEffect(() => {
    // Simulate finding players
    const interval = setInterval(() => {
      setPlayersFound(prev => {
        if (prev >= boss.maxPlayers) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [boss.maxPlayers]);

  useEffect(() => {
    if (playersFound >= boss.maxPlayers) {
      // Generate players (mix of bots and real player)
      const players: RaidPlayer[] = [
        {
          id: 'player-1',
          name: 'Shadow_Fighter_1000',
          level: 5,
          isBot: false,
          isReady: true
        }
      ];

      // Add bots
      const botNames = ['VALKYRIE', 'MAKITTA', 'TEN', 'ADONIS', 'KENNYS', 'MUKI10', 'STORM', 'BLADE'];
      for (let i = 1; i < boss.maxPlayers; i++) {
        players.push({
          id: `bot-${i}`,
          name: botNames[Math.floor(Math.random() * botNames.length)],
          level: Math.floor(Math.random() * 5) + 3,
          isBot: true,
          isReady: true
        });
      }

      setTimeout(() => {
        onMatchmakingComplete(players);
      }, 500);
    }
  }, [playersFound, boss.maxPlayers, onMatchmakingComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-gradient-to-b from-amber-900/40 to-slate-900 border-amber-500/30 p-8 text-center max-w-md">
        <h2 className="text-amber-500 mb-6">Joining Raid</h2>
        
        {/* Animated Hourglass */}
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Hourglass className="size-16 text-amber-400" />
        </motion.div>

        {/* Players Found */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Users className="size-5" />
            <span>Players Found</span>
          </div>
          <div className="text-3xl text-amber-500">
            {playersFound} / {boss.maxPlayers}
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-6">
          <motion.div
            className="w-2 h-2 bg-amber-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-amber-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-amber-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </Card>
    </div>
  );
}