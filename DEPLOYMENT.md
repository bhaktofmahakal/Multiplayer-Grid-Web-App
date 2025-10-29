# 🚀 Deployment Guide

## Overview
- **Frontend**: Deploy to Vercel (React app)
- **Backend**: Deploy to Render.com (Node.js/Express server)

---

## Backend Deployment on Render

### Step 1: Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/multiplayer-grid.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 3: Connect GitHub Repository
1. Select your GitHub repository
2. Name: `multiplayer-grid-backend`
3. Runtime: Select **Node**
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Plan: Select **Free tier** (optional)

### Step 4: Set Environment Variables
In Render Dashboard → Environment:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Step 5: Deploy
Click "Create Web Service"
- Render will automatically build and deploy
- Get your backend URL: `https://multiplayer-grid-backend.onrender.com`

### Important Notes:
- Free tier on Render spins down after 15 minutes of inactivity
- For production, upgrade to paid plan
- Backend URL: `https://multiplayer-grid-backend.onrender.com`

---

## Frontend Deployment on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import project

### Step 2: Import Project from GitHub
1. Click "Add New" → "Project"
2. Select your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js (but it's React + CRA, so select "Create React App")
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install --legacy-peer-deps`

### Step 3: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL=https://multiplayer-grid-backend.onrender.com
```

### Step 4: Deploy
1. Vercel automatically deploys on every push to main branch
2. Get your frontend URL: `https://multiplayer-grid.vercel.app`

### Important Notes:
- Free tier includes unlimited deployments
- Custom domain available for free
- Auto-deploys on every Git push
- Preview deployments for pull requests

---

## Testing Deployment

### Test Backend
```bash
# Check backend health
curl https://multiplayer-grid-backend.onrender.com/health

# Should return:
# {"status":"ok","onlinePlayers":0}
```

### Test Frontend
1. Visit `https://multiplayer-grid.vercel.app`
2. Register player
3. Select cell
4. Update grid
5. Open new tab and verify real-time updates

### Test Real-time Sync
1. Open app in two different browser tabs
2. Update grid in tab 1
3. Verify grid updates in tab 2 instantly

---

## Troubleshooting

### Backend Issues

**Error: "Cannot find module"**
- Solution: Run `npm install` in backend directory
- Render should handle this automatically with build command

**Error: "Port already in use"**
- Solution: Render manages ports automatically
- Check `process.env.PORT` is being used correctly

**Backend not connecting to frontend**
- Solution: Update `FRONTEND_URL` in Render environment variables
- Make sure CORS is enabled in backend

### Frontend Issues

**Error: "API connection failed"**
- Solution: Check `REACT_APP_API_URL` environment variable in Vercel
- Ensure backend URL is correct and accessible
- Check browser console for exact error

**Error: "Module not found"**
- Solution: Use `npm install --legacy-peer-deps` (already configured)
- Clear npm cache: `npm cache clean --force`

**UI not updating in real-time**
- Solution: Check network tab in DevTools for WebSocket connection
- Verify Socket.IO is connecting to correct backend URL

---

## Monitoring & Logs

### Render Backend Logs
1. Go to Render Dashboard
2. Select "multiplayer-grid-backend"
3. Click "Logs" tab
4. View real-time server logs

### Vercel Frontend Logs
1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. View build and runtime logs

---

## Updating Deployed Applications

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
```
→ Render automatically redeploys

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
→ Vercel automatically redeploys

---

## Scaling & Performance

### Backend (Render)
- Free tier: ~2 vCPU, 512 MB RAM
- Spins down after 15 minutes inactivity
- For production: Upgrade to Standard ($7/month)
- Benefits: Always-on, more RAM & CPU

### Frontend (Vercel)
- Free tier: Unlimited bandwidth
- Edge network for fast global delivery
- Automatic CDN caching
- No performance concerns for typical usage

---

## Custom Domain

### Add Domain to Vercel
1. Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records with Vercel's nameservers
4. Wait 24-48 hours for propagation

### Add Domain to Render
1. Render Dashboard → multiplayer-grid-backend
2. Settings → Custom Domains
3. Add domain and update DNS records

---

## Production Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Backend health check passing
- [ ] Frontend loads without errors
- [ ] Real-time sync working between tabs
- [ ] Cooldown mechanism functioning
- [ ] History tracking working
- [ ] Error messages displaying correctly
- [ ] Responsive design verified
- [ ] WebSocket connection established

---

## Helpful Links

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- Socket.IO in Production: https://socket.io/docs/v4/socket-io-setup/#production-considerations
- React Deployment: https://create-react-app.dev/deployment/vercel/

---

**Status**: Ready for Production Deployment