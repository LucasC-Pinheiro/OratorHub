import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { talksService } from "@/services/talks.service";
import type { DashboardStats, Talk } from "@/types/talks";
import { BookOpen, Plus, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
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
        setError(err instanceof Error ? err.message : "Falha ao carregar dados");
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
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo! Aqui está um resumo das palestras da sua congregação.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/talks/new")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Palestra
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
                  Total de Palestras
                </CardTitle>
                <BookOpen className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_talks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Total de todos os tempos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Palestrantes Únicos
                </CardTitle>
                <Users className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unique_speakers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Palestrantes diferentes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Temas Únicos
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unique_themes}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Temas diferentes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Este Mês
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-primary/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.this_month}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Palestras agendadas
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      )}

      {/* Recent Talks */}
      {recentTalks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Palestras Recentes</CardTitle>
            <CardDescription>
              Últimas 5 palestras do sistema
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
                      {talk.speaker_name || "Palestrante Desconhecido"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(talk.talk_date).toLocaleDateString("pt-BR")}
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
            <h3 className="font-semibold text-lg mb-2">Nenhuma palestra ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece a registrar palestras para vê-las aqui
            </p>
            <Button 
              onClick={() => navigate("/talks/new")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Registre Sua Primeira Palestra
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
