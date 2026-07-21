"use client";

import { Camera, CheckCircle2, ImageUp, Sparkles, Sun, XCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/card";
import { analyzeHairPhoto } from "@/lib/photo-diagnosis";
import type { HairPhotoAnalysis } from "@/types/photo-diagnosis";

type PhotoDiagnosisPanelProps = {
  analysis: HairPhotoAnalysis | null;
  onAnalysis: (analysis: HairPhotoAnalysis | null) => void;
};

const guideItems = [
  { icon: Sun, text: "明るい場所で撮影してください" },
  { icon: Camera, text: "頭頂部から毛先まで写してください" },
  { icon: Sparkles, text: "加工をしないでください" },
  { icon: XCircle, text: "帽子やヘッドホンは外してください" },
  { icon: CheckCircle2, text: "髪にピントを合わせてください" }
];

export function PhotoDiagnosisPanel({ analysis, onAnalysis }: PhotoDiagnosisPanelProps) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await analyzeHairPhoto(file);
      onAnalysis(result);
    } catch {
      onAnalysis({
        usable: false,
        message: "写真から髪質を正確に判断できませんでした。質問内容のみで診断します。",
        scores: {},
        metrics: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card as="section" className="mb-6 border-accent/30 bg-secondary/70">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <CardEyebrow>Photo diagnosis</CardEyebrow>
          <h2 className="mt-3 text-2xl font-semibold">髪の写真から診断する</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            より正確に診断したい方は、写真診断がおすすめです。写真の判定結果と質問の回答を組み合わせて商品を提案します。
          </p>
          <label className="mt-6 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-brand border border-dashed border-accent bg-white px-5 py-6 text-center transition hover:-translate-y-0.5 hover:shadow-brand">
            <ImageUp className="h-8 w-8 text-green" />
            <span className="mt-3 font-semibold">{loading ? "写真を確認中..." : "髪の写真をアップロード"}</span>
            <span className="mt-1 text-xs text-muted">スマホでは撮影してそのまま選べます</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
        </div>

        <div className="grid gap-4">
          <div className="rounded-brand border border-line bg-white p-5">
            <h3 className="font-semibold">撮影ガイド</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {guideItems.map((item) => (
                <div key={item.text} className="flex gap-3 text-sm leading-6 text-muted">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {analysis && (
            <div className="rounded-brand border border-line bg-white p-5">
              <p className={`font-semibold ${analysis.usable ? "text-green" : "text-muted"}`}>{analysis.message}</p>
              {analysis.metrics.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {analysis.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-brand bg-soft px-4 py-3">
                      <span className="block text-xs font-semibold text-green">{metric.label}</span>
                      <span className="mt-1 block text-sm text-muted">{metric.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
