"use client";

import { Camera, Check, ClipboardCheck, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { DiagnosisSteps } from "@/components/diagnosis-steps";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";
import { PhotoDiagnosisPanel } from "@/features/diagnosis/photo-diagnosis-panel";
import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

type FlowStep = "intro" | "photo" | "questions";
type DiagnosisMode = "questions" | "photo";

const diagnosisEnabled = process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED === "true";
const photoDiagnosisEnabled = diagnosisEnabled && process.env.NEXT_PUBLIC_PHOTO_DIAGNOSIS_ENABLED === "true";

export function DiagnosisExperience() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [mode, setMode] = useState<DiagnosisMode>("questions");
  const [photo, setPhoto] = useState<PreparedHairPhoto | null>(null);
  const [consent, setConsent] = useState(false);
  const [guardianConfirmation, setGuardianConfirmation] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.previewUrl);
    };
  }, [photo]);

  const startQuestionDiagnosis = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "questions" })
      });
      const body = (await response.json()) as { diagnosisId?: string; error?: string };
      if (!response.ok || !body.diagnosisId) throw new Error(body.error ?? "診断を開始できませんでした。");
      setDiagnosisId(body.diagnosisId);
      setMode("questions");
      setStep("questions");
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "診断を開始できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photo || !consent || !guardianConfirmation) return;
    setSubmitting(true);
    setError("");
    try {
      const form = new FormData();
      form.set("image", photo.file);
      form.set("direction", "front");
      form.set("consentAiTraining", "true");
      form.set("guardianConfirmation", "true");
      const response = await fetch("/api/diagnoses", { method: "POST", body: form });
      const body = (await response.json()) as { diagnosisId?: string; error?: string };
      if (!response.ok || !body.diagnosisId) throw new Error(body.error ?? "写真を保存できませんでした。");
      setDiagnosisId(body.diagnosisId);
      setMode("photo");
      setStep("questions");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "写真を保存できませんでした。");
    } finally {
      setSubmitting(false);
    }
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
            診断機能は現在調整中です。再開までしばらくお待ちください。
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={startQuestionDiagnosis}
            disabled={!diagnosisEnabled || submitting}
            className="group relative rounded-[20px] border border-line bg-soft p-6 text-left transition duration-200 enabled:hover:-translate-y-1 enabled:hover:border-green enabled:hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted">一時停止中</span>
            <ClipboardCheck className="h-8 w-8 text-muted" />
            <h2 className="mt-5 text-2xl font-semibold">質問だけで診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 現在利用できません</p>
            <p className="mt-4 text-sm leading-7 text-muted">診断データの保存機能を調整しています。</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-muted">診断を一時停止しています</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!photoDiagnosisEnabled) return;
              setMode("photo");
              setStep("photo");
              setError("");
            }}
            disabled={!photoDiagnosisEnabled || submitting}
            className="group rounded-[20px] border border-line bg-soft p-6 text-left transition duration-200 enabled:hover:-translate-y-1 enabled:hover:border-green enabled:hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted">
              {photoDiagnosisEnabled ? "β版" : "一時停止中"}
            </span>
            <Camera className="mt-4 h-8 w-8 text-muted" />
            <h2 className="mt-5 text-2xl font-semibold">写真＋質問で診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 現在利用できません</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              写真の保存機能を調整しています。
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-muted">
              写真保存を停止しています
            </span>
          </button>
        </div>

        {diagnosisEnabled ? (
          <>
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
            {error && <p className="mx-auto mt-5 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4" />質問だけの診断では写真を保存しません。</p>
          </>
        ) : (
          <p className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-muted">
            <ShieldCheck className="h-4 w-4" /> 安全に利用できる準備が整い次第、再開します。
          </p>
        )}
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
          consent={consent}
          onConsent={setConsent}
          guardianConfirmation={guardianConfirmation}
          onGuardianConfirmation={setGuardianConfirmation}
          onContinue={uploadPhoto}
          onBack={() => setStep("intro")}
          submitting={submitting}
          error={error}
        />
      ) : diagnosisId ? (
        <DiagnosisForm diagnosisId={diagnosisId} mode={mode} currentProductId={currentProductId || null} />
      ) : null}
    </div>
  );
}
"use client";

