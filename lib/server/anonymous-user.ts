import type { NextRequest, NextResponse } from "next/server";
import { isUuid } from "@/lib/server/http-security";

export const anonymousUserCookie = "care_hair_anonymous_id";

export function getAnonymousUserId(request: NextRequest): string | null {
  const value = request.cookies.get(anonymousUserCookie)?.value;
  return value && isUuid(value) ? value : null;
}

export function ensureAnonymousUserId(request: NextRequest) {
  return getAnonymousUserId(request) ?? crypto.randomUUID();
}

export function setAnonymousUserCookie(response: NextResponse, id: string) {
  response.cookies.set(anonymousUserCookie, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
}
