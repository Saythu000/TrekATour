/**
 * Role management utilities for admin operations
 * Provides functions to manage user roles and permissions
 */

import { Role, Permission, getPermissionsForRole } from './permissions';

export interface UserRole {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
  assignedAt: Date;
  assignedBy: string;
}

/**
 * Validate if a role change is allowed
 */
export const canAssignRole = (assignerRole: Role, targetRole: Role): boolean => {
  const roleHierarchy = {
    [Role.USER]: 0,
    [Role.MODERATOR]: 1,
    [Role.ADMIN]: 2,
    [Role.SUPER_ADMIN]: 3
  };

  // Can only assign roles equal or lower than your own
  return roleHierarchy[assignerRole] >= roleHierarchy[targetRole];
};

/**
 * Get role display information
 */
export const getRoleInfo = (role: Role) => {
  const roleInfo = {
    [Role.USER]: {
      label: 'User',
      description: 'Basic user with read access',
      color: 'default' as const
    },
    [Role.MODERATOR]: {
      label: 'Moderator',
      description: 'Can read and write content',
      color: 'secondary' as const
    },
    [Role.ADMIN]: {
      label: 'Administrator',
      description: 'Full administrative access',
      color: 'destructive' as const
    },
    [Role.SUPER_ADMIN]: {
      label: 'Super Admin',
      description: 'Complete system access',
      color: 'destructive' as const
    }
  };

  return roleInfo[role] || roleInfo[Role.USER];
};

/**
 * Create role assignment payload for Clerk
 */
export const createRoleMetadata = (role: Role) => {
  return {
    role,
    permissions: getPermissionsForRole(role),
    assignedAt: new Date().toISOString()
  };
};

/**
 * Validate role metadata structure
 */
export const isValidRoleMetadata = (metadata: unknown): metadata is { role: string; permissions: string[]; lastUpdated: string } => {
  return (
    metadata &&
    typeof metadata.role === 'string' &&
    Array.isArray(metadata.permissions) &&
    Object.values(Role).includes(metadata.role as Role)
  );
};
