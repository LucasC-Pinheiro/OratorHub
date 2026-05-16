import { MainLayout } from "@/layouts/main-layout";

export function SpeakersPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Speakers</h1>
          <p className="text-muted-foreground mt-2">
            Manage speakers in your congregation.
          </p>
        </div>
        <p className="text-muted-foreground">Speaker management coming soon...</p>
      </div>
    </MainLayout>
  );
}
