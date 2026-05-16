import { cn } from "@/lib/utils";

export type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Loader({ size = "md", className }: LoaderProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-r-transparent",
        sizeClasses[size],
        className,
      )}
      aria-label="Loading"
      role="status"
    />
  );
}

export type SkeletonLoaderProps = {
  count?: number;
  className?: string;
};

export function SkeletonLoader({ count = 3, className }: SkeletonLoaderProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-12 w-full animate-pulse rounded-lg bg-secondary",
            className,
          )}
        />
      ))}
    </div>
  );
}
