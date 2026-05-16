import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-aurora px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-5 rounded-2xl border border-border bg-card/90 p-8 text-center shadow-floating backdrop-blur">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            404 — Not found
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            We can't find that page
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you're looking for may have been moved or no longer exists.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
