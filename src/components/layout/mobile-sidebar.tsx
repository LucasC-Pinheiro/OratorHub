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

export type MobileSidebarProps = {
  onClose: () => void;
};

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Mobile sidebar */}
      <div className="fixed left-0 top-16 z-40 w-64 border-r border-border bg-background shadow-lg animate-slide-in lg:hidden">
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
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
        </div>
      </div>
    </>
  );
}
