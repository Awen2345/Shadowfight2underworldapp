# 🧪 TESTING GUIDE - Shadow Fight 2 Underworld

## 🎯 **Complete Testing Checklist**

---

## 1️⃣ **Setup & Start**

### **Backend Setup:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run init-db
npm run dev

# Expected output:
# ✅ Server running on http://localhost:3001
# ✅ Database initialized
# ✅ All endpoints ready
```

### **Frontend Setup:**
```bash
# Terminal 2 - Frontend
npm install
npm run dev

# Expected output:
# ✅ Server running on http://localhost:5173
# ✅ React app started
```

### **Browser:**
```
Open: http://localhost:5173
```

---

## 2️⃣ **Backend Connection Test**

### **Check Connection Status:**
```
1. Open app in browser
2. Look at TOP RIGHT corner
3. ✅ Should see: 🟢 Backend Connected
4. ❌ If red: Check backend is running
```

### **Test API Directly:**
```bash
# Test player stats endpoint
curl http://localhost:3001/api/player/stats

# Expected response:
{
  "id": "player-1",
  "rating": 4850,
  "level": 10,
  ...
}

# Test leaderboard endpoint
curl http://localhost:3001/api/leaderboard/players?limit=10

# Expected response:
[
  { "id": "player-1", "username": "Shadow_Master_999", "rating": 5000 },
  ...
]
```

---

## 3️⃣ **Feature Testing**

### **A. Player Stats Test**

#### **Test Steps:**
```
1. Click "Shadow_Fighter_1000" in taskbar
2. Wait for loading spinner
3. ✅ Check stats load:
   - Rating: Should show number (e.g., 4850)
   - Level: Should show Dan level
   - Win Rate: Should show percentage
   - Raids Today: Should show count

4. ✅ Check real-time updates:
   - Complete a raid (see Raid Test below)
   - Return to My Stats
   - Stats should update automatically
```

#### **Expected Results:**
```
✅ Loading spinner shows briefly
✅ Stats load from backend
✅ Win rate calculated correctly
✅ Raids today count shows
✅ Stats update after raid
```

---

### **B. Leaderboard Test**

#### **Test Steps:**
```
1. Click "Top 20" in taskbar
2. Wait for loading spinner
3. ✅ Check top 3 podium:
   - #1: Gold trophy
   - #2: Silver medal
   - #3: Bronze award

4. ✅ Check player list:
   - Should show 20 players
   - Sorted by rating (highest first)
   - Each has username, rating, clan

5. ✅ Click on a player:
   - Modal should open
   - Shows detailed stats
```

#### **Expected Results:**
```
✅ Top 20 players load
✅ Sorted correctly by rating
✅ Podium displays correctly
✅ Player stats modal works
✅ Loading state shows
```

---

### **C. Shop & Inventory Test**

#### **Test Steps:**
```
1. Note current gems count (bottom left)
2. Click "Shop" in taskbar
3. ✅ Check gems display:
   - Should match backend data
   - Verified gems shown

4. Purchase test:
   - Click "Chests" tab
   - Buy Bronze Chest (50 gems)
   - ✅ Check gems deducted
   - ✅ Check chest opens
   - ✅ Check inventory updates

5. Click "Gems" in taskbar
6. ✅ Verify gems count updated
```

#### **Expected Results:**
```
✅ Gems load from backend
✅ Purchase deducts gems
✅ Inventory updates real-time
✅ Backend syncs correctly
```

---

### **D. Raid System Test**

#### **Complete Raid Flow:**
```
1. Start Position:
   - Note current rating
   - Note raids today count
   - Check keys count

2. Start Raid:
   - Click "Map"
   - Select Tier 1
   - Click on "Butcher" (first boss)
   - ✅ Check boss modal opens
   - ✅ Check key requirement shows
   - Click "Start Raid"

3. Matchmaking:
   - ✅ Wait for 3-5 seconds
   - ✅ Should find 2 AI players
   - ✅ Auto-enter lobby

