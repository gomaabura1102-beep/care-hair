"use client";

import { Camera, Check, ClipboardCheck, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { DiagnosisSteps } from "@/components/diagnosis-steps";
import { products } from "@/data/products";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";
import { PhotoDiagnosisPanel } from "@/features/diagnosis/photo-diagnosis-panel";
import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

type FlowStep = "intro" | "photo" | "questions";
type DiagnosisMode = "questions" | "photo";

export function DiagnosisExperience() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [mode, setMode] = useState<DiagnosisMode>("questions");
  const [photo, setPhoto] = useState<PreparedHairPhoto | null>(null);
  const [currentProductId, setCurrentProductId] = useState("");
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.previewUrl);
    };
  }, [photo]);

  const startQuestionDiagnosis = () => {
    setDiagnosisId(crypto.randomUUID());
    setMode("questions");
    setStep("questions");
  };

  const continueFromPhoto = () => {
    if (!photo) return;
    setDiagnosisId(crypto.randomUUID());
    setMode("photo");
    setPhoto(null);
    setStep("questions");
  };

  if (step === "intro") {
    return (
      <div className="mx-auto min-w-0 w-full max-w-5xl rounded-[20px] border border-line bg-white/95 p-5 shadow-brand sm:p-9 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-green">
            <ClipboardCheck className="h-7 w-7" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-green">Hair diagnosis</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">自分に合うケアを見つける</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
            11の質問から今の髪質と悩みを整理します。回答内容と写真はサーバーへ送信・保存しません。
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={startQuestionDiagnosis}
            className="group relative rounded-[20px] border border-line bg-soft p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-green hover:shadow-hover"
          >
            <span className="absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-green">おすすめ</span>
            <ClipboardCheck className="h-8 w-8 text-green" />
            <h2 className="mt-5 text-2xl font-semibold">質問だけで診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 約3分</p>
            <p className="mt-4 text-sm leading-7 text-muted">写真を使わず、回答だけで髪質とケアの優先順位を判定します。</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green">診断をはじめる</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("photo");
              setStep("photo");
            }}
            className="group rounded-[20px] border border-line bg-soft p-6 text-left transition duration-200 hover:-translate-y-1 hover:border-green hover:shadow-hover"
          >
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted">一時プレビュー</span>
            <Camera className="mt-4 h-8 w-8 text-green" />
            <h2 className="mt-5 text-2xl font-semibold">写真＋質問で診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 約4分</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              写真は端末内で一時表示するだけで、判定・送信・保存には使用しません。
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green">写真を選んではじめる</span>
          </button>
        </div>

        <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-line bg-soft p-5">
          <label className="grid gap-2 text-left text-sm font-semibold">
            今使っているシャンプー（任意）
            <select
              value={currentProductId}
              onChange={(event) => setCurrentProductId(event.target.value)}
              className="min-h-12 w-full min-w-0 rounded-xl border border-line bg-white px-4 font-normal outline-none focus:border-green"
            >
              <option value="">選択しない／一覧にない</option>
              {products.filter((product) => product.type === "shampoo").map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
          <p className="mt-3 flex gap-2 text-xs leading-6 text-muted"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-green" />今の商品をすぐ替える必要があるかも、結果で押しつけずに確認します。</p>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4" />回答内容と写真はこの端末から送信しません。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 w-full max-w-5xl">
      <DiagnosisSteps current={step === "photo" ? 1 : mode === "photo" ? 2 : 1} mode={mode} />
      {step === "photo" ? (
        <PhotoDiagnosisPanel
          photo={photo}
          onPhoto={setPhoto}
          onContinue={continueFromPhoto}
          onBack={() => setStep("intro")}
        />
      ) : diagnosisId ? (
        <DiagnosisForm diagnosisId={diagnosisId} mode={mode} currentProductId={currentProductId || null} />
      ) : null}
    </div>
  );
}
