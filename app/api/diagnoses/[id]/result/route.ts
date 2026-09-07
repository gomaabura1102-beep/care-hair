import { NextRequest, NextResponse } from "next/server";
import { getAnonymousUserId } from "@/lib/server/anonymous-user";
import { isUuid } from "@/lib/server/http-security";
import { serviceJson, SupabaseConfigurationError } from "@/lib/server/supabase-rest";
import type { DiagnosisResult, PublicDiagnosis } from "@/types/diagnosis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isUuid(params.id)) return errorResponse("診断IDが正しくありません。", 400);
  const anonymousUserId = getAnonymousUserId(request);
  if (!anonymousUserId) return errorResponse("診断を行った端末から確認してください。", 403);

  try {
    const query = new URLSearchParams({
      select: "id,result_snapshot,diagnosis_logic_version,created_at,diagnosis_images(id)",
      id: `eq.${params.id}`,
      anonymous_user_id: `eq.${anonymousUserId}`,
      data_status: "eq.completed",
      limit: "1"
    });
    const rows = await serviceJson<
      Array<{
        id: string;
        result_snapshot: DiagnosisResult;
        diagnosis_logic_version: string;
        created_at: string;
        diagnosis_images: Array<{ id: string }>;
      }>
    >(`/rest/v1/diagnoses?${query}`);
    if (!rows[0]) return errorResponse("診断結果が見つかりません。", 404);

    const payload: PublicDiagnosis = {
      diagnosisId: rows[0].id,
      result: rows[0].result_snapshot,
      diagnosisLogicVersion: rows[0].diagnosis_logic_version,
      createdAt: rows[0].created_at,
      mode: rows[0].diagnosis_images.length > 0 ? "photo" : "questions"
    };
    return NextResponse.json(payload, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return errorResponse("Supabaseの設定が必要です。", 503);
    return errorResponse("診断結果を読み込めませんでした。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
