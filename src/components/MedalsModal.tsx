import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Trophy, Medal as MedalIcon, Award } from 'lucide-react';
import type { Player } from '../lib/mockData';

interface MedalsModalProps {
  player: Player;
  onClose: () => void;
}

export function MedalsModal({ player, onClose }: MedalsModalProps) {
  const getMedalIcon = (type: 'gold' | 'silver' | 'bronze') => {
    switch (type) {
      case 'gold':
        return <Trophy className="size-8 text-amber-400" />;
      case 'silver':
        return <MedalIcon className="size-8 text-slate-300" />;
      case 'bronze':
        return <Award className="size-8 text-amber-700" />;
    }
  };

  const getMedalBadge = (type: 'gold' | 'silver' | 'bronze') => {
    switch (type) {
      case 'gold':
        return 'bg-amber-500';
      case 'silver':
        return 'bg-slate-400';
      case 'bronze':
        return 'bg-amber-700';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-amber-500/30 text-slate-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            <span className="text-amber-500">Medals Collection</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {player.username}'s achievements from Top 100 placements
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {player.medals.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="size-16 mx-auto mb-4 text-slate-600" />
              <div className="text-slate-400">No medals earned yet</div>
              <div className="text-slate-500 text-sm mt-2">
                Finish in Top 100 to earn medals
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {player.medals.map((medal, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getMedalIcon(medal.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-200">Season {medal.season}</span>
                        <Badge className={`${getMedalBadge(medal.type)} text-white text-xs`}>
                          {medal.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-amber-500">
                        Rank #{medal.rank}
                      </div>
                      <div className="text-slate-500 text-sm mt-1">
                        {medal.rank <= 10 && 'Elite Top 10'}
                        {medal.rank > 10 && medal.rank <= 50 && 'High Achiever'}
                        {medal.rank > 50 && 'Top 100'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
              <div className="text-amber-400">
                {player.medals.filter(m => m.type === 'gold').length}
              </div>
              <div className="text-slate-400 text-sm mt-1">Gold Medals</div>
            </div>
            <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-3 text-center">
              <div className="text-slate-300">
                {player.medals.filter(m => m.type === 'silver').length}
              </div>
              <div className="text-slate-400 text-sm mt-1">Silver Medals</div>
            </div>
            <div className="bg-amber-700/10 border border-amber-700/30 rounded-lg p-3 text-center">
              <div className="text-amber-700">
                {player.medals.filter(m => m.type === 'bronze').length}
              </div>
              <div className="text-slate-400 text-sm mt-1">Bronze Medals</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}