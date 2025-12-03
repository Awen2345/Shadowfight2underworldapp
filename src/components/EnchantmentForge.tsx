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
  Gem,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
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
import { toast } from 'sonner@2.0.3';

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
      case 'simple': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'medium': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'mythical': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
    }
  };

  const getTypeGradient = (type: EnchantmentType): string => {
    switch (type) {
      case 'simple': return 'from-green-900/40 via-green-800/20 to-slate-900/40';
      case 'medium': return 'from-orange-900/40 via-orange-800/20 to-slate-900/40';
      case 'mythical': return 'from-purple-900/40 via-purple-800/20 to-slate-900/40';
    }
  };

  const getTypeIcon = (type: EnchantmentType) => {
    switch (type) {
      case 'simple': return <Sparkles className="size-5 text-green-400" />;
      case 'medium': return <Flame className="size-5 text-orange-400" />;
      case 'mythical': return <Wand2 className="size-5 text-purple-400" />;
    }
  };

  const handleStartForge = (enchantment: Enchantment, equipmentId: string) => {
    if (!selectedSlot) return;

    // Check if have enough orbs
    const requirements = enchantment.requirements;
    if (requirements.greenOrbs && !hasEnoughItems('green-orbs', requirements.greenOrbs)) {
      toast.error('Insufficient Resources!', {
        description: 'You need more Green Shadow Orbs'
      });
      return;
    }
    if (requirements.redOrbs && !hasEnoughItems('red-orbs', requirements.redOrbs)) {
      toast.error('Insufficient Resources!', {
        description: 'You need more Red Shadow Orbs'
      });
      return;
    }
    if (requirements.purpleOrbs && !hasEnoughItems('purple-orbs', requirements.purpleOrbs)) {
      toast.error('Insufficient Resources!', {
        description: 'You need more Purple Shadow Orbs'
      });
      return;
    }

    // Consume orbs
    if (requirements.greenOrbs) removeInventoryItem('green-orbs', requirements.greenOrbs);
    if (requirements.redOrbs) removeInventoryItem('red-orbs', requirements.redOrbs);
    if (requirements.purpleOrbs) removeInventoryItem('purple-orbs', requirements.purpleOrbs);

    // Start forging
    startForging(selectedSlot, enchantment, equipmentId);
    
    toast.success('Forging Started!', {
      description: `${enchantment.name} is now being forged`
    });

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
      toast.error('Insufficient Gems!', {
        description: `You need ${cost} Unverified Gems`
      });
      return;
    }

    removeInventoryItem('unverified-gems', cost);
    speedUpForging(slotId);
    
    toast.success('Forging Completed!', {
      description: `${slot.enchantment.name} has been added to your equipment`
    });
  };

  // Render forge slots overview
  const renderSlots = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
            <Wand2 className="size-7 text-white" />
          </div>
        </motion.div>
        <h2 className="text-amber-500">Enchantment Forge</h2>
        <p className="text-slate-400">Craft powerful enchantments using Shadow Orbs</p>
      </div>

      {/* Resources Display - Enhanced */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="text-slate-400 text-sm mb-4 flex items-center gap-2">
            <Gem className="size-4" />
            Your Resources
          </div>
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30">
                <Sparkles className="size-7 text-white" />
              </div>
              <div className="text-slate-400 text-xs mb-2">Green Orbs</div>
              <div className="text-green-400 text-xl">{getInventoryItem('green-orbs')}</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(249, 115, 22, 0.5)' }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30">
                <Flame className="size-7 text-white" />
              </div>
              <div className="text-slate-400 text-xs mb-2">Red Orbs</div>
              <div className="text-orange-400 text-xl">{getInventoryItem('red-orbs')}</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.5)' }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
                <Wand2 className="size-7 text-white" />
              </div>
              <div className="text-slate-400 text-xs mb-2">Purple Orbs</div>
              <div className="text-purple-400 text-xl">{getInventoryItem('purple-orbs')}</div>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Forge Slots - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white flex items-center gap-2">
            <Flame className="size-5 text-orange-500" />
            Active Forge Slots
          </h3>
          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
            {forgeSlots.filter(s => s.isForging).length} / {forgeSlots.length} Active
          </Badge>
        </div>
        {forgeSlots.map((slot, index) => {
          const remaining = getRemainingForgeTime(slot.slotId);
          const progress = getForgeProgress(slot.slotId);

          return (
            <motion.div
              key={slot.slotId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`overflow-hidden transition-all ${
                  slot.isForging 
                    ? 'bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-slate-900/50 border-amber-500/50 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {slot.isForging && slot.enchantment ? (
                  // Active forging - Enhanced
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="text-4xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {slot.enchantment.imageIcon}
                        </motion.div>
                        <div>
                          <div className="text-white mb-2">{slot.enchantment.name}</div>
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(slot.enchantment.type)}>
                              {slot.enchantment.type.toUpperCase()}
                            </Badge>
                            <Badge className="bg-slate-700/50 text-slate-300">
                              Slot {index + 1}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 text-lg flex items-center gap-2">
                          <Clock className="size-4" />
                          {formatTime(remaining)}
                        </div>
                        <div className="text-slate-400 text-xs mt-1">{progress.toFixed(0)}% Complete</div>
                      </div>
                    </div>
                    
                    {/* Progress bar - Enhanced */}
                    <div className="relative w-full bg-slate-900/50 rounded-full h-3 mb-4 overflow-hidden border border-slate-700/50">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: '50%' }}
                      />
                    </div>

                    {/* Action buttons - Enhanced */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30"
                        onClick={() => handleSpeedUp(slot.slotId)}
                      >
                        <Zap className="size-4 mr-2" />
                        Speed Up ({slot.enchantment.skipCost} Gems)
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-900/30 hover:border-red-500"
                        onClick={() => {
                          cancelForging(slot.slotId);
                          toast.info('Forging Cancelled', {
                            description: 'Resources have not been refunded'
                          });
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Empty slot - Enhanced
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-28 bg-gradient-to-br from-slate-700/30 to-slate-800/30 hover:from-slate-700/50 hover:to-slate-800/50 border-2 border-dashed border-slate-600 hover:border-amber-500/50 transition-all"
                      onClick={() => {
                        setSelectedSlot(slot.slotId);
                        setViewMode('select-type');
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <Wand2 className="size-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-white mb-1">Forge Slot {index + 1}</div>
                          <div className="text-slate-400 text-sm">Click to start forging</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card - Enhanced */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/50 backdrop-blur-sm">
          <div className="p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="size-5 text-blue-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-blue-300">Enchantment Information</div>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>Enchantments provide powerful combat effects to your equipment.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="size-4 text-green-400" />
                        <span className="text-green-400 text-xs">SIMPLE</span>
                      </div>
                      <div className="text-slate-400 text-xs">20 min • 3 Green Orbs</div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="size-4 text-orange-400" />
                        <span className="text-orange-400 text-xs">MEDIUM</span>
                      </div>
                      <div className="text-slate-400 text-xs">1h 20m • 5 Green + 2 Red</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Wand2 className="size-4 text-purple-400" />
                        <span className="text-purple-400 text-xs">MYTHICAL</span>
                      </div>
                      <div className="text-slate-400 text-xs">2h • 10 Green + 5 Red + 1 Purple</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );

  // Render type selection
  const renderTypeSelection = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Button
        variant="ghost"
        className="text-slate-400 hover:text-white"
        onClick={() => setViewMode('slots')}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Forge Slots
      </Button>

      <div className="text-center space-y-3">
        <h2 className="text-amber-500">Select Enchantment Type</h2>
        <p className="text-slate-400">Choose the recipe tier you want to forge</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Simple */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card 
            className="bg-gradient-to-br from-green-900/30 via-green-800/10 to-slate-900/50 border-green-500/40 cursor-pointer hover:border-green-400 transition-all shadow-lg hover:shadow-green-500/20 overflow-hidden"
            onClick={() => {
              setSelectedType('simple');
              setViewMode('select-enchantment');
            }}
          >
            <div className="p-6 relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/40">
                    <Sparkles className="size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-2">Simple Recipes</h3>
                    <Badge className="bg-green-500 text-white shadow-lg">20 Minutes</Badge>
                  </div>
                </div>
                <ChevronRight className="size-7 text-green-400" />
              </div>
              <p className="text-slate-300 mb-4 relative z-10">
                Basic enchantments providing fundamental combat effects. Quick to forge with minimal resources.
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30">
                  <Sparkles className="size-4" />
                  <span>3 Green Orbs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/30">
                  <Zap className="size-4" />
                  <span>50 Gems to Skip</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Medium */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="bg-gradient-to-br from-orange-900/30 via-orange-800/10 to-slate-900/50 border-orange-500/40 cursor-pointer hover:border-orange-400 transition-all shadow-lg hover:shadow-orange-500/20 overflow-hidden"
            onClick={() => {
              setSelectedType('medium');
              setViewMode('select-enchantment');
            }}
          >
            <div className="p-6 relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/40">
                    <Flame className="size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-2">Medium Recipes</h3>
                    <Badge className="bg-orange-500 text-white shadow-lg">1 Hour 20 Minutes</Badge>
                  </div>
                </div>
                <ChevronRight className="size-7 text-orange-400" />
              </div>
              <p className="text-slate-300 mb-4 relative z-10">
                Advanced enchantments with stronger effects and longer durations. Requires both Green and Red Orbs.
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/30">
                  <Flame className="size-4" />
                  <span>5 Green + 2 Red Orbs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/30">
                  <Zap className="size-4" />
                  <span>150 Gems to Skip</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mythical */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="bg-gradient-to-br from-purple-900/30 via-purple-800/10 to-slate-900/50 border-purple-500/40 cursor-pointer hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/20 overflow-hidden"
            onClick={() => {
              setSelectedType('mythical');
              setViewMode('select-enchantment');
            }}
          >
            <div className="p-6 relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 relative">
                    <Wand2 className="size-8 text-white" />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-purple-400/20"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-2">Mythical Recipes</h3>
                    <Badge className="bg-purple-500 text-white shadow-lg">2 Hours</Badge>
                  </div>
                </div>
                <ChevronRight className="size-7 text-purple-400" />
              </div>
              <p className="text-slate-300 mb-4 relative z-10">
                Legendary enchantments with game-changing mechanics. Requires all three types of Shadow Orbs.
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/30">
                  <Wand2 className="size-4" />
                  <span>10 Green + 5 Red + 1 Purple</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/30">
                  <Zap className="size-4" />
                  <span>300 Gems to Skip</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  // Render enchantment selection
  const renderEnchantmentSelection = () => {
    const enchantments = selectedType ? getEnchantmentsByType(selectedType) : [];

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white"
          onClick={() => setViewMode('select-type')}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Type Selection
        </Button>

        <div className="text-center space-y-3">
          <h2 className="text-amber-500">Select Enchantment</h2>
          <Badge className={`${getTypeColor(selectedType!)} px-4 py-1`}>
            {selectedType?.toUpperCase()} RECIPES
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
          {enchantments.map((enchantment, index) => {
            const hasResources = 
              (!enchantment.requirements.greenOrbs || hasEnoughItems('green-orbs', enchantment.requirements.greenOrbs)) &&
              (!enchantment.requirements.redOrbs || hasEnoughItems('red-orbs', enchantment.requirements.redOrbs)) &&
              (!enchantment.requirements.purpleOrbs || hasEnoughItems('purple-orbs', enchantment.requirements.purpleOrbs));

            return (
              <motion.div
                key={enchantment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={hasResources ? { scale: 1.02, x: 4 } : {}}
                whileTap={hasResources ? { scale: 0.98 } : {}}
              >
                <Card
                  className={`p-5 cursor-pointer transition-all ${
                    hasResources 
                      ? `bg-gradient-to-br ${getTypeGradient(enchantment.type)} border-${enchantment.type === 'simple' ? 'green' : enchantment.type === 'medium' ? 'orange' : 'purple'}-500/50 hover:shadow-lg` 
                      : 'bg-slate-800/30 border-slate-700/50 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (hasResources) {
                      setSelectedEnchantment(enchantment);
                      setViewMode('select-equipment');
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="text-4xl"
                      animate={hasResources ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {enchantment.imageIcon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white text-lg">{enchantment.name}</h3>
                        {!hasResources && (
                          <div className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded border border-red-500/30">
                            <Lock className="size-3" />
                            <span>Locked</span>
                          </div>
                        )}
                        {hasResources && (
                          <CheckCircle2 className="size-5 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{enchantment.description}</p>
                      
                      {/* Requirements and info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">
                          <Clock className="size-3 text-slate-400" />
                          <span className="text-slate-300">
                            {enchantment.type === 'simple' && '20 min'}
                            {enchantment.type === 'medium' && '1h 20min'}
                            {enchantment.type === 'mythical' && '2 hours'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">
                          <Zap className="size-3 text-purple-400" />
                          <span className="text-purple-300">{enchantment.skipCost} gems</span>
                        </div>
                        {enchantment.requirements.greenOrbs && (
                          <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded border border-green-500/30">
                            <Sparkles className="size-3 text-green-400" />
                            <span className="text-green-300">{enchantment.requirements.greenOrbs}</span>
                          </div>
                        )}
                        {enchantment.requirements.redOrbs && (
                          <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/30">
                            <Flame className="size-3 text-orange-400" />
                            <span className="text-orange-300">{enchantment.requirements.redOrbs}</span>
                          </div>
                        )}
                        {enchantment.requirements.purpleOrbs && (
                          <div className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">
                            <Wand2 className="size-3 text-purple-400" />
                            <span className="text-purple-300">{enchantment.requirements.purpleOrbs}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white"
          onClick={() => setViewMode('select-enchantment')}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Enchantment Selection
        </Button>

        {/* Selected Enchantment Preview */}
        <Card className={`bg-gradient-to-br ${getTypeGradient(selectedEnchantment.type)} border-${selectedEnchantment.type === 'simple' ? 'green' : selectedEnchantment.type === 'medium' ? 'orange' : 'purple'}-500/50`}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl">{selectedEnchantment.imageIcon}</div>
              <div className="flex-1">
                <h2 className="text-white text-xl mb-2">{selectedEnchantment.name}</h2>
                <Badge className={getTypeColor(selectedEnchantment.type)}>
                  {selectedEnchantment.type.toUpperCase()}
                </Badge>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{selectedEnchantment.description}</p>
          </div>
        </Card>

        <div className="text-center space-y-2">
          <h3 className="text-white">Select Equipment to Enchant</h3>
          <p className="text-slate-400 text-sm">Choose which equipment receives this enchantment</p>
        </div>

        {compatibleEquipment.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="size-10 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg mb-2">No Compatible Equipment</p>
            <p className="text-slate-500 text-sm">You don't own any equipment that can use this enchantment</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {compatibleEquipment.map((eq: any, index) => {
              const currentEnchantment = getEquipmentEnchantment(eq.id);

              return (
                <motion.div
                  key={eq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="p-5 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-amber-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/10"
                    onClick={() => handleStartForge(selectedEnchantment, eq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                          <span className="text-2xl">
                            {eq.category === 'weapon' && '⚔️'}
                            {eq.category === 'armor' && '🛡️'}
                            {eq.category === 'helm' && '⛑️'}
                            {eq.category === 'ranged' && '🏹'}
                            {eq.category === 'magic' && '✨'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white mb-2">{eq.name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Lv. {eq.owned.level}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {eq.category}
                            </Badge>
                            {currentEnchantment && (
                              <Badge className={getTypeColor(currentEnchantment.enchantmentType)}>
                                {currentEnchantment.enchantmentName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="size-6 text-amber-400 flex-shrink-0" />
                    </div>
                    {currentEnchantment && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-sm text-amber-400">
                          <AlertCircle className="size-4" />
                          <span>Current enchantment will be replaced</span>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 z-50 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-10" />
      
      <div className="relative h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-6 pb-20">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800/50"
              onClick={onClose}
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Menu
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'slots' && renderSlots()}
              {viewMode === 'select-type' && renderTypeSelection()}
              {viewMode === 'select-enchantment' && renderEnchantmentSelection()}
              {viewMode === 'select-equipment' && renderEquipmentSelection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}
