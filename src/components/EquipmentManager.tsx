import { EnchantmentForge } from './EnchantmentForge';
import { getInventoryItem, removeInventoryItem } from '../lib/inventoryData';
import { motion } from 'motion/react';
import { CombatSimulator } from './CombatSimulator';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sword, 
  Shield, 
  CircleDot,
  Zap,
  Wand2,
  Lock,
  Check,
  Clock,
  ChevronRight,
  Gem,
  Coins,
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Settings,
  ChevronUp,
  ChevronDown,
  Star,
  Sparkles,
  Swords,
  Flame
} from 'lucide-react';
import { 
  Equipment, 
  EquipmentCategory,
  getEquipmentByCategory,
  getRarityColor,
  getEquipmentById
} from '../lib/equipmentData';
import {
  hasEquipment,
  addEquipment,
  equipItem,
  getEquippedItem,
  getOwnedEquipmentLevel,
  startUpgrade,
  completeUpgrade,
  speedUpUpgrade,
  getRemainingTime,
  getUpgradeProgress,
  getPlayerLevel,
  getMaxPlayerLevel,
  setPlayerLevel,
  ownedEquipment,
  getEquipmentCurrentStats,
  getUpgradeCostForLevel
} from '../lib/playerEquipment';

interface EquipmentManagerProps {
  onClose: () => void;
}

