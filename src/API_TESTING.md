# 🧪 API Testing Guide

Panduan lengkap testing backend API Shadow Fight 2 Underworld.

## 🚀 Prerequisites

1. Backend running di `http://localhost:3001`
2. Database sudah di-initialize (`npm run init-db`)
3. Tools: Browser, Terminal, atau Postman

---

## 🏥 Health Check

### Request
```bash
GET http://localhost:3001/health
```

### Response
```json
{
  "status": "ok",
  "message": "Shadow Fight Underworld API is running"
}
```

### cURL
```bash
curl http://localhost:3001/health
```

---

## 👤 Player API

### 1. Get Player

**Request:**
```bash
GET http://localhost:3001/api/players/You
```

**cURL:**
```bash
curl http://localhost:3001/api/players/You
```

**Response:**
```json
{
  "id": "uuid-here",
  "username": "You",
  "rating": 1250,
  "best_rating": 1250,
  "level": 1,
  "total_raids": 0,
  "total_victories": 0,
  "total_defeats": 0,
  "total_damage": 0,
  "total_rounds": 0,
  "first_place_finishes": 0,
  "clan_id": null,
  "season_banner": null,
  "last_presence": "Online",
  "created_at": "2024-12-03T...",
  "updated_at": "2024-12-03T..."
}
```

### 2. Create/Update Player

**Request:**
```bash
POST http://localhost:3001/api/players
Content-Type: application/json

{
  "username": "TestPlayer",
  "rating": 1500,
  "level": 2
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "username": "TestPlayer",
    "rating": 1500,
    "level": 2
  }'
```

### 3. Update Player Stats

**Request:**
```bash
PATCH http://localhost:3001/api/players/You/stats
Content-Type: application/json

{
  "rating": 1350,
  "total_raids": 5,
  "total_victories": 3,
  "total_defeats": 2
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3001/api/players/You/stats \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 1350,
    "total_raids": 5,
    "total_victories": 3,
    "total_defeats": 2
  }'
```

---

## 🏆 Leaderboard API

### 1. Get Top Players

**Request:**
```bash
GET http://localhost:3001/api/leaderboard/players?limit=10
```

**cURL:**
```bash
curl "http://localhost:3001/api/leaderboard/players?limit=10"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "ShadowMaster99",
    "rating": 3500,
    "rank": 1,
    "level": 10,
    "clan_tag": "SHA",
    "season_banner": "gold",
    "win_rate": "78.5",
    "avg_damage_per_round": 1250
  },
  // ... more players
]
```

### 2. Get Top Clans

**Request:**
```bash
GET http://localhost:3001/api/leaderboard/clans?limit=10
```

**cURL:**
```bash
curl "http://localhost:3001/api/leaderboard/clans?limit=10"
```

### 3. Get Player Rank

**Request:**
```bash
GET http://localhost:3001/api/leaderboard/players/You/rank
```

**cURL:**
```bash
curl http://localhost:3001/api/leaderboard/players/You/rank
```

**Response:**
```json
{
  "rank": 45,
  "rating": 1250
}
```

---

## ⚔️ Raid API

### 1. Record Raid

**Request:**
```bash
POST http://localhost:3001/api/raids
Content-Type: application/json

{
  "player_username": "You",
  "boss_id": "butcher",
  "boss_tier": 1,
  "victory": true,
  "damage_dealt": 5000,
  "rounds": 3,
  "rating_gained": 150,
  "placement": 1
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/raids \
  -H "Content-Type: application/json" \
  -d '{
    "player_username": "You",
    "boss_id": "butcher",
    "boss_tier": 1,
    "victory": true,
    "damage_dealt": 5000,
    "rounds": 3,
    "rating_gained": 150,
    "placement": 1
  }'
```

**Response:**
```json
{
  "raid_id": "uuid",
  "player": {
    "rating": 1400,
    "total_raids": 1,
    "total_victories": 1,
    // ... updated stats
  },
  "message": "Raid recorded successfully"
}
```

### 2. Get Raid History

**Request:**
```bash
GET http://localhost:3001/api/raids/player/You?limit=10
```

