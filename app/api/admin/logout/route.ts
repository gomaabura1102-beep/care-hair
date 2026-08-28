import { NextRequest, NextResponse } from "next/server";
import { adminAccessCookie } from "@/lib/admin-session";
import { hasSameOrigin } from "@/lib/server/http-security";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "不正な送信元です。" }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(adminAccessCookie, "", { httpOnly: true, path: "/", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
