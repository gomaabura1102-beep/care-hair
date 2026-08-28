import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { updateAdminReview } from "@/lib/server/admin-data";
import { hasSameOrigin, isUuid } from "@/lib/server/http-security";
import type { DatasetSplit, QualityRating, ReviewStatus } from "@/types/admin";
import type { DiagnosisLabels } from "@/types/diagnosis";

const reviewStatuses: ReviewStatus[] = ["unreviewed", "usable", "low_quality", "label_review_needed", "excluded"];
const splits: DatasetSplit[] = ["unassigned", "train", "validation", "test", "excluded"];
const ratings: QualityRating[] = ["unrated", "good", "acceptable", "poor"];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return errorResponse("不正な送信元です。", 403);
  if (!isUuid(params.id)) return errorResponse("診断IDが正しくありません。", 400);
  const admin = await getAdminFromRequest(request);
  if (!admin) return errorResponse("管理者としてログインしてください。", 403);

  try {
    const body = (await request.json()) as {
      adminLabel?: Partial<DiagnosisLabels> | null;
      adminNote?: string | null;
      reviewStatus?: ReviewStatus;
      datasetSplit?: DatasetSplit;
      imageQuality?: QualityRating;
      hairVisibility?: QualityRating;
    };
    if (!body.reviewStatus || !reviewStatuses.includes(body.reviewStatus)) return errorResponse("確認状態が不正です。", 400);
    if (!body.datasetSplit || !splits.includes(body.datasetSplit)) return errorResponse("データ分類が不正です。", 400);
    if (!body.imageQuality || !ratings.includes(body.imageQuality)) return errorResponse("画像品質が不正です。", 400);
    if (!body.hairVisibility || !ratings.includes(body.hairVisibility)) return errorResponse("髪の写りが不正です。", 400);
    if (body.adminNote && body.adminNote.length > 4000) return errorResponse("メモは4000文字以内にしてください。", 400);

    await updateAdminReview(
      params.id,
      {
        adminLabel: body.adminLabel ?? null,
        adminNote: body.adminNote?.trim() || null,
        reviewStatus: body.reviewStatus,
        datasetSplit: body.datasetSplit,
        imageQuality: body.imageQuality,
        hairVisibility: body.hairVisibility
      },
      admin
    );
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("確認内容を保存できませんでした。", 500);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
