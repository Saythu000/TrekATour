import { ReactNode } from "react";

interface ClerkWrapperProps {
  children: ReactNode;
}

const ClerkWrapper = ({ children }: ClerkWrapperProps) => {
  // Simple wrapper without Clerk - just return children
  return <>{children}</>;
};

export default ClerkWrapper;
