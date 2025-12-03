import { useState, useEffect, useCallback } from 'react';
import type { Boss } from '../lib/bossData';
import { MatchmakingPopup, type RaidPlayer } from './MatchmakingPopup';
import { EnhancedLobbyScreen } from './EnhancedLobbyScreen';
import { RaidBattleScreen } from './RaidBattleScreen';
import { ResultScreen } from './ResultScreen';
import { VictoryResultScreen } from './VictoryResultScreen';
import { RewardScreen } from './RewardScreen';
import { calculateRatingGain } from '../lib/playerStatsData';
import { useGameContext } from '../lib/context/GameContext';
import type { RaidResult } from '../lib/playerStatsData';

type RaidPhase = 'matchmaking' | 'lobby' | 'battle' | 'result' | 'victory' | 'reward' | 'defeat';

interface RaidOrchestratorProps {
  boss: Boss;
  onRaidComplete: () => void;
  onCancel: () => void;
}

export function RaidOrchestrator({ boss, onRaidComplete, onCancel }: RaidOrchestratorProps) {
  const [phase, setPhase] = useState<RaidPhase>('matchmaking');
  const [players, setPlayers] = useState<RaidPlayer[]>([]);
  const { updateAfterRaid } = useGameContext();
  
  // Boss state
  const [currentBossShield, setCurrentBossShield] = useState(boss.shield);
  const [bossTimerRemaining, setBossTimerRemaining] = useState(boss.raidDuration); // Use boss-specific raid duration
  
  // Battle state
  const [battleCooldown, setBattleCooldown] = useState(0);
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const [selectedElixir, setSelectedElixir] = useState<string | null>(null);
  
  // Round results
  const [lastRoundDamage, setLastRoundDamage] = useState({ regular: 0, charge: 0, total: 0 });
  const [lastRoundTime, setLastRoundTime] = useState(45);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [playerPlacement, setPlayerPlacement] = useState(1);

  // Boss timer countdown (in lobby)
  useEffect(() => {
    if (phase === 'lobby' && bossTimerRemaining > 0) {
      const timer = setInterval(() => {
        setBossTimerRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, bossTimerRemaining]);

  // Battle cooldown
  useEffect(() => {
    if (battleCooldown > 0 && phase === 'lobby') {
      const timer = setInterval(() => {
        setBattleCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [battleCooldown, phase]);

  const handleMatchmakingComplete = useCallback((foundPlayers: RaidPlayer[]) => {
    setPlayers(foundPlayers);
    setPhase('lobby');
  }, []);

  const handleStartBattle = useCallback((charge: string | null, elixir: string | null) => {
    setSelectedCharge(charge);
    setSelectedElixir(elixir);
    setPhase('battle');
  }, []);

  const handleBattleComplete = useCallback((
    regularDamage: number, 
    chargeDamage: number, 
    timeUsed: number,
    remainingShield: number,
    isFinalBattleWon: boolean
  ) => {
    const totalDamage = regularDamage + chargeDamage;
    
    setLastRoundDamage({ 
      regular: regularDamage, 
      charge: chargeDamage, 
      total: totalDamage 
    });
    setLastRoundTime(timeUsed);
    setTotalDamageDealt(prev => prev + totalDamage);
    setTotalRounds(prev => prev + 1);
    setCurrentBossShield(remainingShield);
    
    // Check if final battle was won
    if (isFinalBattleWon) {
      // Generate random placement (1-3)
      const placement = Math.floor(Math.random() * 3) + 1;
      setPlayerPlacement(placement);
      
      // Calculate rating gain
      const ratingGained = calculateRatingGain(
        totalDamageDealt + totalDamage,
        boss.shield,
        placement,
        true
      );
      
      // Update player stats
      const raidResult: RaidResult = {
        victory: true,
        damageDealt: totalDamageDealt + totalDamage,
        rounds: totalRounds + 1,
        ratingGained,
        placement,
        bossName: boss.name,
        timestamp: new Date()
      };
      updateAfterRaid(raidResult);
      
      setPhase('victory');
    } else {
      // Show round result and return to lobby
      // Set cooldown based on time used
      const timeLimit = parseInt(boss.timeLimit);
      if (timeUsed >= timeLimit) {
        setBattleCooldown(15); // Full time = 15s cooldown
      } else {
        setBattleCooldown(60); // Quick death = 60s cooldown
      }
      
      setPhase('result');
    }
  }, [boss.timeLimit, boss.shield, boss.name, totalDamageDealt, totalRounds, updateAfterRaid]);

  const handleResultContinue = useCallback(() => {
    setPhase('lobby');
  }, []);

  const handleVictoryContinue = useCallback(() => {
    setPhase('reward');
  }, []);

  const handleRewardContinue = useCallback(() => {
    onRaidComplete();
  }, [onRaidComplete]);

  const handleTimerExpired = useCallback(() => {
    // Boss timer ran out - raid failed
    // Show defeat screen with total damage dealt
    setPhase('defeat');
  }, []);

  const handleDefeatContinue = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <>
      {phase === 'matchmaking' && (
        <MatchmakingPopup
          boss={boss}
          onMatchmakingComplete={handleMatchmakingComplete}
          onCancel={onCancel}
        />
      )}

      {phase === 'lobby' && (
        <EnhancedLobbyScreen
          boss={boss}
          players={players}
          currentBossShield={currentBossShield}
          bossTimerRemaining={bossTimerRemaining}
          onStartBattle={handleStartBattle}
          onTimerExpired={handleTimerExpired}
          onExit={onCancel}
          battleCooldown={battleCooldown}
        />
      )}

      {phase === 'battle' && (
        <RaidBattleScreen
          boss={boss}
          players={players}
          charge={selectedCharge}
          elixir={selectedElixir}
          currentBossShield={currentBossShield}
          onBattleComplete={handleBattleComplete}
          onClose={() => {
            setPhase('lobby');
          }}
        />
      )}

      {phase === 'result' && (
        <ResultScreen
          isVictory={lastRoundTime >= 45 || lastRoundDamage.total > 0}
          regularDamage={lastRoundDamage.regular}
          chargeDamage={lastRoundDamage.charge}
          totalDamage={lastRoundDamage.total}
          timeUsed={lastRoundTime}
          maxTime={45}
          onContinue={handleResultContinue}
        />
      )}

      {phase === 'victory' && (
        <VictoryResultScreen
          position={playerPlacement}
          playerDamage={totalDamageDealt}
          totalRaidDamage={Math.floor(totalDamageDealt * (1 + Math.random() * 0.5))}
          bossName={boss.name}
          rounds={totalRounds}
          onContinue={handleVictoryContinue}
        />
      )}

      {phase === 'reward' && (
        <RewardScreen
          tier={boss.tier}
          onContinue={handleRewardContinue}
        />
      )}

      {phase === 'defeat' && (
        <ResultScreen
          isVictory={false}
          regularDamage={0}
          chargeDamage={0}
          totalDamage={totalDamageDealt}
          timeUsed={600}
          maxTime={600}
          onContinue={handleDefeatContinue}
        />
      )}
    </>
  );
}