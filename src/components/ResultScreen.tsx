import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skull, Swords, Zap, Timer, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

interface ResultScreenProps {
  isVictory: boolean;
  regularDamage: number;
  chargeDamage: number;
  totalDamage: number;
  timeUsed: number;
  maxTime: number;
  onContinue: () => void;
}

export function ResultScreen({ 
  isVictory, 
  regularDamage, 
  chargeDamage, 
  totalDamage,
  timeUsed,
  maxTime,
  onContinue 
}: ResultScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className={`
        max-w-2xl w-full p-8
        ${isVictory 
          ? 'bg-gradient-to-b from-green-900/50 to-slate-900 border-green-500' 
          : 'bg-gradient-to-b from-red-900/50 to-slate-900 border-red-500'
        }
      `}>
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-4 ${
            isVictory 
              ? 'bg-green-500/20 border-green-500' 
              : 'bg-red-500/20 border-red-500'
          }`}>
            {isVictory ? (
              <Swords className="size-12 text-green-400" />
            ) : (
              <Skull className="size-12 text-red-400" />
            )}
          </div>
          
          <h2 className={`mb-2 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
            {isVictory ? 'Round Complete!' : 'Round Failed!'}
          </h2>
          
          <p className="text-slate-400">
            {isVictory 
              ? 'You dealt significant damage to the boss!' 
              : 'Time ran out! But you still dealt damage.'
            }
          </p>
        </div>

        {/* Damage Breakdown */}
        <div className="space-y-4 mb-6">
          <h3 className="text-amber-500 text-center mb-4">Damage Report</h3>
          
          {/* Regular Damage */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Swords className="size-4 text-blue-400" />
                <span className="text-slate-300">Regular Damage</span>
              </div>
              <span className="text-blue-400">{regularDamage.toLocaleString()}</span>
            </div>
            <Progress 
              value={(regularDamage / totalDamage) * 100} 
              className="h-2 bg-slate-700"
            />
          </Card>

          {/* Charge Damage */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-purple-400" />
                <span className="text-slate-300">Charge Damage</span>
              </div>
              <span className="text-purple-400">{chargeDamage.toLocaleString()}</span>
            </div>
            <Progress 
              value={(chargeDamage / totalDamage) * 100} 
              className="h-2 bg-slate-700"
            />
          </Card>

          {/* Total Damage */}
          <Card className="bg-slate-800/50 border-amber-500/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-amber-400" />
                <span className="text-amber-400">Total Damage</span>
              </div>
              <span className="text-amber-400 text-xl">{totalDamage.toLocaleString()}</span>
            </div>
          </Card>

          {/* Time Used */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="size-4 text-slate-400" />
                <span className="text-slate-300">Time Used</span>
              </div>
              <span className="text-slate-300">{formatTime(timeUsed)} / {formatTime(maxTime)}</span>
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <Button
          className={`w-full h-14 ${
            isVictory 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-slate-600 hover:bg-slate-700'
          } text-white`}
          onClick={onContinue}
        >
          Continue
        </Button>
      </Card>
    </div>
  );
}