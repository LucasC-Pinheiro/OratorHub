import { AuthLayout } from "@/layouts/auth-layout";

export function LoginPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">🎤</span>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to OratorHub</h1>
          <p className="text-muted-foreground">
            Sign in to manage your congregation's talks
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <p className="text-center text-muted-foreground">
            Login form coming soon...
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