import { ArrowRight, Camera, Check, ClipboardCheck, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { DiagnosisSteps } from "@/components/diagnosis-steps";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";
import { PhotoDiagnosisPanel } from "@/features/diagnosis/photo-diagnosis-panel";
import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

type FlowStep = "intro" | "photo" | "questions";
type DiagnosisMode = "questions" | "photo";

const photoDiagnosisEnabled = process.env.NEXT_PUBLIC_PHOTO_DIAGNOSIS_ENABLED === "true";

export function DiagnosisExperience() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [mode, setMode] = useState<DiagnosisMode>("questions");
  const [photo, setPhoto] = useState<PreparedHairPhoto | null>(null);
  const [consent, setConsent] = useState(false);
  const [guardianConfirmation, setGuardianConfirmation] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.previewUrl);
    };
  }, [photo]);

  const startQuestionDiagnosis = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "questions" })
      });
      const body = (await response.json()) as { diagnosisId?: string; error?: string };
      if (!response.ok || !body.diagnosisId) throw new Error(body.error ?? "診断を開始できませんでした。");
      setDiagnosisId(body.diagnosisId);
      setMode("questions");
      setStep("questions");
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "診断を開始できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photo || !consent || !guardianConfirmation) return;
    setSubmitting(true);
    setError("");
    try {
      const form = new FormData();
      form.set("image", photo.file);
      form.set("direction", "front");
      form.set("consentAiTraining", "true");
      form.set("guardianConfirmation", "true");
      const response = await fetch("/api/diagnoses", { method: "POST", body: form });
      const body = (await response.json()) as { diagnosisId?: string; error?: string };
      if (!response.ok || !body.diagnosisId) throw new Error(body.error ?? "写真を保存できませんでした。");
      setDiagnosisId(body.diagnosisId);
      setMode("photo");
      setStep("questions");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "写真を保存できませんでした。");
    } finally {
      setSubmitting(false);
    }
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
            11の質問から今の髪質と悩みを整理します。写真を使った診断は現在一時停止しています。
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={startQuestionDiagnosis}
            disabled={submitting}
            className="group relative rounded-[20px] border-2 border-green bg-[#f2f7f5] p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-hover disabled:opacity-50"
          >
            <span className="absolute right-4 top-4 rounded-full bg-green px-3 py-1 text-[11px] font-semibold text-white">おすすめ</span>
            <ClipboardCheck className="h-8 w-8 text-green" />
            <h2 className="mt-5 text-2xl font-semibold">質問だけで診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 約2分・登録不要</p>
            <p className="mt-4 text-sm leading-7 text-muted">写真を保存せず、11の質問だけで気軽に診断できます。</p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green">この方法ではじめる <ArrowRight className="h-4 w-4" /></span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!photoDiagnosisEnabled) return;
              setMode("photo");
              setStep("photo");
              setError("");
            }}
            disabled={!photoDiagnosisEnabled || submitting}
            className="group rounded-[20px] border border-line bg-soft p-6 text-left transition duration-200 enabled:hover:-translate-y-1 enabled:hover:border-green enabled:hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted">
              {photoDiagnosisEnabled ? "β版" : "一時停止中"}
            </span>
            <Camera className="mt-4 h-8 w-8 text-muted" />
            <h2 className="mt-5 text-2xl font-semibold">写真＋質問で診断</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Clock3 className="h-4 w-4" /> 現在利用できません</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              写真の保存機能を調整しています。再開まで「質問だけで診断」をご利用ください。
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-muted">
              写真保存を停止しています
            </span>
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

        {error && <p className="mx-auto mt-5 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4" />質問だけの診断では写真を保存しません。</p>
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
          consent={consent}
          onConsent={setConsent}
          guardianConfirmation={guardianConfirmation}
          onGuardianConfirmation={setGuardianConfirmation}
          onContinue={uploadPhoto}
          onBack={() => setStep("intro")}
          submitting={submitting}
          error={error}
        />
      ) : diagnosisId ? (
        <DiagnosisForm diagnosisId={diagnosisId} mode={mode} currentProductId={currentProductId || null} />
      ) : null}
    </div>
  );
}
