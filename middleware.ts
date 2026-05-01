import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const token =
//     req.cookies.get("sb-access-token") ||
//     req.cookies.get("supabase-auth-token");

//   const path = req.nextUrl.pathname;

//   if (
//     (path.startsWith("/admin") ||
//       path.startsWith("/teacher")) &&
//     !token
//   ) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }