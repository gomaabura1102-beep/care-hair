import { NextRequest, NextResponse } from "next/server";

const legacyProductionHost = "care-hair.vercel.app";
const currentProductionHost = "care-hair-five.vercel.app";

export function middleware(request: NextRequest) {
  const requestHost = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (requestHost === legacyProductionHost) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    redirectUrl.host = currentProductionHost;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
