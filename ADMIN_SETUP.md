# 🔐 Admin Role Setup Guide

## Setting Up Admin Roles in Clerk

To properly configure admin access, you need to set user roles in Clerk's dashboard:

### 1. Access Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to "Users" section

### 2. Set Admin Role for Users
For each admin user:
1. Click on the user's email
2. Go to "Metadata" tab
3. In "Public metadata" section, add:
```json
{
  "role": "admin",
  "permissions": ["read", "write", "delete", "admin", "manage_trips", "view_analytics"]
}
```

### 3. Available Roles
- **user**: Basic read access
- **moderator**: Read and write access
- **admin**: Full admin access (recommended for trek-a-tour admins)
- **super_admin**: Complete system access

### 4. Current Admin Emails (Temporary Fallback)
During migration, these emails have automatic admin access:
- saythu000@gmail.com
- trekatour@gmail.com

### 5. Migration Steps
1. Set up proper roles in Clerk for admin users
2. Test admin access with new role system
3. Remove email fallback from code (future update)

## Security Improvements
✅ Role-based access control (RBAC)  
✅ Permission-based authorization  
✅ Server-side role validation via Clerk  
✅ Granular permission system  
✅ Secure fallback during migration  

## Testing Admin Access
1. Sign in with admin account
2. Navigate to `/admin`
3. Verify access is granted
4. Test with non-admin account to verify access is denied
