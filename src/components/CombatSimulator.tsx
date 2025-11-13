import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Swords,
  Heart,
  Shield,
  Zap,
  Flame,
  Skull,
  Sparkles,
  Clock,
  X,
  Play,
  Pause,
  RotateCcw,
  Info
} from 'lucide-react';
import {
  CombatEntity,
  CombatLog,
  AttackResult,
  getPlayerActiveEnchantments,
  calculateFinalDamage,
  applyDOTEffects,
  applyHealingBuffs,
  applyPrecision,
  applyOverheat,
  applyPoisoning,
  applyBloodrage,
  applyLifesteal,
  applyBleeding,
  applyFrenzy,
  applyTempestRage,
  applyCrimsonCorruption,
  applyKarma
} from '../lib/combatSystem';
import { getEquippedItem } from '../lib/playerEquipment';
import { allEquipment } from '../lib/equipmentData';

export function CombatSimulator({ onClose }: { onClose: () => void }) {
  const [player, setPlayer] = useState<CombatEntity>({
    id: 'player',
    name: 'Shadow',
    maxHealth: 1000,
    currentHealth: 1000,
    damage: 50,
    defense: 30,
    magicPower: 40,
    rangedDamage: 35,
    activeBuffs: [],
    activeDebuffs: [],
    enchantmentStacks: new Map()
  });

  const [enemy, setEnemy] = useState<CombatEntity>({
    id: 'enemy',
    name: 'Boss',
    maxHealth: 1500,
    currentHealth: 1500,
    damage: 45,
    defense: 25,
    magicPower: 30,
    rangedDamage: 30,
    activeBuffs: [],
    activeDebuffs: [],
    enchantmentStacks: new Map()
  });

  const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [round, setRound] = useState(1);
  const [comboHits, setComboHits] = useState(0);
  const [activeEnchantments, setActiveEnchantments] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    // Load player's equipped enchantments
    const enchantments = getPlayerActiveEnchantments();
    setActiveEnchantments(enchantments);

    // Apply equipment stats
    const weaponId = getEquippedItem('weapon');
    const armorId = getEquippedItem('armor');
    
    if (weaponId) {
      const weapon = allEquipment.find(e => e.id === weaponId);
      if (weapon?.stats.damage) {
        setPlayer(prev => ({
          ...prev,
          damage: prev.damage + weapon.stats.damage
        }));
      }
    }

    if (armorId) {
      const armor = allEquipment.find(e => e.id === armorId);
      if (armor?.stats.defense) {
        setPlayer(prev => ({
          ...prev,
          defense: prev.defense + armor.stats.defense
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      handlePlayerAttack();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlay, player, enemy]);

  useEffect(() => {
    // Apply DOT and healing every second
    const interval = setInterval(() => {
      // Apply DOT to both entities
      const playerDOT = applyDOTEffects(player);
      const enemyDOT = applyDOTEffects(enemy);

      // Apply healing to both entities
      const playerHealing = applyHealingBuffs(player);
      const enemyHealing = applyHealingBuffs(enemy);

      if (playerDOT > 0 || playerHealing > 0) {
        setPlayer(prev => ({
          ...prev,
          currentHealth: Math.max(0, Math.min(prev.maxHealth, prev.currentHealth - playerDOT + playerHealing))
        }));
      }

      if (enemyDOT > 0 || enemyHealing > 0) {
        setEnemy(prev => ({
          ...prev,
          currentHealth: Math.max(0, Math.min(prev.maxHealth, prev.currentHealth - enemyDOT + enemyHealing))
        }));
      }

      // Update buff/debuff durations
      setPlayer(prev => ({
        ...prev,
        activeBuffs: prev.activeBuffs.filter(b => {
          b.remainingDuration--;
          return b.remainingDuration > 0;
        }),
        activeDebuffs: prev.activeDebuffs.filter(d => {
          d.remainingDuration--;
          return d.remainingDuration > 0;
        })
      }));

      setEnemy(prev => ({
        ...prev,
        activeBuffs: prev.activeBuffs.filter(b => {
          b.remainingDuration--;
          return b.remainingDuration > 0;
        }),
        activeDebuffs: prev.activeDebuffs.filter(d => {
          d.remainingDuration--;
          return d.remainingDuration > 0;
        })
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [player, enemy]);

  const addLog = (message: string, result?: AttackResult) => {
    const log: CombatLog = {
      timestamp: Date.now(),
      attacker: 'Shadow',
      defender: 'Boss',
      action: 'attack',
      result: result || {
        damage: 0,
        isCritical: false,
        isBlocked: false,
        healed: 0,
        buffsApplied: [],
        debuffsApplied: [],
        specialEffects: []
      },
      message
    };

    setCombatLogs(prev => [...prev.slice(-20), log]);
  };

  const handlePlayerAttack = () => {
    if (player.currentHealth <= 0 || enemy.currentHealth <= 0) {
      setIsAutoPlay(false);
      return;
    }

    let baseDamage = player.damage;
    let totalDamage = baseDamage;
    let healed = 0;
    const effects: string[] = [];
    let enchantmentUsed = '';

    // Check for weapon enchantments
    const weaponEnchantment = activeEnchantments.get('weapon');
    
    if (weaponEnchantment) {
      switch (weaponEnchantment.id) {
        case 'precision': {
          const result = applyPrecision(player, enemy, baseDamage, weaponEnchantment.power);
          totalDamage = result.damage;
          if (result.isCritical) {
            effects.push('💥 Critical Hit! (Precision)');
            enchantmentUsed = 'Precision';
          }
          break;
        }
        case 'overheat': {
          const buff = applyOverheat(player, weaponEnchantment.power, true);
          if (buff) {
            setPlayer(prev => ({
              ...prev,
              activeBuffs: [...prev.activeBuffs, buff]
            }));
            totalDamage *= 2;
            effects.push('🔥 Overheat! Next strike +200% damage');
            enchantmentUsed = 'Overheat';
          }
          break;
        }
        case 'poisoning': {
          const debuff = applyPoisoning(enemy, totalDamage, weaponEnchantment.power, false);
          if (debuff) {
            setEnemy(prev => ({
              ...prev,
              activeDebuffs: [...prev.activeDebuffs, debuff]
            }));
            effects.push('☠️ Poisoned! -3% HP/sec for 5s');
            enchantmentUsed = 'Poisoning';
          }
          break;
        }
        case 'bloodrage': {
          const result = applyBloodrage(player, baseDamage, weaponEnchantment.power);
          totalDamage = result.damage;
          if (result.enchantmentTriggered) {
            healed = result.healed;
            effects.push(...result.specialEffects);
            enchantmentUsed = 'Bloodrage';
          }
          break;
        }
        case 'lifesteal': {
          const healAmount = applyLifesteal(player, totalDamage, weaponEnchantment.power, false);
          if (healAmount > 0) {
            healed = healAmount;
            effects.push('🧛 Lifesteal! Healed +' + Math.floor(healAmount) + ' HP');
            enchantmentUsed = 'Lifesteal';
          }
          break;
        }
        case 'bleeding': {
          const debuff = applyBleeding(enemy, totalDamage, weaponEnchantment.power, false);
          if (debuff) {
            setEnemy(prev => ({
              ...prev,
              activeDebuffs: [...prev.activeDebuffs, debuff]
            }));
            effects.push('🩸 Bleeding! -6% HP/sec for 5s');
            enchantmentUsed = 'Bleeding';
          }
          break;
        }
        case 'frenzy': {
          const buff = applyFrenzy(player, weaponEnchantment.power);
          if (buff) {
            setPlayer(prev => ({
              ...prev,
              activeBuffs: [...prev.activeBuffs, buff]
            }));
            effects.push('😤 Frenzy! +150% damage for 5s');
            enchantmentUsed = 'Frenzy';
          }
          break;
        }
        case 'tempest-rage': {
          const result = applyTempestRage(player, true);
          if (result.damage > 1) {
            totalDamage *= result.damage;
            effects.push('⚡ Tempest Rage UNLEASHED! +350% damage!');
            enchantmentUsed = 'Tempest Rage';
          } else if (result.stacks > 0) {
            effects.push(`⚡ Tempest Rage charging... (${result.stacks}/4)`);
          }
          break;
        }
        case 'crimson-corruption': {
          const dotPercent = applyCrimsonCorruption(enemy, totalDamage);
          if (dotPercent > 0) {
            effects.push(`🔴 Crimson Corruption! -${dotPercent}% HP/sec`);
            enchantmentUsed = 'Crimson Corruption';
          }
          break;
        }
        case 'karma': {
          const newCombo = comboHits + 1;
          setComboHits(newCombo);
          const result = applyKarma(player, newCombo);
          if (result.buffType === 'damage') {
            const multipliers = [1.5, 2, 3];
            totalDamage *= multipliers[result.level - 1];
            effects.push(`☯️ Karma (Yang)! +${(multipliers[result.level - 1] - 1) * 100}% damage`);
            enchantmentUsed = 'Karma';
          } else if (result.buffType === 'heal') {
            const healPercents = [10, 15, 25];
            healed = (player.maxHealth * healPercents[result.level - 1]) / 100;
            effects.push(`☯️ Karma (Yin)! Healed ${healPercents[result.level - 1]}%`);
            enchantmentUsed = 'Karma';
          }
          break;
        }
      }
    }

    // Apply armor enchantments on taking hit (simulated counter)
    const armorEnchantment = activeEnchantments.get('armor');
    if (armorEnchantment && Math.random() > 0.7) {
      // 30% chance enemy attacks back
      const enemyDamage = enemy.damage;
      
      if (armorEnchantment.id === 'rejuvenation') {
        const buff = {
          id: `rejuvenation-${Date.now()}`,
          name: 'Rejuvenation',
          type: 'heal' as const,
          multiplier: 0.03,
          duration: 5,
          remainingDuration: 5
        };
        setPlayer(prev => ({
          ...prev,
          activeBuffs: [...prev.activeBuffs, buff]
        }));
        effects.push('💚 Rejuvenation! +3% HP/sec for 5s');
      }
    }

    // Update combo counter
    setComboHits(prev => prev + 1);

    // Apply final damage
    const newEnemyHealth = Math.max(0, enemy.currentHealth - totalDamage);
    const newPlayerHealth = Math.min(player.maxHealth, player.currentHealth + healed);

    setEnemy(prev => ({
      ...prev,
      currentHealth: newEnemyHealth
    }));

    setPlayer(prev => ({
      ...prev,
      currentHealth: newPlayerHealth
    }));

    // Log the attack
    const logMessage = `Shadow attacks! ${Math.floor(totalDamage)} damage${healed > 0 ? ` | Healed ${Math.floor(healed)} HP` : ''}${enchantmentUsed ? ` | ${enchantmentUsed}` : ''}`;
    addLog(logMessage);

    if (effects.length > 0) {
      effects.forEach(effect => addLog(effect));
    }

    // Check for victory
    if (newEnemyHealth <= 0) {
      addLog('🎉 VICTORY! Boss defeated!');
      setIsAutoPlay(false);
    }

    setRound(prev => prev + 1);
  };

  const handleReset = () => {
    setPlayer({
      id: 'player',
      name: 'Shadow',
      maxHealth: 1000,
      currentHealth: 1000,
      damage: 50,
      defense: 30,
      magicPower: 40,
      rangedDamage: 35,
      activeBuffs: [],
      activeDebuffs: [],
      enchantmentStacks: new Map()
    });

    setEnemy({
      id: 'enemy',
      name: 'Boss',
      maxHealth: 1500,
      currentHealth: 1500,
      damage: 45,
      defense: 25,
      magicPower: 30,
      rangedDamage: 30,
      activeBuffs: [],
      activeDebuffs: [],
      enchantmentStacks: new Map()
    });

    setCombatLogs([]);
    setRound(1);
    setComboHits(0);
    setIsAutoPlay(false);
  };

  const renderHealthBar = (entity: CombatEntity) => {
    const healthPercent = (entity.currentHealth / entity.maxHealth) * 100;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white">{entity.name}</span>
          <span className="text-slate-300">
            {Math.floor(entity.currentHealth)} / {entity.maxHealth}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4 relative overflow-hidden">
          <motion.div
            className={`h-4 rounded-full ${
              healthPercent > 50 ? 'bg-green-500' :
              healthPercent > 25 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
            {Math.floor(healthPercent)}%
          </div>
        </div>
      </div>
    );
  };

  const renderBuffsDebuffs = (entity: CombatEntity) => {
    return (
      <div className="flex flex-wrap gap-2">
        {entity.activeBuffs.map((buff, idx) => (
          <Badge key={idx} className="bg-green-600 text-white text-xs">
            ✨ {buff.name} ({buff.remainingDuration}s)
          </Badge>
        ))}
        {entity.activeDebuffs.map((debuff, idx) => (
          <Badge key={idx} className="bg-red-600 text-white text-xs">
            💀 {debuff.name} ({debuff.remainingDuration}s)
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1 flex items-center gap-2">
              <Swords className="size-6 text-red-500" />
              Combat Simulator
            </h1>
            <p className="text-slate-400">Test your enchantments in battle</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">
            <X className="size-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Side */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border-blue-500/50 p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-blue-500">
                <Shield className="size-10 text-blue-400" />
              </div>
              <h2 className="text-blue-400 mb-2">Shadow (You)</h2>
            </div>

            {renderHealthBar(player)}

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">⚔️ Damage:</span>
                <span className="text-white">{player.damage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">🛡️ Defense:</span>
                <span className="text-white">{player.defense}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">🔥 Combo:</span>
                <span className="text-amber-400">{comboHits} hits</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-slate-300 text-sm mb-2">Active Effects:</h3>
              {renderBuffsDebuffs(player)}
              {player.activeBuffs.length === 0 && player.activeDebuffs.length === 0 && (
                <p className="text-slate-500 text-sm">No active effects</p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-slate-300 text-sm mb-2">Equipped Enchantments:</h3>
              {Array.from(activeEnchantments.entries()).map(([category, enchantment]) => (
                <Badge key={category} className="bg-purple-900/50 border-purple-500 text-purple-300 text-xs mr-2 mb-2">
                  {enchantment.imageIcon} {enchantment.name}
                </Badge>
              ))}
              {activeEnchantments.size === 0 && (
                <p className="text-slate-500 text-sm">No enchantments equipped</p>
              )}
            </div>
          </Card>

          {/* Combat Log */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-amber-500 flex items-center gap-2">
                <Flame className="size-5" />
                Round {round}
              </h3>
              <div className="flex gap-2">
                {!isAutoPlay ? (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsAutoPlay(true)}
                    disabled={player.currentHealth <= 0 || enemy.currentHealth <= 0}
                  >
                    <Play className="size-4 mr-1" />
                    Auto
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => setIsAutoPlay(false)}
                  >
                    <Pause className="size-4 mr-1" />
                    Pause
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayerAttack}
                  disabled={isAutoPlay || player.currentHealth <= 0 || enemy.currentHealth <= 0}
                >
                  <Swords className="size-4 mr-1" />
                  Attack
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 text-red-400"
                  onClick={handleReset}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto space-y-2">
              <AnimatePresence>
                {combatLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-700/50 p-3 rounded border border-slate-600 text-sm"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="size-3" />
                      <span>{log.message}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {combatLogs.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-slate-500">Press Attack to begin combat</p>
                </div>
              )}
            </div>
          </Card>

          {/* Enemy Side */}
          <Card className="bg-gradient-to-br from-red-900/30 to-slate-800/50 border-red-500/50 p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-500">
                <Skull className="size-10 text-red-400" />
              </div>
              <h2 className="text-red-400 mb-2">Boss</h2>
            </div>

            {renderHealthBar(enemy)}

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">⚔️ Damage:</span>
                <span className="text-white">{enemy.damage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">🛡️ Defense:</span>
                <span className="text-white">{enemy.defense}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-slate-300 text-sm mb-2">Active Effects:</h3>
              {renderBuffsDebuffs(enemy)}
              {enemy.activeBuffs.length === 0 && enemy.activeDebuffs.length === 0 && (
                <p className="text-slate-500 text-sm">No active effects</p>
              )}
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-900/20 border-blue-500/50 p-4">
          <div className="flex gap-3">
            <Info className="size-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="mb-2">This simulator tests your equipped enchantments in real combat scenarios.</p>
              <ul className="space-y-1 text-slate-400 text-xs">
                <li>• Enchantments trigger based on their power level and chance</li>
                <li>• DOT effects (poison, bleeding) tick every second</li>
                <li>• Buffs and debuffs show remaining duration</li>
                <li>• Combo counter affects Karma and other combo-based enchantments</li>
                <li>• Mythical enchantments require full equipment set to activate</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
