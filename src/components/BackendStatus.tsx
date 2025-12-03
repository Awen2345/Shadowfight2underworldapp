import { useState, useEffect } from 'react';
import { useGameContext } from '../lib/context/GameContext';
import { Database, Wifi, WifiOff, HardDrive } from 'lucide-react';

export const BackendStatus: React.FC = () => {
  const { backendConnected } = useGameContext();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const apiUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL as string
    : undefined;

  // Don't show anything if no API URL is configured
  if (!apiUrl) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-50">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Status Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm shadow-lg transition-all ${
            backendConnected
              ? 'bg-green-900/80 border-green-500/30 hover:bg-green-900/90'
              : 'bg-red-900/80 border-red-500/30 hover:bg-red-900/90'
          }`}
        >
          {backendConnected ? (
            <>
              <Wifi className="size-4 text-green-400" />
              <Database className="size-4 text-green-400" />
            </>
          ) : (
            <>
              <WifiOff className="size-4 text-red-400" />
              <HardDrive className="size-4 text-red-400" />
            </>
          )}
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Database className="size-4 text-blue-400" />
              <span className="text-slate-200">Backend Status</span>
            </div>
            
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${
                    backendConnected ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <span>
                  {backendConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-2 border-t border-slate-700 pt-2">
                {backendConnected ? (
                  <>
                    <div>✓ Using backend API</div>
                    <div className="break-all mt-1">{apiUrl}</div>
                  </>
                ) : (
                  <>
                    <div>⚠ Using localStorage fallback</div>
                    <div className="mt-1">Backend unreachable</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};