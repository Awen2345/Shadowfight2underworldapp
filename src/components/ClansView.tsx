import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Search, 
  Shield, 
  Trophy, 
  Target,
  Crown,
  Swords,
  UserPlus,
  Info
} from 'lucide-react';
import { mockClans } from '../lib/mockData';
import type { Clan } from '../lib/mockData';

export function ClansView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);

  const myClan: Clan = {
    id: 'my-clan',
    name: 'Shadow Warriors',
    tag: 'SHA',
    rating: 48500,
    members: 45,
    leader: 'Shadow_Fighter_1000',
    totalRaids: 856,
    winRate: 82
  };

  const filteredClans = mockClans.filter(clan => 
    clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clan.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-amber-500 mb-2">Clans</h2>
        <p className="text-slate-400">Join a clan or view clan rankings</p>
      </div>

      <Tabs defaultValue="myclan" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="myclan">My Clan</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="top">Rankings</TabsTrigger>
        </TabsList>

        {/* My Clan Tab */}
        <TabsContent value="myclan" className="space-y-4">
          <Card className="bg-slate-800/50 border-amber-500/30 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded flex items-center justify-center">
                  <Shield className="size-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-amber-500">[{myClan.tag}] {myClan.name}</h3>
                    <Badge className="bg-amber-500 text-white">Rank #5</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="size-3" />
                      <span>{myClan.members}/50 members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="size-3" />
                      <span>{myClan.rating.toLocaleString()} rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                <Info className="size-4 mr-2" />
                Details
              </Button>
            </div>

            {/* Clan Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                <div className="text-slate-400 text-sm mb-1">Total Raids</div>
                <div className="text-slate-200">{myClan.totalRaids}</div>
              </div>
              <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                <div className="text-slate-400 text-sm mb-1">Win Rate</div>
                <div className="text-green-400">{myClan.winRate}%</div>
              </div>
              <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                <div className="text-slate-400 text-sm mb-1">Leader</div>
                <div className="text-amber-500 text-sm">{myClan.leader}</div>
              </div>
              <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                <div className="text-slate-400 text-sm mb-1">Your Role</div>
                <div className="text-amber-400">Leader</div>
              </div>
            </div>
          </Card>

          {/* Clan Members */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-amber-500 mb-4 flex items-center gap-2">
              <Users className="size-4" />
              Clan Members (Top 10)
            </h3>
            <div className="space-y-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600 hover:border-amber-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">#{i + 1}</div>
                    <div>
                      <div className="text-slate-200">Shadow_Fighter_{1000 + i}</div>
                      {i === 0 && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Crown className="size-3" />
                          <span>Leader</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500">{(5000 - i * 100).toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search clans by name or tag..."
              className="pl-10 bg-slate-800 border-slate-700 text-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredClans.slice(0, 20).map((clan) => (
              <Card
                key={clan.id}
                className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer p-4"
                onClick={() => setSelectedClan(clan)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                      <Shield className="size-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-slate-200 mb-1">[{clan.tag}] {clan.name}</div>
                      <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{clan.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="size-3" />
                          <span>{clan.winRate}% win</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500">{clan.rating.toLocaleString()}</div>
                    <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                      <UserPlus className="size-3 mr-1" />
                      Request
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="top" className="space-y-2">
          <Card className="bg-slate-800/50 border-amber-500/30 p-4 mb-4">
            <div className="text-center text-amber-500 mb-2">Top 10 Clans</div>
            <div className="text-slate-400 text-sm text-center">Season ends in 3 days</div>
          </Card>

          {mockClans.slice(0, 10).map((clan, index) => {
            const rank = index + 1;
            return (
              <Card
                key={clan.id}
                className={`
                  p-4 transition-all cursor-pointer
                  ${rank <= 3 
                    ? 'bg-gradient-to-r from-amber-900/30 to-slate-800/50 border-amber-500/50' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12">
                    {rank === 1 && <Trophy className="size-6 text-amber-400" />}
                    {rank === 2 && <Shield className="size-6 text-slate-300" />}
                    {rank === 3 && <Swords className="size-6 text-amber-700" />}
                    {rank > 3 && <span className="text-slate-400">#{rank}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-200">[{clan.tag}] {clan.name}</span>
                      {rank <= 3 && (
                        <Badge className="bg-amber-500 text-white text-xs">ELITE</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="size-3" />
                        <span>{clan.members}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Swords className="size-3" />
                        <span>{clan.totalRaids} raids</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="size-3" />
                        <span>{clan.winRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-amber-500">{clan.rating.toLocaleString()}</div>
                    <div className="text-slate-500 text-sm">Rating</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
