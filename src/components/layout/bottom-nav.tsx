import { NavLink, useLocation } from "react-router-dom";
import {
  History,
  LayoutDashboard,
  PlusCircle,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const items: Item[] = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/buscar", label: "Buscar", icon: Search },
  { to: "/historico", label: "Histórico", icon: History },
];

export function BottomNav({ onNewTalk }: { onNewTalk: () => void }) {
  const location = useLocation();
  const center = Math.floor(items.length / 2);

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.06)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-end justify-around">
        {items.slice(0, center).map((item) => (
          <NavItem key={item.to} item={item} active={location.pathname.startsWith(item.to)} />
        ))}
        <li className="-mt-6 px-1">
          <button
            type="button"
            onClick={onNewTalk}
            aria-label="Registrar discurso"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-500 text-primary-foreground shadow-floating ring-4 ring-background transition-transform active:scale-95"
          >
            <PlusCircle className="h-6 w-6" strokeWidth={2.2} />
          </button>
        </li>
        {items.slice(center).map((item) => (
          <NavItem key={item.to} item={item} active={location.pathname.startsWith(item.to)} />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ item, active }: { item: Item; active: boolean }) {
  return (
    <li className="flex-1">
      <NavLink
        to={item.to}
        className={cn(
          "group mx-auto flex max-w-[5rem] flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
            active ? "bg-primary/10" : "group-hover:bg-secondary/70",
          )}
        >
          <item.icon className="h-[18px] w-[18px]" />
        </span>
        {item.label}
      </NavLink>
    </li>
  );
}
