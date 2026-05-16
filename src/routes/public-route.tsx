import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/ui/loader";

export type PublicRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * PublicRoute component for pages that should not be accessed by authenticated users
 * Redirects authenticated users to dashboard
 */
export function PublicRoute({
  children,
  fallback = <Loader />,
}: PublicRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {fallback}
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
