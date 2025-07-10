// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_THEME } from "@/lib/theme-utils";

export async function middleware(request: NextRequest) {
  console.log("🔥 Middleware running for:", request.nextUrl.pathname);

  const themeCookie = request.cookies.get("theme");

  // If theme cookie is already set, allow the request to continue
  if (themeCookie) return NextResponse.next();

  // No cookie → fetch theme from backend
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL; // backend url

  try {
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
  } catch (error) {
    console.warn("Failed to fetch theme in middleware:", error);
    return NextResponse.next(); // fallback
  }
}

// Apply to all pages except static/assets/api
export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
