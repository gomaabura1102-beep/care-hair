"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type CSSProperties, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { questions } from "@/data/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  answers: z.array(z.array(z.number())).length(questions.length)
});

type FormValues = z.infer<typeof formSchema>;

type DiagnosisFormProps = {
  diagnosisId: string;
};

export function DiagnosisForm({ diagnosisId }: DiagnosisFormProps) {
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
      const response = await fetch(`/api/diagnoses/${diagnosisId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.getValues())
      });
      const body = (await response.json()) as { diagnosisId?: string; error?: string };
      if (!response.ok || !body.diagnosisId) throw new Error(body.error ?? "診断結果を保存できませんでした。");
      router.push(`/result?id=${body.diagnosisId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "診断結果を保存できませんでした。");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-brand border border-line bg-white/95 p-4 shadow-brand sm:p-7 md:p-12">
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-line" aria-label="診断の進捗">
        <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-8 flex items-center justify-between gap-4 text-sm text-muted">
        <span>
          {current + 1} / {questions.length}
        </span>
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
            {submitting ? "診断結果を保存しています..." : "診断結果を見る"} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-sm text-muted">回答すると自動で次へ進みます</span>
        )}
      </div>
    </div>
  );
}
