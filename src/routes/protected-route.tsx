import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/ui/loader";

export type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * ProtectedRoute component that requires authentication
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  fallback = <Loader />,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {fallback}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
