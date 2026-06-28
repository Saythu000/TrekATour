# 🔐 Admin Authentication Setup

## Current System: Custom Email OTP

Your project uses a **custom email OTP authentication system** for admin access.

## 🚀 Setup Steps

### Step 1: Configure EmailJS
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Create account and email service
3. Create email template for OTP
4. Get your service credentials

### Step 2: Update Environment Variables
Create `.env` file in project root:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id

# EmailJS Configuration for Admin OTP
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 🎯 How It Works

### Email OTP Flow:
```
1. Enter authorized email → Click "Send OTP"
2. System generates 6-digit OTP
3. EmailJS sends OTP to email
4. Enter OTP → Access admin panel
```

### Authorized Emails:
- ✅ `saythu000@gmail.com`
- ✅ `trekatour@gmail.com`
- ❌ Other emails → Access denied

## 📧 Features

- ✅ **6-digit OTP codes** - Secure verification
- ✅ **5-minute expiry** - Time-limited access
- ✅ **Email whitelist** - Only authorized emails
- ✅ **Session management** - Secure login state
- ✅ **Demo mode** - Works without EmailJS setup

## 🧪 Testing

### Without EmailJS (Demo Mode):
- Shows OTP in toast notification
- Console logs setup instructions
- Full functionality for testing

### With EmailJS:
- Real emails sent to inbox
- Professional OTP delivery
- Production-ready authentication

## 🔧 Technical Details

### Authentication Flow:
1. **AdminLogin.tsx** - Handles OTP generation/verification
2. **useAdmin.ts** - Manages authentication state
3. **AdminRoute.tsx** - Protects admin pages
4. **localStorage** - Stores session data

### Security Features:
- ✅ **Email verification** - Must access real email
- ✅ **Time-limited OTP** - Expires in 5 minutes
- ✅ **Single-use codes** - Each OTP works once
- ✅ **Authorized emails only** - Whitelist protection

## ✅ Setup Checklist
- [ ] EmailJS account created
- [ ] Email service configured
- [ ] Template created for OTP
- [ ] Environment variables updated
- [ ] Test with authorized emails
- [ ] Verify admin panel access

**Your authentication system is ready to use with or without EmailJS configuration!**
