# ⚡ Quick EmailJS Setup for Real OTP Emails

## 🎯 Current Status
- ✅ **Demo mode removed** - No OTP shown on website
- ✅ **Real email system** - Only sends to actual email addresses
- ✅ **Production ready** - Secure OTP delivery
- ❌ **EmailJS not configured** - Needs setup for email delivery

## 🚀 5-Minute Setup

### 1. Create EmailJS Account
- Go to [EmailJS.com](https://www.emailjs.com/) → Sign up
- Verify your email

### 2. Connect Gmail Service
- Dashboard → Email Services → Add New Service → Gmail
- Connect your Gmail account
- **Copy Service ID** (e.g., `service_abc123`)

### 3. Create OTP Template
- Dashboard → Email Templates → Create New Template
- **Subject:** `TrekaTour Admin Login - Your OTP Code`
- **Content:**
```
Hello {{to_name}},

Your OTP for TrekaTour admin panel access is:

**{{otp_code}}**

This OTP will expire in 5 minutes.

Best regards,
TrekaTour Admin Team
```
- **Copy Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
- Dashboard → Account → General
- **Copy Public Key** (e.g., `user_abc123xyz`)

### 5. Update Configuration
Edit `src/lib/emailService.ts`:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id_here',
  TEMPLATE_ID: 'your_template_id_here', 
  PUBLIC_KEY: 'your_public_key_here'
};
```

## 🧪 Test Flow
1. **Enter email:** `saythu000@gmail.com`
2. **Click "Send OTP"**
3. **Check email inbox** (and spam folder)
4. **Enter OTP from email**
5. **Access admin panel**

## ✅ Expected Results

**Before Setup:**
- Email sending fails
- Error message shown
- No admin access

**After Setup:**
- Real OTP email sent to inbox
- Professional email template
- Secure admin authentication
- No OTP visible on website

## 🚨 Important
- **No demo mode** - Must set up EmailJS for login to work
- **Real emails only** - OTP sent to actual email addresses
- **Check spam folder** - Sometimes emails go to spam
- **5-minute expiry** - OTP expires for security

**Setup EmailJS to enable real OTP email delivery for admin authentication!**
