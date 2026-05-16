import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Stack = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "col";
    gap?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "start" | "center" | "end";
    justify?: "start" | "center" | "between" | "end";
  }
>(
  (
    {
      direction = "col",
      gap = "md",
      align = "start",
      justify = "start",
      className,
      ...props
    },
    ref,
  ) => {
    const gapMap = {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    const alignMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
    };

    const justifyMap = {
      start: "justify-start",
      center: "justify-center",
      between: "justify-between",
      end: "justify-end",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "row" ? "flex-row" : "flex-col",
          gapMap[gap],
          alignMap[align],
          justifyMap[justify],
          className,
        )}
        {...props}
      />
    );
  },
);

Stack.displayName = "Stack";

export const Grid = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    columns?: number;
  }
>(({ columns = 2, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid gap-4",
      `grid-cols-${columns}`,
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className,
    )}
    {...props}
  />
));

Grid.displayName = "Grid";

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  ),
);

Container.displayName = "Container";
