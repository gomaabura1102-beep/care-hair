"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminReviewRecord, DatasetSplit, QualityRating, ReviewStatus } from "@/types/admin";
import type { DiagnosisLabels } from "@/types/diagnosis";

export function AdminReviewForm({ diagnosisId, review }: { diagnosisId: string; review: AdminReviewRecord | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const labelEntries = ["hairBody", "hairShape", "scalpState", "condition"]
      .map((key) => [key, String(form.get(key) ?? "").trim()] as const)
      .filter(([, value]) => value);
    const adminLabel = labelEntries.length ? Object.fromEntries(labelEntries) as Partial<DiagnosisLabels> : null;

    try {
      const response = await fetch(`/api/admin/diagnoses/${diagnosisId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminLabel,
          adminNote: form.get("adminNote"),
          reviewStatus: form.get("reviewStatus") as ReviewStatus,
          datasetSplit: form.get("datasetSplit") as DatasetSplit,
          imageQuality: form.get("imageQuality") as QualityRating,
          hairVisibility: form.get("hairVisibility") as QualityRating
        })
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "保存できませんでした。");
      setMessage("確認内容を保存しました。");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存できませんでした。");
    } finally {
      setSaving(false);
    }
  };

  const label = review?.admin_label ?? {};
  return (
    <form onSubmit={submit} className="rounded-brand border border-line bg-white p-6 shadow-brand">
      <h2 className="text-xl font-semibold">運営側の確認情報</h2>
      <p className="mt-2 text-sm leading-7 text-muted">元回答・元ラベルは変更せず、運営側の修正を別データとして保存します。</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SelectField name="reviewStatus" label="確認状態" defaultValue={review?.review_status ?? "unreviewed"} options={reviewStatusOptions} />
        <SelectField name="datasetSplit" label="データ分類" defaultValue={review?.dataset_split ?? "unassigned"} options={splitOptions} />
        <SelectField name="imageQuality" label="画像品質" defaultValue={review?.image_quality ?? "unrated"} options={qualityOptions} />
        <SelectField name="hairVisibility" label="髪の写り" defaultValue={review?.hair_visibility ?? "unrated"} options={qualityOptions} />
      </div>

      <h3 className="mt-7 font-semibold">管理者ラベル（必要な項目だけ）</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <TextField name="hairBody" label="髪の太さ・硬さ" defaultValue={label.hairBody ?? ""} />
        <TextField name="hairShape" label="くせ・うねり" defaultValue={label.hairShape ?? ""} />
        <TextField name="scalpState" label="頭皮状態" defaultValue={label.scalpState ?? ""} />
        <TextField name="condition" label="ダメージ・乾燥傾向" defaultValue={label.condition ?? ""} />
      </div>
      <label className="mt-5 grid gap-2 text-sm font-semibold">
        管理者メモ
        <textarea name="adminNote" defaultValue={review?.admin_note ?? ""} maxLength={4000} rows={5} className="rounded-brand border border-line px-4 py-3 font-normal outline-none focus:border-green" />
      </label>
      {message && <p className="mt-4 text-sm font-semibold text-green">{message}</p>}
      <Button type="submit" className="mt-5" disabled={saving}>{saving ? "保存しています..." : "確認内容を保存"}</Button>
    </form>
  );
}

function SelectField({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: Array<[string, string]> }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select name={name} defaultValue={defaultValue} className="min-h-12 rounded-brand border border-line bg-white px-4 font-normal outline-none focus:border-green">
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );
}

function TextField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input name={name} defaultValue={defaultValue} className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none focus:border-green" /></label>;
}

const reviewStatusOptions = [
  ["unreviewed", "未確認"], ["usable", "使用可能"], ["low_quality", "画像品質が低い"],
  ["label_review_needed", "ラベル確認が必要"], ["excluded", "使用対象外"]
] as Array<[string, string]>;
const splitOptions = [
  ["unassigned", "未分類"], ["train", "学習用"], ["validation", "検証用"], ["test", "テスト用"], ["excluded", "対象外"]
] as Array<[string, string]>;
const qualityOptions = [
  ["unrated", "未評価"], ["good", "良好"], ["acceptable", "使用可能"], ["poor", "不十分"]
] as Array<[string, string]>;
