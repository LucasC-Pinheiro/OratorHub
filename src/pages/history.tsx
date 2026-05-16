import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Filter,
  History as HistoryIcon,
  Hash,
  MapPin,
  PlusCircle,
  Search as SearchIcon,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { TalksTable } from "@/components/talks/talks-table";
import {
  aggregateCongregations,
  aggregateSpeakers,
  aggregateThemes,
} from "@/services/talks.service";
import { useTalksStore } from "@/hooks/use-talks-store";
import { normalize, pluralize } from "@/lib/utils";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";

const PAGE_SIZE = 10;

type Range = "all" | "30d" | "90d" | "12m" | "year";

const RANGE_LABEL: Record<Range, string> = {
  all: "Todo o período",
  "30d": "Últimos 30 dias",
  "90d": "Últimos 90 dias",
  "12m": "Últimos 12 meses",
  year: "Ano atual",
};

export function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { talks, loading } = useTalksStore();
  const { openRegister } = useOutletContext<DashboardOutletContext>();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [theme, setTheme] = useState(searchParams.get("tema") ?? "");
  const [speaker, setSpeaker] = useState(searchParams.get("orador") ?? "");
  const [congregations, setCongregations] = useState<Set<string>>(
    () => new Set(searchParams.getAll("congregacao")),
  );
  const [range, setRange] = useState<Range>(
    (searchParams.get("periodo") as Range) || "all",
  );
  const [page, setPage] = useState(0);

  // Debounce free-text search.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(handle);
  }, [query]);

  // Sync URL.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (theme.trim()) params.set("tema", theme.trim());
    if (speaker.trim()) params.set("orador", speaker.trim());
    congregations.forEach((c) => params.append("congregacao", c));
    if (range !== "all") params.set("periodo", range);
    setSearchParams(params, { replace: true });
    setPage(0);
  }, [debouncedQuery, theme, speaker, congregations, range, setSearchParams]);

  const themeOptions = useMemo<ComboboxOption[]>(
    () =>
      aggregateThemes(talks).map((t) => ({
        value: t.theme,
        label: t.theme,
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
        description: pluralize(s.total, "discurso"),
      })),
    [talks],
  );

  const availableCongregations = useMemo(
    () => aggregateCongregations(talks),
    [talks],
  );

  const rangeStart = useMemo(() => {
    const now = new Date();
    switch (range) {
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case "12m":
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case "year":
        return new Date(now.getFullYear(), 0, 1);
      default:
        return null;
    }
  }, [range]);

  const filtered = useMemo(() => {
    const term = normalize(debouncedQuery);
    const themeTerm = normalize(theme);
    const speakerTerm = normalize(speaker);
    return talks.filter((t) => {
      if (
        term &&
        !(
          normalize(t.theme).includes(term) ||
          normalize(t.speaker_name).includes(term) ||
          normalize(t.congregation).includes(term)
        )
      )
        return false;
      if (themeTerm && !normalize(t.theme).includes(themeTerm)) return false;
      if (
        speakerTerm &&
        !normalize(t.speaker_name).includes(speakerTerm)
      )
        return false;
      if (congregations.size > 0 && !congregations.has(t.congregation))
        return false;
      if (rangeStart && new Date(t.talk_date) < rangeStart) return false;
      return true;
    });
  }, [talks, debouncedQuery, theme, speaker, congregations, rangeStart]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * PAGE_SIZE;
  const pageData = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function toggleCongregation(name: string) {
    setCongregations((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setTheme("");
    setSpeaker("");
    setCongregations(new Set());
    setRange("all");
  }

  const hasFilters =
    Boolean(debouncedQuery || theme || speaker) ||
    congregations.size > 0 ||
    range !== "all";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Histórico de discursos
          </h1>
          <p className="text-sm text-muted-foreground">
            Pesquise, filtre e navegue por todo o acervo da congregação.
          </p>
        </div>
        <Button onClick={openRegister} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          Registrar
        </Button>
      </header>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por tema, orador ou congregação…"
              className="pl-9 pr-9"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="justify-start font-normal text-muted-foreground"
                >
                  <MapPin className="h-4 w-4" />
                  {congregations.size === 0
                    ? "Congregação"
                    : pluralize(
                        congregations.size,
                        "congregação",
                        "congregações",
                      )}
                  {congregations.size > 0 ? (
                    <Badge className="ml-auto">{congregations.size}</Badge>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-60 max-h-72 overflow-y-auto scrollbar-thin"
              >
                <DropdownMenuLabel>Filtrar por congregação</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableCongregations.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    Nenhuma congregação registrada ainda.
                  </p>
                ) : (
                  availableCongregations.map((name) => (
                    <DropdownMenuCheckboxItem
                      key={name}
                      checked={congregations.has(name)}
                      onCheckedChange={() => toggleCongregation(name)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {name}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="justify-start font-normal text-muted-foreground"
                >
                  <CalendarRange className="h-4 w-4" />
                  {RANGE_LABEL[range]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Período</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(RANGE_LABEL) as Range[]).map((value) => (
                  <DropdownMenuCheckboxItem
                    key={value}
                    checked={range === value}
                    onCheckedChange={() => setRange(value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {RANGE_LABEL[value]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasFilters ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-muted-foreground">
                Filtros ativos:
              </span>
              {theme ? (
                <FilterChip
                  label={`Tema: ${theme}`}
                  onClear={() => setTheme("")}
                />
              ) : null}
              {speaker ? (
                <FilterChip
                  label={`Orador: ${speaker}`}
                  onClear={() => setSpeaker("")}
                />
              ) : null}
              {[...congregations].map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  onClear={() => toggleCongregation(c)}
                />
              ))}
              {range !== "all" ? (
                <FilterChip
                  label={RANGE_LABEL[range]}
                  onClear={() => setRange("all")}
                />
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <X className="h-3.5 w-3.5" />
                Limpar tudo
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <TalksTable
            talks={pageData}
            loading={loading && talks.length === 0}
            emptyState={
              <EmptyState
                icon={hasFilters ? Filter : HistoryIcon}
                title={
                  hasFilters
                    ? "Nenhum discurso corresponde aos filtros"
                    : "Nenhum discurso registrado"
                }
                description={
                  hasFilters
                    ? "Tente ampliar a busca ou limpar os filtros aplicados."
                    : "Cadastre o primeiro discurso para começar o histórico."
                }
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                      Limpar filtros
                    </Button>
                  ) : (
                    <Button onClick={openRegister}>
                      <PlusCircle className="h-4 w-4" />
                      Registrar discurso
                    </Button>
                  )
                }
              />
            }
          />
        </CardContent>
      </Card>

      {filtered.length > 0 ? (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Mostrando{" "}
            <span className="font-medium text-foreground">
              {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
            </span>{" "}
            de{" "}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            discursos
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              Página {safePage + 1} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs text-foreground">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-0.5 transition-colors hover:bg-secondary"
        aria-label={`Remover filtro ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
