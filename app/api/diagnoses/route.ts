import { NextRequest, NextResponse } from "next/server";
import { DIAGNOSIS_LOGIC_VERSION } from "@/lib/diagnosis";
import { ensureAnonymousUserId, setAnonymousUserCookie } from "@/lib/server/anonymous-user";
import { hasSameOrigin } from "@/lib/server/http-security";
import { ImageValidationError, inspectSanitizedImage } from "@/lib/server/image-security";
import {
  deletePrivateImages,
  serviceJson,
  SupabaseConfigurationError,
  uploadPrivateImage
} from "@/lib/server/supabase-rest";
import { hairPhotoDirections } from "@/types/photo-diagnosis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const consentVersion = "ai-training-consent-v1.0";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);

  let storagePath: string | null = null;
  let diagnosisId: string | null = null;

  try {
    const anonymousUserId = ensureAnonymousUserId(request);
    const rateLimitResponse = await checkRateLimit(anonymousUserId);
    if (rateLimitResponse) return rateLimitResponse;

    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = (await request.json()) as { mode?: unknown };
      if (body.mode !== "questions") return errorResponse("診断方法が正しくありません。", 400);

      diagnosisId = crypto.randomUUID();
      await createDiagnosisDraft({
        diagnosisId,
        anonymousUserId,
        consent: false,
        consentVersion: "question-only-v1.0",
        guardianConfirmation: false
      });
      const response = NextResponse.json({ diagnosisId }, { status: 201 });
      response.headers.set("Cache-Control", "no-store");
      setAnonymousUserCookie(response, anonymousUserId);
      return response;
    }

    const form = await request.formData();
    const image = form.get("image");
    const direction = String(form.get("direction") ?? "front");
    const consent = form.get("consentAiTraining") === "true";
    const guardianConfirmation = form.get("guardianConfirmation") === "true";

    if (!consent || !guardianConfirmation) {
      return errorResponse("写真の利用目的と未成年者への確認事項に同意してください。", 400);
    }
    if (!(image instanceof File)) return errorResponse("髪の写真を選んでください。", 400);
    if (!hairPhotoDirections.includes(direction as (typeof hairPhotoDirections)[number])) {
      return errorResponse("撮影方向が正しくありません。", 400);
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const inspectedImage = inspectSanitizedImage(bytes);
    diagnosisId = crypto.randomUUID();
    const imageId = crypto.randomUUID();
    storagePath = `${anonymousUserId}/${diagnosisId}/${imageId}.${inspectedImage.extension}`;

    await uploadPrivateImage(storagePath, bytes, inspectedImage.mimeType);
    await createDiagnosisDraft({
      diagnosisId,
      anonymousUserId,
      consent: true,
      consentVersion,
      guardianConfirmation: true,
      createAdminReview: false
    });
    await serviceJson("/rest/v1/diagnosis_images", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: imageId,
        diagnosis_id: diagnosisId,
        storage_path: storagePath,
        direction,
        mime_type: inspectedImage.mimeType,
        width: inspectedImage.width,
        height: inspectedImage.height,
        byte_size: bytes.length,
        exif_removed: true
      })
    });
    await serviceJson("/rest/v1/admin_reviews", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ diagnosis_id: diagnosisId })
    });

    const response = NextResponse.json({ diagnosisId }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    setAnonymousUserCookie(response, anonymousUserId);
    return response;
  } catch (error) {
    if (diagnosisId) {
      const params = new URLSearchParams({ id: `eq.${diagnosisId}` });
      await serviceJson(`/rest/v1/diagnoses?${params}`, { method: "DELETE" }).catch(() => undefined);
    }
    if (storagePath) await deletePrivateImages([storagePath]).catch(() => undefined);

    if (error instanceof SupabaseConfigurationError) {
      return errorResponse("診断データの保存先を準備しています。Supabaseの設定後にご利用ください。", 503);
    }
    if (error instanceof ImageValidationError) return errorResponse(error.message, 400);
    return errorResponse("写真を保存できませんでした。時間をおいてもう一度お試しください。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function checkRateLimit(anonymousUserId: string) {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recentParams = new URLSearchParams({
    select: "id",
    anonymous_user_id: `eq.${anonymousUserId}`,
    created_at: `gte.${cutoff}`,
    limit: "5"
  });
  const recent = await serviceJson<Array<{ id: string }>>(`/rest/v1/diagnoses?${recentParams}`);
  return recent.length >= 5 ? errorResponse("しばらく時間をおいてから、もう一度お試しください。", 429) : null;
}

async function createDiagnosisDraft(input: {
  diagnosisId: string;
  anonymousUserId: string;
  consent: boolean;
  consentVersion: string;
  guardianConfirmation: boolean;
  createAdminReview?: boolean;
}) {
  await serviceJson("/rest/v1/diagnoses", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: input.diagnosisId,
      anonymous_user_id: input.anonymousUserId,
      diagnosis_logic_version: DIAGNOSIS_LOGIC_VERSION,
      consent_ai_training: input.consent,
      consent_version: input.consentVersion,
      consented_at: new Date().toISOString(),
      guardian_confirmation: input.guardianConfirmation,
      data_status: "draft"
    })
  });
  if (input.createAdminReview === false) return;
  await serviceJson("/rest/v1/admin_reviews", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ diagnosis_id: input.diagnosisId })
  });
}
