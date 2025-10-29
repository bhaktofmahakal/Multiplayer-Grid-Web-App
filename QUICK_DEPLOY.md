# 🚀 Quick Deployment Guide - 5 Minutes

## Prerequisites
- GitHub account
- Vercel account (free)
- Render.com account (free)

---

## Step 1: Push to GitHub (2 min)

```bash
cd u:\Task
git init
git add .
git commit -m "Initial commit - Multiplayer Grid App"
git remote add origin https://github.com/YOUR_USERNAME/multiplayer-grid.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render (2 min)

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Configure:
   - **Name**: `multiplayer-grid-backend`
   - **Runtime**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** → **Add Environment Variable**:
   - Key: `FRONTEND_URL`
   - Value: (leave blank for now, update after Vercel deploy)
6. Click **Create Web Service**
7. **Note the URL**: `https://multiplayer-grid-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel (1 min)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Configure:
   - **Framework**: Other (Create React App)
   - **Root Directory**: `./frontend`
5. Click **Advanced** → **Environment Variables**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://multiplayer-grid-backend.onrender.com`
6. Click **Deploy**
7. **Note the URL**: `https://multiplayer-grid-xxxxxx.vercel.app`

---

## Step 4: Update Backend FRONTEND_URL (Optional but recommended)

1. Go to Render Dashboard
2. Select `multiplayer-grid-backend`
3. Click **Settings** → **Environment**
4. Update `FRONTEND_URL`: `https://your-vercel-url.vercel.app`
5. Click **Save Changes** (auto-redeploys)

---

## Step 5: Test

1. Open https://your-vercel-url.vercel.app
2. Register player
3. Place character on grid
4. Verify in another tab (real-time sync)

✅ **Done!** Your app is live! 

---

## Deployment URLs

- **Frontend**: https://your-vercel-domain.vercel.app
- **Backend**: https://multiplayer-grid-backend.onrender.com

---

## Future Updates

Just push to GitHub - both platforms auto-redeploy:
```bash
git add .
git commit -m "Your update"
git push origin main
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't connect to backend | Check `REACT_APP_API_URL` in Vercel Settings |
| Backend error in logs | Go to Render → Logs tab to see errors |
| Real-time updates not working | Check WebSocket is enabled (Socket.IO uses it) |
| App spins down | Upgrade Render to paid plan (free tier spins down) |

---

For detailed deployment guide, see `DEPLOYMENT.md`