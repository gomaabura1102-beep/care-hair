import { createPrivateImageUrl, deletePrivateImages, serviceJson } from "@/lib/server/supabase-rest";
import type {
  AdminReviewRecord,
  AdminUser,
  DatasetSplit,
  DiagnosisRecord,
  QualityRating,
  ReviewStatus
} from "@/types/admin";
import type { DiagnosisLabels } from "@/types/diagnosis";

const adminSelect = [
  "id",
  "anonymous_user_id",
  "original_answers",
  "original_scores",
  "original_labels",
  "result_snapshot",
  "diagnosis_logic_version",
  "consent_ai_training",
  "consent_version",
  "consented_at",
  "guardian_confirmation",
  "data_status",
  "created_at",
  "completed_at",
  "diagnosis_images(id,diagnosis_id,storage_path,direction,mime_type,width,height,byte_size,exif_removed,created_at)",
  "admin_reviews(diagnosis_id,admin_label,admin_note,review_status,dataset_split,image_quality,hair_visibility,reviewed_by,reviewed_at)"
].join(",");

export type AdminFilters = {
  dateFrom?: string;
  dateTo?: string;
  label?: string;
  logicVersion?: string;
  consent?: string;
  image?: string;
  direction?: string;
  dataStatus?: string;
  reviewStatus?: string;
  datasetSplit?: string;
};

export async function listDiagnoses(filters: AdminFilters): Promise<DiagnosisRecord[]> {
  const query = new URLSearchParams({ select: adminSelect, order: "created_at.desc", limit: "500" });
  if (filters.dateFrom) query.append("created_at", `gte.${filters.dateFrom}T00:00:00+09:00`);
  if (filters.dateTo) query.append("created_at", `lte.${filters.dateTo}T23:59:59+09:00`);
  if (filters.label) query.set("original_labels->>hairBody", `eq.${filters.label}`);
  if (filters.logicVersion) query.set("diagnosis_logic_version", `eq.${filters.logicVersion}`);
  if (filters.consent === "yes") query.set("consent_ai_training", "eq.true");
  if (filters.consent === "no") query.set("consent_ai_training", "eq.false");
  if (filters.dataStatus) query.set("data_status", `eq.${filters.dataStatus}`);

  const rows = await serviceJson<DiagnosisRecord[]>(`/rest/v1/diagnoses?${query}`);
  return rows.filter((row) => {
    const review = getReview(row);
    if (filters.image === "yes" && row.diagnosis_images.length === 0) return false;
    if (filters.image === "no" && row.diagnosis_images.length > 0) return false;
    if (filters.direction && !row.diagnosis_images.some((image) => image.direction === filters.direction)) return false;
    if (filters.reviewStatus && review?.review_status !== filters.reviewStatus) return false;
    if (filters.datasetSplit && review?.dataset_split !== filters.datasetSplit) return false;
    return true;
  });
}

export async function getDiagnosisRecord(id: string): Promise<DiagnosisRecord | null> {
  const query = new URLSearchParams({ select: adminSelect, id: `eq.${id}`, limit: "1" });
  const rows = await serviceJson<DiagnosisRecord[]>(`/rest/v1/diagnoses?${query}`);
  return rows[0] ?? null;
}

export function getReview(diagnosis: DiagnosisRecord): AdminReviewRecord | null {
  if (Array.isArray(diagnosis.admin_reviews)) return diagnosis.admin_reviews[0] ?? null;
  return diagnosis.admin_reviews;
}

export async function getSignedDiagnosisImages(diagnosis: DiagnosisRecord) {
  return Promise.all(
    diagnosis.diagnosis_images.map(async (image) => ({
      ...image,
      signedUrl: await createPrivateImageUrl(image.storage_path, 300)
    }))
  );
}

export type ReviewUpdate = {
  adminLabel: Partial<DiagnosisLabels> | null;
  adminNote: string | null;
  reviewStatus: ReviewStatus;
  datasetSplit: DatasetSplit;
  imageQuality: QualityRating;
  hairVisibility: QualityRating;
};

export async function updateAdminReview(id: string, values: ReviewUpdate, admin: AdminUser) {
  await serviceJson("/rest/v1/admin_reviews?on_conflict=diagnosis_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      diagnosis_id: id,
      admin_label: values.adminLabel,
      admin_note: values.adminNote,
      review_status: values.reviewStatus,
      dataset_split: values.datasetSplit,
      image_quality: values.imageQuality,
      hair_visibility: values.hairVisibility,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString()
    })
  });
  await writeAuditLog(admin, "diagnosis.review", id, {
    reviewStatus: values.reviewStatus,
    datasetSplit: values.datasetSplit
  });
}

export async function deleteDiagnosisAsAdmin(id: string, admin: AdminUser) {
  const diagnosis = await getDiagnosisRecord(id);
  if (!diagnosis) return false;
  await deletePrivateImages(diagnosis.diagnosis_images.map((image) => image.storage_path));
  const query = new URLSearchParams({ id: `eq.${id}` });
  await serviceJson(`/rest/v1/diagnoses?${query}`, { method: "DELETE" });
  await writeAuditLog(admin, "diagnosis.delete", id, {
    imageCount: diagnosis.diagnosis_images.length,
    diagnosisLogicVersion: diagnosis.diagnosis_logic_version
  });
  return true;
}

export async function writeAuditLog(
  admin: AdminUser,
  action: string,
  targetDiagnosisId: string | null,
  metadata: Record<string, unknown> = {}
) {
  await serviceJson("/rest/v1/admin_audit_logs", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      admin_user_id: admin.id,
      action,
      target_diagnosis_id: targetDiagnosisId,
      metadata
    })
  });
}

export async function getRecentAuditLogs() {
  const query = new URLSearchParams({
    select: "id,admin_user_id,action,target_diagnosis_id,created_at",
    order: "created_at.desc",
    limit: "20"
  });
  return serviceJson<
    Array<{
      id: number;
      admin_user_id: string | null;
      action: string;
      target_diagnosis_id: string | null;
      created_at: string;
    }>
  >(`/rest/v1/admin_audit_logs?${query}`);
}
