import { useEffect, useState } from "react";

interface AdminStatus {
  isAdmin: boolean;
  isLoaded: boolean;
  role: string | null;
  permissions: string[];
}

export const useAdmin = (): AdminStatus => {
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    isLoaded: false,
    role: null,
    permissions: []
  });

  const checkAdminStatus = () => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    
    setAdminStatus({
      isAdmin: isAdminUser,
      isLoaded: true,
      role: isAdminUser ? 'admin' : 'user',
      permissions: isAdminUser ? ['read', 'write', 'delete', 'admin'] : ['read']
    });
  };

  useEffect(() => {
    // Initial check
    checkAdminStatus();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAdmin') {
        checkAdminStatus();
      }
    };

    // Listen for custom storage events (for same-tab changes)
    const handleCustomStorageChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminStatusChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminStatusChanged', handleCustomStorageChange);
    };
  }, []);

  return adminStatus;
};
