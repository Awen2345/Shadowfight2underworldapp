# 🎮 Shadow Fight 2 Underworld - Setup Guide

Panduan lengkap setup aplikasi **Shadow Fight 2 Underworld Simulator** dengan **Frontend (React)** + **Backend (Node.js + SQLite)**.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Pastikan sudah terinstall:
- **Node.js** v16 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** atau **yarn**
- **Git**

Check versi:
```bash
node --version  # Should be v16+
npm --version   # Should be 8+
```

---

## Backend Setup

### 1. Navigate ke folder backend
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
# Copy file example
cp .env.example .env
```

Edit `.env` sesuai kebutuhan:
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/shadowfight.db
CORS_ORIGIN=http://localhost:5173
```

### 4. Initialize database
```bash
npm run init-db
```

Output:
```
🔧 Initializing database...
✅ Database initialized successfully
✅ Mock data inserted successfully
```

### 5. Start backend server
```bash
# Development mode (auto-reload dengan nodemon)
npm run dev

# Production mode
npm start
```

Backend akan berjalan di: **http://localhost:3001**

Test health check:
```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "message": "Shadow Fight Underworld API is running"
}
```

---

## Frontend Setup

### 1. Navigate ke root folder
```bash
cd ..  # Keluar dari folder backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
# Copy file example
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

### 4. Start frontend development server
```bash
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## Running the Application

### Development Mode (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Buka browser: **http://localhost:5173**

### Testing API Connection

1. Buka frontend
2. Cek browser console (F12)
3. Harusnya tidak ada error koneksi
4. Data akan dimuat dari backend

---

## Deployment

### Backend Deployment

#### Option 1: Railway.app (FREE & EASY)

1. **Sign up** di [Railway.app](https://railway.app)

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

3. **Deploy:**
```bash
cd backend
railway login
railway init
railway up
```

4. **Set environment variables** di Railway Dashboard:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend-url.com`

5. **Get URL:** Railway akan berikan URL seperti `https://yourapp.railway.app`

#### Option 2: Render.com (FREE)

1. Sign up di [Render.com](https://render.com)
2. Create **New Web Service**
3. Connect GitHub repository
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy!

#### Option 3: Heroku

```bash
heroku login
heroku create shadowfight-backend
git subtree push --prefix backend heroku main
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend.com
```

---

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set environment variable:**
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.railway.app/api
```

4. **Production deploy:**
```bash
vercel --prod
```

#### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

4. **Set environment variables** di Netlify dashboard

#### Option 3: GitHub Pages (Static Only)

```bash
npm run build
# Upload dist/ folder ke GitHub Pages
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│            React + TypeScript                   │
│         http://localhost:5173                   │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 │ (REST)
                 ▼
┌─────────────────────────────────────────────────┐
│                   BACKEND                       │
│          Node.js + Express.js                   │
│         http://localhost:3001/api               │
└────────────────┬────────────────────────────────┘
                 │
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────────────────┐
│                  DATABASE                       │
│               SQLite3                           │
│     backend/database/shadowfight.db             │
└─────────────────────────────────────────────────┘
```

---

## API Endpoints Overview

### Players
- `GET /api/players/:username` - Get player
- `POST /api/players` - Create/update player
- `PATCH /api/players/:username/stats` - Update stats

### Leaderboard
- `GET /api/leaderboard/players` - Top 100 players
- `GET /api/leaderboard/clans` - Top 100 clans
- `GET /api/leaderboard/top20` - Top 20 for rewards

### Raids
- `POST /api/raids` - Record raid
- `GET /api/raids/player/:username` - Raid history
- `GET /api/raids/player/:username/today` - Today's raids

### Inventory
- `GET /api/inventory/:username` - Get inventory
- `POST /api/inventory/:username/item` - Add item
- `DELETE /api/inventory/:username/item/:itemId` - Remove item

### Equipment
- `GET /api/equipment/:username` - Get equipment
- `POST /api/equipment/:username` - Add equipment
- `PATCH /api/equipment/:username/:id/equip` - Equip item

See full API docs: `backend/README.md`

---

## Troubleshooting

### ❌ Backend tidak bisa start

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Mac/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Atau ganti port di backend/.env
PORT=3002
```

---

### ❌ Frontend tidak connect ke backend

**Error:** `Network Error` atau `CORS Error`

**Solution 1:** Check CORS settings
```bash
# backend/.env
CORS_ORIGIN=http://localhost:5173
```

**Solution 2:** Check backend URL
```bash
# frontend .env
VITE_API_URL=http://localhost:3001/api
```

**Solution 3:** Restart kedua server

---

### ❌ Database error

**Error:** `database is locked`

**Solution:**
```bash
# Reset database
cd backend
rm database/shadowfight.db
npm run init-db
```

---

### ❌ Dependencies error

**Solution:**
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install

# Atau gunakan npm ci untuk clean install
npm ci
```

---

## Project Structure

```
shadow-fight-underworld/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection
│   │   ├── schema.sql         # Database schema
│   │   └── shadowfight.db     # SQLite database file
│   ├── routes/
│   │   ├── players.js         # Player endpoints
│   │   ├── raids.js           # Raid endpoints
│   │   ├── inventory.js       # Inventory endpoints
│   │   ├── equipment.js       # Equipment endpoints
│   │   ├── clans.js           # Clan endpoints
│   │   ├── leaderboard.js     # Leaderboard endpoints
│   │   └── stats.js           # Statistics endpoints
│   ├── scripts/
│   │   └── initDatabase.js    # Database initialization
│   ├── server.js              # Express server
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client base
│   │   ├── playerApi.ts       # Player API calls
│   │   ├── raidApi.ts         # Raid API calls
│   │   ├── inventoryApi.ts    # Inventory API calls
│   │   ├── equipmentApi.ts    # Equipment API calls
│   │   └── leaderboardApi.ts  # Leaderboard API calls
│   └── ... (existing frontend libs)
│
├── components/                 # React components
├── App.tsx                    # Main app component
├── package.json
├── .env.example
├── SETUP_GUIDE.md            # This file
└── README.md
```

---

## Development Tips

### 1. Hot Reload
Backend dan frontend sama-sama support hot reload:
- Backend: nodemon (npm run dev)
- Frontend: Vite HMR (automatic)

### 2. Database Management

View database content:
```bash
cd backend
sqlite3 database/shadowfight.db

# SQLite commands:
.tables                          # Show all tables
.schema players                  # Show table schema
SELECT * FROM players LIMIT 5;   # Query data
.quit                           # Exit
```

### 3. API Testing

Gunakan VS Code extension **Thunder Client** atau **Postman**:

Example: Get player stats
```
GET http://localhost:3001/api/stats/You
```

Example: Record raid
```
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

---

## Next Steps

1. ✅ Setup backend dan frontend
2. ✅ Test koneksi API
3. 🔄 Integrate frontend dengan backend API
4. 🚀 Deploy ke production
5. 🎮 Play & enjoy!

---

## Support

Jika ada masalah:
1. Check backend logs (terminal backend)
2. Check frontend console (F12 di browser)
3. Check API di Thunder Client/Postman
4. Read error messages carefully

**Happy coding! 🎮⚔️**
