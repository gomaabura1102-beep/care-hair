import { NextRequest, NextResponse } from "next/server";
import { adminAccessCookie } from "@/lib/admin-session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/mypage", request.url));
    }
    if (!request.cookies.has(adminAccessCookie)) {
      return NextResponse.redirect(new URL("/mypage", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
