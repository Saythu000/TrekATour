import { ReactNode } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock } from "lucide-react";
import { Permission, hasPermission } from "@/lib/permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: Permission;
  fallbackMessage?: string;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredPermission = Permission.READ,
  fallbackMessage = "You don't have permission to access this resource.",
  requireAuth = true
}: ProtectedRouteProps) => {
  const { isAdmin, isLoaded, permissions } = useAdmin();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has required permission
  if (!hasPermission(permissions, requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">{fallbackMessage}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // For admin routes, always allow access since we removed Clerk
  return <>{children}</>;
};

export default ProtectedRoute;
