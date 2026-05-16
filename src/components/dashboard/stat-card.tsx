import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  loading?: boolean;
  trend?: "up" | "neutral";
  className?: string;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  loading,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-1 h-8 w-20" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {hint ? (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
