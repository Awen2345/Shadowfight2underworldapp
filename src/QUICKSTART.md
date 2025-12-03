# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan Shadow Fight 2 Underworld dengan Backend.

## ⚡ 5 Menit Setup

### 1️⃣ Install Dependencies

```bash
# Root (Frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

### 2️⃣ Setup Backend

```bash
cd backend

# Initialize database (auto-create mock data)
npm run init-db

# Start backend server
npm run dev
```

✅ Backend running di: **http://localhost:3001**

### 3️⃣ Start Frontend

**Buka terminal baru:**

```bash
# Di root folder
npm run dev
```

✅ Frontend running di: **http://localhost:5173**

---

## 🎮 Test the App

1. Buka browser: **http://localhost:5173**
2. Lihat **Backend Status** indicator di kanan atas (🟢 = connected)
3. Play a raid dan lihat stats update real-time!

---

## 🔧 Quick Commands

### Backend

```bash
cd backend

# Development (auto-reload)
npm run dev

# Production
npm start

# Reset database
rm database/shadowfight.db && npm run init-db
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📊 Check Backend Health

### Browser
```
http://localhost:3001/health
```

### Terminal
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

## 🐛 Troubleshooting

### ❌ Backend won't start

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
PORT=3002
```

### ❌ Frontend shows "Disconnected"

1. Check backend is running
2. Check `.env` has correct API URL
3. Check browser console (F12)

### ❌ CORS Error

Update `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 📁 Project Structure

```
shadow-fight-underworld/
├── backend/              # Node.js API
│   ├── database/        # SQLite database
│   ├── routes/          # API endpoints
│   └── server.js        # Express server
├── lib/
│   ├── api/            # API clients
│   ├── hooks/          # React hooks
│   ├── services/       # Business logic
│   └── context/        # React context
├── components/         # React components
└── App.tsx            # Main app
```

---

## 🎯 What's Working?

✅ **Backend API** - 30+ endpoints  
✅ **SQLite Database** - Persistent storage  
✅ **Player Stats** - Real-time updates  
✅ **Leaderboard** - Top 100 players & clans  
✅ **Raid System** - Record & history  
✅ **Inventory** - Item management  
✅ **Equipment** - Gear system  
✅ **Fallback** - Works offline with localStorage  

---

## 📚 Documentation

- **Full Setup**: `SETUP_GUIDE.md`
- **Frontend Integration**: `FRONTEND_INTEGRATION.md`
- **Backend API**: `backend/README.md`

---

## 🚢 Next Steps

1. ✅ Backend & Frontend running
2. 🎮 Play and test features
3. 🔄 Integrate more components
4. 🚀 Deploy to production

---

**Happy gaming! 🎮⚔️**
