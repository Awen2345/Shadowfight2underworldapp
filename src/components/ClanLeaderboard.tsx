import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Medal, Award, Users, Swords, Target } from 'lucide-react';
import { mockClans } from '../lib/mockData';

export function ClanLeaderboard() {
  const getRewardIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-5 text-amber-400" />;
    if (rank === 2) return <Medal className="size-5 text-slate-300" />;
    if (rank === 3) return <Award className="size-5 text-amber-700" />;
    return null;
  };

  const getRewardBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-amber-500 text-white">Golden Chest</Badge>;
    if (rank === 2) return <Badge className="bg-slate-400 text-white">Silver Chest</Badge>;
    if (rank === 3) return <Badge className="bg-amber-700 text-white">Normal Chest</Badge>;
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Top 3 Rewards Info */}
      <Card className="bg-slate-800/50 border-amber-500/30 p-4 mb-4">
        <h3 className="text-amber-500 mb-3">Season Rewards (3 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <Trophy className="size-6 text-amber-400" />
            <div>
              <div className="text-slate-300">1st Place</div>
              <div className="text-amber-400">Golden Chest</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-500/10 rounded-lg border border-slate-500/30">
            <Medal className="size-6 text-slate-300" />
            <div>
              <div className="text-slate-300">2nd Place</div>
              <div className="text-slate-300">Silver Chest</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-700/10 rounded-lg border border-amber-700/30">
            <Award className="size-6 text-amber-700" />
            <div>
              <div className="text-slate-300">3rd Place</div>
              <div className="text-amber-700">Normal Chest</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Clan List */}
      {mockClans.map((clan, index) => {
        const rank = index + 1;
        return (
          <Card
            key={clan.id}
            className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer p-4"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {getRewardIcon(rank) || (
                  <span className="text-slate-400">#{rank}</span>
                )}
              </div>

              {/* Clan Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-200">[{clan.tag}] {clan.name}</span>
                  {rank <= 3 && (
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30">
                      Elite
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>{clan.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Swords className="size-3" />
                    <span>{clan.totalRaids} raids</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="size-3" />
                    <span>{clan.winRate}% win rate</span>
                  </div>
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  Leader: {clan.leader}
                </div>
              </div>

              {/* Rating */}
              <div className="text-right">
                <div className="text-amber-500">{clan.rating.toLocaleString()}</div>
                <div className="text-slate-500 text-sm">Rating</div>
              </div>

              {/* Reward Badge */}
              <div className="w-32 flex justify-end">
                {getRewardBadge(rank)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
