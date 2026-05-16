import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarRange,
  Clock,
  Hash,
  MapPin,
  Mic2,
  PlusCircle,
  Search as SearchIcon,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { TalksTable } from "@/components/talks/talks-table";
import { useTalksStore } from "@/hooks/use-talks-store";
import {
  aggregateSpeakers,
  aggregateThemes,
} from "@/services/talks.service";
import {
  formatDate,
  formatRelative,
  initials,
  normalize,
  pluralize,
} from "@/lib/utils";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";
import type { Talk } from "@/types/talks";

const RECENT_KEY = "oratorhub:recent-searches";
const RECENT_MAX = 6;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeRecent(values: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(values));
  } catch {
    /* ignore quota errors */
  }
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTheme = searchParams.get("q") ?? "";
  const initialSpeaker = searchParams.get("orador") ?? "";

  const [theme, setTheme] = useState(initialTheme);
  const [speaker, setSpeaker] = useState(initialSpeaker);
  const [recent, setRecent] = useState<string[]>(() => readRecent());

  const { talks, loading } = useTalksStore();
  const { openRegister } = useOutletContext<DashboardOutletContext>();

  // Sync URL ↔ state.
  useEffect(() => {
    const next = new URLSearchParams();
    if (theme.trim()) next.set("q", theme.trim());
    if (speaker.trim()) next.set("orador", speaker.trim());
    setSearchParams(next, { replace: true });
  }, [theme, speaker, setSearchParams]);

  const themeOptions = useMemo<ComboboxOption[]>(
    () =>
      aggregateThemes(talks).map((t) => ({
        value: t.theme,
        label: t.theme,
        description: `Último: ${t.last_talk.speaker_name} · ${formatRelative(t.last_talk.talk_date)}`,
        badge: (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {t.total}×
          </span>
        ),
      })),
    [talks],
  );

  const speakerOptions = useMemo<ComboboxOption[]>(
    () =>
      aggregateSpeakers(talks).map((s) => ({
        value: s.name,
        label: s.name,
        description: `${pluralize(s.total, "discurso")} · último em ${formatDate(s.last_talk.talk_date)}`,
      })),
    [talks],
  );

  const matches = useMemo(() => {
    const t = normalize(theme);
    const s = normalize(speaker);
    if (!t && !s) return [] as Talk[];
    return talks.filter((talk) => {
      const themeOk = !t || normalize(talk.theme).includes(t);
      const speakerOk = !s || normalize(talk.speaker_name).includes(s);
      return themeOk && speakerOk;
    });
  }, [talks, theme, speaker]);

  const lastForTheme = useMemo(() => {
    const t = normalize(theme);
    if (!t) return null;
    const exact = talks
      .filter((talk) => normalize(talk.theme) === t)
      .sort((a, b) => +new Date(b.talk_date) - +new Date(a.talk_date));
    if (exact.length > 0) {
      return { total: exact.length, last: exact[0], strict: true as const };
    }
    const loose = talks
      .filter((talk) => normalize(talk.theme).includes(t))
      .sort((a, b) => +new Date(b.talk_date) - +new Date(a.talk_date));
    if (loose.length === 0) return null;
    return { total: loose.length, last: loose[0], strict: false as const };
  }, [talks, theme]);

  const speakerThemeIntel = useMemo(() => {
    const t = normalize(theme);
    const s = normalize(speaker);
    if (!t || !s) return null;
    const rows = talks
      .filter(
        (talk) =>
          normalize(talk.theme).includes(t) &&
          normalize(talk.speaker_name).includes(s),
      )
      .sort((a, b) => +new Date(b.talk_date) - +new Date(a.talk_date));
    return { total: rows.length, last: rows[0] ?? null, talks: rows };
  }, [talks, theme, speaker]);

  // Persist recent searches whenever a meaningful query is run.
  useEffect(() => {
    const value = theme.trim() || speaker.trim();
    if (!value) return;
    const handle = setTimeout(() => {
      const next = [value, ...recent.filter((r) => normalize(r) !== normalize(value))].slice(
        0,
        RECENT_MAX,
      );
      setRecent(next);
      writeRecent(next);
    }, 1500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, speaker]);

  const hasQuery = Boolean(theme.trim() || speaker.trim());

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Busca inteligente
        </h1>
        <p className="text-sm text-muted-foreground">
          Combine tema e orador para descobrir, na hora, quem deu o último
          discurso e quantas vezes ele já foi apresentado.
        </p>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
          <Combobox
            value={theme}
            onChange={setTheme}
            options={themeOptions}
            placeholder="Filtrar por tema"
            leadingIcon={<Hash className="h-4 w-4" />}
          />
          <Combobox
            value={speaker}
            onChange={setSpeaker}
            options={speakerOptions}
            placeholder="Filtrar por orador"
            leadingIcon={<User className="h-4 w-4" />}
          />
        </CardContent>
        {recent.length > 0 ? (
          <CardContent className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-4 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Recentes:
            </span>
            {recent.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setTheme(value);
                  setSpeaker("");
                }}
                className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {value}
              </button>
            ))}
          </CardContent>
        ) : null}
      </Card>

      {!hasQuery ? (
        <EmptyState
          icon={SearchIcon}
          title="Comece pelo tema ou pelo orador"
          description="Os resultados mostram o último orador, congregação, data e a contagem total para o tema escolhido."
        />
      ) : loading ? (
        <SearchSkeleton />
      ) : speakerThemeIntel ? (
        <SpeakerThemeResult
          theme={theme}
          speaker={speaker}
          total={speakerThemeIntel.total}
          last={speakerThemeIntel.last}
          talks={speakerThemeIntel.talks}
        />
      ) : lastForTheme ? (
        <ThemeResult
          theme={theme}
          total={lastForTheme.total}
          last={lastForTheme.last}
          strict={lastForTheme.strict}
        />
      ) : (
        <EmptyState
          icon={Mic2}
          title="Nenhum discurso corresponde"
          description={`Não encontramos discursos com "${theme || speaker}". Tente outra palavra-chave ou cadastre o primeiro.`}
          action={
            <Button onClick={openRegister}>
              <PlusCircle className="h-4 w-4" />
              Registrar discurso
            </Button>
          }
        />
      )}

      {hasQuery && matches.length > 1 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Todos os discursos relacionados</CardTitle>
              <p className="text-sm text-muted-foreground">
                {pluralize(matches.length, "registro encontrado", "registros encontrados")}.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link
                to={`/historico?q=${encodeURIComponent(theme || speaker)}`}
              >
                Abrir histórico
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <TalksTable talks={matches.slice(0, 10)} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function ThemeResult({
  theme,
  total,
  last,
  strict,
}: {
  theme: string;
  total: number;
  last: Talk;
  strict: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-gradient-to-br from-secondary/40 to-card">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {strict ? "Tema encontrado" : "Tema mais próximo"}
          </div>
          <CardTitle className="text-xl text-balance">
            {strict ? last.theme : theme}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Usado {pluralize(total, "vez", "vezes")} · último em{" "}
            {formatRelative(last.talk_date)}.
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        <FieldCard
          icon={User}
          label="Último orador"
          value={last.speaker_name}
          chip={initials(last.speaker_name)}
        />
        <FieldCard
          icon={MapPin}
          label="Congregação"
          value={last.congregation}
        />
        <FieldCard
          icon={CalendarRange}
          label="Data"
          value={formatDate(last.talk_date)}
        />
        <FieldCard
          icon={Hash}
          label="Total de ocorrências"
          value={`${total}×`}
        />
      </CardContent>
    </Card>
  );
}

function SpeakerThemeResult({
  theme,
  speaker,
  total,
  last,
  talks,
}: {
  theme: string;
  speaker: string;
  total: number;
  last: Talk | null;
  talks: Talk[];
}) {
  if (total === 0 || !last) {
    return (
      <EmptyState
        icon={Mic2}
        title="Combinação inédita"
        description={`${speaker || "Esse orador"} ainda não apresentou um discurso com tema "${theme || "selecionado"}".`}
      />
    );
  }
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-secondary/40 to-card">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Orador × Tema
          </div>
          <CardTitle className="text-xl text-balance">
            {last.speaker_name} apresentou “{last.theme}”
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {pluralize(total, "vez", "vezes")} no total · última em{" "}
            <strong>{formatDate(last.talk_date)}</strong> ({last.congregation}).
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldCard
            icon={CalendarRange}
            label="Última apresentação"
            value={formatDate(last.talk_date)}
          />
          <FieldCard
            icon={MapPin}
            label="Congregação"
            value={last.congregation}
          />
          <FieldCard
            icon={Hash}
            label="Quantas vezes"
            value={`${total}×`}
          />
          <FieldCard
            icon={Clock}
            label="Tempo desde a última"
            value={formatRelative(last.talk_date)}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Histórico completo desta combinação
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {talks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(t.talk_date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.congregation}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelative(t.talk_date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function FieldCard({
  icon: Icon,
  label,
  value,
  chip,
}: {
  icon: typeof Mic2;
  label: string;
  value: string;
  chip?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {chip ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {chip}
          </span>
        ) : null}
        <p className="text-base font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