4. Lobby:
   - ✅ See 3 players total
   - ✅ Boss timer counts down
   - ✅ Can select charge/elixir
   - Click "Start Battle"

5. Battle:
   - ✅ Combat simulation runs
   - ✅ Damage shows
   - ✅ Timer counts down
   - Battle completes automatically

6. Results:
   - ✅ Shows placement (1-3)
   - ✅ Shows damage dealt
   - ✅ Shows rating gained
   - ✅ Shows rewards

7. Return to Map:
   - ✅ Rating should increase
   - ✅ Raids today should increment
   - ✅ Keys should be deducted
```

#### **Expected Results:**
```
✅ Keys deducted: -1
✅ Rating gained: +10 to +50
✅ Raids today: +1
✅ Stats sync to backend
✅ Leaderboard updates if needed
```

---

### **E. Real-Time Updates Test**

#### **Test Multi-Tab Sync:**
```
1. Open app in 2 browser tabs

2. Tab 1:
   - Go to "My Stats"
   - Note current rating

3. Tab 2:
   - Go to "Map"
   - Complete a raid

4. Tab 1:
   - ✅ Check if stats auto-update
   - Should see new rating
   - Should see raids count increase

5. Leaderboard test:
   - Tab 1: Go to "Top 20"
   - Tab 2: Complete another raid
   - Tab 1: ✅ Leaderboard should refresh
```

#### **Expected Results:**
```
✅ Stats update across tabs
✅ No page refresh needed
✅ Real-time sync works
✅ Subscription pattern functional
```

---

### **F. Offline Mode Test**

#### **Test Fallback:**
```
1. With backend running:
   - Complete a raid
   - Check stats update

2. Stop backend:
   - In backend terminal: Ctrl+C
   - ✅ Check indicator: 🔴 Backend Disconnected

3. Try operations:
   - Complete another raid
   - ✅ Should still work
   - ✅ Data saved to localStorage
   - ✅ No errors shown

4. Restart backend:
   - npm run dev
   - ✅ Check indicator: 🟢 Backend Connected
   - ✅ Data should sync
```

#### **Expected Results:**
```
✅ App works offline
✅ localStorage fallback active
✅ No errors thrown
✅ Smooth reconnection
✅ Data syncs when backend returns
```

---

## 4️⃣ **Performance Testing**

### **Load Time Test:**
```
1. Clear browser cache
2. Reload page
3. ✅ Check initial load:
   - Should load < 3 seconds
   - Loading spinners show
   - Data appears smoothly

4. Navigate between pages:
   - Map → My Stats → Top 20
   - ✅ Each page loads instantly
   - ✅ No lag or freeze
```

### **Memory Test:**
```
1. Open DevTools (F12)
2. Go to Performance tab
3. Complete 5 raids
4. ✅ Check memory usage:
   - Should stay < 100MB
   - No memory leaks
   - Smooth performance
```

---

## 5️⃣ **Error Handling Test**

### **Invalid Data Test:**
```
1. Open DevTools Console
2. Try invalid operations:
   - Buy item with 0 gems
   - Start raid with 0 keys
   - ✅ Check error messages show
   - ✅ Check app doesn't crash

3. API Error Test:
   - Stop backend
   - Try to load stats
   - ✅ Error message shows
   - ✅ Fallback to localStorage
   - ✅ App remains functional
```

---

## 6️⃣ **Mobile Responsive Test**

### **Test on Mobile:**
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select iPhone 12 Pro
4. ✅ Check layout:
   - Taskbar responsive
   - Map grid adjusts
   - Leaderboard scrollable
   - Shop cards stack

5. Test interactions:
   - Tap to navigate
   - Scroll leaderboard
   - Open modals
   - ✅ All should work smoothly
```

---

## 7️⃣ **Browser Compatibility Test**

### **Test Browsers:**
```
Chrome:  ✅ Test all features
Firefox: ✅ Test all features
Safari:  ✅ Test all features
Edge:    ✅ Test all features
```

