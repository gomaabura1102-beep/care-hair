"use client";

import { ArrowRight, Camera, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { DiagnosisSteps } from "@/components/diagnosis-steps";
import { Button } from "@/components/ui/button";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";
import { PhotoDiagnosisPanel } from "@/features/diagnosis/photo-diagnosis-panel";
import type { PreparedHairPhoto } from "@/types/photo-diagnosis";

type FlowStep = "intro" | "photo" | "questions";

export function DiagnosisExperience() {
  const [step, setStep] = useState<FlowStep>("intro");
  const [photo, setPhoto] = useState<PreparedHairPhoto | null>(null);
  const [consent, setConsent] = useState(false);
  const [guardianConfirmation, setGuardianConfirmation] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.previewUrl);
    };
  }, [photo]);

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
      setStep("questions");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "写真を保存できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "intro") {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-brand border border-line bg-white/95 p-6 text-center shadow-brand sm:p-10 md:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-green">
          <ClipboardCheck className="h-8 w-8" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green">Hair diagnosis</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">あなたの髪に合うケアを診断</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted sm:text-base">
          髪の写真を1枚アップロードした後、現在の髪質について11の質問に回答します。診断結果は質問回答だけで判定します。
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {[
            { icon: Camera, title: "写真を1枚", text: "髪全体が分かる写真" },
            { icon: ClipboardCheck, title: "11の質問", text: "現在の髪質を回答" },
            { icon: ShieldCheck, title: "安全に保存", text: "非公開でAI開発用に管理" }
          ].map((item) => (
            <div key={item.title} className="rounded-brand border border-line bg-soft p-4">
              <item.icon className="h-5 w-5 text-green" />
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted">{item.text}</p>
            </div>
          ))}
        </div>
        <Button type="button" size="lg" className="mt-9" onClick={() => setStep("photo")}>
          髪質診断をはじめる <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <DiagnosisSteps current={step === "photo" ? 1 : 2} />
      {step === "photo" ? (
        <PhotoDiagnosisPanel
          photo={photo}
          onPhoto={setPhoto}
          consent={consent}
          onConsent={setConsent}
          guardianConfirmation={guardianConfirmation}
          onGuardianConfirmation={setGuardianConfirmation}
          onContinue={uploadPhoto}
          submitting={submitting}
          error={error}
        />
      ) : diagnosisId ? (
        <DiagnosisForm diagnosisId={diagnosisId} />
      ) : null}
    </div>
  );
}
