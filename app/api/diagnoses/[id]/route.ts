import { NextRequest, NextResponse } from "next/server";
import { getAnonymousUserId } from "@/lib/server/anonymous-user";
import { hasSameOrigin, isUuid } from "@/lib/server/http-security";
import { deletePrivateImages, serviceJson } from "@/lib/server/supabase-rest";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  if (!isUuid(params.id)) return errorResponse("診断IDが正しくありません。", 400);
  const anonymousUserId = getAnonymousUserId(request);
  if (!anonymousUserId) return errorResponse("診断を行った端末から操作してください。", 403);

  try {
    const query = new URLSearchParams({
      select: "id,diagnosis_images(storage_path)",
      id: `eq.${params.id}`,
      anonymous_user_id: `eq.${anonymousUserId}`,
      limit: "1"
    });
    const rows = await serviceJson<Array<{ id: string; diagnosis_images: Array<{ storage_path: string }> }>>(
      `/rest/v1/diagnoses?${query}`
    );
    if (!rows[0]) return errorResponse("診断データが見つかりません。", 404);

    const target = new URLSearchParams({ id: `eq.${params.id}`, anonymous_user_id: `eq.${anonymousUserId}` });
    await serviceJson(`/rest/v1/diagnoses?${target}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ data_status: "deletion_requested" })
    });
    await deletePrivateImages(rows[0].diagnosis_images.map((image) => image.storage_path));
    await serviceJson(`/rest/v1/diagnoses?${target}`, { method: "DELETE" });

    return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("削除処理を完了できませんでした。運営へ診断IDを添えてお問い合わせください。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
