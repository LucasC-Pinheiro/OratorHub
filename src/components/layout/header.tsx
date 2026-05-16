import { LogOut, PlusCircle, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { useAuth } from "@/hooks/use-auth";
import { initials } from "@/lib/utils";

export function Header({ onNewTalk }: { onNewTalk: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const email = user?.email ?? "";
  const name = (user?.user_metadata?.full_name as string | undefined) ?? email;

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Sessão encerrada");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Não foi possível sair", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          onNewTalk={onNewTalk}
        />
        <div className="md:hidden">
          <Logo compact />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onNewTalk}
          size="sm"
          className="hidden md:inline-flex"
        >
          <PlusCircle className="h-4 w-4" />
          Novo discurso
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-0.5 pr-2 text-left transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Abrir menu do perfil"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-500 text-xs font-semibold text-primary-foreground">
                {initials(name) || <UserIcon className="h-4 w-4" />}
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="max-w-[150px] truncate text-xs font-medium text-foreground">
                  {name || "Conta"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Acesso de ancião
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {name || "Logado"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
