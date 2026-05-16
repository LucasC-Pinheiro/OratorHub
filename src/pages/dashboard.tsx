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
import { TopThemesCard } from "@/components/dashboard/top-themes-card";
import { RecentSpeakersCard } from "@/components/dashboard/recent-speakers-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TalksTable } from "@/components/talks/talks-table";
import { useAuth } from "@/hooks/use-auth";
import { useTalksStore } from "@/hooks/use-talks-store";
import {
  aggregateSpeakers,
  aggregateThemes,
  aggregateTopThemes,
} from "@/services/talks.service";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";
import { pluralize } from "@/lib/utils";

export function DashboardPage() {
  const { user } = useAuth();
  const { openRegister } = useOutletContext<DashboardOutletContext>();
  const { talks, loading, error } = useTalksStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) {
      toast.error("Falha ao carregar dados", {
        description: error.message,
      });
    }
  }, [error]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const stats = useMemo(() => {
    const speakers = new Set<string>();
    const themes = new Set<string>();
    const congregations = new Set<string>();
    let thisMonth = 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const t of talks) {
      speakers.add(t.speaker_name.toLowerCase().trim());
      themes.add(t.theme.toLowerCase().trim());
      congregations.add(t.congregation.toLowerCase().trim());
      if (new Date(t.talk_date) >= startOfMonth) thisMonth += 1;
    }

    return {
      total: talks.length,
      speakers: speakers.size,
      themes: themes.size,
      congregations: congregations.size,
      thisMonth,
    };
  }, [talks]);

  const recent = useMemo(() => talks.slice(0, 6), [talks]);
  const topThemes = useMemo(() => aggregateTopThemes(talks, 5), [talks]);
  const recentSpeakers = useMemo(
    () => aggregateSpeakers(talks).slice(0, 5),
    [talks],
  );
  const themeOptions = useMemo(() => aggregateThemes(talks), [talks]);

  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Ancião";

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {greeting}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Olá, {name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe os discursos públicos da sua congregação em um só lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/buscar">
              <Search className="h-4 w-4" />
              Buscar tema
            </Link>
          </Button>
          <Button onClick={openRegister} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Novo discurso
          </Button>
        </div>
      </section>

      <QuickActions onNewTalk={openRegister} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Mic2}
          label="Discursos"
          value={stats.total}
          hint="Total registrado"
          loading={loading && talks.length === 0}
        />
        <StatCard
          icon={Users}
          label="Oradores"
          value={stats.speakers}
          hint="Diferentes irmãos"
          loading={loading && talks.length === 0}
        />
        <StatCard
          icon={Layers}
          label="Temas"
          value={stats.themes}
          hint="Assuntos únicos"
          loading={loading && talks.length === 0}
        />
        <StatCard
          icon={CalendarRange}
          label="Neste mês"
          value={stats.thisMonth}
          hint={`Em ${stats.congregations} congregações`}
          loading={loading && talks.length === 0}
          trend="up"
        />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Busca rápida</CardTitle>
            <p className="text-sm text-muted-foreground">
              Encontre um tema, orador ou congregação em segundos.
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
              placeholder="Ex.: coragem"
              className="pl-9"
            />
          </form>
        </CardHeader>
        {search.trim() ? (
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button asChild>
              <Link to={`/buscar?q=${encodeURIComponent(search.trim())}`}>
                Buscar "{search.trim()}"
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              {pluralize(themeOptions.length, "tema cadastrado", "temas cadastrados")}
            </p>
          </CardContent>
        ) : null}
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <TopThemesCard themes={topThemes} loading={loading && talks.length === 0} />
        <RecentSpeakersCard
          speakers={recentSpeakers}
          loading={loading && talks.length === 0}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Discursos recentes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Os últimos registros em todas as congregações.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/historico">
              Ver tudo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <TalksTable
            talks={recent}
            loading={loading && talks.length === 0}
            emptyState={
              <EmptyState
                icon={Mic2}
                title="Nenhum discurso ainda"
                description="Registre o primeiro discurso para começar a construir o histórico da sua congregação."
                action={
                  <Button onClick={openRegister}>
                    <PlusCircle className="h-4 w-4" />
                    Registrar discurso
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
