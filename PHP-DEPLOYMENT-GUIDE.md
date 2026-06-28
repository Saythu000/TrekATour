# 🚀 Deploy Trek A Tour to Hostinger - PHP Backend

## ✅ Ready to Deploy!

Your project now uses **PHP backend** (like your CRM) instead of Node.js.

---

## 📦 Files to Upload:

### 1. PHP API (Upload to `public_html/api/`)
From folder: `api-php/`
- `config.php`
- `trips.php`
- `recommended.php`
- `recommendations-content.php`
- `health.php`
- `.htaccess`

### 2. Frontend (Upload to `public_html/`)
From folder: `dist/`
- All files (index.html, assets/, .htaccess, etc.)

### 3. Images (Upload to `public_html/images/trips/`)
From folder: `downloaded-images/`
- All 15 images

---

## 🚀 Deployment Steps:

### Step 1: Upload PHP API
1. Login to **Hostinger File Manager**
2. Go to `public_html/`
3. Create folder: `api` (if not exists)
4. Upload all files from `api-php/` to `public_html/api/`

### Step 2: Upload Frontend
1. In File Manager, go to `public_html/`
2. Upload all files from `dist/` folder
3. **Important**: Files go directly in `public_html/`, not in a subfolder

### Step 3: Upload Images
1. Create folder: `public_html/images/trips/` (if not exists)
2. Upload all 15 images from `downloaded-images/`

### Step 4: Test
1. Visit: `https://trekatour.in/api/health`
   - Should show: `{"status":"ok","message":"Trek A Tour API is running"}`
2. Visit: `https://trekatour.in`
   - Trips should load automatically!

---

## ✅ Advantages of PHP Backend:

- ✅ Works on your current Hostinger plan (no upgrade needed)
- ✅ No Node.js server to manage
- ✅ Same architecture as your working CRM
- ✅ Apache handles everything automatically
- ✅ Fast and reliable

---

## 🔧 Troubleshooting:

### API not working?
- Check files are in `public_html/api/`
- Check `.htaccess` is uploaded
- Test: `https://trekatour.in/api/health`

### Trips not loading?
- Check browser console for errors
- Verify database credentials in `api/config.php`
- Test API directly: `https://trekatour.in/api/trips`

### Images not showing?
- Verify images are in `public_html/images/trips/`
- Check image URLs in database

---

## 📋 Quick Checklist:

- [ ] Upload `api-php/` files to `public_html/api/`
- [ ] Upload `dist/` files to `public_html/`
- [ ] Upload images to `public_html/images/trips/`
- [ ] Test API: `https://trekatour.in/api/health`
- [ ] Test website: `https://trekatour.in`

---

**Ready to deploy? Follow the steps above!** 🎉
