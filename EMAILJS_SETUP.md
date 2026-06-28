# 📧 EmailJS Setup for OTP Authentication

## 🎯 Overview
The admin login system uses EmailJS to send OTP codes to authorized email addresses.

## 🚀 Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose **Gmail** (recommended)
4. Connect your Gmail account
5. Note the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this template:

```html
Subject: TrekaTour Admin Login OTP

Hello {{to_name}},

Your OTP for TrekaTour admin login is: {{otp_code}}

This OTP will expire in 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
TrekaTour Team
```

4. Note the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `user_abc123xyz`)

### 5. Update Configuration
Edit `src/lib/emailService.ts` with your credentials:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',     // Your service ID
  TEMPLATE_ID: 'template_xyz789',   // Your template ID
  PUBLIC_KEY: 'user_abc123xyz'      // Your public key
};
```

## 📋 Template Variables
Your EmailJS template should use these variables:
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name (extracted from email)
- `{{otp_code}}` - 6-digit OTP code
- `{{from_name}}` - Sender name (TrekaTour Admin)

## 🔧 Testing
1. Update the configuration in `emailService.ts`
2. Try logging in with authorized email
3. Check if OTP email is received
4. Verify OTP works correctly

## 💡 Demo Mode
If EmailJS is not configured, the system will:
- Show OTP in browser toast notification
- Still work for testing purposes
- Display "Email Service Unavailable" message

## 🚨 Production Notes
- Remove demo OTP display from toast messages
- Ensure EmailJS account has sufficient quota
- Test with both authorized email addresses
- Monitor EmailJS dashboard for delivery status

## 📊 EmailJS Limits (Free Plan)
- 200 emails per month
- Perfect for admin authentication
- Upgrade if you need more emails

## 🔒 Security
- OTP expires in 5 minutes
- Only authorized emails receive OTPs
- Each OTP is single-use
- No OTP storage in database
