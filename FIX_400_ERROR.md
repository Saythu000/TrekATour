# 🔧 Fix EmailJS 400 Error - Get Real OTP Emails

## ❌ Current Issue
```
Failed to load resource: the server responded with a status of 400
Failed to send OTP email: EmailJSResponseStatus
```

## 🔍 Root Cause
The EmailJS credentials are **placeholder values**, not real ones. EmailJS returns 400 when Service ID, Template ID, or Public Key is invalid.

## ✅ Current Status
- ✅ **CSP fixed** - EmailJS API accessible
- ✅ **Demo mode active** - Shows OTP in browser for testing
- ❌ **EmailJS not configured** - Need real credentials for email delivery

## 🚀 Quick Fix - Get Real EmailJS Credentials

### Step 1: Create EmailJS Account (2 minutes)
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up with your email
3. Verify your account

### Step 2: Add Gmail Service (1 minute)
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Connect your Gmail account
4. **Copy Service ID** (looks like: `service_abc123`)

### Step 3: Create Email Template (2 minutes)
1. Dashboard → **Email Templates** → **Create New Template**
2. **Subject:** `TrekaTour Admin Login - Your OTP Code`
3. **Content:**
```
Hello {{to_name}},

Your OTP: {{otp_code}}

Expires in 5 minutes.

TrekaTour Team
```
4. **Copy Template ID** (looks like: `template_xyz789`)

### Step 4: Get Public Key (30 seconds)
1. Dashboard → **Account** → **General**
2. **Copy Public Key** (looks like: `user_abc123xyz`)

### Step 5: Update Configuration (1 minute)
Edit `src/lib/emailService.ts`:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',     // Your real service ID
  TEMPLATE_ID: 'template_xyz789',   // Your real template ID
  PUBLIC_KEY: 'user_abc123xyz'      // Your real public key
};
```

## 🧪 Testing

### Current Demo Mode:
- Enter email → Shows OTP in browser notification
- Works for testing admin login flow
- No real emails sent

### After EmailJS Setup:
- Enter email → Real OTP sent to email inbox
- Professional email delivery
- No OTP shown in browser

## 🎯 Expected Results

### Before Setup (Demo Mode):
```
✅ Console: "EmailJS not configured - using demo mode"
✅ Toast: "Demo Mode - OTP Generated: 123456"
✅ Admin login works with shown OTP
```

### After Setup (Production):
```
✅ Console: "EmailJS initialized with service: service_abc123"
✅ Console: "Email sent successfully: {status: 200}"
✅ Toast: "OTP Sent Successfully!"
✅ Real email received in inbox
```

## 🚨 Alternative: Use Demo Mode for Now

If you want to test the admin system immediately:
1. **Current system works** - OTP shown in browser
2. **Enter authorized email** - `saythu000@gmail.com` or `trekatour@gmail.com`
3. **Copy OTP from notification** - Use it to login
4. **Full admin access** - Manage trips, dates, etc.

## 📋 Quick Checklist
- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created
- [ ] Real credentials updated in code
- [ ] Test with authorized email
- [ ] Verify real email received

**The 400 error will be fixed once you replace the placeholder EmailJS credentials with real ones from your EmailJS account!**