**cURL:**
```bash
curl "http://localhost:3001/api/raids/player/You?limit=10"
```

### 3. Get Raids Today

**Request:**
```bash
GET http://localhost:3001/api/raids/player/You/today
```

**cURL:**
```bash
curl http://localhost:3001/api/raids/player/You/today
```

**Response:**
```json
{
  "raids_today": 3,
  "date": "2024-12-03"
}
```

---

## 🎒 Inventory API

### 1. Get Inventory

**Request:**
```bash
GET http://localhost:3001/api/inventory/You
```

**cURL:**
```bash
curl http://localhost:3001/api/inventory/You
```

**Response:**
```json
[
  {
    "id": 1,
    "player_id": "uuid",
    "item_id": "verified-gems",
    "quantity": 500,
    "created_at": "...",
    "updated_at": "..."
  },
  {
    "id": 2,
    "item_id": "steel-keys",
    "quantity": 10
  }
]
```

### 2. Add Item

**Request:**
```bash
POST http://localhost:3001/api/inventory/You/item
Content-Type: application/json

{
  "item_id": "verified-gems",
  "quantity": 100
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/inventory/You/item \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "verified-gems",
    "quantity": 100
  }'
```

### 3. Remove Item

**Request:**
```bash
DELETE http://localhost:3001/api/inventory/You/item/verified-gems
Content-Type: application/json

{
  "quantity": 50
}
```

**cURL:**
```bash
curl -X DELETE http://localhost:3001/api/inventory/You/item/verified-gems \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50
  }'
```

---

## ⚔️ Equipment API

### 1. Get Equipment

**Request:**
```bash
GET http://localhost:3001/api/equipment/You
```

**cURL:**
```bash
curl http://localhost:3001/api/equipment/You
```

### 2. Add Equipment

**Request:**
```bash
POST http://localhost:3001/api/equipment/You
Content-Type: application/json

{
  "equipment_id": "blade-of-shadow",
  "equipment_type": "weapon",
  "level": 1
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/equipment/You \
  -H "Content-Type: application/json" \
  -d '{
    "equipment_id": "blade-of-shadow",
    "equipment_type": "weapon",
    "level": 1
  }'
```

### 3. Equip Item

**Request:**
```bash
PATCH http://localhost:3001/api/equipment/You/blade-of-shadow/equip
Content-Type: application/json

{
  "is_equipped": true
}
```

**cURL:**
```bash
curl -X PATCH http://localhost:3001/api/equipment/You/blade-of-shadow/equip \
  -H "Content-Type: application/json" \
  -d '{"is_equipped": true}'
```

---

## 🏰 Clan API

### 1. Get All Clans

**Request:**
```bash
GET http://localhost:3001/api/clans?limit=10
```

**cURL:**
```bash
curl "http://localhost:3001/api/clans?limit=10"
```

### 2. Create Clan

**Request:**
```bash
POST http://localhost:3001/api/clans
Content-Type: application/json

{
  "name": "Warriors of Shadow",
  "tag": "WOS",
  "leader_username": "You"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/clans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Warriors of Shadow",
    "tag": "WOS",
    "leader_username": "You"
  }'
```

### 3. Join Clan

**Request:**
```bash
POST http://localhost:3001/api/clans/WOS/join
Content-Type: application/json

{
  "username": "You"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/clans/WOS/join \
  -H "Content-Type: application/json" \
  -d '{"username": "You"}'
```

---

## 📊 Stats API

### 1. Get Player Stats

**Request:**
```bash
GET http://localhost:3001/api/stats/You
```

**cURL:**
```bash
curl http://localhost:3001/api/stats/You
```

**Response:**
```json
{
  "rating": 1250,
  "best_rating": 1250,
  "level": 1,
  "total_raids": 0,
  "total_victories": 0,
  "total_defeats": 0,
  "win_rate": 0,
  "avg_damage_per_round": 0,
  "raids_today": 0
}
```

### 2. Get Global Stats

**Request:**
```bash
GET http://localhost:3001/api/stats/global/summary
```

