import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, Star, Key, Flame, Droplet, Trophy, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { getItemById } from '../lib/itemsData';
import { addInventoryItem } from '../lib/inventoryData';

interface RewardScreenProps {
  tier: number;
  onContinue: () => void;
}

interface Reward {
  itemId: string;
  quantity: number;
}

export function RewardScreen({ tier, onContinue }: RewardScreenProps) {
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Generate rewards on mount
  useEffect(() => {
    setRewards(generateRewards());
  }, [tier]);

  // Generate rewards based on tier
  const generateRewards = (): Reward[] => {
    const newRewards: Reward[] = [];
    
    // Verified Gems (always given) - Rare rewards from bosses
    let verifiedGemsAmount = 0;
    switch (tier) {
      case 1:
        verifiedGemsAmount = Math.floor(Math.random() * 200) + 100; // 100-300 gems
        break;
      case 2:
        verifiedGemsAmount = Math.floor(Math.random() * 400) + 400; // 400-800 gems
        break;
      case 3:
        verifiedGemsAmount = Math.floor(Math.random() * 1000) + 1000; // 1000-2000 gems
        break;
      case 4:
        verifiedGemsAmount = Math.floor(Math.random() * 2000) + 3000; // 3000-5000 gems
        break;
    }
    newRewards.push({ itemId: 'verified-gems', quantity: verifiedGemsAmount });
    
    // Shadow Coins (always given) - For weapon upgrades
    let coinsAmount = 0;
    switch (tier) {
      case 1:
        coinsAmount = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 coins
        break;
      case 2:
        coinsAmount = Math.floor(Math.random() * 5000) + 5000; // 5000-10000 coins
        break;
      case 3:
        coinsAmount = Math.floor(Math.random() * 10000) + 10000; // 10000-20000 coins
        break;
      case 4:
        coinsAmount = Math.floor(Math.random() * 20000) + 20000; // 20000-40000 coins
        break;
    }
    newRewards.push({ itemId: 'coins', quantity: coinsAmount });
    
    // Keys (always given) - More keys for higher tiers
    newRewards.push({ itemId: 'steel-keys', quantity: Math.floor(Math.random() * 3) + 2 + tier });
    
    // Charges
    if (tier >= 1) {
      newRewards.push({ itemId: 'minor-charge', quantity: Math.floor(Math.random() * 5) + 3 });
    }
    if (tier >= 2) {
      newRewards.push({ itemId: 'medium-charge', quantity: Math.floor(Math.random() * 3) + 2 });
    }
    if (tier >= 3) {
      newRewards.push({ itemId: 'large-charge', quantity: Math.floor(Math.random() * 2) + 1 });
    }
    
    // Elixirs (random)
    const elixirPool = ['steel-hedgehog', 'crag', 'healing-vine', 'magic-source'];
    if (tier >= 3) {
      elixirPool.push('phoenix', 'explosive-vigor');
    }
    if (tier >= 4) {
      elixirPool.push('star-clarity');
    }
    
    const numElixirs = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numElixirs; i++) {
      const randomElixir = elixirPool[Math.floor(Math.random() * elixirPool.length)];
      newRewards.push({ itemId: randomElixir, quantity: Math.floor(Math.random() * 2) + 1 });
    }
    
    // Shards (higher tiers)
    if (tier >= 2) {
      newRewards.push({ itemId: 'monk-shards', quantity: Math.floor(Math.random() * 10) + 5 });
    }
    if (tier >= 3) {
      newRewards.push({ itemId: 'sentinel-shards', quantity: Math.floor(Math.random() * 8) + 3 });
    }
    if (tier >= 4) {
      newRewards.push({ itemId: 'neo-wanderer-shards', quantity: Math.floor(Math.random() * 5) + 2 });
    }
    
    return newRewards;
  };

  const handleOpenChest = () => {
    // Add rewards to inventory
    rewards.forEach(reward => {
      addInventoryItem(reward.itemId, reward.quantity);
    });
    
    setShowRewards(true);
  };

  const getItemIcon = (itemId: string) => {
    if (itemId.includes('gem')) return <Gem className="size-8 text-cyan-400" />;
    if (itemId.includes('coin')) return <Trophy className="size-8 text-yellow-400" />;
    if (itemId.includes('key')) return <Key className="size-8 text-amber-400" />;
    if (itemId.includes('charge')) return <Flame className="size-8 text-purple-400" />;
    if (itemId.includes('shard')) return <Star className="size-8 text-amber-400" />;
    return <Droplet className="size-8 text-blue-400" />;
  };

  const getChestColor = () => {
    switch (tier) {
      case 1: return 'from-amber-700 to-amber-900';
      case 2: return 'from-purple-700 to-purple-900';
      case 3: return 'from-slate-600 to-slate-800';
      case 4: return 'from-cyan-600 to-cyan-800';
      default: return 'from-amber-700 to-amber-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-b from-amber-900/40 to-slate-900 border-amber-500/50 max-w-3xl w-full p-8">
        {!showRewards ? (
          /* Chest Animation */
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-amber-500 mb-2">Victory!</h2>
              <p className="text-slate-400">You've earned a reward chest!</p>
            </div>

            <motion.div
              className={`w-48 h-48 mx-auto rounded-lg bg-gradient-to-br ${getChestColor()} border-4 border-amber-500 flex items-center justify-center mb-6 cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChest}
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                  '0 0 40px rgba(251, 191, 36, 0.8)',
                  '0 0 20px rgba(251, 191, 36, 0.5)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="text-center">
                <Trophy className="size-20 text-amber-300 mx-auto mb-2" />
                <Badge className="bg-amber-500 text-white">Tier {tier}</Badge>
              </div>
            </motion.div>

            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white text-lg h-14 px-8"
              onClick={handleOpenChest}
            >
              <Sparkles className="size-5 mr-2" />
              Open Chest
            </Button>
          </motion.div>
        ) : (
          /* Rewards Display */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-amber-500 mb-2">Rewards Obtained!</h2>
              <Badge className="bg-amber-500 text-white">Tier {tier} Boss Chest</Badge>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
              {rewards.map((reward, index) => {
                const item = getItemById(reward.itemId);
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-amber-500/30 p-4 hover:border-amber-500 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center mb-2">
                          {getItemIcon(reward.itemId)}
                        </div>
                        <div className="text-slate-200 text-sm mb-1">{item?.name}</div>
                        <Badge className="bg-amber-500 text-white">
                          x{reward.quantity}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Continue Button */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white h-14"
              onClick={onContinue}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}