import { MainLayout } from "@/layouts/main-layout";

export function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your congregation's talks.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Placeholder stats cards */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-sm font-medium text-muted-foreground">Total Talks</div>
            <div className="mt-2 text-3xl font-bold">—</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-sm font-medium text-muted-foreground">Unique Speakers</div>
            <div className="mt-2 text-3xl font-bold">—</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-sm font-medium text-muted-foreground">Unique Themes</div>
            <div className="mt-2 text-3xl font-bold">—</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <div className="text-sm font-medium text-muted-foreground">This Month</div>
            <div className="mt-2 text-3xl font-bold">—</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
