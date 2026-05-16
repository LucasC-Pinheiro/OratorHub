import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import { GuestRoute, ProtectedRoute } from "@/components/protected-route";
import { FullPageLoader } from "@/components/ui/full-page-loader";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/layouts/dashboard-layout";

const LoginPage = lazy(() =>
  import("@/pages/login").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage })),
);
const SearchPage = lazy(() =>
  import("@/pages/search").then((m) => ({ default: m.SearchPage })),
);
const HistoryPage = lazy(() =>
  import("@/pages/history").then((m) => ({ default: m.HistoryPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((m) => ({ default: m.NotFoundPage })),
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/painel" element={<DashboardPage />} />
                  <Route path="/buscar" element={<SearchPage />} />
                  <Route path="/historico" element={<HistoryPage />} />
                </Route>
              </Route>

              {/* Backwards-compatible redirects for the previous English URLs. */}
              <Route path="/dashboard" element={<Navigate to="/painel" replace />} />
              <Route path="/search" element={<Navigate to="/buscar" replace />} />
              <Route path="/history" element={<Navigate to="/historico" replace />} />

              <Route path="/" element={<Navigate to="/painel" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
