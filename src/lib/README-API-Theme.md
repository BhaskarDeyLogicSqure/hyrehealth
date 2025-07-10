# API-Based Theme System

This document explains how to use the API-based theme system instead of cookies for theme management.

## Overview

The theme system now fetches and updates theme preferences via API calls to your backend, allowing for:

- User-specific theme preferences stored in your database
- Server-side theme synchronization
- Integration with existing authentication systems
- Centralized theme management across multiple applications

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Theme API Configuration
NEXT_PUBLIC_THEME_API_URL="/api/theme"
API_BASE_URL="http://localhost:3000"

# If using external backend API
# NEXT_PUBLIC_THEME_API_URL="https://your-backend-api.com/api/theme"
# API_BASE_URL="https://your-backend-api.com"

# Authentication (if needed)
# JWT_SECRET="your-jwt-secret"
# USER_SERVICE_URL="https://your-user-service.com"
```

## API Endpoints

### GET /api/theme

Fetches the current user's theme preference.

**Request:**

```http
GET /api/theme
Authorization: Bearer <token> (if using JWT)
Cookie: session=<session-id> (if using sessions)
```

**Response:**

```json
{
  "theme": "modern"
}
```

### POST /api/theme

Updates the user's theme preference.

**Request:**

```http
POST /api/theme
Content-Type: application/json
Authorization: Bearer <token> (if using JWT)

{
  "theme": "classic"
}
```

**Response:**

```json
{
  "success": true,
  "theme": "classic",
  "message": "Theme updated successfully"
}
```

## Backend Integration

### Option 1: Next.js API Routes (Included)

The included `src/app/api/theme/route.ts` provides a basic implementation. Customize the helper functions:

```typescript
// Implement based on your auth system
function getUserId(request: NextRequest): string | null {
  // JWT example:
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  }
  return null;
}

// Implement based on your database
async function fetchUserThemeFromDatabase(userId: string): Promise<ThemeName> {
  const user = await db.user.findUnique({ where: { id: userId } });
  return user?.theme || DEFAULT_THEME;
}

async function saveUserThemeToDatabase(
  userId: string,
  theme: ThemeName
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { theme },
  });
}
```

### Option 2: External Backend API

If you have an existing backend, update the environment variables:

```env
NEXT_PUBLIC_THEME_API_URL="https://your-api.com/api/user/theme"
API_BASE_URL="https://your-api.com"
```

Your backend should implement:

- `GET /api/user/theme` - Returns user's theme
- `POST /api/user/theme` - Updates user's theme

## Database Schema

Add a theme field to your user table:

```sql
-- For PostgreSQL/MySQL
ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'classic';

-- For Prisma schema
model User {
  id    String @id @default(cuid())
  theme String @default("classic")
  // ... other fields
}
```

## Authentication Integration

### JWT Token Example

```typescript
// In your API route
import jwt from "jsonwebtoken";

function getUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
  return null;
}
```

### Session Cookie Example

```typescript
function getUserId(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get("session");
  if (sessionCookie) {
    // Implement your session validation logic
    return getSessionUserId(sessionCookie.value);
  }
  return null;
}
```

## Usage in Components

The theme system automatically handles API calls:

```typescript
import { useTheme } from "@/contexts/ThemeProvider";

function MyComponent() {
  const { theme, setTheme, isLoading } = useTheme();

  const handleThemeChange = async () => {
    await setTheme("modern"); // Automatically calls API
  };

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={handleThemeChange}>Change Theme</button>
    </div>
  );
}
```

## Error Handling

The system gracefully handles API failures:

1. **Server-side failures**: Falls back to default theme
2. **Client-side failures**: Shows warnings in console, maintains current theme
3. **Network issues**: Uses optimistic updates with error recovery

## Performance Considerations

- **Caching**: Consider implementing API response caching
- **Optimistic Updates**: Theme changes are applied immediately before API calls
- **Fallbacks**: Always has a default theme available
- **SSR**: Server-side rendering with theme data from API

## Migration from Cookie-Based System

1. Update your backend to store theme preferences
2. Replace cookie-based logic with API calls
3. Update environment variables
4. Test theme persistence across sessions

The system maintains backward compatibility with the existing ThemeContext interface.
