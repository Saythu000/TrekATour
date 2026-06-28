# 📧 EmailJS Setup Guide - Real OTP Email Delivery

## 🎯 Goal
Send actual OTP emails to `saythu000@gmail.com` and `trekatour@gmail.com` instead of showing OTP on website.

## 🚀 Step-by-Step Setup

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"**
3. Create account with your email
4. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended)
4. Click **"Connect Account"**
5. Sign in with Gmail account that will send OTPs
6. Grant permissions
7. **Copy the Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

**Template Name:** `TrekaTour Admin OTP`

**Subject:** `TrekaTour Admin Login - Your OTP Code`

**Content:**
```html
Hello {{to_name}},

Your OTP for TrekaTour admin panel access is:

**{{otp_code}}**

This OTP will expire in 5 minutes for security reasons.

If you didn't request this login, please ignore this email.

Best regards,
TrekaTour Admin Team

---
This is an automated message for admin authentication.
```

4. **Save template** and copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **"Account"** → **"General"**
2. Find **"Public Key"** section
3. **Copy your Public Key** (e.g., `user_abc123xyz`)

### Step 5: Update Configuration
Edit `src/lib/emailService.ts` with your actual credentials:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',     // Your actual service ID
  TEMPLATE_ID: 'template_xyz789',   // Your actual template ID
  PUBLIC_KEY: 'user_abc123xyz'      // Your actual public key
};
```

### Step 6: Test Email Delivery
1. Save the configuration
2. Build and run your application
3. Try admin login with `saythu000@gmail.com`
4. Check if OTP email arrives in inbox
5. Test with `trekatour@gmail.com` as well

## 📋 Template Variables Reference
Your EmailJS template uses these variables:
- `{{to_email}}` - Recipient email (saythu000@gmail.com or trekatour@gmail.com)
- `{{to_name}}` - Recipient name (extracted from email prefix)
- `{{otp_code}}` - 6-digit OTP code (e.g., 123456)
- `{{from_name}}` - Sender name (TrekaTour Admin Team)
- `{{subject}}` - Email subject line

## 🔧 Configuration File Location
File: `src/lib/emailService.ts`

Replace these placeholders:
```javascript
SERVICE_ID: 'service_trekatour',    // Replace with your service ID
TEMPLATE_ID: 'template_otp_admin',  // Replace with your template ID
PUBLIC_KEY: 'trekatour_public_key'  // Replace with your public key
```

## 🧪 Testing Checklist
- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created with OTP variables
- [ ] Configuration updated in `emailService.ts`
- [ ] Test email sent to `saythu000@gmail.com`
- [ ] Test email sent to `trekatour@gmail.com`
- [ ] OTP received in actual email inbox
- [ ] OTP verification works in admin login
- [ ] No OTP shown on website (production mode)

## 🚨 Important Notes

### Security
- OTP is only sent to authorized emails
- OTP expires in 5 minutes
- Each OTP is single-use only
- No OTP displayed on website

### Email Delivery
- Check spam/junk folders if email not received
- Gmail service is most reliable
- Free EmailJS plan: 200 emails/month (sufficient for admin use)

### Troubleshooting
- Verify all IDs are correct in configuration
- Check EmailJS dashboard for delivery status
- Ensure Gmail account has proper permissions
- Test with both authorized email addresses

## 📊 Expected Email Format
```
Subject: TrekaTour Admin Login - Your OTP Code

Hello saythu000,

Your OTP for TrekaTour admin panel access is:

**123456**

This OTP will expire in 5 minutes for security reasons.

If you didn't request this login, please ignore this email.

Best regards,
TrekaTour Admin Team
```

## ✅ Success Criteria
- Real emails sent to authorized addresses
- No OTP visible on website
- Professional email template
- Secure 5-minute expiry
- Reliable email delivery

**Once configured, admins will receive actual OTP emails in their inbox for secure authentication!**
