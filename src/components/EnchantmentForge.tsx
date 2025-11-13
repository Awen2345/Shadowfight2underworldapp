import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Wand2, 
  Flame, 
  Sparkles, 
  Clock, 
  Zap, 
  X,
  Check,
  Lock,
  ChevronRight,
  Info,
  Gem
} from 'lucide-react';
import { 
  allEnchantments, 
  Enchantment, 
  EnchantmentType,
  isEnchantmentAvailableFor,
  getEnchantmentsByType
} from '../lib/enchantmentData';
import {
  startForging,
  completeForging,
  speedUpForging,
  cancelForging,
  getRemainingForgeTime,
  getForgeProgress,
  forgeSlots,
  getEquipmentEnchantment,
  hasAvailableForgeSlot
} from '../lib/enchantmentForging';
import { getInventoryItem, hasEnoughItems, removeInventoryItem } from '../lib/inventoryData';
import { ownedEquipment } from '../lib/playerEquipment';
import { allEquipment } from '../lib/equipmentData';

type ViewMode = 'slots' | 'select-type' | 'select-enchantment' | 'select-equipment';

export function EnchantmentForge({ onClose }: { onClose: () => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('slots');
  const [selectedType, setSelectedType] = useState<EnchantmentType | null>(null);
  const [selectedEnchantment, setSelectedEnchantment] = useState<Enchantment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [time, setTime] = useState(Date.now());

  // Update time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
      
      // Auto-complete finished forgings
      forgeSlots.forEach(slot => {
        if (slot.isForging && slot.endTime && Date.now() >= slot.endTime) {
          completeForging(slot.slotId);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getTypeColor = (type: EnchantmentType): string => {
    switch (type) {
      case 'simple': return 'border-green-500/50 bg-green-900/20';
      case 'medium': return 'border-red-500/50 bg-red-900/20';
      case 'mythical': return 'border-purple-500/50 bg-purple-900/20';
    }
  };

  const getTypeIcon = (type: EnchantmentType) => {
    switch (type) {
      case 'simple': return <Sparkles className="size-5 text-green-400" />;
      case 'medium': return <Flame className="size-5 text-red-400" />;
      case 'mythical': return <Wand2 className="size-5 text-purple-400" />;
    }
  };

  const handleStartForge = (enchantment: Enchantment, equipmentId: string) => {
    if (!selectedSlot) return;

    // Check if have enough orbs
    const requirements = enchantment.requirements;
    if (requirements.greenOrbs && !hasEnoughItems('green-orbs', requirements.greenOrbs)) {
      alert('Not enough Green Shadow Orbs!');
      return;
    }
    if (requirements.redOrbs && !hasEnoughItems('red-orbs', requirements.redOrbs)) {
      alert('Not enough Red Shadow Orbs!');
      return;
    }
    if (requirements.purpleOrbs && !hasEnoughItems('purple-orbs', requirements.purpleOrbs)) {
      alert('Not enough Purple Shadow Orbs!');
      return;
    }

    // Consume orbs
    if (requirements.greenOrbs) removeInventoryItem('green-orbs', requirements.greenOrbs);
    if (requirements.redOrbs) removeInventoryItem('red-orbs', requirements.redOrbs);
    if (requirements.purpleOrbs) removeInventoryItem('purple-orbs', requirements.purpleOrbs);

    // Start forging
    startForging(selectedSlot, enchantment, equipmentId);
    
    // Reset view
    setViewMode('slots');
    setSelectedType(null);
    setSelectedEnchantment(null);
    setSelectedSlot(null);
  };

  const handleSpeedUp = (slotId: string) => {
    const slot = forgeSlots.find(s => s.slotId === slotId);
    if (!slot || !slot.enchantment) return;

    const cost = slot.enchantment.skipCost;
    if (!hasEnoughItems('unverified-gems', cost)) {
      alert('Not enough Unverified Gems!');
      return;
    }

    removeInventoryItem('unverified-gems', cost);
    speedUpForging(slotId);
  };

  // Render forge slots overview
  const renderSlots = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-amber-500 mb-2 flex items-center justify-center gap-2">
          <Wand2 className="size-6" />
          Enchantment Forge
        </h2>
        <p className="text-slate-400">Create powerful enchantments for your equipment</p>
      </div>

      {/* Resources */}
      <Card className="bg-slate-800/50 border-slate-700 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-green-500/50">
              <Sparkles className="size-6 text-green-400" />
            </div>
            <div className="text-slate-400 text-sm mb-1">Green Orbs</div>
            <div className="text-green-400">{getInventoryItem('green-orbs')}</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-red-500/50">
              <Flame className="size-6 text-red-400" />
            </div>
            <div className="text-slate-400 text-sm mb-1">Red Orbs</div>
            <div className="text-red-400">{getInventoryItem('red-orbs')}</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-purple-500/50">
              <Wand2 className="size-6 text-purple-400" />
            </div>
            <div className="text-slate-400 text-sm mb-1">Purple Orbs</div>
            <div className="text-purple-400">{getInventoryItem('purple-orbs')}</div>
          </div>
        </div>
      </Card>

      {/* Forge Slots */}
      <div className="space-y-4">
        <h3 className="text-white flex items-center gap-2">
          <Flame className="size-5" />
          Forge Slots
        </h3>
        {forgeSlots.map(slot => {
          const remaining = getRemainingForgeTime(slot.slotId);
          const progress = getForgeProgress(slot.slotId);

          return (
            <Card 
              key={slot.slotId} 
              className={`p-4 ${slot.isForging ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700'}`}
            >
              {slot.isForging && slot.enchantment ? (
                // Active forging
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{slot.enchantment.imageIcon}</div>
                      <div>
                        <div className="text-white">{slot.enchantment.name}</div>
                        <Badge className={getTypeColor(slot.enchantment.type)}>
                          {slot.enchantment.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-amber-400">
                      {formatTime(remaining)}
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleSpeedUp(slot.slotId)}
                    >
                      <Zap className="size-4 mr-2" />
                      Skip ({slot.enchantment.skipCost} Gems)
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-900/20"
                      onClick={() => cancelForging(slot.slotId)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty slot
                <Button
                  className="w-full h-20 bg-slate-700/50 hover:bg-slate-700 border-2 border-dashed border-slate-600"
                  onClick={() => {
                    setSelectedSlot(slot.slotId);
                    setViewMode('select-type');
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="size-5" />
                    <span>Start Forging</span>
                  </div>
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Info */}
      <Card className="bg-blue-900/20 border-blue-500/50 p-4">
        <div className="flex gap-3">
          <Info className="size-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <p className="mb-2">Enchantments add powerful effects to your equipment.</p>
            <ul className="space-y-1 text-slate-400 text-xs">
              <li>• Simple: 20 min, Green Orbs only</li>
              <li>• Medium: 1h 20min, Green + Red Orbs</li>
              <li>• Mythical: 2 hours, All Orbs required</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render type selection
  const renderTypeSelection = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="text-slate-400"
        onClick={() => setViewMode('slots')}
      >
        ← Back to Forge Slots
      </Button>

      <div className="text-center">
        <h2 className="text-amber-500 mb-2">Select Enchantment Type</h2>
        <p className="text-slate-400">Choose the recipe type you want to forge</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Simple */}
        <Card 
          className="bg-gradient-to-br from-green-900/30 to-slate-800/50 border-green-500/30 p-6 cursor-pointer hover:border-green-400/50 transition-all"
          onClick={() => {
            setSelectedType('simple');
            setViewMode('select-enchantment');
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                <Sparkles className="size-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white mb-1">Simple Recipes</h3>
                <Badge className="bg-green-500 text-white">20 Minutes</Badge>
              </div>
            </div>
            <ChevronRight className="size-6 text-green-400" />
          </div>
          <p className="text-slate-300 text-sm mb-3">
            Basic enchantments that provide fundamental effects. Quick to forge with only Green Orbs.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Sparkles className="size-4" />
            <span>Requires: 3 Green Orbs</span>
          </div>
        </Card>

        {/* Medium */}
        <Card 
          className="bg-gradient-to-br from-red-900/30 to-slate-800/50 border-red-500/30 p-6 cursor-pointer hover:border-red-400/50 transition-all"
          onClick={() => {
            setSelectedType('medium');
            setViewMode('select-enchantment');
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
                <Flame className="size-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white mb-1">Medium Recipes</h3>
                <Badge className="bg-red-500 text-white">1h 20min</Badge>
              </div>
            </div>
            <ChevronRight className="size-6 text-red-400" />
          </div>
          <p className="text-slate-300 text-sm mb-3">
            Advanced enchantments with stronger effects. Requires both Green and Red Orbs.
          </p>
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Flame className="size-4" />
            <span>Requires: 5 Green + 2 Red Orbs</span>
          </div>
        </Card>

        {/* Mythical */}
        <Card 
          className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border-purple-500/30 p-6 cursor-pointer hover:border-purple-400/50 transition-all"
          onClick={() => {
            setSelectedType('mythical');
            setViewMode('select-enchantment');
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/50">
                <Wand2 className="size-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white mb-1">Mythical Recipes</h3>
                <Badge className="bg-purple-500 text-white">2 Hours</Badge>
              </div>
            </div>
            <ChevronRight className="size-6 text-purple-400" />
          </div>
          <p className="text-slate-300 text-sm mb-3">
            Legendary enchantments with game-changing effects. Requires all three types of Orbs.
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <Wand2 className="size-4" />
            <span>Requires: 10 Green + 5 Red + 1 Purple Orbs</span>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render enchantment selection
  const renderEnchantmentSelection = () => {
    const enchantments = selectedType ? getEnchantmentsByType(selectedType) : [];

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="text-slate-400"
          onClick={() => setViewMode('select-type')}
        >
          ← Back to Type Selection
        </Button>

        <div className="text-center">
          <h2 className="text-amber-500 mb-2">Select Enchantment</h2>
          <Badge className={getTypeColor(selectedType!)}>
            {selectedType} Recipes
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto">
          {enchantments.map(enchantment => {
            const hasResources = 
              (!enchantment.requirements.greenOrbs || hasEnoughItems('green-orbs', enchantment.requirements.greenOrbs)) &&
              (!enchantment.requirements.redOrbs || hasEnoughItems('red-orbs', enchantment.requirements.redOrbs)) &&
              (!enchantment.requirements.purpleOrbs || hasEnoughItems('purple-orbs', enchantment.requirements.purpleOrbs));

            return (
              <Card
                key={enchantment.id}
                className={`p-4 cursor-pointer transition-all ${
                  hasResources 
                    ? `${getTypeColor(enchantment.type)} hover:opacity-80` 
                    : 'bg-slate-800/50 border-slate-700 opacity-50'
                }`}
                onClick={() => {
                  if (hasResources) {
                    setSelectedEnchantment(enchantment);
                    setViewMode('select-equipment');
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{enchantment.imageIcon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white">{enchantment.name}</h3>
                      {!hasResources && <Lock className="size-4 text-red-400" />}
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{enchantment.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {enchantment.type === 'simple' && '20 min'}
                        {enchantment.type === 'medium' && '1h 20min'}
                        {enchantment.type === 'mythical' && '2 hours'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="size-3" />
                        Skip: {enchantment.skipCost} gems
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Render equipment selection
  const renderEquipmentSelection = () => {
    if (!selectedEnchantment) return null;

    // Filter owned equipment that can have this enchantment
    const compatibleEquipment = ownedEquipment
      .map(owned => {
        const equipment = allEquipment.find(e => e.id === owned.equipmentId);
        return equipment && isEnchantmentAvailableFor(selectedEnchantment, equipment.category) 
          ? { ...equipment, owned } 
          : null;
      })
      .filter(Boolean);

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="text-slate-400"
          onClick={() => setViewMode('select-enchantment')}
        >
          ← Back to Enchantment Selection
        </Button>

        <div className="text-center">
          <div className="text-2xl mb-2">{selectedEnchantment.imageIcon}</div>
          <h2 className="text-amber-500 mb-2">{selectedEnchantment.name}</h2>
          <p className="text-slate-400 text-sm">Select equipment to enchant</p>
        </div>

        {compatibleEquipment.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <Lock className="size-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No compatible equipment owned</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto">
            {compatibleEquipment.map((eq: any) => {
              const currentEnchantment = getEquipmentEnchantment(eq.id);

              return (
                <Card
                  key={eq.id}
                  className="p-4 bg-slate-800/50 border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all"
                  onClick={() => handleStartForge(selectedEnchantment, eq.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white mb-1">{eq.name}</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-slate-700">Lv. {eq.owned.level}</Badge>
                        <Badge className="bg-blue-600">{eq.category}</Badge>
                        {currentEnchantment && (
                          <Badge className={getTypeColor(currentEnchantment.enchantmentType)}>
                            Has {currentEnchantment.enchantmentType} enchantment
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-amber-400" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-4 text-slate-400"
          onClick={onClose}
        >
          ← Back
        </Button>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {viewMode === 'slots' && renderSlots()}
            {viewMode === 'select-type' && renderTypeSelection()}
            {viewMode === 'select-enchantment' && renderEnchantmentSelection()}
            {viewMode === 'select-equipment' && renderEquipmentSelection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
