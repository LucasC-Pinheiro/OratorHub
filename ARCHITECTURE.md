# OratorHub

A premium internal platform for congregation elders to manage public talks and speakers. Built with modern technologies for a professional SaaS-like experience.

## 🎯 Overview

OratorHub is designed to become a professional web and mobile (PWA) application for managing congregation public talks. It features authentication, real-time data management, and a polished interface similar to Linear, Notion, and Stripe.

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite (fast development and production builds)
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI (headless component library)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v7 (modern routing with data loading)
- **Icons**: Lucide React (beautiful icon library)

## 📁 Project Structure

```
src/
├── App.tsx                          # Root component with routing setup
├── main.tsx                         # React DOM entry point
├── pages/                           # Page components
│   ├── dashboard.tsx                # Dashboard with statistics
│   ├── login.tsx                    # Authentication page
│   ├── talks.tsx                    # Talks management
│   ├── speakers.tsx                 # Speakers management
│   ├── settings.tsx                 # User settings
│   ├── not-found.tsx                # 404 page
│   └── index.ts                     # Barrel export
├── layouts/                         # Layout components
│   ├── auth-layout.tsx              # Auth pages layout
│   └── main-layout.tsx              # App pages layout
├── routes/                          # Routing configuration
│   ├── protected-route.tsx          # Authentication guard
│   ├── public-route.tsx             # Login page guard
│   ├── root-route.tsx               # Initial navigation
│   └── index.tsx                    # Route configuration
├── components/                      # React components
│   ├── ui/                          # Reusable UI components
│   │   ├── button.tsx               # Button with variants
│   │   ├── card.tsx                 # Card layout
│   │   ├── avatar.tsx               # User avatar
│   │   ├── alert.tsx                # Alert messages
│   │   ├── loader.tsx               # Loading indicators
│   │   ├── badge.tsx                # Badge component
│   │   ├── input.tsx                # Form input
│   │   ├── label.tsx                # Form label
│   │   ├── not-found.tsx            # 404 component
│   │   ├── search-input.tsx         # Search field
│   │   ├── layout.tsx               # Stack, Grid, Container
│   │   └── ...                      # Other UI components
│   ├── layout/                      # Application layout
│   │   ├── header.tsx               # Top navigation bar
│   │   ├── sidebar.tsx              # Left sidebar navigation
│   │   ├── mobile-sidebar.tsx       # Mobile menu
│   │   └── theme-toggle.tsx         # Dark/light mode
│   ├── dashboard/                   # Dashboard components
│   ├── talks/                       # Talks-related components
│   └── ...                          # Feature-specific components
├── context/                         # React Context for state
│   ├── auth-context.tsx             # Authentication state
│   └── theme-context.tsx            # Theme/dark mode state
├── hooks/                           # Custom React hooks
│   ├── use-auth.ts                  # Auth context hook
│   └── use-theme.ts                 # Theme context hook
├── services/                        # Business logic & API calls
│   ├── auth.service.ts              # Authentication
│   ├── talks.service.ts             # Talks CRUD operations
│   └── cache.service.ts             # Client-side caching
├── integrations/                    # Third-party integrations
│   └── supabase/
│       ├── client.ts                # Supabase client setup
│       └── types.ts                 # Database types
├── types/                           # TypeScript types
│   └── talks.ts                     # Talks-related types
├── lib/                             # Utilities
│   └── utils.ts                     # Helper functions (cn, formatting)
├── store/                           # State management (future)
├── hooks/                           # Custom hooks
└── index.css                        # Global styles & Tailwind

```

## 🎨 Design System

### Colors
- **Primary**: Blue (221° 83% 53%)
- **Secondary**: Light gray (220° 14% 96%)
- **Destructive**: Red (0° 84% 60%)
- **Muted**: Gray (220° 14% 96%)
- **Accent**: Light blue (221° 83% 96%)

### Components

#### UI Components
- **Button**: Multiple variants (default, secondary, outline, ghost, destructive, link)
- **Card**: Consistent card container with header/content/footer
- **Avatar**: User avatars with fallback initials
- **Alert**: Contextual alerts (info, success, warning, error)
- **Badge**: Status badges with multiple variants
- **Input**: Form inputs with search support
- **Dialog**: Modal dialogs for user actions

