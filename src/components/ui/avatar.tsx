import { forwardRef, type HTMLAttributes, useMemo } from "react";
import { cn } from "@/lib/utils";

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "secondary" | "muted";
};

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
  xl: "h-14 w-14 text-lg",
};

const variantClasses = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  muted: "bg-muted text-muted-foreground",
};

// Generate a consistent color based on initials
function getColorFromInitials(initials: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];
  const charCode = initials.charCodeAt(0);
  return colors[charCode % colors.length];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      initials,
      size = "md",
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const bgClass = useMemo(() => {
      if (src) return variantClasses[variant];
      if (initials) return getColorFromInitials(initials);
      return variantClasses.muted;
    }, [src, initials, variant]);

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold",
          sizeClasses[size],
          bgClass,
          className,
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials || "?"
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
