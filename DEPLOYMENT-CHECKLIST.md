# 🚀 QUICK DEPLOYMENT CHECKLIST

## ✅ Files Ready to Upload:

### 1. Backend API (Upload to `public_html/api/`)
- [ ] `api/server.js`
- [ ] `api/db.js`
- [ ] `api/package.json`
- [ ] `api/.env`

### 2. Frontend (Upload to `public_html/`)
- [ ] All files from `dist/` folder
  - `index.html`
  - `assets/` folder
  - `.htaccess` (IMPORTANT!)
  - All other files

### 3. Images (Upload to `public_html/images/trips/`)
- [ ] All 15 images from `downloaded-images/` folder

---

## 📋 Deployment Steps:

### Step 1: Upload Files via Hostinger File Manager
1. Login to Hostinger hPanel
2. Go to **File Manager**
3. Upload backend to `public_html/api/`
4. Upload frontend (dist contents) to `public_html/`
5. Upload images to `public_html/images/trips/`

### Step 2: Setup Node.js Application
1. In hPanel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Settings:
   - Node.js version: **20.x**
   - Application mode: **Production**
   - Application root: `/public_html/api`
   - Application startup file: `server.js`
4. Click **Create**
5. Click **Run NPM Install**
6. Click **Start Application**

### Step 3: Verify
1. Visit: https://trekatour.in
2. Check if trips load
3. Check if images show
4. Test navigation

---

## 🔧 If Something Goes Wrong:

### Trips not loading?
- Check Node.js app status (should be "Running")
- View logs in hPanel → Node.js → View Logs
- Test API: https://trekatour.in/api/health

### Images not showing?
- Verify images are in correct folder
- Check image URLs in browser console

### 500 Error?
- Check `.htaccess` file is uploaded
- Check Node.js app is running
- Check database credentials in `api/.env`

---

## 📞 Need Help?
Check the full guide: HOSTINGER-DEPLOYMENT.md
