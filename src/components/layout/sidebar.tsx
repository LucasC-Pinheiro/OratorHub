import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  type LucideIcon,
  Search,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search Themes", icon: Search },
  { to: "/history", label: "Talk History", icon: History },
];

export function Sidebar({
  onItemClick,
  onNewTalk,
}: {
  onItemClick?: () => void;
  onNewTalk?: () => void;
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => {
            onNewTalk?.();
            onItemClick?.();
          }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 active:scale-[0.98]",
          )}
        >
          <PlusCircle className="h-4 w-4" />
          Register talk
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        <p className="px-2 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-gradient-to-br from-secondary to-background p-3 shadow-soft">
          <p className="text-xs font-semibold text-foreground">
            Need a refresher?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Browse talk history to check when a theme was last given.
          </p>
        </div>
      </div>
    </aside>
  );
}
