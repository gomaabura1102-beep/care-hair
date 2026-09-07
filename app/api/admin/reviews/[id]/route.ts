import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { moderateProductReview } from "@/lib/server/admin-data";
import { hasSameOrigin, isUuid } from "@/lib/server/http-security";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "不正な送信元です。" }, { status: 403 });
  if (!isUuid(params.id)) return NextResponse.json({ error: "口コミIDが正しくありません。" }, { status: 400 });
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "管理者としてログインしてください。" }, { status: 403 });
  try {
    const body = await request.json() as { status?: unknown };
    if (body.status !== "published" && body.status !== "rejected") return NextResponse.json({ error: "公開状態が正しくありません。" }, { status: 400 });
    await moderateProductReview(params.id, body.status, admin);
    return NextResponse.json({ updated: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "口コミの状態を変更できませんでした。" }, { status: 500 });
  }
}
