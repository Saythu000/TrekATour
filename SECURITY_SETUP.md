# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Key Regeneration Required

The following API keys were exposed in the repository and must be regenerated immediately:

### 1. Supabase Keys
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Navigate to your project settings
- Go to API section
- **Regenerate** the anon/public key
- Update `VITE_SUPABASE_PUBLISHABLE_KEY` in your `.env` file

### 2. Clerk Keys  
- Go to [Clerk Dashboard](https://dashboard.clerk.com)
- Navigate to your application
- Go to API Keys section
- **Regenerate** both publishable and secret keys
- Update `VITE_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in your `.env` file

### 3. Environment Setup
1. Copy `.env.example` to `.env`
2. Replace all placeholder values with your new regenerated keys
3. Never commit the `.env` file to version control

### 4. Verification
After updating keys, test:
- Authentication flow works
- Database connections work
- Admin functions work

## Security Best Practices Applied
✅ Environment variables properly configured  
✅ Secrets removed from codebase  
✅ .gitignore updated to prevent future exposure  
✅ Environment validation added  

## Next Steps
- Regenerate all exposed keys immediately
- Test application functionality
- Proceed to next security fix
