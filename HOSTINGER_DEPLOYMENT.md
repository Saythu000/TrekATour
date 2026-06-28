# 🚀 Hostinger Deployment Instructions

## ✅ Build Complete!
Your project has been successfully built. The `dist/` folder contains all files ready for deployment.

## 📁 Files to Upload
Upload ALL contents of the `dist/` folder to your Hostinger hosting:

```
dist/
├── index.html
├── .htaccess (for proper routing)
├── assets/
│   ├── index-Dr3OPgVl.css
│   ├── index-NBn2wfw7.js
│   └── (other asset files)
└── (other files)
```

## 🌐 Hostinger Upload Steps

### Step 1: Access File Manager
1. Login to your Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html/` folder

### Step 2: Upload Files
1. **Delete** any existing files in `public_html/`
2. **Upload** ALL contents from your `dist/` folder
3. Make sure `.htaccess` file is uploaded (enables proper routing)

### Step 3: Set Environment Variables
Create a `.env` file in `public_html/` with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Configure Domain
1. In Hostinger panel, go to **Domains**
2. Point your domain to the hosting account
3. Enable SSL certificate (usually auto-enabled)

## 🔧 Important Notes

### File Permissions
Set these permissions in File Manager:
- Folders: 755
- Files: 644
- .htaccess: 644

### Supabase Configuration
Make sure your Supabase project allows your domain:
1. Go to Supabase Dashboard
2. Settings → API
3. Add your domain to allowed origins

### Testing
After upload, test these URLs:
- `yourdomain.com` - Homepage
- `yourdomain.com/camping` - Category page
- `yourdomain.com/admin` - Admin panel

## 📋 Deployment Checklist
- [ ] All dist/ files uploaded to public_html/
- [ ] .htaccess file uploaded
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL enabled
- [ ] Supabase origins updated
- [ ] Test all pages working

## 🆘 Troubleshooting

**404 Errors on page refresh:**
- Make sure `.htaccess` file is uploaded

**Blank page:**
- Check browser console for errors
- Verify environment variables are set

**Images not loading:**
- Check file permissions (644 for files, 755 for folders)

Your website should be live at your domain once DNS propagates (up to 24 hours)!
