import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Gem, CheckCircle, AlertCircle, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { getInventoryItem } from '../lib/inventoryData';

export function GemsView() {
  const unverifiedGems = getInventoryItem('unverified-gems');
  const verifiedGems = getInventoryItem('verified-gems');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-amber-500 mb-2">Gems</h2>
        <p className="text-slate-400">Your currency for upgrades and items</p>
      </div>

      {/* Gems Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified Gems */}
        <Card className="bg-gradient-to-br from-green-900/30 to-slate-800/50 border-green-500/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                <Gem className="size-7 text-green-400" />
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Verified Gems</div>
                <div className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  <span>Serv: {verifiedGems.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">Verified</Badge>
          </div>
          
          <p className="text-slate-400 text-sm mb-4">
            These gems are verified by the server and can be used for all purchases and upgrades.
          </p>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Plus className="size-4 mr-2" />
            Buy Verified Gems
          </Button>
        </Card>

        {/* Unverified Gems */}
        <Card className="bg-gradient-to-br from-amber-900/30 to-slate-800/50 border-amber-500/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500/50">
                <Gem className="size-7 text-amber-400" />
              </div>
              <div>
                <div className="text-slate-400 text-sm mb-1">Unverified Gems</div>
                <div className="text-amber-400 flex items-center gap-1">
                  <AlertCircle className="size-4" />
                  <span>{unverifiedGems.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-amber-500 text-white">Pending</Badge>
          </div>
          
          <p className="text-slate-400 text-sm mb-4">
            Earned from battles. Convert to verified gems or use for limited features.
          </p>

          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            <ArrowRight className="size-4 mr-2" />
            Convert to Verified
          </Button>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-amber-500 mb-4 flex items-center gap-2">
          <Sparkles className="size-4" />
          About Gems
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <CheckCircle className="size-5 text-green-400" />
            </div>
            <div>
              <div className="text-slate-200 mb-1">Verified Gems (Serv:)</div>
              <div className="text-slate-400 text-sm">
                Purchased or officially earned gems that are synchronized with the server. 
                Can be used for all in-game purchases, equipment upgrades, and special items.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              <AlertCircle className="size-5 text-amber-400" />
            </div>
            <div>
              <div className="text-slate-200 mb-1">Unverified Gems</div>
              <div className="text-slate-400 text-sm">
                Gems earned from battles and daily rewards. These need to be converted to verified gems 
                or can be used for limited features. Conversion may take 24-48 hours.
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Gem Shop Preview */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-amber-500 mb-4">Gem Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Package 1 */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 text-center hover:border-amber-500/50 transition-all cursor-pointer">
            <Gem className="size-12 mx-auto mb-3 text-green-400" />
            <div className="text-slate-200 mb-1">Starter Pack</div>
            <div className="text-green-400 mb-3">500 Gems</div>
            <div className="text-amber-500 mb-3">$4.99</div>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
              Purchase
            </Button>
          </div>

          {/* Package 2 */}
          <div className="bg-gradient-to-b from-amber-900/20 to-slate-700/30 p-4 rounded-lg border-2 border-amber-500/50 text-center hover:border-amber-400 transition-all cursor-pointer relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white">
              POPULAR
            </Badge>
            <Gem className="size-12 mx-auto mb-3 text-green-400" />
            <div className="text-slate-200 mb-1">Premium Pack</div>
            <div className="text-green-400 mb-1">1500 Gems</div>
            <div className="text-slate-400 text-xs line-through mb-2">$14.99</div>
            <div className="text-amber-500 mb-3">$9.99</div>
            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
              Purchase
            </Button>
          </div>

          {/* Package 3 */}
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 text-center hover:border-amber-500/50 transition-all cursor-pointer">
            <Gem className="size-12 mx-auto mb-3 text-green-400" />
            <div className="text-slate-200 mb-1">Mega Pack</div>
            <div className="text-green-400 mb-3">5000 Gems</div>
            <div className="text-amber-500 mb-3">$29.99</div>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
              Purchase
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-amber-500 mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {[
            { type: 'Earned', amount: '+50', time: '2 hours ago', verified: false },
            { type: 'Purchase', amount: '+500', time: '1 day ago', verified: true },
            { type: 'Spent', amount: '-200', time: '2 days ago', verified: true },
            { type: 'Earned', amount: '+75', time: '3 days ago', verified: false },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600">
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${transaction.type === 'Earned' ? 'bg-green-500/20' : transaction.type === 'Purchase' ? 'bg-blue-500/20' : 'bg-red-500/20'}
                `}>
                  <Gem className={`
                    size-4
                    ${transaction.type === 'Earned' ? 'text-green-400' : transaction.type === 'Purchase' ? 'text-blue-400' : 'text-red-400'}
                  `} />
                </div>
                <div>
                  <div className="text-slate-200">{transaction.type}</div>
                  <div className="text-slate-400 text-xs">{transaction.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`
                  ${transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}
                `}>
                  {transaction.amount}
                </div>
                {transaction.verified && (
                  <div className="text-green-500 text-xs flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}