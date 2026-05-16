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

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project structure and technical overview
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development patterns and best practices

## 🛠️ Tech Stack

| Category       | Technology                         |
| -------------- | ---------------------------------- |
| **Framework**  | React 19 + TypeScript              |
| **Build Tool** | Vite                               |
| **Styling**    | TailwindCSS + Custom Design System |
| **UI Library** | Radix UI                           |
| **Backend**    | Supabase (PostgreSQL + Auth)       |
| **Routing**    | React Router v7                    |
| **Icons**      | Lucide React                       |
| **Linting**    | ESLint + TypeScript                |

## 📁 Project Structure

```
src/
├── pages/           # Page components
├── layouts/         # Layout components
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── services/       # Business logic & APIs
├── context/        # React Context
├── types/          # TypeScript definitions
└── lib/            # Utilities
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

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
npm run build          # Build for production
npm run preview        # Preview production build

# Quality
npm run check          # Run TypeScript type checker
npm run lint           # Run ESLint

# Other
npm run dev:vite      # Direct Vite dev server
```

## 🔐 Authentication

- **Provider**: Supabase Auth
- **Sessions**: Automatic persistence
- **Protected Routes**: Components guard against unauthorized access
- **State Management**: Global auth context

## 📊 Features

### Current (MVP)

- ✅ User authentication
- ✅ Dashboard with statistics
- ✅ Page routing and navigation
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Client-side caching
- ✅ Talks service with CRUD operations

### Planned

- 📝 Talk creation/editing forms
- 👥 Speaker management interface
- 🔍 Advanced filtering
- 📊 Analytics dashboard
- 🔔 Real-time notifications
- 📱 PWA mobile app
- 🌍 Multi-language support
- 📤 Export to PDF/CSV

## 💻 Development

### Creating a New Page

```tsx
import { MainLayout } from "@/layouts/main-layout";

export function MyPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">My Page</h1>
      </div>
    </MainLayout>
  );
}
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for more patterns and examples.

### Type Safety

The entire project uses TypeScript with strict mode enabled:

```bash
npm run check        # Verify all types
```

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
- **Caching**: 5-minute TTL for API responses
- **Bundling**: Optimized with Vite
- **Minification**: Automatic in production

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

**[📖 Architecture Guide](./ARCHITECTURE.md)** • **[🛠️ Development Guide](./DEVELOPMENT.md)**

Made with ❤️ for congregation elders

</div>
