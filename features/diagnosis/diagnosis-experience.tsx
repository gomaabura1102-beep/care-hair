"use client";

import { Camera, ClipboardList } from "lucide-react";
import { useState } from "react";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";
import { PhotoDiagnosisPanel } from "@/features/diagnosis/photo-diagnosis-panel";
import { cn } from "@/lib/utils";
import type { HairPhotoAnalysis } from "@/types/photo-diagnosis";

type DiagnosisMode = "question" | "photo";

const modes = [
  { id: "question", label: "質問のみで診断", icon: ClipboardList },
  { id: "photo", label: "髪の写真＋質問で診断", icon: Camera }
] as const;

export function DiagnosisExperience() {
  const [mode, setMode] = useState<DiagnosisMode>("question");
  const [photoAnalysis, setPhotoAnalysis] = useState<HairPhotoAnalysis | null>(null);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 rounded-brand border border-line bg-white/95 p-3 shadow-brand">
        <div className="grid gap-3 sm:grid-cols-2">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={cn(
                "flex min-h-14 items-center justify-center gap-3 rounded-[var(--radius-button)] border px-5 text-sm font-semibold transition",
                mode === item.id
                  ? "border-green bg-green text-white"
                  : "border-line bg-white text-ink hover:border-green hover:bg-soft"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "photo" && <PhotoDiagnosisPanel analysis={photoAnalysis} onAnalysis={setPhotoAnalysis} />}

      <DiagnosisForm photoAnalysis={mode === "photo" ? photoAnalysis : null} />
    </div>
  );
}
