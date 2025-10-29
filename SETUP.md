# 🚀 Setup and Deployment Guide

## ⚡ Quick Start

### Prerequisites
- **Node.js** v16+ (download from https://nodejs.org)
- **npm** (comes with Node.js)
- Windows PowerShell or Command Prompt

### Step 1: Install Backend Dependencies

```powershell
cd u:\Task\backend
npm install
```

Expected output: `added XXX packages`

### Step 2: Install Frontend Dependencies

```powershell
cd u:\Task\frontend
npm install
```

Expected output: `added XXX packages`

### Step 3: Start Backend Server (Terminal 1)

```powershell
cd u:\Task\backend
npm run dev
```

Expected output:
```
Server running on port 5000
```

**Leave this terminal open!**

### Step 4: Start Frontend Server (Terminal 2)

Open a NEW terminal window and run:

```powershell
cd u:\Task\frontend
npm start
```

Expected output:
```
webpack compiled with X warnings
Compiled successfully!

Local: http://localhost:3000
```

A browser window should open automatically at `http://localhost:3000`

### Step 5: Play the Game!

1. Enter your player name
2. Click "Register"
3. Click any cell in the grid
4. Type a Unicode character
5. Click "Update Cell"
6. See real-time updates!

---

## 📋 What Each Command Does

| Command | Location | Purpose |
|---------|----------|---------|
| `npm install` | `backend/` & `frontend/` | Install all dependencies |
| `npm run dev` | `backend/` | Start backend in development mode with auto-reload |
| `npm run build` | `backend/` | Compile TypeScript to JavaScript |
| `npm start` | `frontend/` | Start React dev server with hot-reload |
| `npm run build` | `frontend/` | Build production-ready React app |

---

## 🧪 Testing (Optional)

After both servers are running, you can open multiple browser tabs/windows and test multiplayer:

1. Open `http://localhost:3000` in Browser 1
2. Register as "Player 1"
3. Open `http://localhost:3000` in Browser 2
4. Register as "Player 2"
5. Update cells from both browsers
6. Watch updates sync in real-time!

---

## 🔍 Troubleshooting

### Issue: "npm: The term 'npm' is not recognized"
**Solution**: Node.js is not installed. Download from https://nodejs.org and install.

### Issue: "Address already in use :::5000"
**Solution**: Port 5000 is already in use.
- Kill the process using port 5000
- Or change PORT in `backend/.env`

### Issue: "Cannot GET /"
**Solution**: Frontend dev server not running. Start it in a new terminal.

### Issue: "WebSocket connection fails"
**Solution**: 
- Backend not running on port 5000
- Check backend terminal for error messages
- Verify CORS settings in backend

### Issue: Grid not updating in real-time
**Solution**:
- Open browser DevTools (F12)
- Go to Network tab
- Look for WebSocket connections
- Verify Socket.IO connection shows "connected"

---

## 🏗️ Production Deployment

### Backend Deployment (Vercel, Render, Heroku)

1. **Build**
   ```bash
   npm run build
   ```

2. **Set Environment**
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Start Script** (in package.json)
   ```json
   "start": "node dist/index.js"
   ```

### Frontend Deployment (Vercel, Netlify)

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy `build/` folder**

3. **Update Backend URL** in src/App.tsx:
   ```typescript
   const socket = io('https://your-backend-domain.com', {
     transports: ['websocket', 'polling'],
   })
   ```

---

## 📦 Project Files Explanation

```
u:\Task/
├── backend/
│   ├── src/index.ts                # Server code with game logic
│   ├── package.json                # Backend dependencies
│   ├── tsconfig.json               # TypeScript config
│   └── dist/                       # Compiled code (generated)
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Main React component
│   │   ├── App.css                 # Styling
│   │   └── index.tsx               # Entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── package.json                # Frontend dependencies
│   └── tsconfig.json               # TypeScript config
│
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
└── SETUP.md                        # This file
```

---

## ✅ Verification Checklist

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000 in browser
- [ ] Can register with a player name
- [ ] Can place characters on grid
- [ ] Real-time updates working (open 2 browser windows)

---

## 🎯 Next Steps

1. **Explore the Code**: Read src/index.ts and src/App.tsx
2. **Modify Rules**: Change COOLDOWN_DURATION in backend/src/index.ts
3. **Customize Styling**: Edit frontend/src/App.css
4. **Add Features**: Implement new game rules or UI elements
5. **Deploy**: Push to GitHub and deploy to cloud

---

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Open browser DevTools (F12) and check Console
3. Check backend terminal for error messages
4. Verify both servers are running

---

**Good luck! 🚀**