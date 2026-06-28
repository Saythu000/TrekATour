import { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { Permission } from "@/lib/permissions";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <ProtectedRoute
      requiredPermission={Permission.ADMIN}
      fallbackMessage="Only authorized administrators can access this area. Please contact support if you believe this is an error."
      requireAuth={true}
    >
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;
