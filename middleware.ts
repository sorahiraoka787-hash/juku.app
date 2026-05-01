import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token");

  const path = req.nextUrl.pathname;

  // 管理者・講師ページ保護
  if (
    (path.startsWith("/admin") ||
      path.startsWith("/teacher")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};