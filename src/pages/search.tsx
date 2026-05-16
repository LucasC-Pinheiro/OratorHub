import { useEffect, useState, type FormEvent } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarRange,
  Hash,
  MapPin,
  Mic2,
  PlusCircle,
  Search as SearchIcon,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatRelative } from "@/lib/utils";
import { talksService } from "@/services/talks.service";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";
import type { ThemeSummary } from "@/types/talks";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [result, setResult] = useState<ThemeSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const { openRegister } = useOutletContext<DashboardOutletContext>();

  useEffect(() => {
    if (!submitted.trim()) {
      setResult(null);
      return;
    }
    let mounted = true;
    setLoading(true);
    talksService
      .searchTheme(submitted)
      .then((data) => {
        if (mounted) setResult(data);
      })
      .catch((error) => {
        if (mounted) {
          toast.error("Search failed", {
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
          setResult(null);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [submitted]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    setSubmitted(trimmed);
    if (trimmed) setSearchParams({ q: trimmed });
    else setSearchParams({});
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Search themes
        </h1>
        <p className="text-sm text-muted-foreground">
          Look up a theme to see who last gave it, in which congregation, and
          how many times it's been used.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by theme keyword…"
                className="pl-9"
              />
            </div>
            <Button type="submit" size="lg" loading={loading}>
              <SearchIcon className="h-4 w-4" />
              Search
            </Button>
          </CardContent>
        </Card>
      </form>

      {!submitted.trim() ? (
        <EmptyState
          icon={SearchIcon}
          title="Start by entering a theme"
          description="Search results will display the last speaker, congregation, date, and total times the theme was used."
        />
      ) : loading ? (
        <SearchSkeleton />
      ) : !result || result.total === 0 ? (
        <EmptyState
          icon={Mic2}
          title="No talks match that theme yet"
          description={`We couldn't find any talks containing "${submitted}". Try a different keyword or register the first one.`}
          action={
            <Button onClick={openRegister}>
              <PlusCircle className="h-4 w-4" />
              Register this talk
            </Button>
          }
        />
      ) : (
        <SearchResult summary={result} />
      )}
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

function SearchResult({ summary }: { summary: ThemeSummary }) {
  const last = summary.last_talk;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-gradient-to-br from-secondary/40 to-card">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Hash className="h-3.5 w-3.5" />
            Theme match
          </div>
          <CardTitle className="text-xl">{summary.theme}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Used {summary.total} {summary.total === 1 ? "time" : "times"} in
            total
            {last
              ? ` · last given ${formatRelative(last.talk_date)}`
              : ""}
          </p>
        </div>
      </CardHeader>
      {last ? (
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <ResultField
            icon={User}
            label="Last speaker"
            value={last.speaker_name}
          />
          <ResultField
            icon={MapPin}
            label="Congregation"
            value={last.congregation}
          />
          <ResultField
            icon={CalendarRange}
            label="Date given"
            value={formatDate(last.talk_date)}
          />
          <ResultField
            icon={Hash}
            label="Total occurrences"
            value={`${summary.total} talk${summary.total === 1 ? "" : "s"}`}
          />
          <div className="sm:col-span-2">
            <Button asChild variant="outline">
              <a
                href={`#/history?q=${encodeURIComponent(summary.theme)}`}
                className="inline-flex items-center gap-2"
              >
                View full history for this theme
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

function ResultField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mic2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
