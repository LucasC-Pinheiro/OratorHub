import { MainLayout } from "@/layouts/main-layout";

export function TalksPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
          <p className="text-muted-foreground mt-2">
            Manage all public talks given in your congregation.
          </p>
        </div>
        <p className="text-muted-foreground">Talk management coming soon...</p>
      </div>
    </MainLayout>
  );
}
