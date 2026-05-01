import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token =
    req.cookies.get("sb-access-token")?.value ||
    req.cookies.get("supabase-auth-token")?.value;

  // 未ログイン
  if (!token && (path.startsWith("/admin") || path.startsWith("/teacher"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};