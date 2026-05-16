import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
  { label: "Talks", icon: <Mic className="h-5 w-5" />, href: "/talks" },
  { label: "Speakers", icon: <Users className="h-5 w-5" />, href: "/speakers" },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "hidden lg:flex w-64 flex-col border-r border-border bg-background",
        "sticky top-0 h-screen",
      )}
    >
      {/* Logo */}
      <div className="border-b border-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground">OratorHub</h1>
            <p className="text-xs text-muted-foreground">Congregation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-4">
        <p className="text-xs text-muted-foreground px-3">
          v0.1.0 • Beta
        </p>
      </div>
    </aside>
  );
}
