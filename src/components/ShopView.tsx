import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ShoppingCart, 
  Key, 
  Gem, 
  Flame, 
  Droplet, 
  Star,
  Shield,
  Sword,
  Crown,
  Zap,
  Sparkles,
  Trophy,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';
import { getInventoryItem, addInventoryItem, removeInventoryItem } from '../lib/inventoryData';
import { toast } from 'sonner';
import { ChestOpening, ChestType, ChestReward } from './ChestOpening';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'gems' | 'keys';
  icon: React.ReactNode;
  category: 'keys' | 'elixirs' | 'charges' | 'shards' | 'premium' | 'chests';
  quantity: number;
  discount?: number;
  featured?: boolean;
  chestType?: ChestType;
}

export function ShopView() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [openingChest, setOpeningChest] = useState<ChestType | null>(null);
  const gemsCount = getInventoryItem('verified-gems');
  const keysCount = getInventoryItem('steel-keys');

  const shopItems: ShopItem[] = [
    // Keys Section
    {
      id: 'keys-pack-small',
      name: 'Small Key Pack',
      description: '5 Steel Keys',
      price: 50,
      currency: 'gems',
      icon: <Key className="size-8 text-amber-400" />,
      category: 'keys',
      quantity: 5
    },
    {
      id: 'keys-pack-medium',
      name: 'Medium Key Pack',
      description: '15 Steel Keys',
      price: 120,
      currency: 'gems',
      icon: <Key className="size-8 text-amber-400" />,
      category: 'keys',
      quantity: 15,
      discount: 20
    },
    {
      id: 'keys-pack-large',
      name: 'Large Key Pack',
      description: '50 Steel Keys',
      price: 350,
      currency: 'gems',
      icon: <Key className="size-8 text-amber-400" />,
      category: 'keys',
      quantity: 50,
      discount: 30,
      featured: true
    },

    // Elixirs
    {
      id: 'elixir-steel-hedgehog',
      name: 'Steel Hedgehog',
      description: 'Reflect damage back to attacker',
      price: 30,
      currency: 'gems',
      icon: <Droplet className="size-8 text-blue-400" />,
      category: 'elixirs',
      quantity: 3
    },
    {
      id: 'elixir-healing-vine',
      name: 'Healing Vine',
      description: 'Regenerate health over time',
      price: 40,
      currency: 'gems',
      icon: <Droplet className="size-8 text-green-400" />,
      category: 'elixirs',
      quantity: 3
    },
    {
      id: 'elixir-phoenix',
      name: 'Phoenix',
      description: 'Revive once when defeated',
      price: 80,
      currency: 'gems',
      icon: <Droplet className="size-8 text-orange-400" />,
      category: 'elixirs',
      quantity: 1,
      featured: true
    },

    // Charges
    {
      id: 'charge-minor-pack',
      name: 'Minor Charge Pack',
      description: '10 Minor Charges',
      price: 20,
      currency: 'gems',
      icon: <Flame className="size-8 text-purple-400" />,
      category: 'charges',
      quantity: 10
    },
    {
      id: 'charge-medium-pack',
      name: 'Medium Charge Pack',
      description: '5 Medium Charges',
      price: 35,
      currency: 'gems',
      icon: <Flame className="size-8 text-purple-400" />,
      category: 'charges',
      quantity: 5
    },
    {
      id: 'charge-large-pack',
      name: 'Large Charge Pack',
      description: '3 Large Charges',
      price: 50,
      currency: 'gems',
      icon: <Flame className="size-8 text-purple-400" />,
      category: 'charges',
      quantity: 3
    },

    // Shards
    {
      id: 'shard-monk',
      name: 'Monk Shards',
      description: '20 Monk Shards',
      price: 60,
      currency: 'gems',
      icon: <Star className="size-8 text-cyan-400" />,
      category: 'shards',
      quantity: 20
    },
    {
      id: 'shard-sentinel',
      name: 'Sentinel Shards',
      description: '15 Sentinel Shards',
      price: 80,
      currency: 'gems',
      icon: <Star className="size-8 text-blue-400" />,
      category: 'shards',
      quantity: 15
    },
    {
      id: 'shard-wanderer',
      name: 'Neo Wanderer Shards',
      description: '10 Neo Wanderer Shards',
      price: 100,
      currency: 'gems',
      icon: <Star className="size-8 text-purple-400" />,
      category: 'shards',
      quantity: 10,
      featured: true
    },

    // Premium
    {
      id: 'premium-starter',
      name: 'Starter Pack',
      description: '100 Gems + 10 Keys + 5 Elixirs',
      price: 5,
      currency: 'gems',
      icon: <Crown className="size-8 text-yellow-400" />,
      category: 'premium',
      quantity: 1,
      featured: true
    },
    {
      id: 'premium-vip',
      name: 'VIP Pack',
      description: '500 Gems + 50 Keys + Premium Items',
      price: 20,
      currency: 'gems',
      icon: <Crown className="size-8 text-yellow-400" />,
      category: 'premium',
      quantity: 1,
      featured: true
    },

    // Chests
    {
      id: 'chest-bronze',
      name: 'Bronze Chest',
      description: '3 random items | Common-Epic',
      price: 50,
      currency: 'gems',
      icon: <Trophy className="size-8 text-amber-600" />,
      category: 'chests',
      quantity: 1,
      chestType: 'bronze'
    },
    {
      id: 'chest-silver',
      name: 'Silver Chest',
      description: '4 random items | Rare-Legendary',
      price: 100,
      currency: 'gems',
      icon: <Trophy className="size-8 text-slate-400" />,
      category: 'chests',
      quantity: 1,
      chestType: 'silver',
      discount: 10
    },
    {
      id: 'chest-gold',
      name: 'Gold Chest',
      description: '5 random items | Epic-Legendary',
      price: 200,
      currency: 'gems',
      icon: <Trophy className="size-8 text-yellow-400" />,
      category: 'chests',
      quantity: 1,
      chestType: 'gold',
      featured: true
    },
    {
      id: 'chest-diamond',
      name: 'Diamond Chest',
      description: '6 random items | Epic-Mythic',
      price: 350,
      currency: 'gems',
      icon: <Gem className="size-8 text-cyan-400" />,
      category: 'chests',
      quantity: 1,
      chestType: 'diamond',
      featured: true
    },
    {
      id: 'chest-legendary',
      name: 'Legendary Chest',
      description: '8 random items | Legendary-Mythic',
      price: 500,
      currency: 'gems',
      icon: <Crown className="size-8 text-purple-400" />,
      category: 'chests',
      quantity: 1,
      chestType: 'legendary',
      featured: true
    }
  ];

  const handlePurchase = (item: ShopItem) => {
    const currentGems = getInventoryItem('verified-gems');

    if (item.currency === 'gems') {
      if (currentGems >= item.price) {
        // Deduct gems
        removeInventoryItem('verified-gems', item.price);
        
        // Handle chest opening
        if (item.id.includes('chest')) {
          setOpeningChest(item.chestType!);
        } else {
          // Add purchased item
          if (item.id.includes('keys')) {
            addInventoryItem('steel-keys', item.quantity);
          } else if (item.id.includes('elixir')) {
            addInventoryItem(item.id.replace('elixir-', ''), item.quantity);
          } else if (item.id.includes('charge')) {
            const chargeType = item.id.includes('minor') ? 'minor-charge' : 
                              item.id.includes('medium') ? 'medium-charge' : 'large-charge';
            addInventoryItem(chargeType, item.quantity);
          } else if (item.id.includes('shard')) {
            const shardType = item.id.replace('shard-', '') + '-shards';
            addInventoryItem(shardType, item.quantity);
          }
          toast.success(`Purchased ${item.name}!`);
        }

        setRefreshKey(prev => prev + 1);
      } else {
        toast.error('Not enough gems!');
      }
    }
  };

  const handleChestRewards = (rewards: ChestReward[]) => {
    // Add all rewards to inventory
    rewards.forEach(reward => {
      addInventoryItem(reward.itemId, reward.quantity);
    });
    
    setRefreshKey(prev => prev + 1);
    toast.success(`Received ${rewards.length} items from chest!`);
  };

  const renderShopItems = (category: string) => {
    const items = shopItems.filter(item => item.category === category);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-slate-800/50 border-slate-700 p-4 hover:border-amber-500 transition-all ${
              item.featured ? 'ring-2 ring-amber-500 border-amber-500' : ''
            }`}>
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-slate-200 flex items-center gap-2">
                        {item.name}
                        {item.featured && <Sparkles className="size-4 text-amber-400" />}
                      </div>
                      <div className="text-slate-400 text-xs">{item.description}</div>
                    </div>
                  </div>
                </div>

                {/* Discount Badge */}
                {item.discount && (
                  <Badge className="bg-red-500 text-white">
                    -{item.discount}% OFF
                  </Badge>
                )}

                {/* Price and Purchase */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gem className="size-5 text-cyan-400" />
                    <span className="text-slate-200">
                      {item.discount 
                        ? Math.floor(item.price * (1 - item.discount / 100))
                        : item.price}
                    </span>
                    {item.discount && (
                      <span className="text-slate-500 line-through text-sm">{item.price}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="size-4 mr-1" />
                    Buy
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-amber-500 mb-2">Shadow Shop</h2>
        <p className="text-slate-400">Purchase items and power-ups</p>
      </div>

      {/* Currency Display */}
      <div className="flex justify-center gap-6">
        <Card className="bg-gradient-to-r from-cyan-900/30 to-cyan-800/30 border-cyan-500/30 px-6 py-3">
          <div className="flex items-center gap-3">
            <Gem className="size-6 text-cyan-400" />
            <div>
              <div className="text-slate-400 text-xs">Gems</div>
              <div className="text-cyan-400">{gemsCount.toLocaleString()}</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border-amber-500/30 px-6 py-3">
          <div className="flex items-center gap-3">
            <Key className="size-6 text-amber-400" />
            <div>
              <div className="text-slate-400 text-xs">Keys</div>
              <div className="text-amber-400">{keysCount.toLocaleString()}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Shop Tabs */}
      <Tabs defaultValue="chests" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
          <TabsTrigger value="chests" className="data-[state=active]:bg-amber-600">
            <Trophy className="size-4 mr-2" />
            Chests
          </TabsTrigger>
          <TabsTrigger value="keys" className="data-[state=active]:bg-amber-600">
            <Key className="size-4 mr-2" />
            Keys
          </TabsTrigger>
          <TabsTrigger value="elixirs" className="data-[state=active]:bg-amber-600">
            <Droplet className="size-4 mr-2" />
            Elixirs
          </TabsTrigger>
          <TabsTrigger value="charges" className="data-[state=active]:bg-amber-600">
            <Flame className="size-4 mr-2" />
            Charges
          </TabsTrigger>
          <TabsTrigger value="shards" className="data-[state=active]:bg-amber-600">
            <Star className="size-4 mr-2" />
            Shards
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-amber-600">
            <Crown className="size-4 mr-2" />
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chests" className="mt-6">
          <div className="bg-gradient-to-r from-purple-900/20 to-amber-900/20 border-2 border-amber-500/50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="size-8 text-amber-400" />
              <div>
                <h3 className="text-amber-400">Gacha Chests</h3>
                <p className="text-slate-400 text-sm">Open chests to receive random items with guaranteed rarity!</p>
              </div>
            </div>
          </div>
          {renderShopItems('chests')}
        </TabsContent>

        <TabsContent value="keys" className="mt-6">
          {renderShopItems('keys')}
        </TabsContent>

        <TabsContent value="elixirs" className="mt-6">
          {renderShopItems('elixirs')}
        </TabsContent>

        <TabsContent value="charges" className="mt-6">
          {renderShopItems('charges')}
        </TabsContent>

        <TabsContent value="shards" className="mt-6">
          {renderShopItems('shards')}
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          <div className="bg-gradient-to-r from-purple-900/20 to-amber-900/20 border-2 border-amber-500/50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="size-8 text-amber-400" />
              <div>
                <h3 className="text-amber-400">Premium Packs</h3>
                <p className="text-slate-400 text-sm">Limited time offers - Best value!</p>
              </div>
            </div>
          </div>
          {renderShopItems('premium')}
        </TabsContent>
      </Tabs>

      {/* Chest Opening */}
      {openingChest && (
        <ChestOpening
          chestType={openingChest}
          onClose={() => setOpeningChest(null)}
          onRewardsReceived={handleChestRewards}
        />
      )}
    </div>
  );
}