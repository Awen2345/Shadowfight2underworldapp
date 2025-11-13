import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown, HelpCircle, X, Flame, Droplet, Swords } from 'lucide-react';
import { getItemById } from '../lib/itemsData';
import { getInventoryItem } from '../lib/inventoryData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Boss } from '../lib/bossData';

interface EquipmentPreparationProps {
  boss: Boss;
  onEquipmentSelected: (selectedCharge: string | null, selectedElixir: string | null) => void;
  onCancel: () => void;
}

export function EquipmentPreparation({ boss, onEquipmentSelected, onCancel }: EquipmentPreparationProps) {
  const [selectedCharge, setSelectedCharge] = useState<string | null>('minor-charge');
  const [selectedElixir, setSelectedElixir] = useState<string | null>('steel-hedgehog');

  const availableCharges = [
    { id: 'minor-charge', count: getInventoryItem('minor-charge') },
    { id: 'medium-charge', count: getInventoryItem('medium-charge') },
    { id: 'large-charge', count: getInventoryItem('large-charge') }
  ].filter(item => item.count > 0);

  const availableElixirs = [
    { id: 'magic-source', count: getInventoryItem('magic-source') },
    { id: 'steel-hedgehog', count: getInventoryItem('steel-hedgehog') },
    { id: 'crag', count: getInventoryItem('crag') },
    { id: 'healing-vine', count: getInventoryItem('healing-vine') },
    { id: 'phoenix', count: getInventoryItem('phoenix') },
    { id: 'explosive-vigor', count: getInventoryItem('explosive-vigor') },
    { id: 'star-clarity', count: getInventoryItem('star-clarity') }
  ].filter(item => item.count > 0);

  const selectedChargeItem = selectedCharge ? getItemById(selectedCharge) : null;
  const selectedElixirItem = selectedElixir ? getItemById(selectedElixir) : null;

  const cycleCharge = (direction: 'up' | 'down') => {
    if (availableCharges.length === 0) return;
    
    const currentIndex = selectedCharge ? availableCharges.findIndex(c => c.id === selectedCharge) : -1;
    let newIndex;
    
    if (direction === 'up') {
      newIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + availableCharges.length) % availableCharges.length;
    } else {
      newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % availableCharges.length;
    }
    
    setSelectedCharge(availableCharges[newIndex].id);
  };

  const cycleElixir = (direction: 'up' | 'down') => {
    if (availableElixirs.length === 0) return;
    
    const currentIndex = selectedElixir ? availableElixirs.findIndex(e => e.id === selectedElixir) : -1;
    let newIndex;
    
    if (direction === 'up') {
      newIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + availableElixirs.length) % availableElixirs.length;
    } else {
      newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % availableElixirs.length;
    }
    
    setSelectedElixir(availableElixirs[newIndex].id);
  };

  const getItemImage = (itemId: string) => {
    const imageMap: Record<string, string> = {
      'minor-charge': 'https://static.wikia.nocookie.net/shadowfight/images/2/2b/Sphere1.png',
      'medium-charge': 'https://static.wikia.nocookie.net/shadowfight/images/b/bb/Sphere2.png',
      'large-charge': 'https://static.wikia.nocookie.net/shadowfight/images/e/ec/Sphere3.png',
      'crag': 'https://static.wikia.nocookie.net/shadowfight/images/7/7b/Potion_rock.png',
      'steel-hedgehog': 'https://static.wikia.nocookie.net/shadowfight/images/f/f0/Potion_spikes.png',
      'magic-source': 'https://static.wikia.nocookie.net/shadowfight/images/e/eb/Potion_magic.png',
      'phoenix': 'https://static.wikia.nocookie.net/shadowfight/images/3/3a/Potion_phoenix.png',
      'explosive-vigor': 'https://static.wikia.nocookie.net/shadowfight/images/2/2f/RaidItems4.png',
      'star-clarity': 'https://static.wikia.nocookie.net/shadowfight/images/0/05/Potion3.png',
      'healing-vine': 'https://static.wikia.nocookie.net/shadowfight/images/1/1f/Potion_healing.png'
    };
    return imageMap[itemId] || '';
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 border-amber-900 border-4 max-w-5xl w-full relative shadow-2xl">
        {/* Decorative border */}
        <div className="absolute inset-0 border-8 border-amber-900/20 pointer-events-none" style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(139, 69, 19, 0.1) 100%)'
        }} />
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-amber-900 hover:text-red-700 hover:bg-red-100 z-10 w-12 h-12 rounded-none"
          onClick={onCancel}
        >
          <X className="size-8" strokeWidth={3} />
        </Button>

        <div className="relative p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-amber-900 mb-2" style={{
              textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)',
              letterSpacing: '0.1em'
            }}>PREPARATION OF EQUIPMENT</h2>
          </div>

          {/* Equipment Selection */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Charge Selection */}
            <div className="text-center">
              <h3 className="text-amber-900 mb-6" style={{ letterSpacing: '0.05em' }}>Charge</h3>
              
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-8 h-8"
                  onClick={() => cycleCharge('up')}
                  disabled={availableCharges.length <= 1}
                >
                  <ChevronUp className="size-6" strokeWidth={3} />
                </Button>

                <div className="relative my-2">
                  {selectedChargeItem ? (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 border-8 border-amber-900 flex items-center justify-center shadow-xl relative overflow-hidden p-4">
                      <ImageWithFallback 
                        src={getItemImage(selectedCharge!)}
                        alt={selectedChargeItem.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-8 border-slate-600 flex items-center justify-center">
                      <HelpCircle className="size-20 text-slate-300" />
                    </div>
                  )}
                  
                  {selectedCharge && (
                    <>
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-amber-50 border-4 border-amber-900 flex items-center justify-center shadow-lg">
                        <HelpCircle className="size-6 text-amber-900" />
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-900 border-4 border-amber-900 px-4 py-1 rounded-full shadow-lg">
                        <span className="font-bold">{getInventoryItem(selectedCharge)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-8 h-8"
                  onClick={() => cycleCharge('down')}
                  disabled={availableCharges.length <= 1}
                >
                  <ChevronDown className="size-6" strokeWidth={3} />
                </Button>
              </div>

              {selectedChargeItem && (
                <div className="mt-6">
                  <div className="text-amber-900 text-sm mb-3">
                    {selectedChargeItem.description.includes('72-88') && 'Damage: 72 - 88'}
                    {selectedChargeItem.description.includes('488-552') && 'Damage: 488 - 552'}
                    {selectedChargeItem.description.includes('990-1072') && 'Damage: 990 - 1072'}
                  </div>
                  <Button
                    className="bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-amber-900 border-4 border-amber-900 rounded-full px-6 py-2 shadow-lg h-auto"
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
                  >
                    <Flame className="size-4 mr-2 text-orange-600" />
                    <span className="font-bold">{getInventoryItem(selectedCharge)}</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Elixir Selection */}
            <div className="text-center">
              <h3 className="text-amber-900 mb-6" style={{ letterSpacing: '0.05em' }}>Elixir</h3>
              
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-8 h-8"
                  onClick={() => cycleElixir('up')}
                  disabled={availableElixirs.length <= 1}
                >
                  <ChevronUp className="size-6" strokeWidth={3} />
                </Button>

                <div className="relative my-2">
                  {selectedElixirItem ? (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 border-8 border-amber-900 flex items-center justify-center shadow-xl relative overflow-hidden p-4">
                      <ImageWithFallback 
                        src={getItemImage(selectedElixir!)}
                        alt={selectedElixirItem.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-8 border-slate-600 flex items-center justify-center">
                      <HelpCircle className="size-20 text-slate-300" />
                    </div>
                  )}
                  
                  {selectedElixir && (
                    <>
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-amber-50 border-4 border-amber-900 flex items-center justify-center shadow-lg">
                        <HelpCircle className="size-6 text-amber-900" />
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-900 border-4 border-amber-900 px-4 py-1 rounded-full shadow-lg">
                        <span className="font-bold">{getInventoryItem(selectedElixir)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-900 hover:text-amber-700 hover:bg-amber-200/50 w-8 h-8"
                  onClick={() => cycleElixir('down')}
                  disabled={availableElixirs.length <= 1}
                >
                  <ChevronDown className="size-6" strokeWidth={3} />
                </Button>
              </div>

              {selectedElixirItem && (
                <div className="mt-6">
                  <div className="text-amber-900 text-sm mb-3">3 effects in 1</div>
                  <Button
                    className="bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-amber-900 border-4 border-amber-900 rounded-full px-8 py-2 shadow-lg h-auto font-bold"
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}
                    onClick={() => {/* Drink animation */}}
                  >
                    DRINK
                  </Button>
                </div>
              )}
            </div>

            {/* Horn (Placeholder) */}
            <div className="text-center">
              <h3 className="text-amber-900 mb-6" style={{ letterSpacing: '0.05em' }}>Horn</h3>
              
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 w-8 h-8"
                  disabled
                >
                  <ChevronUp className="size-6" strokeWidth={3} />
                </Button>

                <div className="relative my-2">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-8 border-slate-600 flex items-center justify-center shadow-xl">
                    <svg className="size-20 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 14c.83.48 2.16.95 3 .95 2.29 0 5.28-1.3 7-2.95 2.28 1.95 5.6 3.95 8 3.95.84 0 2.17-.48 3-.95v-2.29c-.83.48-2.16.95-3 .95-2.4 0-5.72-2-8-3.95C11.28 11.7 8.29 13 6 13c-.84 0-2.17-.48-3-.95v2.29z"/>
                    </svg>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 w-8 h-8"
                  disabled
                >
                  <ChevronDown className="size-6" strokeWidth={3} />
                </Button>
              </div>

              <div className="mt-6">
                <div className="text-slate-500 text-sm">No horn equipped</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button
              className="bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-amber-900 border-4 border-amber-900 shadow-lg h-14 text-lg font-bold"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
              onClick={() => onEquipmentSelected(selectedCharge, selectedElixir)}
            >
              FIGHT!
            </Button>

            <Button
              className="bg-gradient-to-b from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-900 border-4 border-amber-900 shadow-lg h-14 text-lg font-bold"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' }}
              onClick={onCancel}
            >
              SHOP
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}