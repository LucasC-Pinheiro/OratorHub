import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AuthLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary px-4 py-8",
        className,
      )}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
