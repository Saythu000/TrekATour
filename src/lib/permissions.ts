/**
 * Permission-based access control system
 * Provides granular permissions for different user roles
 */

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
  MANAGE_TRIPS = 'manage_trips',
  MANAGE_USERS = 'manage_users',
  VIEW_ANALYTICS = 'view_analytics'
}

export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ],
  [Role.MODERATOR]: [Permission.READ, Permission.WRITE],
  [Role.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.ADMIN,
    Permission.MANAGE_TRIPS,
    Permission.VIEW_ANALYTICS
  ],
  [Role.SUPER_ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.ADMIN,
    Permission.MANAGE_TRIPS,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS
  ]
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (userPermissions: string[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the required permissions
 */
export const hasAnyPermission = (userPermissions: string[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all required permissions
 */
export const hasAllPermissions = (userPermissions: string[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

/**
 * Get permissions for a specific role
 */
export const getPermissionsForRole = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[Role.USER];
};
