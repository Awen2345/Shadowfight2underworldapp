import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  Key, 
  Flame, 
  Droplet, 
  Gem, 
  Star,
  Zap,
  Crown,
  Gift
} from 'lucide-react';

export type ChestType = 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface ChestReward {
  itemId: string;
  itemName: string;
  quantity: number;
  rarity: ItemRarity;
  icon: React.ReactNode;
}

interface ChestOpeningProps {
  chestType: ChestType;
  onClose: () => void;
  onRewardsReceived: (rewards: ChestReward[]) => void;
}

export function ChestOpening({ chestType, onClose, onRewardsReceived }: ChestOpeningProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'revealing' | 'complete'>('closed');
  const [rewards, setRewards] = useState<ChestReward[]>([]);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);

  const getChestConfig = () => {
    switch (chestType) {
      case 'bronze':
        return {
          name: 'Bronze Chest',
          color: 'from-amber-700 to-amber-900',
          borderColor: 'border-amber-500',
          glowColor: 'rgba(251, 191, 36, 0.6)',
          icon: <Trophy className="size-20 text-amber-600" />
        };
      case 'silver':
        return {
          name: 'Silver Chest',
          color: 'from-slate-400 to-slate-600',
          borderColor: 'border-slate-400',
          glowColor: 'rgba(203, 213, 225, 0.6)',
          icon: <Trophy className="size-20 text-slate-300" />
        };
      case 'gold':
        return {
          name: 'Golden Chest',
          color: 'from-yellow-400 to-yellow-600',
          borderColor: 'border-yellow-400',
          glowColor: 'rgba(250, 204, 21, 0.8)',
          icon: <Trophy className="size-20 text-yellow-300" />
        };
      case 'diamond':
        return {
          name: 'Diamond Chest',
          color: 'from-cyan-400 to-blue-600',
          borderColor: 'border-cyan-400',
          glowColor: 'rgba(34, 211, 238, 0.8)',
          icon: <Gem className="size-20 text-cyan-300" />
        };
      case 'legendary':
        return {
          name: 'Legendary Chest',
          color: 'from-purple-500 via-pink-500 to-orange-500',
          borderColor: 'border-purple-400',
          glowColor: 'rgba(168, 85, 247, 0.9)',
          icon: <Crown className="size-20 text-purple-300" />
        };
    }
  };

  const getRarityConfig = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'common':
        return { color: 'text-slate-400', bgColor: 'bg-slate-700', borderColor: 'border-slate-500', label: 'Common' };
      case 'rare':
        return { color: 'text-blue-400', bgColor: 'bg-blue-900/50', borderColor: 'border-blue-500', label: 'Rare' };
      case 'epic':
        return { color: 'text-purple-400', bgColor: 'bg-purple-900/50', borderColor: 'border-purple-500', label: 'Epic' };
      case 'legendary':
        return { color: 'text-orange-400', bgColor: 'bg-orange-900/50', borderColor: 'border-orange-500', label: 'Legendary' };
      case 'mythic':
        return { color: 'text-pink-400', bgColor: 'bg-pink-900/50', borderColor: 'border-pink-500', label: 'Mythic' };
    }
  };

  const generateRewards = (): ChestReward[] => {
    const rewardPool: ChestReward[] = [];
    
    // Define drop rates based on chest type
    const dropRates = {
      bronze: {
        common: 0.70,
        rare: 0.25,
        epic: 0.05,
        legendary: 0,
        mythic: 0
      },
      silver: {
        common: 0.50,
        rare: 0.35,
        epic: 0.13,
        legendary: 0.02,
        mythic: 0
      },
      gold: {
        common: 0.30,
        rare: 0.40,
        epic: 0.23,
        legendary: 0.06,
        mythic: 0.01
      },
      diamond: {
        common: 0.15,
        rare: 0.35,
        epic: 0.35,
        legendary: 0.13,
        mythic: 0.02
      },
      legendary: {
        common: 0.05,
        rare: 0.20,
        epic: 0.40,
        legendary: 0.30,
        mythic: 0.05
      }
    };

    const rates = dropRates[chestType];
    const numRewards = chestType === 'bronze' ? 3 : chestType === 'silver' ? 4 : chestType === 'gold' ? 5 : chestType === 'diamond' ? 6 : 8;

    for (let i = 0; i < numRewards; i++) {
      const rarity = rollRarity(rates);
      const reward = generateRewardByRarity(rarity);
      rewardPool.push(reward);
    }

    return rewardPool;
  };

  const rollRarity = (rates: Record<ItemRarity, number>): ItemRarity => {
    const random = Math.random();
    let cumulative = 0;

    for (const [rarity, rate] of Object.entries(rates)) {
      cumulative += rate;
      if (random <= cumulative) {
        return rarity as ItemRarity;
      }
    }

    return 'common';
  };

  const generateRewardByRarity = (rarity: ItemRarity): ChestReward => {
    const itemPools: Record<ItemRarity, Array<{id: string, name: string, qty: number[], iconType: string}>> = {
      common: [
        { id: 'steel-keys', name: 'Steel Keys', qty: [1, 3], iconType: 'key' },
        { id: 'minor-charge', name: 'Minor Charge', qty: [2, 5], iconType: 'flame' },
        { id: 'steel-hedgehog', name: 'Steel Hedgehog', qty: [1, 2], iconType: 'droplet-blue' },
      ],
      rare: [
        { id: 'steel-keys', name: 'Steel Keys', qty: [5, 10], iconType: 'key' },
        { id: 'medium-charge', name: 'Medium Charge', qty: [2, 4], iconType: 'flame' },
        { id: 'healing-vine', name: 'Healing Vine', qty: [2, 3], iconType: 'droplet-green' },
        { id: 'monk-shards', name: 'Monk Shards', qty: [5, 10], iconType: 'star-cyan' },
      ],
      epic: [
        { id: 'steel-keys', name: 'Steel Keys', qty: [10, 20], iconType: 'key' },
        { id: 'large-charge', name: 'Large Charge', qty: [1, 3], iconType: 'flame' },
        { id: 'phoenix', name: 'Phoenix', qty: [1, 2], iconType: 'droplet-orange' },
        { id: 'sentinel-shards', name: 'Sentinel Shards', qty: [8, 15], iconType: 'star-blue' },
        { id: 'unverified-gems', name: 'Unverified Gems', qty: [20, 50], iconType: 'gem' },
      ],
      legendary: [
        { id: 'steel-keys', name: 'Steel Keys', qty: [30, 50], iconType: 'key' },
        { id: 'large-charge', name: 'Large Charge', qty: [5, 8], iconType: 'flame' },
        { id: 'star-clarity', name: 'Star Clarity', qty: [2, 3], iconType: 'droplet-purple' },
        { id: 'neo-wanderer-shards', name: 'Neo Wanderer Shards', qty: [10, 20], iconType: 'star-purple' },
        { id: 'unverified-gems', name: 'Unverified Gems', qty: [100, 200], iconType: 'gem-unverified' },
        { id: 'verified-gems', name: 'Verified Gems', qty: [5, 15], iconType: 'gem-verified' },
      ],
      mythic: [
        { id: 'steel-keys', name: 'Steel Keys', qty: [100, 150], iconType: 'key' },
        { id: 'large-charge', name: 'Large Charge', qty: [10, 15], iconType: 'flame' },
        { id: 'unverified-gems', name: 'Unverified Gems', qty: [500, 1000], iconType: 'gem-unverified' },
        { id: 'verified-gems', name: 'Verified Gems', qty: [20, 50], iconType: 'gem-verified' },
        { id: 'neo-wanderer-shards', name: 'Neo Wanderer Shards', qty: [50, 100], iconType: 'star-purple' },
      ]
    };

    const getIcon = (iconType: string) => {
      switch (iconType) {
        case 'key': return <Key className="size-8 text-amber-400" />;
        case 'flame': return <Flame className="size-8 text-purple-400" />;
        case 'droplet-blue': return <Droplet className="size-8 text-blue-400" />;
        case 'droplet-green': return <Droplet className="size-8 text-green-400" />;
        case 'droplet-orange': return <Droplet className="size-8 text-orange-400" />;
        case 'droplet-purple': return <Droplet className="size-8 text-purple-400" />;
        case 'star-cyan': return <Star className="size-8 text-cyan-400" />;
        case 'star-blue': return <Star className="size-8 text-blue-400" />;
        case 'star-purple': return <Star className="size-8 text-purple-400" />;
        case 'gem': return <Gem className="size-8 text-cyan-400" />;
        case 'gem-unverified': return <Gem className="size-8 text-gray-400" />;
        case 'gem-verified': return <Gem className="size-8 text-green-400" />;
        default: return <Star className="size-8 text-white" />;
      }
    };

    const pool = itemPools[rarity];
    const item = pool[Math.floor(Math.random() * pool.length)];
    const quantity = Math.floor(Math.random() * (item.qty[1] - item.qty[0] + 1)) + item.qty[0];

    return {
      itemId: item.id,
      itemName: item.name,
      quantity,
      rarity,
      icon: getIcon(item.iconType)
    };
  };

  const handleOpenChest = () => {
    setPhase('opening');
    const generatedRewards = generateRewards();
    
    // Opening animation
    setTimeout(() => {
      setRewards(generatedRewards);
      setPhase('revealing');
      setCurrentRewardIndex(0);
    }, 2000);
  };

  useEffect(() => {
    if (phase === 'revealing' && currentRewardIndex < rewards.length) {
      const timer = setTimeout(() => {
        setCurrentRewardIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else if (phase === 'revealing' && currentRewardIndex >= rewards.length) {
      setTimeout(() => {
        setPhase('complete');
      }, 1000);
    }
  }, [phase, currentRewardIndex, rewards.length]);

  const handleClaim = () => {
    onRewardsReceived(rewards);
    onClose();
  };

  const chestConfig = getChestConfig();

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <AnimatePresence mode="wait">
        {phase === 'closed' && (
          <motion.div
            key="closed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <Card className={`bg-gradient-to-br ${chestConfig.color} ${chestConfig.borderColor} border-4 p-8 max-w-md`}>
              <h2 className="text-white mb-4">{chestConfig.name}</h2>
              
              <motion.div
                className={`w-48 h-48 mx-auto rounded-2xl bg-gradient-to-br ${chestConfig.color} border-4 ${chestConfig.borderColor} flex items-center justify-center mb-6 cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenChest}
                animate={{ 
                  boxShadow: [
                    `0 0 20px ${chestConfig.glowColor}`,
                    `0 0 40px ${chestConfig.glowColor}`,
                    `0 0 20px ${chestConfig.glowColor}`
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {chestConfig.icon}
              </motion.div>

              <Button
                onClick={handleOpenChest}
                className="bg-white text-slate-900 hover:bg-slate-200 text-lg h-14 px-8 w-full"
              >
                <Sparkles className="size-5 mr-2" />
                Open Chest
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                className="mt-3 text-white hover:bg-white/10 w-full"
              >
                Cancel
              </Button>
            </Card>
          </motion.div>
        )}

        {phase === 'opening' && (
          <motion.div
            key="opening"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 0.8, 1.1, 0],
              rotate: [0, -10, 10, -5, 0, 360]
            }}
            transition={{ duration: 2 }}
            className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${chestConfig.color} border-4 ${chestConfig.borderColor} flex items-center justify-center`}
          >
            {chestConfig.icon}
          </motion.div>
        )}

        {phase === 'revealing' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <Card className="bg-slate-900/95 border-amber-500/50 border-2 p-6">
              <h2 className="text-amber-500 text-center mb-6">Opening {chestConfig.name}...</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rewards.map((reward, index) => {
                  const rarityConfig = getRarityConfig(reward.rarity);
                  const isRevealed = index < currentRewardIndex;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotateY: 0 }}
                      animate={isRevealed ? { 
                        scale: [0, 1.2, 1],
                        rotateY: [0, 180, 360]
                      } : { scale: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className={`${rarityConfig.bgColor} border-2 ${rarityConfig.borderColor} p-4 relative overflow-hidden`}>
                        {isRevealed && (
                          <>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                              initial={{ y: '-100%' }}
                              animate={{ y: '100%' }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
                            
                            <div className="text-center relative z-10">
                              <Badge className={`${rarityConfig.bgColor} ${rarityConfig.color} border ${rarityConfig.borderColor} mb-2 text-xs`}>
                                {rarityConfig.label}
                              </Badge>
                              
                              <div className="w-16 h-16 mx-auto rounded-lg bg-slate-800/50 flex items-center justify-center mb-2">
                                {reward.icon}
                              </div>
                              
                              <div className={`${rarityConfig.color} text-sm mb-1`}>
                                {reward.itemName}
                              </div>
                              
                              <Badge className="bg-amber-500 text-white">
                                x{reward.quantity}
                              </Badge>
                            </div>
                          </>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <Card className="bg-gradient-to-b from-amber-900/40 to-slate-900 border-amber-500/50 border-2 p-8">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="size-12 text-amber-400" />
                </motion.div>
                <h2 className="text-amber-500 mb-2">Rewards Obtained!</h2>
                <p className="text-slate-400">You received {rewards.length} items from {chestConfig.name}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-h-[400px] overflow-y-auto">
                {rewards.map((reward, index) => {
                  const rarityConfig = getRarityConfig(reward.rarity);
                  
                  return (
                    <Card key={index} className={`${rarityConfig.bgColor} border-2 ${rarityConfig.borderColor} p-4`}>
                      <div className="text-center">
                        <Badge className={`${rarityConfig.bgColor} ${rarityConfig.color} border ${rarityConfig.borderColor} mb-2 text-xs`}>
                          {rarityConfig.label}
                        </Badge>
                        
                        <div className="w-16 h-16 mx-auto rounded-lg bg-slate-800/50 flex items-center justify-center mb-2">
                          {reward.icon}
                        </div>
                        
                        <div className={`${rarityConfig.color} text-sm mb-1`}>
                          {reward.itemName}
                        </div>
                        
                        <Badge className="bg-amber-500 text-white">
                          x{reward.quantity}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Button
                onClick={handleClaim}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-14"
              >
                <Gift className="size-5 mr-2" />
                Claim All Rewards
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}