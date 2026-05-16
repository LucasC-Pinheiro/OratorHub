import type { ReactNode } from "react";

interface LayoutRouteProps {
  children: ReactNode;
}

export function LayoutRoute({ children }: LayoutRouteProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
