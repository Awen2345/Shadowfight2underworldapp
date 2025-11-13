import { PlayerLeaderboard } from './PlayerLeaderboard';
import { ClanLeaderboard } from './ClanLeaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Users, Clock } from 'lucide-react';
import { Card } from './ui/card';

export function SeasonRewards() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-amber-500 mb-2">Season Rewards</h2>
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Clock className="size-4" />
          <p>Season ends in 3 days</p>
        </div>
      </div>

      {/* Season Info */}
      <Card className="bg-slate-800/50 border-amber-500/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-slate-400 mb-2">Current Season</div>
            <div className="text-amber-500">Season 15</div>
          </div>
          <div>
            <div className="text-slate-400 mb-2">Time Remaining</div>
            <div className="text-red-400">2d 14h 32m</div>
          </div>
          <div>
            <div className="text-slate-400 mb-2">Your Position</div>
            <div className="text-green-400">#42</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="players" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="players" className="flex items-center gap-2">
            <Trophy className="size-4" />
            Top 100 Players
          </TabsTrigger>
          <TabsTrigger value="clans" className="flex items-center gap-2">
            <Users className="size-4" />
            Top 100 Clans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players">
          <PlayerLeaderboard />
        </TabsContent>

        <TabsContent value="clans">
          <ClanLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
