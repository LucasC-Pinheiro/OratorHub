import { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { talksService } from "@/services/talks.service";
import type { DashboardStats } from "@/types/talks";
import { SkeletonLoader } from "@/components/ui/loader";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await talksService.stats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your congregation's talks.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonLoader count={4} className="h-20" />
        ) : stats ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Talks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total_talks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All-time total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Speakers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.unique_speakers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different speakers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.unique_themes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different themes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.this_month}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Talks scheduled
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground text-sm">
            More features coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
