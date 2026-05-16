# OratorHub

> A premium internal platform for congregation elders to manage public talks and speakers. Built with modern technologies for a professional SaaS-like experience.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-private-red)

## 🎯 What is OratorHub?

OratorHub is a professional web application designed to help congregation elders efficiently manage and track public talks. It provides a clean, intuitive interface for:

- 📊 **Dashboard**: Quick overview of all talks, speakers, and themes
- 🎤 **Talk Management**: Create, edit, and organize public talks
- 👥 **Speaker Management**: Track speakers and their contributions
- 🔍 **Advanced Search**: Find talks by theme, speaker, or congregation
- 🌙 **Dark Mode**: Comfortable viewing in any lighting condition
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔐 **Secure**: Protected routes and authentication with Supabase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd OratorHub

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Database setup

OratorHub expects a single `talks` table in your Supabase project:

```sql
create table public.talks (
  id           uuid primary key default gen_random_uuid(),
  speaker_name text        not null,
  congregation text        not null,
  theme        text        not null,
  talk_date    date        not null,
  created_at   timestamptz not null default now()
);

alter table public.talks enable row level security;

create policy "Authenticated users can read talks"
  on public.talks for select to authenticated using (true);

create policy "Authenticated users can insert talks"
  on public.talks for insert to authenticated with check (true);
```

Create at least one user from the Supabase Auth dashboard to sign in.

## 🛠️ Tech Stack

| Category       | Technology                         |
| -------------- | ---------------------------------- |
| **Framework**  | React 19 + TypeScript              |
| **Build Tool** | Vite                               |
| **Styling**    | TailwindCSS + Custom Design System |
| **UI Library** | Radix UI + shadcn/ui patterns      |
| **Backend**    | Supabase (PostgreSQL + Auth)       |
| **Routing**    | React Router v7 (HashRouter)       |
| **Toasts**     | Sonner                             |
| **Icons**      | Lucide React                       |
| **Linting**    | ESLint + TypeScript                |

## 📁 Project Structure

```
src/
├── App.tsx               # HashRouter + provider composition
├── main.tsx              # React entry
├── components/
│   ├── ui/               # Primitives (button, card, dialog, table, …)
│   ├── layout/           # Sidebar, header, mobile sidebar, logo, theme toggle
│   ├── dashboard/        # Dashboard-specific cards
│   ├── talks/            # Register dialog, talks table
│   └── protected-route   # Auth guards (ProtectedRoute, GuestRoute)
├── context/              # AuthProvider, ThemeProvider
├── hooks/                # useAuth, useTheme
├── integrations/
│   └── supabase/         # Typed client + Database types
├── layouts/              # DashboardLayout
├── lib/                  # Utility helpers (cn, dates, initials)
├── pages/                # Login, Dashboard, Search, History, NotFound
├── services/             # auth.service, talks.service
└── types/                # Domain types
```

## 🎨 Design System

### Modern & Premium

- Minimal, clean interface
- Subtle animations and transitions
- Consistent spacing and typography
- Professional color palette
- Dark mode support

### Responsive

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar navigation on desktop
- Hamburger menu on mobile

### Accessible

- WCAG 2.1 compliant
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML

## 🔄 Available Scripts

```bash
# Development
npm run dev            # Start dev server with hot reload

# Production
npm run build          # Type-check and build for production
npm run preview        # Preview production build

# Quality
npm run lint           # Run ESLint
```

## 🔐 Authentication

- **Provider**: Supabase Auth
- **Sessions**: Automatic persistence
- **Protected Routes**: Components guard against unauthorized access
- **State Management**: Global auth context

## 📊 Features

### Current

- ✅ Email/password authentication via Supabase with persistent sessions
- ✅ Protected routes + guest-only login route
- ✅ Dashboard with stat cards, quick search and recent talks
- ✅ Theme search showing last speaker, congregation, date and total uses
- ✅ Full talk history with debounced search, congregation filters, pagination
- ✅ Register-talk dialog accessible from any page
- ✅ Dark mode with persistent preference
- ✅ Responsive layout with desktop sidebar + mobile slide-out menu
- ✅ HashRouter — refreshes and direct links work on Vercel without rewrites

## 💻 Development

### Creating a New Page

Add a new `*.tsx` file under `src/pages/`, then register it inside
`src/App.tsx` as a nested route inside the `DashboardLayout`:

```tsx
// src/pages/my-page.tsx
export function MyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">My page</h1>
    </div>
  );
}
```

```tsx
// src/App.tsx (inside <DashboardLayout/>)
<Route path="/my-page" element={<MyPage />} />
```

Layout, sidebar, header, theme toggle and the register-talk dialog are
provided automatically.

### Type Safety

The entire project uses TypeScript with strict mode enabled. `npm run
build` runs `tsc -b` ahead of the Vite bundle, so a failing type-check
fails the build.

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### Supabase Connection Issues

- Verify credentials in `.env`
- Check Supabase project is active
- Ensure CORS is properly configured

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📈 Performance

- **Code Splitting**: Lazy-loaded pages
- **Bundling**: Optimized with Vite
- **Minification**: Automatic in production

## ☁️ Deployment (Vercel)

The repo ships with a `vercel.json` that builds with `npm run build`,
outputs to `dist`, and rewrites all paths to `index.html` for SPA
support. OratorHub uses `HashRouter`, so refreshes and direct URL
access work without server rewrites — a useful safety net if you
deploy somewhere else later.

## 🤝 Contributing

For internal development:

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Commit with meaningful messages: `git commit -m "feat: add feature"`
4. Push to your branch: `git push origin feat/my-feature`

## 📝 Code Standards

- TypeScript strict mode
- Prettier formatting (configured)
- ESLint rules enforced
- Component-based architecture
- Service layer for business logic

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

## 📋 License

Private project for congregation use.

## 👥 Team

Development team: Lucas C. Pinheiro and contributors

---

<div align="center">

Made with care for congregation elders

</div>
