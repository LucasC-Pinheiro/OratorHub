import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/loader";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  fallback = <PageLoader />,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
