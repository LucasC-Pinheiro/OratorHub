import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border border-secondary/20 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border border-border text-foreground hover:bg-secondary",
        success:
          "border border-green-200/50 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800/50 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900",
        warning:
          "border border-yellow-200/50 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800/50 dark:bg-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-900",
        info: "border border-blue-200/50 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";
