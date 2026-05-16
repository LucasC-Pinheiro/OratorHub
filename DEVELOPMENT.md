# Development Guide

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run check      # Run TypeScript checker
npm run lint       # Run ESLint
```

## Creating New Pages

1. Create a new file in `src/pages/`:

```tsx
import { MainLayout } from "@/layouts/main-layout";

export function MyPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">My Page</h1>
      </div>
    </MainLayout>
  );
}
```

2. Add to routes in `src/App.tsx`:

```tsx
<Route
  path="/mypage"
  element={
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MyPage />
      </Suspense>
    </ProtectedRoute>
  }
/>
```

3. Add navigation item in `src/components/layout/sidebar.tsx`

## Creating New Components

### UI Components (Reusable)

```tsx
// src/components/ui/my-component.tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type MyComponentProps = HTMLAttributes<HTMLDivElement>;

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("my-styles", className)} {...props} />
  ),
);

MyComponent.displayName = "MyComponent";
```

### Feature Components (Specific to features)

```tsx
// src/components/talks/talk-card.tsx
import type { Talk } from "@/types/talks";

export function TalkCard({ talk }: { talk: Talk }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="font-semibold">{talk.theme}</h3>
      <p className="text-sm text-muted-foreground">{talk.speaker_name}</p>
    </div>
  );
}
```

## Using Styles

### Tailwind Classes

```tsx
<div className="flex items-center gap-4 p-6 rounded-lg border border-border bg-card shadow-soft">
  <span>Content</span>
</div>
```

### Custom Utilities

```tsx
import { cn } from "@/lib/utils";

// Merge classes intelligently
const buttonClass = cn("base-styles", isActive && "active-styles", customClass);
```

### Component Variants

```tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" size="lg">Click me</Button>
<Button variant="outline" size="sm">Small</Button>
```

## Working with Forms

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MyForm() {
  const [value, setValue] = useState("");

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input
          id="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Using Services

### Fetching Data

```tsx
import { useEffect, useState } from "react";
import { talksService } from "@/services/talks.service";
import type { Talk } from "@/types/talks";

export function MyComponent() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTalks() {
      try {
        const { data } = await talksService.list();
        setTalks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    loadTalks();
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorAlert title="Error">{error}</ErrorAlert>;

  return <>{/* render talks */}</>;
}
```

### Creating Data

```tsx
import { talksService } from "@/services/talks.service";

async function createTalk() {
  try {
    const newTalk = await talksService.create({
      speaker_name: "John Doe",
      theme: "Faith and Trust",
      congregation: "Main Hall",
      talk_date: "2026-06-01",
    });
    console.log("Created:", newTalk);
  } catch (err) {
    console.error("Error:", err);
  }
}
```

## Working with Authentication

### Accessing Auth State

```tsx
import { useAuth } from "@/hooks/use-auth";

export function MyComponent() {
  const { user, session, loading, signOut } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/routes/protected-route";

// Automatically redirects to /login if not authenticated
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>;
```

## Dark Mode Support

### Using Theme

```tsx
import { useTheme } from "@/hooks/use-theme";

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>Current: {theme} (click to toggle)</button>
  );
}
```

### Styling for Dark Mode

```tsx
<div className="bg-background text-foreground dark:bg-slate-950 dark:text-slate-50">
  {/* Automatically works in both modes */}
</div>
```

## Common Patterns

### Loading State

```tsx
import { Loader } from "@/components/ui/loader";

{
  loading && <Loader />;
}
{
  !loading && <Content />;
}
```

### Error Handling

```tsx
import { ErrorAlert } from "@/components/ui/alert";

{
  error && <ErrorAlert>{error}</ErrorAlert>;
}
```

### Empty State

```tsx
import { EmptyState } from "@/components/ui/empty-state";

{
  items.length === 0 && (
    <EmptyState
      icon={<SearchIcon />}
      title="No results"
      description="Try adjusting your search"
    />
  );
}
```

### Pagination

```tsx
const [page, setPage] = useState(0);
const limit = 20;

const { data, count } = await talksService.list({
  limit,
  offset: page * limit,
});

const totalPages = Math.ceil(count / limit);
```

## Type Safety Tips

### Always Type Props

```tsx
// ❌ Bad
export function MyComponent(props: any) {}

// ✅ Good
interface MyComponentProps {
  title: string;
  onClick: () => void;
}
export function MyComponent({ title, onClick }: MyComponentProps) {}
```

### Use Type Inference

```tsx
import type { Talk } from "@/types/talks";

// ✅ Type inferred from service
const { data } = await talksService.list();
// data is automatically Talk[]
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T extends { id: string }>({
  items,
  renderItem,
}: ListProps<T>) {
  return <div>{items.map((item) => renderItem(item))}</div>;
}
```

## Performance Tips

### Lazy Load Components

```tsx
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loader />}>
  <HeavyComponent />
</Suspense>;
```

### Memoize Components

```tsx
import { memo } from "react";

const MyComponent = memo(function MyComponent({ data }: Props) {
  return <div>{data}</div>;
});
```

### Use Cache Service

```tsx
// Automatically caches for 5 minutes
const { data } = await talksService.stats();
```

## Common Issues

### Import Path Errors

Use `@/` alias instead of relative paths:

```tsx
// ❌ Bad
import { Button } from "../../../components/ui/button";

// ✅ Good
import { Button } from "@/components/ui/button";
```

### Missing Types

Always export types in the same file:

```tsx
export type ButtonProps = HTMLAttributes<HTMLButtonElement>;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
```

### State Not Updating

Remember to create new references for objects:

```tsx
// ❌ Bad
items.push(newItem);
setItems(items);

// ✅ Good
setItems([...items, newItem]);
```

## Testing (Future)

TBD - Testing strategy to be implemented

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Keep commits atomic and meaningful
git commit -m "fix: issue description"
git commit -m "docs: update readme"

# Push and create PR
git push origin feat/my-feature
```

## Resources

- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Radix UI](https://www.radix-ui.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)

---

Happy coding! 🚀
