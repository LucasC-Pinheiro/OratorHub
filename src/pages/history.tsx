import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  History as HistoryIcon,
  PlusCircle,
  Search as SearchIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import { TalksTable } from "@/components/talks/talks-table";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "@/layouts/dashboard-layout";
import { talksService } from "@/services/talks.service";
import type { Talk } from "@/types/talks";

const PAGE_SIZE = 10;

export function HistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [congregations, setCongregations] = useState<Set<string>>(new Set());
  const { openRegister } = useOutletContext<DashboardOutletContext>();

  // Debounce input → query
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        setSearchParams({ q: query.trim() });
      } else {
        setSearchParams({});
      }
      setPage(0);
    }, 300);
    return () => clearTimeout(handle);
  }, [query, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const result = await talksService.list({
          search: debouncedQuery,
          limit: 500,
        });
        if (mounted) setTalks(result.data);
      } catch (error) {
        toast.error("Failed to load history", {
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
  }, [debouncedQuery]);

  const availableCongregations = useMemo(() => {
    const set = new Set<string>();
    talks.forEach((t) => set.add(t.congregation));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [talks]);

  const filtered = useMemo(() => {
    if (congregations.size === 0) return talks;
    return talks.filter((t) => congregations.has(t.congregation));
  }, [talks, congregations]);

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
    setPage(0);
  }

  function clearFilters() {
    setCongregations(new Set());
    setQuery("");
    setPage(0);
  }

  const hasFilters = Boolean(debouncedQuery) || congregations.size > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Talk history
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse every recorded talk. Search, filter and paginate through the
            full archive.
          </p>
        </div>
        <Button onClick={openRegister}>
          <PlusCircle className="h-4 w-4" />
          Register talk
        </Button>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search theme, speaker or congregation…"
              className="pl-9 pr-9"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" type="button">
                <Filter className="h-4 w-4" />
                Congregation
                {congregations.size > 0 ? (
                  <Badge className="ml-1">{congregations.size}</Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto scrollbar-thin">
              <DropdownMenuLabel>Filter by congregation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableCongregations.length === 0 ? (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  No congregations yet
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

          {hasFilters ? (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <TalksTable
            talks={pageData}
            loading={loading}
            emptyState={
              <EmptyState
                icon={HistoryIcon}
                title={
                  hasFilters
                    ? "No talks match those filters"
                    : "No talks recorded yet"
                }
                description={
                  hasFilters
                    ? "Try widening your search or clearing filters."
                    : "Get started by registering your first public talk."
                }
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                      Clear filters
                    </Button>
                  ) : (
                    <Button onClick={openRegister}>
                      <PlusCircle className="h-4 w-4" />
                      Register a talk
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
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            talks
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              Page {safePage + 1} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
