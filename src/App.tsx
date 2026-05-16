import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootRoute } from "@/routes/root-route";
import { ProtectedRoute } from "@/routes/protected-route";
import { PublicRoute } from "@/routes/public-route";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { Suspense, lazy } from "react";
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/talks"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <TalksPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/speakers"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <SpeakersPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <SettingsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
