import { forwardRef, type HTMLAttributes } from "react";
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm flex gap-3",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground [&>svg]:text-foreground",
        destructive:
          "border-destructive bg-destructive/10 text-destructive [&>svg]:text-destructive",
        success:
          "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-200 dark:[&>svg]:text-green-400",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 dark:[&>svg]:text-yellow-400",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200 dark:[&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
  };

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => (
    <div ref={ref} className={cn(alertVariants({ variant, className }))} {...props}>
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-1">{children}</div>
    </div>
  ),
);

Alert.displayName = "Alert";

export const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("font-semibold", className)} {...props} />
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));

AlertDescription.displayName = "AlertDescription";

// Preset alert types
export function ErrorAlert({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Alert variant="destructive" icon={<AlertCircle className="h-5 w-5" />}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}

export function SuccessAlert({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Alert variant="success" icon={<CheckCircle className="h-5 w-5" />}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}

export function WarningAlert({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Alert variant="warning" icon={<AlertTriangle className="h-5 w-5" />}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}

export function InfoAlert({ children, title }: { children?: React.ReactNode; title?: string }) {
  return (
    <Alert variant="info" icon={<InfoIcon className="h-5 w-5" />}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}
