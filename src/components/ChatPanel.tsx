import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { MessageCircle, Send, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'global' | 'clan' | 'system';
}

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'global' | 'clan'>('global');

  // Mock chat messages
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'System',
      message: 'Welcome to Shadow Fight 2 Underworld!',
      timestamp: new Date(Date.now() - 3600000),
      type: 'system'
    },
    {
      id: '2',
      username: 'DragonSlayer99',
      message: 'Anyone want to team up for Tier 4 boss?',
      timestamp: new Date(Date.now() - 1800000),
      type: 'global'
    },
    {
      id: '3',
      username: 'ShadowNinja',
      message: 'Just got 5000 rating! Finally!',
      timestamp: new Date(Date.now() - 900000),
      type: 'global'
    },
    {
      id: '4',
      username: '[SHA] Warrior_X',
      message: 'Our clan is recruiting! Top 10 clan!',
      timestamp: new Date(Date.now() - 600000),
      type: 'clan'
    },
    {
      id: '5',
      username: 'MasterFighter',
      message: 'What\'s the best elixir combo for Butcher?',
      timestamp: new Date(Date.now() - 300000),
      type: 'global'
    },
    {
      id: '6',
      username: 'System',
      message: 'Season rewards will be distributed in 2 days!',
      timestamp: new Date(Date.now() - 60000),
      type: 'system'
    }
  ]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      // In a real app, this would send the message to the server
      setCurrentMessage('');
    }
  };

  const filteredMessages = messages.filter(msg => 
    activeTab === 'global' 
      ? msg.type === 'global' || msg.type === 'system'
      : msg.type === 'clan' || msg.type === 'system'
  );

  return (
    <>
      {/* Toggle Button - Always visible and clickable */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-l-none rounded-r-lg py-8 px-3 shadow-lg border-r-4 border-amber-800"
        >
          {isOpen ? (
            <X className="size-5" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="size-6" />
              <span className="text-xs">Chat</span>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Panel with Scroll Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-1/2 -translate-y-1/2 z-30 ml-16"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Scroll Paper Effect */}
            <div className="relative">
              {/* Top scroll decoration */}
              <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-lg border-t-4 border-amber-700" />
              
              {/* Main Chat Panel */}
              <Card className="w-96 h-[600px] bg-gradient-to-b from-amber-50/95 to-amber-100/95 backdrop-blur-sm border-4 border-amber-700 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-4 border-b-4 border-amber-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white flex items-center gap-2">
                      <MessageCircle className="size-5" />
                      Global Chat
                    </h3>
                    <Badge className="bg-green-500 text-white">
                      {messages.length} online
                    </Badge>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setActiveTab('global')}
                      className={`flex-1 ${
                        activeTab === 'global'
                          ? 'bg-amber-900 text-white'
                          : 'bg-amber-800/50 text-amber-100'
                      }`}
                      size="sm"
                    >
                      Global
                    </Button>
                    <Button
                      onClick={() => setActiveTab('clan')}
                      className={`flex-1 ${
                        activeTab === 'clan'
                          ? 'bg-amber-900 text-white'
                          : 'bg-amber-800/50 text-amber-100'
                      }`}
                      size="sm"
                    >
                      Clan
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {filteredMessages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {msg.type === 'system' ? (
                          <div className="bg-amber-200 border-l-4 border-amber-600 p-2 rounded text-center">
                            <span className="text-amber-900 text-sm">{msg.message}</span>
                          </div>
                        ) : (
                          <div className="bg-white/80 p-3 rounded-lg border-2 border-amber-300 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-amber-900">{msg.username}</span>
                              <span className="text-amber-600 text-xs">{formatTime(msg.timestamp)}</span>
                            </div>
                            <p className="text-slate-800 text-sm">{msg.message}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 bg-amber-100/90 border-t-4 border-amber-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white border-2 border-amber-400 text-slate-900 placeholder:text-slate-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Bottom scroll decoration */}
              <div className="absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-t from-amber-900 to-amber-800 rounded-b-lg border-b-4 border-amber-700" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}