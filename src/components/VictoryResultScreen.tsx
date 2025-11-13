import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trophy, TrendingUp, Target, Swords, Award, Crown, Star } from 'lucide-react';
import { motion } from 'motion/react';
import exampleImage from 'figma:asset/af21d067747c2dec8058c414d4e8d10ba0d24a4e.png';
import { PlayerLevelBadge } from './PlayerLevelBadge';
import { RATING_LEVELS } from '../lib/playerStatsData';

interface VictoryResultScreenProps {
  position: number;
  playerDamage: number;
  totalRaidDamage: number;
  bossName: string;
  rounds: number;
  onContinue: () => void;
}

export function VictoryResultScreen({ 
  position, 
  playerDamage, 
  totalRaidDamage,
  bossName,
  rounds,
  onContinue 
}: VictoryResultScreenProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Generate fake leaderboard
  const leaderboard = Array.from({ length: 3 }, (_, i) => {
    if (i === position - 1) {
      return { rank: i + 1, damage: playerDamage };
    }
    const baseDamage = playerDamage * (1 - (Math.abs(i - (position - 1)) * 0.3));
    return { 
      rank: i + 1, 
      damage: Math.floor(baseDamage + Math.random() * 1000) 
    };
  }).sort((a, b) => b.damage - a.damage);

  // Import stats from localStorage
  const getStats = () => {
    const stored = localStorage.getItem('playerStats');
    if (stored) {
      const stats = JSON.parse(stored);
      return {
        rating: stats.rating || 1250,
        bestRating: stats.bestRating || 1250,
        level: stats.level || 1,
        totalRaids: stats.totalRaids || 0,
        totalVictories: stats.totalVictories || 0,
        totalDamage: stats.totalDamage || 0,
        totalRounds: stats.totalRounds || 0,
        firstPlaceFinishes: stats.firstPlaceFinishes || 0
      };
    }
    return {
      rating: 1250,
      bestRating: 1250,
      level: 1,
      totalRaids: 0,
      totalVictories: 0,
      totalDamage: 0,
      totalRounds: 0,
      firstPlaceFinishes: 0
    };
  };

  const stats = getStats();
  const winRate = stats.totalRaids > 0 ? ((stats.totalVictories / stats.totalRaids) * 100).toFixed(1) : '0.0';
  const avgDmgPer10Rnd = stats.totalRounds > 0 ? Math.floor((stats.totalDamage / stats.totalRounds) * 10) : 0;
  
  // Get level name
  const levelInfo = RATING_LEVELS.find(l => l.level === stats.level);
  const levelName = levelInfo?.name || 'Novice';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url(${exampleImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        className="relative z-10 max-w-4xl w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          {/* You Win! */}
          <motion.h1
            className="text-white mb-8"
            style={{ 
              fontSize: '72px',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              fontWeight: 'bold'
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            You win!
          </motion.h1>

          {/* Victory Stats */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Victory */}
            <div className="flex items-center justify-between text-white" style={{ fontSize: '36px' }}>
              <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>VICTORY</span>
              <div className="flex items-center gap-3">
                <Trophy className="size-10 text-amber-400" style={{ filter: 'drop-shadow(0 2px 10px rgba(251, 191, 36, 0.8))' }} />
                <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {leaderboard[0]?.damage.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Your Position */}
            <div className="flex items-center justify-between text-white" style={{ fontSize: '36px' }}>
              <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>YOUR POSITION #{position}</span>
              <div className="flex items-center gap-3">
                <Trophy className="size-10 text-amber-400" style={{ filter: 'drop-shadow(0 2px 10px rgba(251, 191, 36, 0.8))' }} />
                <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {leaderboard[position - 1]?.damage.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Damage */}
            <div className="flex items-center justify-between text-white" style={{ fontSize: '36px' }}>
              <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>TOTAL DAMAGE</span>
              <div className="flex items-center gap-3">
                <Trophy className="size-10 text-amber-400" style={{ filter: 'drop-shadow(0 2px 10px rgba(251, 191, 36, 0.8))' }} />
                <span style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {leaderboard[2]?.damage.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Total Score */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <div className="flex items-center justify-center gap-4">
              <Trophy 
                className="text-amber-400" 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  filter: 'drop-shadow(0 4px 20px rgba(251, 191, 36, 0.8))'
                }} 
              />
              <div className="text-white" style={{ 
                fontSize: '96px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                fontWeight: 'bold'
              }}>
                {totalRaidDamage.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Player Stats Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-amber-500/30 p-6 text-left">
              <h3 className="text-amber-400 mb-4 text-center flex items-center justify-center gap-2">
                <Award className="size-6" />
                Your Performance Stats
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Best Rating */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <TrendingUp className="size-4" />
                    <span className="text-xs">Best Rating</span>
                  </div>
                  <div className="text-white text-xl">{stats.bestRating}</div>
                </div>

                {/* Avg Damage per 10 Rounds */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <Target className="size-4" />
                    <span className="text-xs">Avg DMG/10Rnd</span>
                  </div>
                  <div className="text-white text-xl">{avgDmgPer10Rnd.toLocaleString()}</div>
                </div>

                {/* Total Raids */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Swords className="size-4" />
                    <span className="text-xs">Total Raids</span>
                  </div>
                  <div className="text-white text-xl">{stats.totalRaids}</div>
                </div>

                {/* Victory Count */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <Trophy className="size-4" />
                    <span className="text-xs">Victory</span>
                  </div>
                  <div className="text-white text-xl">{stats.totalVictories}</div>
                </div>

                {/* Win Rate */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Award className="size-4" />
                    <span className="text-xs">Win Rate</span>
                  </div>
                  <div className="text-white text-xl">{winRate}%</div>
                </div>

                {/* First Place */}
                <div className="bg-slate-800/50 p-3 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Crown className="size-4" />
                    <span className="text-xs">First Place</span>
                  </div>
                  <div className="text-white text-xl">{stats.firstPlaceFinishes}</div>
                </div>
              </div>

              {/* Rating Increase Notice */}
              {stats.rating > stats.bestRating - 100 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                  className="mt-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-center gap-2 text-amber-300">
                    <TrendingUp className="size-5" />
                    <span>Ranking Updated! Check Season Rewards & Top 20</span>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* OK Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              className="bg-gradient-to-b from-amber-300 to-amber-600 hover:from-amber-400 hover:to-amber-700 text-black px-16 py-6 text-xl border-2 border-amber-800"
              style={{ 
                fontSize: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                minWidth: '200px'
              }}
              onClick={onContinue}
            >
              OK
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}