---

## 8️⃣ **Data Consistency Test**

### **Verify Data Sync:**
```
1. Complete raid
2. Check backend database:
   cd backend
   sqlite3 database.sqlite
   SELECT * FROM player_stats;

3. ✅ Verify data matches:
   - Rating in DB = Rating in UI
   - Total raids match
   - Inventory synced

4. Check localStorage:
   - Open DevTools → Application → Local Storage
   - ✅ Verify backup data exists
   - ✅ Check format is correct
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Backend not connecting**
```
Problem: Red indicator shows
Solution:
1. Check backend is running
2. Check port 3001 is free
3. Check .env file has correct URL
4. Restart backend: npm run dev
```

### **Issue 2: Stats not updating**
```
Problem: Stats show old data
Solution:
1. Check backend connection
2. Complete a raid to trigger update
3. Refresh browser (Ctrl+R)
4. Check localStorage has data
```

### **Issue 3: Purchase not working**
```
Problem: Can't buy items
Solution:
1. Check gems count is enough
2. Check backend is running
3. Check console for errors
4. Verify inventory API works
```

### **Issue 4: Loading forever**
```
Problem: Stuck on loading spinner
Solution:
1. Check backend is responding
2. Check network tab in DevTools
3. Check API endpoints are correct
4. Clear cache and reload
```

---

## ✅ **Complete Test Checklist**

### **Backend Tests:**
- [ ] Backend starts successfully
- [ ] Database initializes
- [ ] API endpoints respond
- [ ] Player stats API works
- [ ] Leaderboard API works
- [ ] Inventory API works

### **Frontend Tests:**
- [ ] Frontend starts successfully
- [ ] Backend connection indicator works
- [ ] Player stats load from backend
- [ ] Leaderboard loads top 100
- [ ] Shop purchases work
- [ ] Inventory updates real-time
- [ ] Raid system syncs with backend
- [ ] Loading states show correctly
- [ ] Error handling works
- [ ] Offline mode functional

### **Integration Tests:**
- [ ] Complete full raid flow
- [ ] Stats update after raid
- [ ] Leaderboard refreshes
- [ ] Inventory syncs
- [ ] Multi-tab updates work
- [ ] Offline → Online transition smooth

### **UI/UX Tests:**
- [ ] Responsive on mobile
- [ ] Works on all browsers
- [ ] No console errors
- [ ] Smooth animations
- [ ] Loading states clear
- [ ] Error messages helpful

### **Performance Tests:**
- [ ] Load time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth navigation
- [ ] No lag during raids
- [ ] Real-time updates instant

---

## 📊 **Expected Test Results**

```
Total Tests: 50+
Must Pass: 100%

Critical Features:
✅ Backend connection
✅ Player stats sync
✅ Leaderboard updates
✅ Inventory management
✅ Raid system
✅ Offline mode

Performance:
✅ Load time < 3s
✅ Memory < 100MB
✅ No errors
✅ Smooth UX
```

---

## 🎯 **Testing Complete!**

If all tests pass:
```
✅ Backend integration: SUCCESS
✅ Real-time updates: WORKING
✅ Offline mode: FUNCTIONAL
✅ Error handling: ROBUST
✅ Performance: OPTIMAL
✅ User experience: SMOOTH

🎉 APPLICATION READY FOR PRODUCTION!
```

---

## 📞 **Support**

If you encounter issues:

1. **Check Logs:**
   - Backend: Terminal 1
   - Frontend: Browser Console (F12)

2. **Verify Setup:**
   - Backend running on :3001
   - Frontend running on :5173
   - Database file exists

3. **Common Fixes:**
   - Restart backend: Ctrl+C → npm run dev
   - Restart frontend: Ctrl+C → npm run dev
   - Clear cache: Ctrl+Shift+R
   - Re-init database: npm run init-db

---

**Happy Testing! 🧪🎮**
