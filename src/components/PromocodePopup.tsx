import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Gift, Check, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PromocodePopupProps {
  onClose: () => void;
  onRedeemSuccess: (rewards: PromoReward) => void;
}

export interface PromoReward {
  gems?: number;
  keys?: number;
  minorCharge?: number;
  mediumCharge?: number;
  largeCharge?: number;
  elixirs?: { id: string; quantity: number }[];
}

interface Promocode {
  code: string;
  rewards: PromoReward;
  isUsed: boolean;
  expiresAt?: Date;
  usageLimit?: number;
}

// Simulated promocodes database
const promocodesData: Promocode[] = [
  {
    code: 'SHADOW2024',
    rewards: {
      gems: 500,
      keys: 3,
      minorCharge: 10,
      mediumCharge: 5
    },
    isUsed: false,
    expiresAt: new Date('2025-12-31')
  },
  {
    code: 'WELCOME100',
    rewards: {
      gems: 100,
      keys: 1,
      minorCharge: 5
    },
    isUsed: false,
    expiresAt: new Date('2025-06-30')
  },
  {
    code: 'ELITE1000',
    rewards: {
      gems: 1000,
      keys: 5,
      mediumCharge: 10,
      largeCharge: 3,
      elixirs: [
        { id: 'phoenix', quantity: 2 },
        { id: 'magic-source', quantity: 3 }
      ]
    },
    isUsed: false,
    expiresAt: new Date('2025-03-31')
  },
  {
    code: 'UNDERWORLD',
    rewards: {
      gems: 250,
      keys: 2,
      largeCharge: 2,
      elixirs: [
        { id: 'steel-hedgehog', quantity: 5 },
        { id: 'crag', quantity: 5 }
      ]
    },
    isUsed: false,
    // No expiry date - permanent
  },
  {
    code: 'LIMITED2024',
    rewards: {
      gems: 2000,
      keys: 10,
      largeCharge: 10
    },
    isUsed: false,
    expiresAt: new Date('2024-12-31') // Already expired
  }
];

// Load used codes from localStorage
const loadUsedCodes = (): Set<string> => {
  const stored = localStorage.getItem('usedPromocodes');
  return stored ? new Set(JSON.parse(stored)) : new Set();
};

// Save used codes to localStorage
const saveUsedCode = (code: string) => {
  const usedCodes = loadUsedCodes();
  usedCodes.add(code);
  localStorage.setItem('usedPromocodes', JSON.stringify([...usedCodes]));
};

export function PromocodePopup({ onClose, onRedeemSuccess }: PromocodePopupProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'used' | 'expired'>('idle');
  const [rewards, setRewards] = useState<PromoReward | null>(null);
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUsedCodes(loadUsedCodes());
  }, []);

  const isCodeExpired = (expiresAt?: Date): boolean => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const handleRedeem = () => {
    const upperCode = code.toUpperCase();
    const promo = promocodesData.find(p => p.code === upperCode);
    
    if (!promo) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    // Check if already used
    if (usedCodes.has(upperCode)) {
      setStatus('used');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    // Check if expired
    if (isCodeExpired(promo.expiresAt)) {
      setStatus('expired');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    // Mark as used
    saveUsedCode(upperCode);
    setUsedCodes(prev => new Set([...prev, upperCode]));
    
    // Show success
    setRewards(promo.rewards);
    setStatus('success');
    
    // Apply rewards after showing them
    setTimeout(() => {
      onRedeemSuccess(promo.rewards);
      onClose();
    }, 2000);
  };

  const getExpiryText = (code: string): string => {
    const promo = promocodesData.find(p => p.code === code.toUpperCase());
    if (!promo?.expiresAt) return '';
    
    const expiryDate = new Date(promo.expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    return `Expires in ${daysLeft} days`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="bg-gradient-to-b from-purple-900/40 to-slate-900 border-purple-500/30 p-6 max-w-md w-full relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="size-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Gift className="size-8 text-purple-400" />
            <h2 className="text-purple-400">Enter Promo Code</h2>
          </div>

          {/* Input */}
          <div className="space-y-4">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE HERE"
              className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-500 text-center tracking-wider"
              maxLength={20}
              disabled={status === 'success'}
            />

            {/* Expiry Info */}
            {code && getExpiryText(code) && (
              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                <Clock className="size-3" />
                <span>{getExpiryText(code)}</span>
              </div>
            )}

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded border border-red-500/30"
                >
                  <AlertCircle className="size-5" />
                  <span>Invalid promo code</span>
                </motion.div>
              )}

              {status === 'used' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-orange-400 bg-orange-500/10 p-3 rounded border border-orange-500/30"
                >
                  <AlertCircle className="size-5" />
                  <span>Code already redeemed</span>
                </motion.div>
              )}

              {status === 'expired' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-gray-400 bg-gray-500/10 p-3 rounded border border-gray-500/30"
                >
                  <Clock className="size-5" />
                  <span>Code has expired</span>
                </motion.div>
              )}

              {status === 'success' && rewards && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded p-4"
                >
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <Check className="size-5" />
                    <span>Rewards Claimed!</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    {rewards.gems && (
                      <div className="flex justify-between">
                        <span>💎 Gems</span>
                        <span className="text-purple-400">+{rewards.gems}</span>
                      </div>
                    )}
                    {rewards.keys && (
                      <div className="flex justify-between">
                        <span>🔑 Keys</span>
                        <span className="text-amber-400">+{rewards.keys}</span>
                      </div>
                    )}
                    {rewards.minorCharge && (
                      <div className="flex justify-between">
                        <span>⚡ Minor Charge</span>
                        <span className="text-blue-400">+{rewards.minorCharge}</span>
                      </div>
                    )}
                    {rewards.mediumCharge && (
                      <div className="flex justify-between">
                        <span>⚡ Medium Charge</span>
                        <span className="text-blue-400">+{rewards.mediumCharge}</span>
                      </div>
                    )}
                    {rewards.largeCharge && (
                      <div className="flex justify-between">
                        <span>⚡ Large Charge</span>
                        <span className="text-blue-400">+{rewards.largeCharge}</span>
                      </div>
                    )}
                    {rewards.elixirs?.map((elixir, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>🧪 {elixir.id}</span>
                        <span className="text-green-400">+{elixir.quantity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Redeem Button */}
            <Button
              onClick={handleRedeem}
              disabled={!code || status === 'success'}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
            >
              Redeem Code
            </Button>
          </div>

          {/* Hint */}
          <div className="mt-6 space-y-1">
            <div className="text-xs text-slate-500 text-center">
              Available codes:
            </div>
            <div className="text-xs text-slate-600 text-center space-y-0.5">
              <div>SHADOW2024 (Expires Dec 2025)</div>
              <div>WELCOME100 (Expires Jun 2025)</div>
              <div>ELITE1000 (Expires Mar 2025)</div>
              <div>UNDERWORLD (No expiry)</div>
              <div className="text-red-400/50">LIMITED2024 (Expired)</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}