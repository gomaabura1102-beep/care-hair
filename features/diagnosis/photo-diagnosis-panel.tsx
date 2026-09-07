"use client";

import { ArrowLeft, Camera, CheckCircle2, ImageUp, LockKeyhole, Sparkles, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";
import { prepareHairPhoto } from "@/lib/photo-diagnosis";
import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

type Props = {
  photo: PreparedHairPhoto | null;
  onPhoto: (photo: PreparedHairPhoto | null) => void;
  onContinue: () => void;
  onBack: () => void;
};

const guideItems = [
  { icon: Sun, text: "明るい場所で、髪全体が分かるように撮影" },
  { icon: Camera, text: "できるだけ顔ではなく髪を中心に写す" },
  { icon: Sparkles, text: "加工・美肌補正・フィルターを使わない" },
  { icon: CheckCircle2, text: "帽子を外し、髪が見える状態にする" }
];

export function PhotoDiagnosisPanel({
  photo,
  onPhoto,
  onContinue,
  onBack
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setProcessing(true);
    setPhotoError("");
    try {
      const prepared = await prepareHairPhoto(file);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      onPhoto(prepared);
    } catch (processingError) {
      setPhotoError(processingError instanceof Error ? processingError.message : "写真を処理できませんでした。");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card as="section" className="border-accent/30 bg-white/95 sm:p-8">
      <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <CardEyebrow>Step 1</CardEyebrow>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">髪の写真をアップロード</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            正面または髪全体が分かる写真を1枚選んでください。写真はこの画面の一時プレビューだけに使います。
          </p>

          <label className="mt-6 flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-brand border border-dashed border-accent bg-soft px-5 py-6 text-center transition hover:border-green hover:bg-white">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.previewUrl} alt="アップロードする髪の写真" className="max-h-64 w-full rounded-lg object-contain" />
            ) : (
              <>
                <ImageUp className="h-9 w-9 text-green" />
                <span className="mt-3 font-semibold">{processing ? "位置情報などを除去しています..." : "撮影／写真を選択"}</span>
                <span className="mt-1 text-xs text-muted">JPEG・PNG・WebPなど、25MBまで（端末対応形式）</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,.heic,.heif"
              capture="environment"
              className="sr-only"
              disabled={processing}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {photo && <p className="mt-2 text-xs text-muted">{photo.width} × {photo.height}px・正面／髪全体</p>}
          {photoError && <p className="mt-3 text-sm font-semibold text-red-700">{photoError}</p>}
        </div>

        <div className="grid content-start gap-5">
          <div className="rounded-brand border border-line bg-soft p-5">
            <h2 className="font-semibold">撮影ガイド</h2>
            <div className="mt-4 grid gap-3">
              {guideItems.map((item) => (
                <div key={item.text} className="flex gap-3 text-sm leading-6 text-muted">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-brand border border-accent/30 bg-secondary/60 p-5">
            <div className="flex items-center gap-2 font-semibold text-green">
              <LockKeyhole className="h-5 w-5" /> 写真と回答は保存しません
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">
              写真はこの端末の画面上だけで一時的に表示し、Care HairのサーバーやSupabaseへ送信・保存しません。質問への回答も送信・保存せず、診断結果はこの端末内で計算します。
            </p>
            <p className="mt-4 rounded-lg bg-white p-3 text-sm leading-6">
              写真は診断の判定にもAI学習にも使用せず、質問へ進む時点で破棄します。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> 方法を選び直す
        </Button>
        <Button type="button" onClick={onContinue} disabled={!photo || processing}>
          質問へ進む
        </Button>
      </div>
    </Card>
  );
}
