import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_THEME } from "@/lib/theme-utils";

// This is a mock implementation - replace with your actual backend logic
// You might fetch from a database, external API, or user preferences service

/**
 * GET /api/theme - Fetch user's theme preference
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ theme: DEFAULT_THEME });
}
