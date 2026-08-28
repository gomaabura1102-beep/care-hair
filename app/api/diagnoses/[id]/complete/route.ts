import { NextRequest, NextResponse } from "next/server";
import { DIAGNOSIS_LOGIC_VERSION, getDiagnosisLabels, getDiagnosisResult } from "@/lib/diagnosis";
import { getAnonymousUserId } from "@/lib/server/anonymous-user";
import { AnswerValidationError, toStoredAnswers, validateAnswers } from "@/lib/server/diagnosis-answers";
import { hasSameOrigin, isUuid } from "@/lib/server/http-security";
import { serviceJson, SupabaseConfigurationError } from "@/lib/server/supabase-rest";
import type { PublicDiagnosis } from "@/types/diagnosis";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  if (!isUuid(params.id)) return errorResponse("診断IDが正しくありません。", 400);

  const anonymousUserId = getAnonymousUserId(request);
  if (!anonymousUserId) return errorResponse("診断を開始した端末から操作してください。", 403);

  try {
    const body = (await request.json()) as { answers?: unknown };
    const answers = validateAnswers(body.answers);
    const result = getDiagnosisResult(answers);
    const storedAnswers = toStoredAnswers(answers);

    const ownershipParams = new URLSearchParams({
      select: "id,created_at,diagnosis_logic_version,data_status",
      id: `eq.${params.id}`,
      anonymous_user_id: `eq.${anonymousUserId}`,
      limit: "1"
    });
    const owned = await serviceJson<
      Array<{ id: string; created_at: string; diagnosis_logic_version: string; data_status: string }>
    >(`/rest/v1/diagnoses?${ownershipParams}`);
    if (!owned[0]) return errorResponse("診断データが見つかりません。", 404);
    if (owned[0].data_status !== "draft") return errorResponse("この診断はすでに完了しています。", 409);
    if (owned[0].diagnosis_logic_version !== DIAGNOSIS_LOGIC_VERSION) {
      return errorResponse("診断画面が更新されました。最初から診断してください。", 409);
    }

    const updateParams = new URLSearchParams({ id: `eq.${params.id}`, data_status: "eq.draft" });
    const updated = await serviceJson<Array<{ id: string; created_at: string }>>(
      `/rest/v1/diagnoses?${updateParams}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          original_answers: storedAnswers,
          original_scores: result.scores,
          original_labels: getDiagnosisLabels(result),
          result_snapshot: result,
          data_status: "completed",
          completed_at: new Date().toISOString()
        })
      }
    );
    if (!updated[0]) return errorResponse("診断結果を保存できませんでした。", 409);

    const payload: PublicDiagnosis = {
      diagnosisId: params.id,
      result,
      diagnosisLogicVersion: DIAGNOSIS_LOGIC_VERSION,
      createdAt: updated[0].created_at
    };
    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return errorResponse("診断データの保存先を準備しています。Supabaseの設定後にご利用ください。", 503);
    }
    if (error instanceof AnswerValidationError) return errorResponse(error.message, 400);
    return errorResponse("診断結果を保存できませんでした。時間をおいてもう一度お試しください。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
