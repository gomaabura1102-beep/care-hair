import { NextRequest, NextResponse } from "next/server";
import { adminAccessCookie } from "@/lib/admin-session";
import { authenticateAdmin } from "@/lib/server/admin-auth";
import { hasSameOrigin } from "@/lib/server/http-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password || body.password.length > 256) {
      return errorResponse("メールアドレスとパスワードを入力してください。", 400);
    }

    const session = await authenticateAdmin(email, body.password);
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(adminAccessCookie, session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.min(session.expires_in, 60 * 60)
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return errorResponse("ログイン情報または管理者権限を確認できませんでした。", 401);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
