import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { talksService } from "@/services/talks.service";
import type { DashboardStats, Talk } from "@/types/talks";
import { useEffect, useState } from "react";
import { BookOpen, Plus, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTalks, setRecentTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, talksData] = await Promise.all([
          talksService.stats(),
          talksService.recent(5),
        ]);
        setStats(statsData);
        setRecentTalks(talksData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setStats(null);
        setRecentTalks([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your congregation's talks.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/talks/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Register Talk
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Talks
                </CardTitle>
                <BookOpen className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_talks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                All-time total
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Speakers
                </CardTitle>
                <Users className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unique_speakers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Different speakers
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unique Themes
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unique_themes}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Different themes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.this_month}</div>
              <p className="text-xs text-muted-foreground mt-2">
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

      {/* Recent Talks */}
      {recentTalks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Talks</CardTitle>
            <CardDescription>
              Last 5 talks in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTalks.map((talk) => (
                <div
                  key={talk.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{talk.theme}</p>
                    <p className="text-xs text-muted-foreground">
                      {talk.speaker_name || "Unknown Speaker"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(talk.talk_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {talk.congregation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && recentTalks.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">No talks yet</h3>
            <p className="text-muted-foreground mb-4">
              Start registering talks to see them here
            </p>
            <Button 
              onClick={() => navigate("/talks/new")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Register Your First Talk
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
