import { PageLoader } from "@/components/ui/loader";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { ProtectedRoute } from "@/routes/protected-route";
import { Suspense, lazy } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Lazy load pages
const LoginPage = lazy(() =>
  import("@/pages/login").then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
);
const TalksPage = lazy(() =>
  import("@/pages/talks").then((m) => ({ default: m.TalksPage }))
);
const SpeakersPage = lazy(() =>
  import("@/pages/speakers").then((m) => ({ default: m.SpeakersPage }))
);
const SettingsPage = lazy(() =>
  import("@/pages/settings").then((m) => ({ default: m.SettingsPage }))
);
const NewTalkPage = lazy(() =>
  import("@/pages/new-talk").then((m) => ({ default: m.NewTalkPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFoundPage }))
);

// Simple layout wrapper for protected pages
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              }
            />

            {/* Protected Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/talks"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout>
                      <TalksPage />
                    </MainLayout>
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/talks/new"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout>
                      <NewTalkPage />
                    </MainLayout>
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/speakers"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout>
                      <SpeakersPage />
                    </MainLayout>
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout>
                      <SettingsPage />
                    </MainLayout>
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Default & Not Found */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
