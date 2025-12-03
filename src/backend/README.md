# Shadow Fight 2 Underworld Backend API

Backend server untuk aplikasi Shadow Fight 2 Underworld Simulator menggunakan **Node.js + Express + SQLite3**.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm atau yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/shadowfight.db
CORS_ORIGIN=http://localhost:5173
```

3. **Initialize database:**
```bash
npm run init-db
```

4. **Start server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### **Players**
- `GET /players/:username` - Get player by username
- `POST /players` - Create or update player
- `PATCH /players/:username/stats` - Update player stats
- `DELETE /players/:username` - Delete player

#### **Leaderboard**
- `GET /leaderboard/players?limit=100` - Get top players
- `GET /leaderboard/clans?limit=100` - Get top clans
- `GET /leaderboard/players/:username/rank` - Get player rank
- `GET /leaderboard/top20` - Get top 20 for rewards

#### **Raids**
- `POST /raids` - Record raid result
- `GET /raids/player/:username?limit=50` - Get player raid history
- `GET /raids/player/:username/today` - Get raids today count
- `GET /raids/stats/:username` - Get raid statistics

#### **Inventory**
- `GET /inventory/:username` - Get player inventory
- `GET /inventory/:username/item/:itemId` - Get item quantity
- `POST /inventory/:username/item` - Add/update item
- `DELETE /inventory/:username/item/:itemId` - Remove item

#### **Equipment**
- `GET /equipment/:username` - Get player equipment
- `GET /equipment/:username/equipped` - Get equipped items
- `POST /equipment/:username` - Add equipment
- `PATCH /equipment/:username/:equipmentId/equip` - Equip/unequip
- `PATCH /equipment/:username/:equipmentId/upgrade` - Start upgrade
- `PATCH /equipment/:username/:equipmentId/complete-upgrade` - Complete upgrade

#### **Clans**
- `GET /clans` - Get all clans
- `GET /clans/:identifier` - Get clan by ID or tag
- `POST /clans` - Create clan
- `POST /clans/:clanId/join` - Join clan
- `POST /clans/:clanId/leave` - Leave clan

#### **Stats**
- `GET /stats/:username` - Get player statistics
- `GET /stats/global/summary` - Get global statistics

## 🗄️ Database Schema

### Tables
- **players** - Player profiles and stats
- **clans** - Clan information
- **raids** - Raid history
- **equipment** - Player equipment
- **inventory** - Player items
- **medals** - Player medals
- **enchantments** - Equipment enchantments
- **daily_raids** - Daily raid tracking

## 🚢 Deployment

### Option 1: Railway (Recommended)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login & deploy:
```bash
railway login
railway init
railway up
```

3. Set environment variables di Railway dashboard
4. Database akan otomatis di-create saat deploy

### Option 2: Render

1. Create new Web Service di Render
2. Connect repository
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables
6. Deploy!

### Option 3: Heroku

```bash
heroku create your-app-name
git subtree push --prefix backend heroku main
heroku config:set NODE_ENV=production
```

### Option 4: VPS (DigitalOcean, Linode, etc)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone & setup
git clone <your-repo>
cd backend
npm install
npm run init-db

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "shadowfight-api"
pm2 startup
pm2 save
```

## 🔧 Configuration

### Frontend Connection

Update frontend `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### CORS Configuration

Update `backend/.env`:
```env
CORS_ORIGIN=https://your-frontend-url.com
```

Untuk multiple origins di production:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://frontend1.com', 'https://frontend2.com'],
  credentials: true
}));
```

## 🧪 Testing API

Gunakan tools seperti:
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)
- **curl**

Example request:
```bash
# Get player stats
curl http://localhost:3001/api/stats/You

# Record raid
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

## 📊 Database Management

### View database:
```bash
sqlite3 backend/database/shadowfight.db
```

SQLite commands:
```sql
-- Show tables
.tables

-- Show table schema
.schema players

-- Query data
SELECT * FROM players ORDER BY rating DESC LIMIT 10;

-- Exit
.quit
```

### Reset database:
```bash
rm backend/database/shadowfight.db
npm run init-db
```

## 🐛 Troubleshooting

### Database locked error
```bash
# Close all connections and restart
rm backend/database/shadowfight.db-*
npm run init-db
```

### Port already in use
```bash
# Change port di .env atau kill process
lsof -ti:3001 | xargs kill -9
```

### CORS errors
- Check CORS_ORIGIN di `.env`
- Pastikan frontend URL sesuai

## 📝 License

MIT License
