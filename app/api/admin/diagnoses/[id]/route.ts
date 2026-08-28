import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { deleteDiagnosisAsAdmin } from "@/lib/server/admin-data";
import { hasSameOrigin, isUuid } from "@/lib/server/http-security";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  if (!isUuid(params.id)) return errorResponse("診断IDが正しくありません。", 400);
  const admin = await getAdminFromRequest(request);
  if (!admin) return errorResponse("管理者としてログインしてください。", 403);

  try {
    const deleted = await deleteDiagnosisAsAdmin(params.id, admin);
    if (!deleted) return errorResponse("診断データが見つかりません。", 404);
    return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("診断データを削除できませんでした。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
