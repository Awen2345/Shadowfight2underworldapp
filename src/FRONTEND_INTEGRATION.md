# 🎮 Frontend Integration Guide

Panduan lengkap integrasi backend API ke frontend Shadow Fight 2 Underworld.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Integration](#api-integration)
3. [Hooks Usage](#hooks-usage)
4. [Migration Guide](#migration-guide)
5. [Testing](#testing)

---

## Architecture Overview

### Layer Structure

```
┌─────────────────────────────────────────┐
│         COMPONENTS (UI)                 │
│     MapView, MyPlayerStats, etc.        │
└──────────────┬──────────────────────────┘
               │ Uses Hooks
┌──────────────▼──────────────────────────┐
│         HOOKS LAYER                     │
│  usePlayerStats, useLeaderboard, etc.   │
└──────────────┬──────────────────────────┘
               │ Calls Services
┌──────────────▼──────────────────────────┐
│       SERVICE LAYER                     │
│    PlayerService, InventoryService      │
└──────────────┬──────────────────────────┘
               │ Uses API Clients
┌──────────────▼──────────────────────────┐
│         API LAYER                       │
│  playerApi, raidApi, inventoryApi       │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
┌──────────────▼──────────────────────────┐
│      BACKEND SERVER                     │
│    Node.js + Express + SQLite           │
└─────────────────────────────────────────┘
```

---

## API Integration

### 1. Setup Environment

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

### 2. Available API Clients

#### **Player API** (`lib/api/playerApi.ts`)

```typescript
import { playerApi } from './lib/api/playerApi';

// Get player
const response = await playerApi.getPlayer('You');
if (response.data) {
  console.log(response.data);
}

// Update player stats
await playerApi.updateStats('You', {
  rating: 1500,
  total_raids: 10
});
```

#### **Raid API** (`lib/api/raidApi.ts`)

```typescript
import { raidApi } from './lib/api/raidApi';

// Record raid
await raidApi.recordRaid({
  player_username: 'You',
  boss_id: 'butcher',
  boss_tier: 1,
  victory: true,
  damage_dealt: 5000,
  rounds: 3,
  rating_gained: 150,
  placement: 1
});

// Get raid history
const history = await raidApi.getPlayerRaidHistory('You', 50);

// Get raids today
const raidsToday = await raidApi.getRaidsToday('You');
```

#### **Leaderboard API** (`lib/api/leaderboardApi.ts`)

```typescript
import { leaderboardApi } from './lib/api/leaderboardApi';

// Get top 100 players
const players = await leaderboardApi.getPlayersLeaderboard(100);

// Get top 100 clans
const clans = await leaderboardApi.getClansLeaderboard(100);

// Get player rank
const rank = await leaderboardApi.getPlayerRank('You');
```

#### **Inventory API** (`lib/api/inventoryApi.ts`)

```typescript
import { inventoryApi } from './lib/api/inventoryApi';

// Get inventory
const inventory = await inventoryApi.getInventory('You');

// Add item
await inventoryApi.addItem('You', 'verified-gems', 100);

// Remove item
await inventoryApi.removeItem('You', 'verified-gems', 50);
```

---

## Hooks Usage

### 1. usePlayerStats

Get player statistics with real-time updates:

```typescript
import { usePlayerStats } from './lib/hooks/usePlayerStats';

function MyComponent() {
  const { 
    stats, 
    loading, 
    error, 
    refresh,
    winRate,
    avgDamagePerRound,
    raidsToday
  } = usePlayerStats();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Rating: {stats?.rating}</h2>
      <p>Win Rate: {winRate.toFixed(1)}%</p>
      <p>Raids Today: {raidsToday}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### 2. useLeaderboard

Get leaderboard data:

```typescript
import { useLeaderboard } from './lib/hooks/useLeaderboard';

function LeaderboardComponent() {
  const { players, clans, loading, error, refresh } = useLeaderboard(100);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div>
      <h2>Top Players</h2>
      {players.map((player, index) => (
        <div key={player.id}>
          #{index + 1} - {player.username} - {player.rating}
        </div>
      ))}
    </div>
  );
}
```

### 3. useInventory

Manage inventory items:

```typescript
import { useInventory } from './lib/hooks/useInventory';

function InventoryComponent() {
  const { 
    inventory, 
    loading, 
    getItemQuantity, 
    addItem, 
    removeItem 
  } = useInventory();

  const gems = getItemQuantity('verified-gems');

  const handleBuyGems = async () => {
    await addItem('verified-gems', 100);
  };

  return (
    <div>
      <p>Gems: {gems}</p>
      <button onClick={handleBuyGems}>Buy 100 Gems</button>
    </div>
  );
}
```

### 4. useGameContext

Global game state with context:

```typescript
import { useGameContext } from './lib/context/GameContext';

function GameComponent() {
  const { 
    playerStats, 
    isLoading, 
    refreshStats, 
    updateAfterRaid,
    backendConnected 
  } = useGameContext();

  return (
    <div>
      <p>Backend: {backendConnected ? '🟢 Connected' : '🔴 Offline'}</p>
      <p>Rating: {playerStats?.rating}</p>
    </div>
  );
}
```

---

## Migration Guide

### Replace localStorage with API

#### Before (localStorage):

```typescript
import { getPlayerStats, updatePlayerStats } from './lib/playerStatsData';

// Get stats
const stats = getPlayerStats();

// Update stats
const updated = updatePlayerStats(raidResult);
```

#### After (API with fallback):

```typescript
import { usePlayerStats } from './lib/hooks/usePlayerStats';
import { useGameContext } from './lib/context/GameContext';

function Component() {
  // Option 1: Use Hook
  const { stats } = usePlayerStats();

  // Option 2: Use Context
  const { playerStats, updateAfterRaid } = useGameContext();

  const handleRaid = async (result) => {
    await updateAfterRaid(result);
  };

  return <div>Rating: {stats?.rating}</div>;
}
```

---

## Component Integration Examples

### Example 1: Update MapView

```typescript
// components/MapView.tsx
import { useGameContext } from '../lib/context/GameContext';
import { usePlayerStats } from '../lib/hooks/usePlayerStats';

export const MapView = () => {
  const { stats, raidsToday } = usePlayerStats();
  const { updateAfterRaid } = useGameContext();

  const handleBossDefeat = async (raidResult) => {
    await updateAfterRaid(raidResult);
    // Stats will auto-update via context
  };

  return (
    <div>
      <h1>Your Rating: {stats?.rating}</h1>
      <p>Raids Today: {raidsToday}</p>
      {/* Boss components */}
    </div>
  );
};
```

### Example 2: Update PlayerLeaderboard

```typescript
// components/PlayerLeaderboard.tsx
import { useLeaderboard } from '../lib/hooks/useLeaderboard';

export const PlayerLeaderboard = () => {
  const { players, loading, error, refresh } = useLeaderboard(100);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <button onClick={refresh}>Refresh Leaderboard</button>
      {players.map((player, index) => (
        <PlayerCard key={player.id} player={player} rank={index + 1} />
      ))}
    </div>
  );
};
```

### Example 3: Update MyPlayerStats

```typescript
// components/MyPlayerStats.tsx
import { usePlayerStats } from '../lib/hooks/usePlayerStats';
import { useGameContext } from '../lib/context/GameContext';

export const MyPlayerStats = () => {
  const { 
    stats, 
    winRate, 
    avgDamagePerRound, 
    raidsToday, 
    loading 
  } = usePlayerStats();
  
  const { backendConnected } = useGameContext();

  return (
    <div>
      {/* Connection indicator */}
      <div>
        {backendConnected ? '🟢 Online' : '🟡 Offline Mode'}
      </div>

      {/* Stats display */}
      <div>Rating: {stats?.rating}</div>
      <div>Level: {stats?.level}</div>
      <div>Win Rate: {winRate.toFixed(1)}%</div>
      <div>Avg Damage: {avgDamagePerRound}</div>
      <div>Raids Today: {raidsToday}</div>
    </div>
  );
};
```

---

## Testing

### 1. Test Backend Connection

```typescript
import { getBackendStatus } from './lib/apiAdapter';

const status = await getBackendStatus();
console.log('Backend enabled:', status.enabled);
console.log('Backend connected:', status.connected);
console.log('API URL:', status.url);
```

### 2. Test with Mock Data

Backend automatically creates mock data on init:
- 1 main player ("You")
- 10 mock players
- 3 mock clans
- Starter inventory

### 3. Test API Endpoints

Use browser console:

```javascript
// Test player API
const response = await fetch('http://localhost:3001/api/players/You');
const data = await response.json();
console.log(data);

// Test leaderboard
const leaderboard = await fetch('http://localhost:3001/api/leaderboard/players');
const players = await leaderboard.json();
console.log(players);
```

---

## Error Handling

### Automatic Fallback

The integration automatically falls back to localStorage if backend is unavailable:

```typescript
// This works even if backend is down
const stats = await getPlayerStats();
```

### Manual Error Handling

```typescript
const { stats, error } = usePlayerStats();

if (error) {
  console.error('Failed to load stats:', error);
  // Show error message to user
}
```

---

## Performance Optimization

### 1. Context Provider

GameProvider wraps entire app and provides global state:

```typescript
// App.tsx
<GameProvider>
  <YourApp />
</GameProvider>
```

### 2. Subscription Pattern

PlayerService uses subscription pattern for real-time updates:

```typescript
// Automatically updates all components when stats change
playerService.subscribe((stats) => {
  // Stats updated
});
```

### 3. Optimistic Updates

Update UI immediately, sync with backend in background:

```typescript
// Local update (instant)
setLocalStats(newStats);

// Backend sync (background)
await playerApi.updateStats('You', newStats);
```

---

## Troubleshooting

### Backend not connecting?

1. Check backend is running: `cd backend && npm run dev`
2. Check `.env` has correct API URL
3. Check CORS settings in backend
4. Check browser console for errors

### Data not syncing?

1. Refresh the page
2. Check backend logs
3. Call `refresh()` from hooks
4. Check SQLite database directly

### Using localStorage only?

If you don't want backend, just don't set `VITE_API_URL` in `.env`:

```env
# Comment out or remove this line
# VITE_API_URL=http://localhost:3001/api
```

App will automatically use localStorage fallback.

---

## Next Steps

1. ✅ Test backend connection with BackendStatus component
2. ✅ Update components to use hooks
3. ✅ Test raid recording and stat updates
4. ✅ Test leaderboard updates
5. 🚀 Deploy to production

---

**Happy coding! 🎮**