**cURL:**
```bash
curl http://localhost:3001/api/stats/global/summary
```

**Response:**
```json
{
  "total_players": 11,
  "total_clans": 3,
  "total_raids": 0,
  "top_player": {
    "username": "ShadowMaster99",
    "rating": 3500
  },
  "top_clan": {
    "name": "Shadow Warriors",
    "tag": "SHA",
    "total_rating": 25000
  },
  "raids_today": 0
}
```

---

## 🧪 Test Sequence (Complete Flow)

### 1. Create Player
```bash
curl -X POST http://localhost:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{"username": "TestWarrior", "rating": 1250}'
```

### 2. Record Victory Raid
```bash
curl -X POST http://localhost:3001/api/raids \
  -H "Content-Type: application/json" \
  -d '{
    "player_username": "TestWarrior",
    "boss_id": "butcher",
    "boss_tier": 1,
    "victory": true,
    "damage_dealt": 5000,
    "rounds": 3,
    "rating_gained": 150,
    "placement": 1
  }'
```

### 3. Check Updated Stats
```bash
curl http://localhost:3001/api/stats/TestWarrior
```

### 4. Check Leaderboard Position
```bash
curl http://localhost:3001/api/leaderboard/players/TestWarrior/rank
```

### 5. Add Gems Reward
```bash
curl -X POST http://localhost:3001/api/inventory/TestWarrior/item \
  -H "Content-Type: application/json" \
  -d '{"item_id": "verified-gems", "quantity": 50}'
```

### 6. Check Inventory
```bash
curl http://localhost:3001/api/inventory/TestWarrior
```

---

## 🔍 Browser Testing

### Open Browser Console (F12)

```javascript
// Test get player
const response = await fetch('http://localhost:3001/api/players/You');
const player = await response.json();
console.log(player);

// Test record raid
const raidResponse = await fetch('http://localhost:3001/api/raids', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    player_username: 'You',
    boss_id: 'butcher',
    boss_tier: 1,
    victory: true,
    damage_dealt: 5000,
    rounds: 3,
    rating_gained: 150,
    placement: 1
  })
});
const raidResult = await raidResponse.json();
console.log(raidResult);

// Test leaderboard
const leaderboard = await fetch('http://localhost:3001/api/leaderboard/players');
const players = await leaderboard.json();
console.log('Top players:', players.slice(0, 5));
```

---

## 📝 Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Shadow Fight API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/health"
      }
    },
    {
      "name": "Get Player",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/players/You"
      }
    },
    {
      "name": "Record Raid",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/raids",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"player_username\": \"You\",\n  \"boss_id\": \"butcher\",\n  \"boss_tier\": 1,\n  \"victory\": true,\n  \"damage_dealt\": 5000,\n  \"rounds\": 3,\n  \"rating_gained\": 150,\n  \"placement\": 1\n}"
        }
      }
    }
  ]
}
```

---

## ✅ Expected Results

After running test sequence:

1. ✅ Player created with initial stats
2. ✅ Raid recorded successfully
3. ✅ Player stats updated (rating +150)
4. ✅ Total raids incremented
5. ✅ Leaderboard position updated
6. ✅ Inventory gems added
7. ✅ All data persisted in database

---

## 🐛 Common Errors

### 404 Player not found
```json
{ "error": "Player not found" }
```
**Solution:** Create player first with POST /api/players

### 400 Bad Request
```json
{ "error": "item_id and quantity are required" }
```
**Solution:** Check request body has all required fields

### 500 Internal Server Error
```json
{ "error": "Internal server error" }
```
**Solution:** Check backend logs, database might be locked

---

## 📊 Database Verification

Check data directly in SQLite:

```bash
cd backend
sqlite3 database/shadowfight.db

# Check players
SELECT * FROM players WHERE username = 'You';

# Check raids
SELECT * FROM raids ORDER BY created_at DESC LIMIT 5;

# Check inventory
SELECT * FROM inventory WHERE player_id = 'your-uuid-here';

# Exit
.quit
```

---

**Happy Testing! 🧪**
