import { Mic2, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative, initials, pluralize } from "@/lib/utils";
import type { SpeakerSummary } from "@/types/talks";

export function RecentSpeakersCard({
  speakers,
  loading,
}: {
  speakers: SpeakerSummary[];
  loading?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div className="space-y-0.5">
          <CardTitle className="text-base">Últimos oradores</CardTitle>
          <p className="text-xs text-muted-foreground">
            Quem subiu à plataforma mais recentemente.
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mic2 className="h-4 w-4" />
        </span>
      </CardHeader>
      <div className="px-4 pb-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : speakers.length === 0 ? (
          <EmptyState
            title="Sem oradores ainda"
            description="Cadastre um discurso para ver oradores aparecerem por aqui."
          />
        ) : (
          <ul className="space-y-1.5">
            {speakers.map((s) => (
              <li key={s.name}>
                <Link
                  to={`/buscar?orador=${encodeURIComponent(s.name)}`}
                  className="group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 transition-all hover:border-border hover:bg-secondary/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-blue-400/15 text-[11px] font-semibold text-primary">
                    {initials(s.name) || s.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {s.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {pluralize(s.total, "discurso")} ·{" "}
                      {formatRelative(s.last_talk.talk_date)}
                    </span>
                  </span>
                  <MoveRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
