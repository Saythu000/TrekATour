# Deploy Trek A Tour to Hostinger - Complete Guide

## ✅ Your Plan Supports Node.js!
- Backend: Express.js ✅
- Frontend: React/Vite ✅
- Node.js versions: 18.x, 20.x, 22.x, 24.x

---

## 📦 Step 1: Prepare Files for Upload

### A. Build Frontend
```bash
cd "/mnt/d/client project/Trek A tour/original file/version-1/trek-a-tour-website-main"
npm run build
```

This creates a `dist/` folder with your production-ready frontend.

---

## 🚀 Step 2: Upload to Hostinger

### A. Upload Backend (API)
1. Login to **Hostinger hPanel**
2. Go to **File Manager**
3. Navigate to `public_html/`
4. Create folder: `api/`
5. Upload these files to `public_html/api/`:
   - `api/server.js`
   - `api/db.js`
   - `api/package.json`
   - `api/.env`

### B. Upload Frontend
1. In File Manager, go to `public_html/`
2. Upload ALL files from `dist/` folder to `public_html/`
   - `index.html`
   - `assets/` folder
   - All other files

### C. Upload Images
1. Create folder: `public_html/images/trips/`
2. Upload all images from `downloaded-images/` to `images/trips/`

---

## ⚙️ Step 3: Setup Node.js Application in Hostinger

1. In hPanel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 20.x (recommended)
   - **Application mode**: Production
   - **Application root**: `/public_html/api`
   - **Application URL**: `https://trekatour.in`
   - **Application startup file**: `server.js`
   - **Port**: (Hostinger will auto-assign, usually 3000 or 3001)

4. Click **Create**
5. Click **Run NPM Install** to install dependencies

---

## 🔧 Step 4: Configure Environment

The API already has the correct database credentials in `api/.env`:
```
DB_HOST=srv1991.hstgr.io
DB_USER=u922871901_TREK
DB_PASSWORD=Mgan@2112
DB_NAME=u922871901_trek_a_tour
DB_PORT=3306
PORT=3001
NODE_ENV=production
```

---

## 🌐 Step 5: Setup Reverse Proxy (Important!)

To make API accessible at `https://trekatour.in/api/*`:

1. In File Manager, edit `public_html/.htaccess`
2. Add this at the TOP:

```apache
# Node.js API Proxy
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
```

---

## 🔄 Step 6: Update Frontend API URL

Before building, update the API URL to use relative path:

File: `src/lib/apiClient.ts`
Change:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```
To:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

Then rebuild:
```bash
npm run build
```

And re-upload the `dist/` folder contents.

---

## ✅ Step 7: Start the Application

1. In hPanel → **Node.js** → Your Application
2. Click **Start Application**
3. Wait for status to show "Running"

---

## 🧪 Step 8: Test

1. Visit: `https://trekatour.in`
2. Trips should load automatically
3. Check browser console for errors

---

## 🔍 Troubleshooting

### If trips don't load:
1. Check Node.js app status in hPanel (should be "Running")
2. Check error logs in hPanel → Node.js → View Logs
3. Verify `.htaccess` proxy rules are correct
4. Test API directly: `https://trekatour.in/api/health`

### If images don't show:
1. Verify images are in `public_html/images/trips/`
2. Check image URLs in database match: `https://trekatour.in/images/trips/filename.jpg`

---

## 📝 Quick Checklist

- [ ] Build frontend (`npm run build`)
- [ ] Upload `api/` folder to `public_html/api/`
- [ ] Upload `dist/` contents to `public_html/`
- [ ] Upload images to `public_html/images/trips/`
- [ ] Create Node.js application in hPanel
- [ ] Run NPM Install
- [ ] Setup `.htaccess` proxy
- [ ] Update API URL in code
- [ ] Rebuild and re-upload
- [ ] Start Node.js application
- [ ] Test website

---

Need help with any step? Let me know!
