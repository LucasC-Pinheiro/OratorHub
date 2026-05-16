import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/hooks/use-auth";

type LocationState = { from?: { pathname?: string } } | null;

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email, password });
      const redirectTo =
        (location.state as LocationState)?.from?.pathname ?? "/dashboard";
      toast.success("Welcome back");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error("Could not sign in", {
        description:
          error instanceof Error ? error.message : "Check your credentials.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-aurora px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden flex-col gap-8 lg:flex">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground">
              The elegant way for congregations to manage public talks.
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Track speakers, themes and dates with confidence. Search history
              instantly, register new talks in seconds, and avoid scheduling
              the same theme twice.
            </p>
          </div>

          <ul className="grid gap-3">
            {[
              "Search talks by theme, speaker or congregation",
              "Know exactly when a theme was last given",
              "Keep a clean, shared history accessible anywhere",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-sm text-foreground"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md animate-fade-in">
          <div className="rounded-2xl border border-border bg-card/90 p-8 shadow-floating backdrop-blur">
            <div className="mb-7 flex flex-col items-center text-center lg:hidden">
              <Logo />
            </div>

            <div className="mb-6 space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to access your congregation's talk records.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="elder@congregation.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="mt-2"
              >
                Sign in
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Authorized elders only · Protected by Supabase Auth
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} OratorHub — built with care
          </p>
        </div>
      </div>
    </div>
  );
}
