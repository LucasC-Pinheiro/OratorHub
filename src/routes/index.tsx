import type { RouteObject } from "react-router-dom";
import { Suspense, lazy } from "react";
import { RootRoute } from "./root-route";
import { ProtectedRoute } from "./protected-route";
import { PublicRoute } from "./public-route";
import { Loader } from "@/components/ui/loader";

// Lazy load pages for better code splitting
const LoginPage = lazy(() => import("@/pages/login").then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/dashboard").then(m => ({ default: m.DashboardPage })));
const TalksPage = lazy(() => import("@/pages/talks").then(m => ({ default: m.TalksPage })));
const SpeakersPage = lazy(() => import("@/pages/speakers").then(m => ({ default: m.SpeakersPage })));
const SettingsPage = lazy(() => import("@/pages/settings").then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import("@/pages/not-found").then(m => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader />
  </div>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/talks",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <TalksPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/speakers",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <SpeakersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <SettingsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];
