// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_THEME } from "@/lib/theme-utils";

const PROTECTED_ROUTES = ["/profile"];
const AUTH_ROUTES = ["/auth/login"];

export async function middleware(request: NextRequest) {
  try {
    console.log("🔥 Middleware running for:", request.nextUrl.pathname);

    const { pathname } = request.nextUrl;

    // 1️⃣ Handle Theme Routes - used to set the theme cookie if it's not set from any route user is coming from
    if (!PROTECTED_ROUTES?.some((route) => pathname?.startsWith(route))) {
      const themeCookie = request.cookies.get("theme");

      // If theme cookie is already set, allow the request to continue
      if (themeCookie) return NextResponse.next();

      // No cookie → fetch theme from backend
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL; // backend url

      // TODO: Uncomment this when we have a way to fetch the theme from the API server
      // const res = await axios.get(`${apiUrl}/theme`, {
      //   headers: {
      //     Cookie: request.headers.get("cookie") || "",
      //   },
      // });

      // const json = await res.data;
      // const theme = json?.userColourTheme || "default";

      const theme = DEFAULT_THEME;

      // Create response and set the cookie
      const response = NextResponse.next();
      response.cookies.set("theme", theme, {
        path: "/", // cookie available to all routes
      });

      return response;
    }

    // 2️⃣ Handle Protected Routes - can't access them if user is not authenticated
    if (PROTECTED_ROUTES?.some((route) => pathname?.startsWith(route))) {
      console.log("🔥 Protected route detected:", pathname);
      const token = request.cookies.get("token")?.value;
      console.log("🔥 Token:", token);

      if (!token) {
        // Redirect unauthenticated user to login
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      // Optional: Verify token (e.g., decode JWT or call auth API)
    }

    // 3️⃣ Handle Auth Routes - can't access them if user is already authenticated
    if (AUTH_ROUTES?.some((route) => pathname?.startsWith(route))) {
      console.log("🔥 Auth route detected:", pathname);
      const token = request.cookies.get("token")?.value;
      console.log("🔥 Token:", token);

      if (token) {
        // Redirect authenticated user to profile
        return NextResponse.redirect(new URL("/profile", request.url));
      }

      return NextResponse.next();
    }

    // 4️⃣ Default pass-through
    return NextResponse.next();
  } catch (error) {
    console.warn("Failed to fetch theme in middleware:", error);
    return NextResponse.next(); // fallback
  }
}

// Apply to all pages except static/assets/api
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
