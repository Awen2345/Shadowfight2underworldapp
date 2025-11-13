import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, Star } from 'lucide-react';
import { RATING_LEVELS, getLevelInfo, getLevelColorClass } from '../lib/playerStatsData';

interface PlayerLevelBadgeProps {
  rating: number;
  level: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayerLevelBadge({ rating, level, showProgress = false, size = 'md' }: PlayerLevelBadgeProps) {
  const levelInfo = RATING_LEVELS.find(l => l.level === level);
  const { currentLevel, nextLevel, progress, ratingToNext } = getLevelInfo(rating);
  const colorClass = getLevelColorClass(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  if (!levelInfo) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className={`${colorClass} ${sizeClasses[size]} border-2`}>
          <Star className={`${size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'} mr-1`} />
          Lv.{level} - {levelInfo.name}
        </Badge>
      </div>

      {showProgress && nextLevel && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{rating} / {nextLevel.minRating}</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="size-3" />
              {ratingToNext} to next
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
