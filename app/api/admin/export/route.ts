import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/server/admin-auth";
import { getReview, listDiagnoses, writeAuditLog } from "@/lib/server/admin-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: "管理者としてログインしてください。" }, { status: 403 });

  const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";
  try {
    const diagnoses = await listDiagnoses({ consent: "yes", dataStatus: "completed" });
    const eligible = diagnoses.filter((diagnosis) => {
      const review = getReview(diagnosis);
      return (
        diagnosis.consent_ai_training === true &&
        review?.review_status === "usable" &&
        ["train", "validation", "test"].includes(review.dataset_split)
      );
    });
    const rows = eligible.flatMap((diagnosis) => {
      const review = getReview(diagnosis)!;
      return diagnosis.diagnosis_images.map((image) => ({
        diagnosisId: diagnosis.id,
        anonymousUserId: diagnosis.anonymous_user_id,
        imageId: image.id,
        imageFile: `/api/admin/images/${image.id}`,
        direction: image.direction,
        answers: diagnosis.original_answers,
        originalLabel: diagnosis.original_labels,
        adminLabel: review.admin_label,
        diagnosisLogicVersion: diagnosis.diagnosis_logic_version,
        datasetSplit: review.dataset_split,
        createdAt: diagnosis.created_at
      }));
    });
    await writeAuditLog(admin, `dataset.export.${format}`, null, { diagnosisCount: eligible.length, imageCount: rows.length });

    const date = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      const headers = Object.keys(rows[0] ?? {
        diagnosisId: "",
        anonymousUserId: "",
        imageId: "",
        imageFile: "",
        direction: "",
        answers: "",
        originalLabel: "",
        adminLabel: "",
        diagnosisLogicVersion: "",
        datasetSplit: "",
        createdAt: ""
      });
      const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => csvCell(row[key as keyof typeof row])).join(","))].join("\n");
      return new NextResponse(`\uFEFF${csv}`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="care-hair-ai-dataset-${date}.csv"`,
          "Cache-Control": "private, no-store"
        }
      });
    }

    return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), rows }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="care-hair-ai-dataset-${date}.json"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "エクスポートを作成できませんでした。" }, { status: 500 });
  }
}

function csvCell(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return `"${text.replace(/"/g, '""')}"`;
}
