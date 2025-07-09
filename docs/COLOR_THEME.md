# Color Theme System - Quick Guide

## What Does It Do?

The color theme system lets you customize two main colors in the app:

- Primary Color: Used for the sidebar (#234A66 by default)
- Secondary Color: Used for the top bar (#C9A95C by default)

## How to Change Colors?

1. Go to Profile page
2. Find the "Custom Branding Setup" section
3. Use the color pickers to choose your colors
4. Click Save to apply changes

That's it! Colors will update immediately across the app.

createContext and useContext are React features that solve the problem of prop drilling and help share data across components without manually passing props through every level of the component tree. Let me break this down:

## For Developers: How to Use Colors

### 1. Import the Theme Hook

```typescript
import { useThemeContext } from "@/contexts/ThemeContext";
```

### 2. Use Colors in Components

```typescript
function YourComponent() {
  const { primaryColor, secondaryColor } = useThemeContext();

  return <div style={{ backgroundColor: primaryColor }}>Your content here</div>;
}
```

### Common Use Cases

1. **Sidebar Elements**

```typescript
<div style={{ backgroundColor: primaryColor }}>Sidebar content</div>
```

2. **Top Bar Elements**

```typescript
<div style={{ backgroundColor: secondaryColor }}>Top bar content</div>
```

3. **Cards with Theme Colors**

```typescript
<div
  style={{
    borderLeft: `4px solid ${primaryColor}`,
    backgroundColor: `${primaryColor}10`, // 10% opacity
  }}
>
  Card content
</div>
```

## Tips

- Colors are stored in Redux for global state management
- Redux-persist keeps colors saved after page refresh
- Use useSelector hook to access colors in any component
- Use dispatch to update colors
- Avoid hardcoding color values - always use Redux state
