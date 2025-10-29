# 🚀 Deployment Commands - Copy & Paste Ready

## Phase 1: Git Setup

### 1.1 Initialize Git Repository
```bash
cd u:\Task
git init
```

### 1.2 Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.3 Add Files & Commit
```bash
cd u:\Task
git add .
git commit -m "Initial commit: Multiplayer Grid Web App - Production Ready"
```

### 1.4 Create Remote & Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/multiplayer-grid.git
git branch -M main
git push -u origin main
```

---

## Phase 2: Render Backend Deployment

### 2.1 Navigate to Render
1. Go to **https://render.com**
2. Click **Dashboard** (top-right)
3. Click **New +** button
4. Select **Web Service**

### 2.2 Connect GitHub Repository
- Select your GitHub account
- Search for **multiplayer-grid**
- Click to connect repository

### 2.3 Configure Service
```
Name:                  multiplayer-grid-backend
Runtime:              Node
Root Directory:       backend
Build Command:        npm install && npm run build
Start Command:        npm start
Plan:                 Free (or Standard for production)
```

### 2.4 Add Environment Variables
Click **Advanced** → **Add Environment Variable**

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 5000 |
| FRONTEND_URL | *(leave empty for now)* |

### 2.5 Deploy
- Click **Create Web Service**
- Wait for deployment to complete
- Note the URL: `https://multiplayer-grid-backend.onrender.com`

---

## Phase 3: Vercel Frontend Deployment

### 3.1 Navigate to Vercel
1. Go to **https://vercel.com**
2. Click **Dashboard** (top-right)
3. Click **Add New** button
4. Select **Project**

### 3.2 Import Repository
- Click **Import Git Repository**
- Select your GitHub repository
- Click **Import**

### 3.3 Configure Project
```
Framework Preset:     Other (Create React App)
Root Directory:       ./frontend
Build Command:        npm install --legacy-peer-deps && npm run build
Output Directory:     build
Install Command:      npm install --legacy-peer-deps
```

### 3.4 Add Environment Variables
Click **Environment Variables**

| Key | Value |
|-----|-------|
| REACT_APP_API_URL | https://multiplayer-grid-backend.onrender.com |

### 3.5 Deploy
- Click **Deploy**
- Wait for deployment to complete
- Note the URL: `https://multiplayer-grid-xxxxx.vercel.app`

---

## Phase 4: Update Backend FRONTEND_URL (Optional)

### 4.1 Update Render Environment
1. Go to Render Dashboard
2. Click **multiplayer-grid-backend** service
3. Click **Settings** tab
4. Scroll to **Environment**
5. Update **FRONTEND_URL** to your Vercel URL:
   ```
   https://multiplayer-grid-xxxxx.vercel.app
   ```
6. Click **Save** (auto-redeploys)

---

## Phase 5: Testing & Verification

### 5.1 Test Backend Health
```bash
# Replace with your actual Render URL
curl https://multiplayer-grid-backend.onrender.com/health
```

Expected output:
```json
{"status":"ok","onlinePlayers":0}
```

### 5.2 Test Frontend
1. Open **https://multiplayer-grid-xxxxx.vercel.app**
2. Register a player (enter name, click Register)
3. Click a grid cell
4. Enter a character
5. Click "Update Cell"
6. Should see success message

### 5.3 Test Real-Time Sync
1. Open app in **Browser Tab 1**
2. Open app in **New Browser Tab 2**
3. In Tab 1: Update a cell
4. In Tab 2: Verify update appears instantly

---

## Future Deployments (Auto)

After initial setup, just push to GitHub:

```bash
# Make your changes
git add .
git commit -m "Feature: Your update description"
git push origin main
```

**Automatic actions:**
- ✅ Vercel rebuilds & deploys frontend
- ✅ Render rebuilds & deploys backend
- ✅ Takes 2-3 minutes total
- ✅ No manual intervention needed

---

## Troubleshooting Commands

### Check Render Logs
```
Render Dashboard → multiplayer-grid-backend → Logs
```

### Check Vercel Logs
```
Vercel Dashboard → multiplayer-grid-xxxxx → Deployments
```

### Clear Node Cache (if issues)
```bash
npm cache clean --force
```

### Verify Environment Variables
```bash
# Backend - check Render Settings
# Frontend - check Vercel Environment Variables
```

---

## Useful URLs (After Deployment)

```
Frontend:           https://multiplayer-grid-[yourname].vercel.app
Backend:            https://multiplayer-grid-backend.onrender.com
Backend Health:     https://multiplayer-grid-backend.onrender.com/health
Render Dashboard:   https://render.com/dashboard
Vercel Dashboard:   https://vercel.com/dashboard
GitHub Repo:        https://github.com/YOUR_USERNAME/multiplayer-grid
```

---

## Emergency Reset

If deployment fails, follow these steps:

### Step 1: Check Logs
```
Render: Dashboard → Service → Logs
Vercel: Dashboard → Project → Deployments
```

### Step 2: Redeploy
```bash
# Force a new deployment
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Step 3: Manual Redeploy
- Render: Click "Manual Redeploy" button
- Vercel: Click "Redeploy" on last deployment

---

## Success Indicators

- ✅ Frontend loads without errors
- ✅ Backend health check returns 200
- ✅ Can register a player
- ✅ Can place character on grid
- ✅ Updates appear in real-time
- ✅ Player count updates correctly

---

## Performance Optimization (Optional)

### Enable Analytics
```
Vercel Dashboard → Analytics → Enable
```

### Monitor Backend Usage
```
Render Dashboard → multiplayer-grid-backend → Usage
```

### Upgrade Plans (if needed)
- Render: Free tier → Standard ($7/month) for always-on
- Vercel: Free tier is sufficient for most uses

---

## Support

- **Render Help**: https://render.com/support
- **Vercel Help**: https://vercel.com/help
- **GitHub Issues**: Create issue in your repository
- **Socket.IO Docs**: https://socket.io/docs/

---

**Total Setup Time**: ~15 minutes  
**Deployment Time**: ~5 minutes  
**Result**: Live production application! 🎉

---

Ready to deploy? Start with **Phase 1: Git Setup** above! 🚀