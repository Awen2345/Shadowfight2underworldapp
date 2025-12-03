# ⚙️ Environment Setup

## 🔧 Create `.env` File

Jika Anda melihat error `Cannot read properties of undefined (reading 'VITE_API_URL')`, berarti file `.env` belum dibuat.

### Frontend `.env`

**Location:** Root folder project

**Create file:**
```bash
# Di root folder
touch .env
```

**Content:**
```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Environment
VITE_ENV=development
```

### Backend `.env`

**Location:** `backend/` folder

**Create file:**
```bash
# Di folder backend
cd backend
touch .env
```

**Content:**
```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/shadowfight.db
CORS_ORIGIN=http://localhost:5173
```

---

## 🔄 Restart Development Server

Setelah membuat `.env` file, **RESTART** development server:

```bash
# Stop server (Ctrl+C)
# Then start again
npm run dev
```

---

## ✅ Verify Setup

### 1. Check `.env` file exists
```bash
# Di root folder
ls -la .env

# Di backend folder
ls -la backend/.env
```

### 2. Check variables loaded
Open browser console (F12):
```javascript
console.log(import.meta.env.VITE_API_URL);
// Should show: http://localhost:3001/api
```

### 3. Check backend status
- Buka http://localhost:5173
- Lihat indicator di kanan atas
- 🟢 = Connected
- 🔴 = Disconnected (but app still works with localStorage)

---

## 🎯 Without Backend (localStorage Only)

Jika Anda ingin menggunakan localStorage saja (tanpa backend):

**Option 1: Don't create `.env` file**
- App akan otomatis menggunakan localStorage

**Option 2: Comment out VITE_API_URL**
```env
# VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined"

**Solution:**
1. ✅ Create `.env` file di root folder
2. ✅ Add `VITE_API_URL=http://localhost:3001/api`
3. ✅ Restart dev server (Ctrl+C then `npm run dev`)

### Error: "CORS error"

**Solution:**
1. Check backend `.env` has `CORS_ORIGIN=http://localhost:5173`
2. Restart backend server

### Backend not connecting

**Solution:**
1. Check backend is running: `cd backend && npm run dev`
2. Check port 3001 is not in use
3. Test health check: `curl http://localhost:3001/health`

---

## 📁 File Structure

```
shadow-fight-underworld/
├── .env                    ← Frontend env (CREATE THIS)
├── .env.example            ← Template
├── backend/
│   ├── .env               ← Backend env (CREATE THIS)
│   └── .env.example       ← Template
└── ...
```

---

## 🚀 Quick Setup Commands

```bash
# Create both .env files at once
echo "VITE_API_URL=http://localhost:3001/api
VITE_ENV=development" > .env

cd backend
echo "PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/shadowfight.db
CORS_ORIGIN=http://localhost:5173" > .env
cd ..

# Done! Now restart servers
```

---

**Now restart your dev server and the error should be fixed! ✅**
