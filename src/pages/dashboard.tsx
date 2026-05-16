import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  CalendarRange,
  Layers,
  Mic2,
  PlusCircle,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { TalksTable } from "@/components/talks/talks-table";
import { useAuth } from "@/hooks/use-auth";
import { talksService } from "@/services/talks.service";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";
import type { DashboardStats, Talk } from "@/types/talks";

export function DashboardPage() {
  const { user } = useAuth();
  const { openRegister } = useOutletContext<DashboardOutletContext>();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [statsData, recentData] = await Promise.all([
          talksService.stats(),
          talksService.recent(6),
        ]);
        if (!mounted) return;
        setStats(statsData);
        setRecent(recentData);
      } catch (error) {
        toast.error("Failed to load dashboard", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Elder";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {greeting}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your congregation's public talks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/search">
              <Search className="h-4 w-4" />
              Search themes
            </Link>
          </Button>
          <Button onClick={openRegister}>
            <PlusCircle className="h-4 w-4" />
            New talk
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Mic2}
          label="Total talks"
          value={stats?.total_talks ?? 0}
          hint="All-time records"
          loading={loading}
        />
        <StatCard
          icon={Users}
          label="Unique speakers"
          value={stats?.unique_speakers ?? 0}
          hint="Active brothers"
          loading={loading}
        />
        <StatCard
          icon={Layers}
          label="Unique themes"
          value={stats?.unique_themes ?? 0}
          hint="Distinct outlines covered"
          loading={loading}
        />
        <StatCard
          icon={CalendarRange}
          label="This month"
          value={stats?.this_month ?? 0}
          hint="Talks delivered"
          loading={loading}
          trend="up"
        />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Quick search</CardTitle>
            <p className="text-sm text-muted-foreground">
              Find a theme, speaker or congregation in seconds.
            </p>
          </div>
          <form
            className="relative w-full sm:w-80"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. brotherly kindness"
              className="pl-9"
            />
          </form>
        </CardHeader>
        {search.trim() ? (
          <CardContent>
            <Button asChild>
              <Link to={`/search?q=${encodeURIComponent(search.trim())}`}>
                Search for "{search.trim()}"
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Recent talks</CardTitle>
            <p className="text-sm text-muted-foreground">
              The latest entries across all congregations.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <TalksTable
            talks={recent}
            loading={loading}
            emptyState={
              <EmptyState
                icon={Mic2}
                title="No talks yet"
                description="Register the first public talk to start building your congregation's history."
                action={
                  <Button onClick={openRegister}>
                    <PlusCircle className="h-4 w-4" />
                    Register a talk
                  </Button>
                }
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
