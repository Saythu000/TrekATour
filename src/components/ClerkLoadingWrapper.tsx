import { ReactNode } from "react";

interface ClerkLoadingWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClerkLoadingWrapper = ({ children }: ClerkLoadingWrapperProps) => {
  // Simple wrapper - just return children since Clerk is removed
  return <>{children}</>;
};

export default ClerkLoadingWrapper;