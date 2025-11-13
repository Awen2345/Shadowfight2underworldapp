import { Map, Trophy, Award, User, Users, Gem, ShoppingCart, Sword } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Page } from '../App';

interface TaskbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Taskbar({ currentPage, onNavigate }: TaskbarProps) {
  const navItems = [
    { id: 'map' as Page, icon: Map, label: 'Map', badge: null },
    { id: 'rewards' as Page, icon: Trophy, label: 'Rewards', badge: null },
    { id: 'ranking' as Page, icon: Award, label: 'Top 20', badge: '3d' },
    { id: 'mystats' as Page, icon: User, label: 'Shadow_Fighter_1000', badge: null, isProfile: true },
    { id: 'equipment' as Page, icon: Sword, label: 'Equipment', badge: null },
    { id: 'clans' as Page, icon: Users, label: 'Clans', badge: null },
    { id: 'shop' as Page, icon: ShoppingCart, label: 'Shop', badge: 'SALE' },
    { id: 'gems' as Page, icon: Gem, label: 'Gems', badge: 'NEW' },
  ];

  return (
    <div className="bg-slate-900/95 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-600 rounded flex items-center justify-center">
              <span className="text-white">SF</span>
            </div>
            <div>
              <h1 className="text-amber-500 text-sm leading-none">Shadow Fight 2</h1>
              <p className="text-slate-400 text-xs">Underworld</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="size-4" />
                  {item.isProfile ? (
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs leading-tight">{item.label}</span>
                      <span className="text-[10px] text-slate-500">ID: 1000</span>
                    </div>
                  ) : (
                    <span className="hidden md:block text-sm">{item.label}</span>
                  )}
                  {item.badge && (
                    <Badge className={`
                      absolute -top-1 -right-1 h-4 px-1 text-[10px]
                      ${item.badge === '3d' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                      }
                    `}>
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}