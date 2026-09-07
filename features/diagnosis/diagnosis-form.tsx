"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleHelp, CloudRain, Hand, RotateCcw, Ruler, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type CSSProperties, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { questions } from "@/data/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DIAGNOSIS_LOGIC_VERSION, getDiagnosisResult } from "@/lib/diagnosis";
import { saveLocalDiagnosisResult, savePendingDiagnosisContext } from "@/lib/user-state";
import type { PublicDiagnosis } from "@/types/diagnosis";

const formSchema = z.object({
  answers: z.array(z.array(z.number())).length(questions.length)
});

type FormValues = z.infer<typeof formSchema>;

type DiagnosisFormProps = {
  diagnosisId: string;
  mode: "questions" | "photo";
  currentProductId: string | null;
};

export function DiagnosisForm({ diagnosisId, mode, currentProductId }: DiagnosisFormProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const question = questions[current];
  const hasManualTitleBreak = question.title.includes("\n");
  const singleLineTitleMaxRem = Math.min(2.25, Math.max(0.95, 46 / question.title.length));
  const progress = ((current + 1) / questions.length) * 100;

  const defaultValues = useMemo<FormValues>(
    () => ({ answers: questions.map(() => []) }),
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const goNext = async () => {
    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const values = formSchema.parse(form.getValues());
      const localDiagnosis: PublicDiagnosis = {
        diagnosisId,
        result: getDiagnosisResult(values.answers),
        diagnosisLogicVersion: DIAGNOSIS_LOGIC_VERSION,
        createdAt: new Date().toISOString(),
        mode
      };
      saveLocalDiagnosisResult(localDiagnosis);
      savePendingDiagnosisContext({ diagnosisId, currentProductId, mode });
      router.push(`/result?id=${diagnosisId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "診断結果を計算できませんでした。");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-brand border border-line bg-white/95 p-4 shadow-brand sm:p-7 md:p-12">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
        <span>{current + 1} / {questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mb-7 h-2 overflow-hidden rounded-full bg-line" aria-label={`診断の進捗 ${Math.round(progress)}%`}>
        <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-7 flex items-center justify-end gap-4 text-sm text-muted">
        <button
          type="button"
          className="text-green underline-offset-4 hover:underline"
          onClick={() => {
            form.reset(defaultValues);
            setCurrent(0);
          }}
        >
          最初から
        </button>
      </div>

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">Diagnosis</p>
      <QuestionVisual questionId={question.id} />
      <h1
        className={cn(
          "jp-question-title max-w-full font-medium",
          hasManualTitleBreak
            ? "jp-question-title--manual"
            : "jp-question-title--single",
          question.id === "wet-stretch" && "jp-question-title--wet-stretch"
        )}
        style={
          hasManualTitleBreak
            ? undefined
            : ({ "--single-title-max": `${singleLineTitleMaxRem}rem` } as CSSProperties)
        }
      >
        {question.title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{question.hint}</p>

      <Controller
        control={form.control}
        name={`answers.${current}`}
        render={({ field }) => (
          <div className="mt-8 grid gap-3">
            {question.options.map((option, optionIndex) => {
              const selected = field.value.includes(optionIndex);

              return (
                <button
                  key={option.label}
                  type="button"
                  className={cn(
                    "min-h-16 rounded-brand border border-line bg-white px-5 py-4 text-left leading-7 transition duration-300 hover:-translate-y-0.5 hover:border-green hover:bg-soft sm:text-base",
                    selected && "border-green bg-sage/60"
                  )}
                  onClick={() => {
                    if (question.multiple) {
                      const noneIndex = question.options.findIndex((item) => item.label === "特にない");
                      const next = selected
                        ? field.value.filter((value) => value !== optionIndex)
                        : optionIndex === noneIndex
                          ? [optionIndex]
                          : [...field.value.filter((value) => value !== noneIndex), optionIndex];
                      field.onChange(next);
                      return;
                    }

                    field.onChange([optionIndex]);
                    window.setTimeout(goNext, 180);
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      />

      {submitError && (
        <p className="mt-6 rounded-brand bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{submitError}</p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrent((value) => Math.max(value - 1, 0))}
          disabled={current === 0 || submitting}
        >
          <ArrowLeft className="h-4 w-4" /> 戻る
        </Button>
        {question.multiple ? (
          <Button type="button" onClick={goNext} disabled={form.watch(`answers.${current}`).length === 0 || submitting}>
            {submitting ? "診断結果を計算しています..." : "診断結果を見る"} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-sm text-muted">回答すると自動で次へ進みます</span>
        )}
      </div>
    </div>
  );
}

function QuestionVisual({ questionId }: { questionId: string }) {
  const visual = questionVisuals[questionId] ?? { icon: CircleHelp, label: "普段の状態を思い出して答えてください" };
  return (
    <div className="mb-5 flex min-h-24 items-center gap-4 rounded-2xl border border-line bg-soft p-4" aria-hidden="true">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-green shadow-sm">
        <visual.icon className="h-7 w-7 stroke-[1.6]" />
      </span>
      <p className="text-sm font-semibold leading-6 text-muted">{visual.label}</p>
    </div>
  );
}

const questionVisuals: Record<string, { icon: typeof CircleHelp; label: string }> = {
  "hair-shape-paper": { icon: Sparkles, label: "白い紙の上で、髪の曲がり方を上から見ます" },
  touch: { icon: Hand, label: "根元から毛先へ、指をやさしく滑らせます" },
  body: { icon: Ruler, label: "抜けた髪の片側だけをつまみ、横向きにします" },
  "curl-memory": { icon: RotateCcw, label: "指に10秒巻き、外した直後の形を見ます" },
  "wet-stretch": { icon: Ruler, label: "無理に引っ張らず、試せない場合は『よく分からない』でOKです" },
  humidity: { icon: CloudRain, label: "雨の日や梅雨の髪を思い出してください" }
};
