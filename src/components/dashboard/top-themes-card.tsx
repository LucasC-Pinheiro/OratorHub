import { Flame, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative } from "@/lib/utils";
import type { TopThemeSummary } from "@/types/talks";

export function TopThemesCard({
  themes,
  loading,
}: {
  themes: TopThemeSummary[];
  loading?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-base">Temas mais usados</CardTitle>
          <p className="text-xs text-muted-foreground">
            Os assuntos mais recorrentes nos últimos discursos.
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Flame className="h-4 w-4" />
        </span>
      </CardHeader>
      <div className="px-4 pb-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : themes.length === 0 ? (
          <EmptyState
            title="Sem dados ainda"
            description="Cadastre alguns discursos para visualizar os temas mais usados."
          />
        ) : (
          <ol className="space-y-1.5">
            {themes.map((t, idx) => (
              <li key={t.theme}>
                <Link
                  to={`/buscar?q=${encodeURIComponent(t.theme)}`}
                  className="group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 transition-all hover:border-border hover:bg-secondary/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-muted-foreground group-hover:text-primary">
                    {idx + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {t.theme}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Último: {t.last_talk.speaker_name} ·{" "}
                      {formatRelative(t.last_talk.talk_date)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {t.total}×
                    </span>
                    <MoveRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}
