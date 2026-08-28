import type { DiagnosisLabels, DiagnosisResult, StoredAnswers } from "@/types/diagnosis";
import type { HairPhotoDirection } from "@/types/photo-diagnosis";

export type DataStatus = "draft" | "completed" | "deletion_requested";
export type ReviewStatus = "unreviewed" | "usable" | "low_quality" | "label_review_needed" | "excluded";
export type DatasetSplit = "unassigned" | "train" | "validation" | "test" | "excluded";
export type QualityRating = "unrated" | "good" | "acceptable" | "poor";

export type DiagnosisImageRecord = {
  id: string;
  diagnosis_id: string;
  storage_path: string;
  direction: HairPhotoDirection;
  mime_type: string;
  width: number;
  height: number;
  byte_size: number;
  exif_removed: boolean;
  created_at: string;
};

export type AdminReviewRecord = {
  diagnosis_id: string;
  admin_label: Partial<DiagnosisLabels> | null;
  admin_note: string | null;
  review_status: ReviewStatus;
  dataset_split: DatasetSplit;
  image_quality: QualityRating;
  hair_visibility: QualityRating;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export type DiagnosisRecord = {
  id: string;
  anonymous_user_id: string;
  original_answers: StoredAnswers | null;
  original_scores: DiagnosisResult["scores"] | null;
  original_labels: DiagnosisLabels | null;
  result_snapshot: DiagnosisResult | null;
  diagnosis_logic_version: string;
  consent_ai_training: boolean;
  consent_version: string;
  consented_at: string;
  guardian_confirmation: boolean;
  data_status: DataStatus;
  created_at: string;
  completed_at: string | null;
  diagnosis_images: DiagnosisImageRecord[];
  admin_reviews: AdminReviewRecord | AdminReviewRecord[] | null;
};

export type AdminUser = {
  id: string;
  email: string;
};
