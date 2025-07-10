# Hyre Health Customer - Dynamic Theming System

A Next.js 14 project with dynamic theming support using App Router architecture. This project demonstrates how to implement scalable, cookie-based theming for public pages while maintaining minimal theming for private pages.

## 🎨 Theme Architecture

### Available Themes

- **Default** 🏢 - Traditional healthcare styling
- **Modern** 🚀 - Contemporary, tech-forward design
- **Classic** 🏛️ - Elegant, professional appearance
- **Ancient** 🏺 - Mystical, wisdom-focused design

### Theme Structure

```
/themes/
├── default/
│   ├── home.tsx
│   └── about.tsx
├── modern/
│   ├── home.tsx
│   └── about.tsx
├── classic/
│   ├── home.tsx
│   └── about.tsx
└── ancient/
    ├── home.tsx
    └── about.tsx
```

## 🚀 Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the themed application.

## 🛠️ How It Works

### 1. Server-Side Theme Detection

The theme is determined server-side by reading the `theme` cookie in `layout.tsx`:

```typescript
// src/app/layout.tsx
import { getThemeFromCookies } from "@/lib/theme-utils";

export default function RootLayout({ children }) {
  const initialTheme = getThemeFromCookies();

  return (
    <html lang="en" data-theme={initialTheme}>
      {/* ... */}
    </html>
  );
}
```

### 2. Dynamic Component Loading

Public pages use dynamic imports to load the correct themed component:

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";
import { getThemeFromCookies } from "@/lib/theme-utils";

const DefaultHomePage = dynamic(() => import("@/../../themes/default/home"));
const ModernHomePage = dynamic(() => import("@/../../themes/modern/home"));

const HomePage = () => {
  const theme = getThemeFromCookies();
  const ThemeComponents = {
    default: DefaultHomePage,
    modern: ModernHomePage,
    // ...
  };

  const SelectedComponent = ThemeComponents[theme] || DefaultHomePage;
  return <SelectedComponent />;
};
```

### 3. CSS Variables System

Themes are implemented using CSS variables that change based on the `[data-theme]` attribute:

```css
/* src/styles/themes.css */
:root,
[data-theme="default"] {
  --color-primary: #234a66;
  --color-secondary: #c9a95c;
  /* ... */
}

[data-theme="modern"] {
  --color-primary: #6366f1;
  --color-secondary: #f59e0b;
  /* ... */
}
```

### 4. Theme Context for Client Components

The `ThemeProvider` makes theme information available to all client components:

```typescript
"use client";
import { useTheme } from "@/contexts/ThemeProvider";

function MyComponent() {
  const { theme, setTheme } = useTheme();
  // ...
}
```

## 📁 File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme detection
│   ├── page.tsx            # Home page with dynamic imports
│   └── about/
│       └── page.tsx        # About page with dynamic imports
├── components/
│   ├── Navigation.tsx      # Theme-aware navigation
├── contexts/
│   ├── ThemeContext.tsx    # Legacy theme context
│   └── ThemeProvider.tsx   # New cookie-based theme provider
├── lib/
│   ├── utils.ts           # Tailwind utilities
│   └── theme-utils.ts     # Theme management utilities
└── styles/
    └── themes.css         # CSS variables for all themes

themes/
├── default/
├── modern/
├── classic/
└── ancient/
```

## 🔧 Adding New Themes

### Step 1: Add Theme Type

```typescript
// src/lib/theme-utils.ts
export type ThemeName =
  | "default"
  | "modern"
  | "classic"
  | "ancient"
  | "newtheme";

export const AVAILABLE_THEMES: ThemeName[] = [
  "default",
  "modern",
  "classic",
  "ancient",
  "newtheme",
];
```

### Step 2: Add CSS Variables

```css
/* src/styles/themes.css */
[data-theme="newtheme"] {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... all required variables */
}
```

### Step 3: Create Theme Components

```
themes/newtheme/
├── home.tsx
├── about.tsx
└── [other-pages].tsx
```

### Step 4: Update Dynamic Imports

```typescript
// src/app/page.tsx
const NewThemeHomePage = dynamic(() => import("@/../../themes/newtheme/home"));

const ThemeComponents = {
  // ... existing themes
  newtheme: NewThemeHomePage,
};
```

## 🎨 Using Theme Variables

### In Components

Use the provided CSS utility classes:

```jsx
<div className="theme-bg theme-text-primary">
  <h1 className="theme-text-primary">Themed Heading</h1>
  <p className="theme-text-muted">Themed text</p>
  <button className="theme-bg-primary">Themed Button</button>
</div>
```

### Available Utility Classes

- `theme-bg` - Background color
- `theme-bg-primary` - Primary background
- `theme-bg-secondary` - Secondary background
- `theme-bg-muted` - Muted background
- `theme-text-primary` - Primary text color
- `theme-text-secondary` - Secondary text color
- `theme-text-muted` - Muted text color
- `theme-border` - Border color

### Custom CSS Variables

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-border);
}
```

## 🔄 Theme Switching

### Programmatically

```typescript
import { useTheme } from "@/contexts/ThemeProvider";

function MyComponent() {
  const { setTheme } = useTheme();

  const handleThemeChange = () => {
    setTheme("modern");
  };
}
```

### Via Cookie (Server-Side)

```typescript
import { setThemeCookie } from "@/lib/theme-utils";

// Set theme cookie
setThemeCookie("modern");
```

## 🏗️ Private Pages Theming

Private pages (like `/dashboard`) use minimal theming through CSS variables only:

```jsx
// Private page component
function Dashboard() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Dashboard content */}
    </div>
  );
}
```

## 📱 Demo Features

- **Theme Switcher**: Fixed position theme switcher for testing
- **Navigation**: Theme-aware navigation between pages
- **Persistent Themes**: Themes persist across page refreshes via cookies
- **SSR Support**: Server-side theme detection for initial render

## 🧪 Testing Themes

1. Use the theme switcher in the top-right corner
2. Navigate between Home and About pages
3. Refresh the page to see theme persistence
4. Inspect CSS variables in dev tools

## 🚀 Production Considerations

- **Performance**: Dynamic imports ensure only the current theme's components are loaded
- **SEO**: Server-side theme detection prevents hydration mismatches
- **Scalability**: Easy to add new themes without modifying existing code
- **Accessibility**: Theme switching maintains accessibility standards
- **Caching**: Theme-specific components can be cached independently

## 📝 Technical Notes

- Uses Next.js 14 App Router
- Server-side cookie reading for initial theme
- Client-side theme switching with immediate updates
- CSS variables for flexible theming
- TypeScript for type safety
- Tailwind CSS for utility classes

This architecture provides a robust, scalable solution for multi-theme applications while maintaining excellent performance and developer experience.