export function EquipmentManager({ onClose }: EquipmentManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory>('weapon');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'browse' | 'detail'>('browse');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLevelControl, setShowLevelControl] = useState(false);
  const [showEnchantmentForge, setShowEnchantmentForge] = useState(false);
  const [showCombatSimulator, setShowCombatSimulator] = useState(false);

  const playerLevel = getPlayerLevel();
  const maxLevel = getMaxPlayerLevel();

  // Auto-refresh for upgrade timers - MOVED BEFORE CONDITIONAL RETURNS
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      
      // Check for completed upgrades
      ownedEquipment.forEach(eq => {
        if (eq.isUpgrading && eq.upgradeEndTime && Date.now() >= eq.upgradeEndTime) {
          completeUpgrade(eq.equipmentId);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show combat simulator
  if (showCombatSimulator) {
    return <CombatSimulator onClose={() => {
      setShowCombatSimulator(false);
      setRefreshKey(prev => prev + 1);
    }} />;
  }

  // Show enchantment forge
  if (showEnchantmentForge) {
    return <EnchantmentForge onClose={() => {
      setShowEnchantmentForge(false);
      setRefreshKey(prev => prev + 1);
    }} />;
  }

  const handleLevelUp = () => {
    if (playerLevel >= maxLevel) {
      alert('Already at max level!');
      return;
    }

    const upgradeCost = playerLevel * 1000; // Cost increases with level
    const currentCoins = getInventoryItem('coins');

    if (currentCoins < upgradeCost) {
      alert(`Not enough Shadow Coins! Need ${upgradeCost.toLocaleString()} coins.`);
      return;
    }

    removeInventoryItem('coins', upgradeCost);
    setPlayerLevel(playerLevel + 1);
    setRefreshKey(prev => prev + 1);
    alert(`Level up! You are now Level ${playerLevel + 1}!`);
  };

  const handleLevelDown = () => {
    if (playerLevel <= 1) {
      alert('Already at minimum level!');
      return;
    }

    setPlayerLevel(playerLevel - 1);
    setRefreshKey(prev => prev + 1);
  };

  const getCategoryIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'weapon': return <Sword className="size-5" />;
      case 'armor': return <Shield className="size-5" />;
      case 'helm': return <CircleDot className="size-5" />;
      case 'ranged': return <Zap className="size-5" />;
      case 'magic': return <Wand2 className="size-5" />;
    }
  };

  const handleBuyEquipment = (equipment: Equipment) => {
    const cost = equipment.cost;
    const costType = equipment.costType;

    if (costType === 'coins') {
      const currentCoins = getInventoryItem('coins');
      if (currentCoins < cost) {
        alert('Not enough Shadow Coins!');
        return;
      }
      removeInventoryItem('coins', cost);
    } else {
      const currentGems = getInventoryItem('verified-gems');
      if (currentGems < cost) {
        alert('Not enough Verified Gems!');
        return;
      }
      removeInventoryItem('verified-gems', cost);
    }

    addEquipment(equipment.id);
    setRefreshKey(prev => prev + 1);
    alert(`${equipment.name} purchased successfully!`);
  };

  const handleEquip = (equipment: Equipment) => {
    equipItem(equipment.id, equipment.category);
    setRefreshKey(prev => prev + 1);
    alert(`${equipment.name} equipped!`);
  };

  const handleStartUpgrade = (equipment: Equipment) => {
    if (!equipment.upgradeCost || !equipment.upgradeTime) {
      alert('This equipment cannot be upgraded!');
      return;
    }

    const currentCoins = getInventoryItem('coins');
    if (currentCoins < equipment.upgradeCost) {
      alert('Not enough Shadow Coins for upgrade!');
      return;
    }

    removeInventoryItem('coins', equipment.upgradeCost);
    
    // Calculate speed up cost (10% of upgrade time in unverified gems)
    const speedUpCost = Math.ceil(equipment.upgradeTime * 0.1);
    
    startUpgrade(equipment.id, equipment.upgradeTime, speedUpCost);
    setRefreshKey(prev => prev + 1);
    alert(`Upgrade started! It will take ${Math.ceil(equipment.upgradeTime / 60)} minutes.`);
  };

  const handleSpeedUp = (equipment: Equipment) => {
    const owned = ownedEquipment.find(eq => eq.equipmentId === equipment.id);
    if (!owned) return;

    const speedUpCost = Math.ceil((equipment.upgradeTime || 0) * 0.1);
    const currentUnverifiedGems = getInventoryItem('unverified-gems');
    
    if (currentUnverifiedGems < speedUpCost) {
      alert('Not enough Unverified Gems to speed up!');
      return;
    }

    removeInventoryItem('unverified-gems', speedUpCost);
    speedUpUpgrade(equipment.id);
    setRefreshKey(prev => prev + 1);
    alert(`${equipment.name} upgrade completed instantly!`);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const renderEquipmentCard = (equipment: Equipment) => {
    const isOwned = hasEquipment(equipment.id);
    const isEquipped = getEquippedItem(equipment.category) === equipment.id;
    const currentLevel = getOwnedEquipmentLevel(equipment.id);
    const isLocked = equipment.levelRequired > playerLevel;
    const owned = ownedEquipment.find(eq => eq.equipmentId === equipment.id);
    const isUpgrading = owned?.isUpgrading || false;
    const remainingTime = getRemainingTime(equipment.id);
    const progress = getUpgradeProgress(equipment.id);

    return (
      <motion.div
        key={equipment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => {
          setSelectedEquipment(equipment);
          setViewMode('detail');
        }}
      >
        <Card className={`bg-slate-800/50 border-2 ${getRarityColor(equipment.rarity)} p-4 cursor-pointer relative overflow-hidden ${isLocked ? 'opacity-50' : ''}`}>
          {isEquipped && (
            <Badge className="absolute top-2 right-2 bg-green-600">
              <Check className="size-3 mr-1" />
              Equipped
            </Badge>
          )}

          {isLocked && (
            <div className="absolute top-2 left-2">
              <Lock className="size-5 text-red-400" />
            </div>
          )}

          <div className="flex items-start gap-3">
            {/* Icon Placeholder */}
            <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center">
              {getCategoryIcon(equipment.category)}
            </div>

            <div className="flex-1">
              <h3 className="text-white mb-1">{equipment.name}</h3>
              
              <div className="flex gap-2 mb-2">
                <Badge className="bg-slate-700 text-slate-300 text-xs">
                  Lv.{equipment.levelRequired}
                </Badge>
                {currentLevel > 0 && (
                  <Badge className="bg-blue-600 text-xs">
                    Owned Lv.{currentLevel}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="text-xs text-slate-400 mb-2">
                {equipment.stats.damage && <div>⚔️ Damage: {equipment.stats.damage}</div>}
                {equipment.stats.defense && <div>🛡️ Defense: {equipment.stats.defense}</div>}
                {equipment.stats.magicPower && <div>✨ Magic: {equipment.stats.magicPower}</div>}
              </div>

              {equipment.enchantment && (
                <Badge className="bg-purple-900/50 text-purple-300 border border-purple-500 text-xs">
                  {equipment.enchantment}
                </Badge>
              )}

              {/* Upgrade Progress */}
              {isUpgrading && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="size-3 text-amber-400" />
                    <span className="text-xs text-amber-400">
                      Upgrading... {formatTime(remainingTime)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {!isOwned && !isLocked && equipment.cost > 0 && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyEquipment(equipment);
                    }}
                  >
                    <ShoppingCart className="size-3 mr-1" />
                    {equipment.cost} {equipment.costType === 'coins' ? '🪙' : '💎'}
                  </Button>
                )}

                {isOwned && !isEquipped && !isLocked && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquip(equipment);
                    }}
                  >
                    Equip
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderDetailView = () => {
    if (!selectedEquipment) return null;

    const isOwned = hasEquipment(selectedEquipment.id);
    const isEquipped = getEquippedItem(selectedEquipment.category) === selectedEquipment.id;
    const currentLevel = getOwnedEquipmentLevel(selectedEquipment.id);
    const maxEquipmentLevel = selectedEquipment.maxLevel || 52;
    const isLocked = selectedEquipment.levelRequired > playerLevel;
    const owned = ownedEquipment.find(eq => eq.equipmentId === selectedEquipment.id);
    const isUpgrading = owned?.isUpgrading || false;
    const remainingTime = getRemainingTime(selectedEquipment.id);
    const canUpgrade = isOwned && !isUpgrading && selectedEquipment.upgradeCost && currentLevel < maxEquipmentLevel;
    const isMaxLevel = currentLevel >= maxEquipmentLevel;

    // Calculate current stats based on level
    const currentStats = getEquipmentCurrentStats(
      selectedEquipment.id,
      selectedEquipment.stats,
      selectedEquipment.statsPerLevel
    );

    // Calculate next level stats
    const nextLevelStats: any = { ...currentStats };
    if (selectedEquipment.statsPerLevel && !isMaxLevel) {
      if (selectedEquipment.statsPerLevel.damage) 
        nextLevelStats.damage = (nextLevelStats.damage || 0) + selectedEquipment.statsPerLevel.damage;
      if (selectedEquipment.statsPerLevel.defense) 
        nextLevelStats.defense = (nextLevelStats.defense || 0) + selectedEquipment.statsPerLevel.defense;
      if (selectedEquipment.statsPerLevel.unarmedDamage) 
        nextLevelStats.unarmedDamage = (nextLevelStats.unarmedDamage || 0) + selectedEquipment.statsPerLevel.unarmedDamage;
      if (selectedEquipment.statsPerLevel.magicPower) 
        nextLevelStats.magicPower = (nextLevelStats.magicPower || 0) + selectedEquipment.statsPerLevel.magicPower;
    }

    // Calculate current level upgrade cost
    const currentUpgradeCost = getUpgradeCostForLevel(selectedEquipment.upgradeCost || 0, currentLevel);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col"
      >
        <Button
          variant="ghost"
          className="mb-4 w-fit text-slate-400"
          onClick={() => setViewMode('browse')}
        >
          ← Back to List
        </Button>

        <Card className={`bg-slate-800/50 border-2 ${getRarityColor(selectedEquipment.rarity)} p-6 flex-1 overflow-y-auto`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-white mb-2">{selectedEquipment.name}</h2>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-slate-700 text-slate-300">
                  Requires Lv.{selectedEquipment.levelRequired}
                </Badge>
                <Badge className={getRarityColor(selectedEquipment.rarity)}>
                  {selectedEquipment.rarity}
                </Badge>
                {currentLevel > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Equipment Lv.{currentLevel} / {maxEquipmentLevel}
                  </Badge>
                )}
                {isMaxLevel && (
                  <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600">
                    ⭐ MAX LEVEL
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-24 h-24 rounded-xl bg-slate-700/50 flex items-center justify-center">
              {getCategoryIcon(selectedEquipment.category)}
            </div>
          </div>

          {/* Description */}
          {selectedEquipment.description && (
            <div className="mb-6">
              <p className="text-slate-400 text-sm">{selectedEquipment.description}</p>
            </div>
          )}

          {/* Equipment Level Progress (only show if owned) */}
          {isOwned && (
            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300">Equipment Level Progress</span>
                <span className="text-white">{currentLevel} / {maxEquipmentLevel}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentLevel / maxEquipmentLevel) * 100}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {isMaxLevel ? '✨ Fully Upgraded!' : `${maxEquipmentLevel - currentLevel} levels remaining`}
              </div>
            </Card>
          )}

          {/* Current Stats */}
          <div className="mb-4">
            <h3 className="text-white mb-3">
              {isOwned ? 'Current Stats' : 'Base Stats'}
              {isOwned && currentLevel > 1 && (
                <span className="text-sm text-blue-400 ml-2">(Level {currentLevel})</span>
              )}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {currentStats.damage !== undefined && (
                <Card className="bg-slate-900/50 p-4 border border-red-500/30">
                  <div className="text-slate-400 text-sm mb-1">⚔️ Damage</div>
                  <div className="text-white text-2xl">{currentStats.damage}</div>
                  {isOwned && currentLevel > 1 && selectedEquipment.statsPerLevel?.damage && (
                    <div className="text-xs text-green-400 mt-1">
                      +{selectedEquipment.statsPerLevel.damage * (currentLevel - 1)} from upgrades
                    </div>
                  )}
                </Card>
              )}
              {currentStats.defense !== undefined && (
                <Card className="bg-slate-900/50 p-4 border border-blue-500/30">
                  <div className="text-slate-400 text-sm mb-1">🛡️ Defense</div>
                  <div className="text-white text-2xl">{currentStats.defense}</div>
                  {isOwned && currentLevel > 1 && selectedEquipment.statsPerLevel?.defense && (
                    <div className="text-xs text-green-400 mt-1">
                      +{selectedEquipment.statsPerLevel.defense * (currentLevel - 1)} from upgrades
                    </div>
                  )}
                </Card>
              )}
              {currentStats.unarmedDamage !== undefined && (
                <Card className="bg-slate-900/50 p-4 border border-orange-500/30">
                  <div className="text-slate-400 text-sm mb-1">👊 Unarmed Damage</div>
                  <div className="text-white text-2xl">{currentStats.unarmedDamage}</div>
                  {isOwned && currentLevel > 1 && selectedEquipment.statsPerLevel?.unarmedDamage && (
                    <div className="text-xs text-green-400 mt-1">
                      +{selectedEquipment.statsPerLevel.unarmedDamage * (currentLevel - 1)} from upgrades
                    </div>
                  )}
                </Card>
              )}
              {currentStats.magicPower !== undefined && (
                <Card className="bg-slate-900/50 p-4 border border-purple-500/30">
                  <div className="text-slate-400 text-sm mb-1">✨ Magic Power</div>
                  <div className="text-white text-2xl">{currentStats.magicPower}</div>
                  {isOwned && currentLevel > 1 && selectedEquipment.statsPerLevel?.magicPower && (
                    <div className="text-xs text-green-400 mt-1">
                      +{selectedEquipment.statsPerLevel.magicPower * (currentLevel - 1)} from upgrades
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>

          {/* Next Level Preview (only show if can upgrade) */}
          {canUpgrade && !isUpgrading && (
            <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/50 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <ChevronUp className="size-5 text-green-400" />
                <span className="text-green-300">Next Level Stats (Lv.{currentLevel + 1})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {nextLevelStats.damage !== undefined && (
                  <div>
                    <div className="text-slate-400 text-xs">Damage</div>
                    <div className="text-white flex items-center gap-1">
                      {currentStats.damage} → <span className="text-green-400">{nextLevelStats.damage}</span>
                      <span className="text-xs text-green-400">+{selectedEquipment.statsPerLevel?.damage}</span>
                    </div>
                  </div>
                )}
                {nextLevelStats.defense !== undefined && (
                  <div>
                    <div className="text-slate-400 text-xs">Defense</div>
                    <div className="text-white flex items-center gap-1">
                      {currentStats.defense} → <span className="text-green-400">{nextLevelStats.defense}</span>
                      <span className="text-xs text-green-400">+{selectedEquipment.statsPerLevel?.defense}</span>
                    </div>
                  </div>
                )}
                {nextLevelStats.unarmedDamage !== undefined && (
                  <div>
                    <div className="text-slate-400 text-xs">Unarmed</div>
                    <div className="text-white flex items-center gap-1">
                      {currentStats.unarmedDamage} → <span className="text-green-400">{nextLevelStats.unarmedDamage}</span>
                      <span className="text-xs text-green-400">+{selectedEquipment.statsPerLevel?.unarmedDamage}</span>
                    </div>
                  </div>
                )}
                {nextLevelStats.magicPower !== undefined && (
                  <div>
                    <div className="text-slate-400 text-xs">Magic Power</div>
                    <div className="text-white flex items-center gap-1">
                      {currentStats.magicPower} → <span className="text-green-400">{nextLevelStats.magicPower}</span>
                      <span className="text-xs text-green-400">+{selectedEquipment.statsPerLevel?.magicPower}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Enchantment */}
          {selectedEquipment.enchantment && (
            <Card className="bg-purple-900/20 border border-purple-500/50 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="size-5 text-purple-400" />
                <span className="text-purple-300">Enchantment</span>
              </div>
              <div className="text-white">{selectedEquipment.enchantment}</div>
              {selectedEquipment.abilityStats && (
                <div className="text-purple-400 text-sm mt-1">
                  Ability Stats: {selectedEquipment.abilityStats}
                </div>
              )}
            </Card>
          )}

          {/* Upgrade Section */}
          {isUpgrading && (
            <Card className="bg-amber-900/20 border border-amber-500/50 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-amber-400" />
                  <span className="text-amber-300">Upgrading to Level {currentLevel + 1}...</span>
                </div>
                <span className="text-amber-400">{formatTime(remainingTime)}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${getUpgradeProgress(selectedEquipment.id)}%` }}
                />
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSpeedUp(selectedEquipment)}
              >
                <Zap className="size-4 mr-2" />
                Speed Up ({Math.ceil((selectedEquipment.upgradeTime || 0) * 0.1)} Unverified Gems)
              </Button>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {!isOwned && !isLocked && selectedEquipment.cost > 0 && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                onClick={() => handleBuyEquipment(selectedEquipment)}
              >
                <ShoppingCart className="size-5 mr-2" />
                Buy for {selectedEquipment.cost} {selectedEquipment.costType === 'coins' ? 'Shadow Coins' : 'Verified Gems'}
              </Button>
            )}

            {isOwned && !isEquipped && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                onClick={() => handleEquip(selectedEquipment)}
              >
                <Check className="size-5 mr-2" />
                Equip
              </Button>
            )}

            {isEquipped && (
              <Badge className="w-full bg-green-600 h-12 flex items-center justify-center">
                <Check className="size-5 mr-2" />
                Currently Equipped
              </Badge>
            )}

            {canUpgrade && (
              <Button
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 h-12"
                onClick={() => handleStartUpgrade(selectedEquipment)}
              >
                <TrendingUp className="size-5 mr-2" />
                Upgrade to Level {currentLevel + 1} ({currentUpgradeCost} Coins, {Math.ceil((selectedEquipment.upgradeTime || 0) / 60)}min)
              </Button>
            )}

            {isMaxLevel && (
              <Card className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/50 p-4">
                <div className="flex items-center gap-2 text-amber-300 justify-center">
                  <Star className="size-5" />
                  <span>⭐ Maximum Level Reached! ⭐</span>
                </div>
              </Card>
            )}

            {isLocked && (
              <Card className="bg-red-900/20 border border-red-500/50 p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <Lock className="size-5" />
                  <span>Requires Player Level {selectedEquipment.levelRequired}</span>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl border-2 border-amber-500/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl mb-1">⚔️ Equipment Manager</h1>
              <p className="text-slate-400">Manage your weapons, armor, and abilities</p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ✕ Close
            </Button>
          </div>

          {/* Player Info */}
          <div className="flex gap-4 mt-4">
            <Card className="bg-slate-800/50 px-4 py-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-400" />
              <span className="text-slate-400 text-sm">Level: </span>
              <span className="text-white">{playerLevel}</span>
            </Card>
            
            {/* Player Level Upgrade System */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/50 px-4 py-3 flex-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Player Level</div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xl">{playerLevel}</span>
                      <span className="text-slate-500 text-sm">/ {maxLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs text-blue-400">{Math.floor((playerLevel / maxLevel) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(playerLevel / maxLevel) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Upgrade Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-900/20 border-red-500/50 hover:bg-red-900/40 h-9 px-3"
                    onClick={handleLevelDown}
                    disabled={playerLevel <= 1}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-9 px-4"
                    onClick={handleLevelUp}
                    disabled={playerLevel >= maxLevel}
                  >
                    <ChevronUp className="size-4 mr-1" />
                    <span>Upgrade ({playerLevel * 1000} 🪙)</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Currency Display */}
          <div className="flex gap-4 mt-3">
            <Card className="bg-slate-800/50 px-4 py-2 flex items-center gap-2">
              <Coins className="size-4 text-yellow-400" />
              <span className="text-slate-400 text-sm">Shadow Coins:</span>
              <span className="text-white">{getInventoryItem('coins').toLocaleString()}</span>
            </Card>
            <Card className="bg-slate-800/50 px-4 py-2 flex items-center gap-2">
              <Gem className="size-4 text-green-400" />
              <span className="text-slate-400 text-sm">Verified Gems:</span>
              <span className="text-white">{getInventoryItem('verified-gems').toLocaleString()}</span>
            </Card>
            <Card className="bg-slate-800/50 px-4 py-2 flex items-center gap-2">
              <Gem className="size-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Unverified Gems:</span>
              <span className="text-white">{getInventoryItem('unverified-gems').toLocaleString()}</span>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {viewMode === 'browse' ? (
            <>
              {/* Category Tabs */}
              <div className="w-64 border-r border-slate-700 p-4 overflow-y-auto">
                <h3 className="text-slate-400 text-sm mb-3">Categories</h3>
                <div className="space-y-2">
                  {(['weapon', 'armor', 'helm', 'ranged', 'magic'] as EquipmentCategory[]).map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className={`w-full justify-start ${selectedCategory === category ? 'bg-amber-600' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {getCategoryIcon(category)}
                      <span className="ml-2 capitalize">{category}</span>
                    </Button>
                  ))}
                </div>

                {/* Special Actions */}
                <div className="mt-6 space-y-2">
                  <h3 className="text-slate-400 text-sm mb-3">Enchantment</h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-purple-900/20 border-purple-500/50 hover:bg-purple-900/40 text-purple-300"
                    onClick={() => setShowEnchantmentForge(true)}
                  >
                    <Sparkles className="size-5" />
                    <span className="ml-2">Forge Enchantments</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-red-900/20 border-red-500/50 hover:bg-red-900/40 text-red-300"
                    onClick={() => setShowCombatSimulator(true)}
                  >
                    <Swords className="size-5" />
                    <span className="ml-2">Combat Simulator</span>
                  </Button>
                </div>
              </div>

              {/* Equipment Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-white text-xl mb-4 capitalize">{selectedCategory}s</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getEquipmentByCategory(selectedCategory).map(equipment => 
                    renderEquipmentCard(equipment)
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              {renderDetailView()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}