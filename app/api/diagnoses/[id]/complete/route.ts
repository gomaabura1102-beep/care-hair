import { NextRequest, NextResponse } from "next/server";
import { hasSameOrigin } from "@/lib/server/http-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  return errorResponse("診断結果は端末内で計算します。回答内容は送信・保存されません。", 410);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
