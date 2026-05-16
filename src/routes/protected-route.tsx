import { PageLoader } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

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
