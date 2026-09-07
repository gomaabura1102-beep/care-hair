"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { prepareHairPhoto } from "@/lib/photo-diagnosis";
import { deleteUsagePhoto, loadUsagePhoto, saveUsagePhoto, type UsagePhotoKind } from "@/lib/usage-photos";

type Props = { usageId: string };
type PhotoUrls = Partial<Record<UsagePhotoKind, string>>;

const photoOptions: Array<{ kind: UsagePhotoKind; label: string }> = [
  { kind: "before", label: "使用前" },
  { kind: "after", label: "使用後" }
];

export function UsagePhotoRecord({ usageId }: Props) {
  const [photoUrls, setPhotoUrls] = useState<PhotoUrls>({});
  const [processing, setProcessing] = useState<UsagePhotoKind | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];
    Promise.all(photoOptions.map(async ({ kind }) => ({ kind, record: await loadUsagePhoto(usageId, kind) })))
      .then((records) => {
        if (!active) return;
        const next: PhotoUrls = {};
        records.forEach(({ kind, record }) => {
          if (!record) return;
          const url = URL.createObjectURL(record.image);
          objectUrls.push(url);
          next[kind] = url;
        });
        setPhotoUrls(next);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "写真記録を読み込めませんでした。"));
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [usageId]);

  async function selectPhoto(kind: UsagePhotoKind, file?: File) {
    if (!file) return;
    setProcessing(kind);
    setError("");
    try {
      const prepared = await prepareHairPhoto(file);
      await saveUsagePhoto(usageId, kind, prepared.file);
      setPhotoUrls((current) => {
        if (current[kind]) URL.revokeObjectURL(current[kind]);
        return { ...current, [kind]: prepared.previewUrl };
      });
    } catch (photoError) {
      setError(photoError instanceof Error ? photoError.message : "写真記録を保存できませんでした。");
    } finally {
      setProcessing(null);
    }
  }

  async function removePhoto(kind: UsagePhotoKind) {
    setProcessing(kind);
    setError("");
    try {
      await deleteUsagePhoto(usageId, kind);
      setPhotoUrls((current) => {
        if (current[kind]) URL.revokeObjectURL(current[kind]);
        const next = { ...current };
        delete next[kind];
        return next;
      });
    } catch (photoError) {
      setError(photoError instanceof Error ? photoError.message : "写真記録を削除できませんでした。");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="text-xs leading-6 text-muted">写真は任意です。位置情報などを除去し、この端末内だけに保存します。運営側には送信されません。</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {photoOptions.map(({ kind, label }) => (
          <div key={kind} className="min-w-0 rounded-xl border border-line bg-soft p-2">
            {photoUrls[kind] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrls[kind]} alt={`${label}の髪の記録`} className="aspect-square w-full rounded-lg object-cover" />
                <button type="button" onClick={() => removePhoto(kind)} disabled={processing !== null} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-white px-2 text-xs font-semibold text-muted"><Trash2 className="h-3.5 w-3.5" />削除</button>
              </>
            ) : (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white p-2 text-center text-xs font-semibold text-green">
                <ImagePlus className="mb-2 h-5 w-5" />
                {processing === kind ? "処理中..." : `${label}の写真を選ぶ`}
                <input type="file" accept="image/*,.heic,.heif" className="sr-only" disabled={processing !== null} onChange={(event) => selectPhoto(kind, event.target.files?.[0])} />
              </label>
            )}
          </div>
        ))}
      </div>
      {error ? <p className="mt-3 text-xs font-semibold text-red-700" role="alert">{error}</p> : null}
    </div>
  );
}
