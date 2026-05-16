import { Link } from "react-router-dom";
import {
  History,
  PlusCircle,
  Search as SearchIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  description: string;
  to?: string;
  onClick?: () => void;
  icon: LucideIcon;
  tone: "primary" | "purple" | "emerald" | "amber";
};

const toneStyles: Record<Action["tone"], string> = {
  primary: "from-primary/15 to-blue-400/10 text-primary",
  purple:
    "from-violet-500/15 to-fuchsia-500/10 text-violet-600 dark:text-violet-300",
  emerald:
    "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
  amber:
    "from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-300",
};

export function QuickActions({ onNewTalk }: { onNewTalk: () => void }) {
  const actions: Action[] = [
    {
      label: "Registrar discurso",
      description: "Cadastre um novo orador em segundos.",
      onClick: onNewTalk,
      icon: PlusCircle,
      tone: "primary",
    },
    {
      label: "Buscar tema",
      description: "Veja quem deu, quando e quantas vezes.",
      to: "/buscar",
      icon: SearchIcon,
      tone: "purple",
    },
    {
      label: "Histórico completo",
      description: "Filtre por tema, orador ou data.",
      to: "/historico",
      icon: History,
      tone: "emerald",
    },
    {
      label: "Insights",
      description: "Temas mais e menos usados, sugestões.",
      to: "/historico?ordenar=tema",
      icon: Sparkles,
      tone: "amber",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        const content = (
          <div className="group relative flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br",
                toneStyles[action.tone],
              )}
            >
              <action.icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </div>
        );

        if (action.to) {
          return (
            <Link to={action.to} key={action.label} className="block">
              {content}
            </Link>
          );
        }
        return (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="block text-left"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
