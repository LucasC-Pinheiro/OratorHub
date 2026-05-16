import { Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-500 shadow-soft">
        <Mic2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {compact ? null : (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            OratorHub
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Public Talks
          </span>
        </div>
      )}
    </div>
  );
}
