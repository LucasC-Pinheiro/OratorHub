import { MainLayout } from "@/layouts/main-layout";

export function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your account and preferences.
          </p>
        </div>
        <p className="text-muted-foreground">Settings coming soon...</p>
      </div>
    </MainLayout>
  );
}
