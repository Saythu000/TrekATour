# 📧 EmailJS 400 Error - Quick Setup Guide

## ✅ Current Status
- ✅ **EmailJS API accessible** - No more CSP errors
- ✅ **Demo mode working** - OTP shown in browser
- ❌ **Invalid public key** - Need real EmailJS credentials

## 🚨 Error Explained
```
POST https://api.emailjs.com/api/v1.0/email/send 400 (Bad Request)
EmailJSResponseStatus: The Public Key is invalid
```

**Cause:** Using placeholder EmailJS credentials instead of real ones.

## 🚀 5-Minute EmailJS Setup

### Step 1: Create Account (1 min)
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. **Sign up** with your email
3. **Verify** your account

### Step 2: Add Email Service (1 min)
1. **Email Services** → **Add New Service**
2. Choose **Gmail**
3. **Connect your Gmail account**
4. **Copy Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template (2 min)
1. **Email Templates** → **Create New Template**
2. **Template Name:** `Admin OTP`
3. **Subject:** `TrekaTour Admin Login - Your OTP`
4. **Content:**
```
Hello {{to_name}},

Your OTP: {{otp_code}}

Expires in 5 minutes.

TrekaTour Team
```
5. **Save** and **copy Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key (30 sec)
1. **Account** → **General**
2. **Copy Public Key** (e.g., `user_abc123xyz`)

### Step 5: Update .env File (30 sec)
Replace placeholders in `.env`:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_abc123xyz
```

## 🧪 Test Real Email Delivery

### After Setup:
1. **Restart dev server** - `npm run dev`
2. **Try admin login** - Enter `saythu000@gmail.com`
3. **Check email inbox** - Real OTP email should arrive
4. **Enter OTP** - Access admin panel

### Expected Results:
```
✅ Console: "✅ EmailJS initialized with real credentials"
✅ Console: "📧 Sending real OTP email to..."
✅ Console: "✅ Real email sent successfully"
✅ Toast: "OTP Sent Successfully!"
✅ Real email in inbox
```

## 🎯 Demo Mode (Current)

### Works Without Setup:
- ✅ **OTP shown in browser** - For immediate testing
- ✅ **Full admin functionality** - Complete system
- ✅ **No email setup needed** - Works out of the box

### Test Now:
1. **Enter email:** `saythu000@gmail.com`
2. **See demo notification** with OTP
3. **Enter OTP** → Access admin panel ✅

## 📊 EmailJS vs Demo Mode

### Demo Mode (Current):
- ✅ **Works immediately** - No setup
- ✅ **OTP in browser** - Easy testing
- ❌ **Not production ready** - OTP visible to anyone

### EmailJS (After Setup):
- ✅ **Real email delivery** - Professional
- ✅ **Secure OTP** - Must access email account
- ✅ **Production ready** - No OTP visible on screen
- ✅ **Free tier** - 200 emails/month

## ✅ Quick Decision

### For Testing Now:
- **Use demo mode** - Already working
- **No setup needed** - Test admin functionality

### For Production:
- **Set up EmailJS** - 5 minutes total
- **Real email delivery** - Professional system
- **Secure authentication** - OTP in email only

**Your admin system works perfectly in demo mode right now. Set up EmailJS when you want real email delivery!**