#### Layout Components
- **Stack**: Flexbox utility component (row/col, gap, alignment)
- **Grid**: CSS Grid utility component
- **Container**: Centered content wrapper

### Animations
- Fade-in/fade-out transitions
- Slide-in/slide-out for modals
- Smooth hover effects
- Loading spinner animations

## 🔐 Authentication

- **Provider**: Supabase Auth
- **Protected Routes**: Components automatically redirect unauthenticated users
- **Session Persistence**: Automatic session recovery on page reload
- **Auth Context**: Global authentication state management

## 📊 Data & Caching

### Talks Service
- `list()`: Get paginated talks with search
- `recent()`: Get latest talks
- `byId()`: Get single talk by ID
- `create()`: Add new talk
- `update()`: Update existing talk
- `remove()`: Delete talk
- `stats()`: Get dashboard statistics
- `searchTheme()`: Search talks by theme

### Caching Strategy
- **TTL-based Caching**: 5-minute default TTL for queries
- **Pattern Invalidation**: Automatic cache clearing on mutations
- **Memory-efficient**: Automatic cleanup of expired entries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project

### Installation

```bash
# Clone repository
git clone <repo-url>
cd OratorHub

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials
# VITE_SUPABASE_URL=<your_url>
# VITE_SUPABASE_ANON_KEY=<your_key>
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Type check
npm run check
```

## 📝 Code Style

### TypeScript Strictness
- Full strict mode enabled
- No implicit any types
- ESLint with type-aware rules
- Code formatting with Prettier

### Naming Conventions
- Components: PascalCase (e.g., `DashboardPage`, `MainLayout`)
- Functions: camelCase (e.g., `getTalks`, `formatDate`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_TTL`)
- Types: PascalCase (e.g., `Talk`, `DashboardStats`)

### File Organization
- One component per file (except small utilities)
- Index files for barrel exports
- Feature-based folder structure
- Shared components in ui/ folder

## 🔄 State Management

### Currently Using
- **React Context**: For global auth and theme state
- **Local State**: useState for component-level state
- **Service Layer**: For API interactions and caching

### Future Considerations
- Redux/Zustand for complex global state
- TanStack Query for advanced caching

## 📱 Responsive Design

- **Mobile-first approach**: All styles target mobile by default
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1400px

- **Components**:
  - Sidebar: Hidden on mobile, toggle menu
  - Header: Responsive logo/title
  - Layout: Single column on mobile, multi-column on desktop

## 🌙 Dark Mode

- Automatic detection of system preference
- Manual toggle in header
- Persistent storage in localStorage
- CSS variables for theming

## 🧪 Type Safety

All code is written in TypeScript with:
- Strict null checks
- No implicit any
- Proper generic typing
- Type-safe Supabase queries

## 📦 Dependencies

### Production
- `react`: UI framework
- `react-dom`: DOM rendering
- `react-router-dom`: Routing
- `@supabase/supabase-js`: Backend
- `tailwindcss`: Styling
- `@radix-ui/*`: UI primitives
- `lucide-react`: Icons
- `sonner`: Toast notifications
- `class-variance-authority`: Component variants
- `tailwind-merge`: Utility merging
- `clsx`: Class merging

### Development
- `typescript`: Type checking
- `vite`: Build tool
- `eslint`: Linting
- `tailwindcss-animate`: Animations

## 🎯 Future Features

- [ ] Talk creation/editing forms
- [ ] Speaker management
- [ ] Advanced filtering and search
- [ ] Real-time notifications
- [ ] Export functionality (PDF, CSV)
- [ ] Team collaboration
- [ ] Mobile app (React Native or PWA)
- [ ] Analytics dashboard
- [ ] Integration with calendar systems
- [ ] Multi-language support

## 📄 License

Private project for congregation use.

## 💡 Contributing

For internal development:
1. Create feature branches from `master`
2. Write type-safe code
3. Follow the code style guidelines
4. Make meaningful commits
5. Submit PRs with descriptions

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated**: May 16, 2026
**Version**: 0.1.0 (Beta)
