"use client";

import { AlertCircle, ChevronUp, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  AiExplanation,
  AiExplanationBudget,
  AiExplanationContext,
  AiExplanationResponse
} from "@/types/ai-explanation";

type AiWhyRecommendedProps = {
  productId: string;
  context: AiExplanationContext;
};

const budgetOptions: Array<Exclude<AiExplanationBudget, "">> = [
  "1500円まで",
  "2000円まで",
  "3000円まで",
  "予算は気にしない"
];

export function AiWhyRecommended({ productId, context }: AiWhyRecommendedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [additionalConcern, setAdditionalConcern] = useState("");
  const [budget, setBudget] = useState<AiExplanationBudget>("");
  const [explanation, setExplanation] = useState<AiExplanation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => () => requestController.current?.abort(), []);

  const askAi = async () => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setLoading(true);
    setError("");
    setExplanation(null);

    try {
      const response = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          productId,
          diagnosisId: context.diagnosisId,
          scores: context.scores,
          currentProductId: context.currentProductId,
          budget: budget || null,
          additionalConcern: additionalConcern.trim()
        })
      });
      const body = (await response.json()) as Partial<AiExplanationResponse> & { error?: string };

      if (!response.ok || !body.explanation) {
        throw new Error(body.error ?? "AI説明を作成できませんでした。時間をおいてもう一度お試しください。");
      }

      setExplanation(body.explanation);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "AI説明を作成できませんでした。時間をおいてもう一度お試しください。"
      );
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setLoading(false);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-green bg-white px-4 text-sm font-semibold text-green transition hover:bg-secondary"
        aria-expanded="false"
      >
        <Sparkles className="h-4 w-4" /> AIで「なぜおすすめ？」を聞く
      </button>
    );
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">AIにもう少し詳しく聞く</p>
          <p className="mt-1 text-xs leading-5 text-muted">診断結果と選定済みのこの商品だけを使って説明します。</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-white hover:text-green"
          aria-label="AI説明の入力欄を閉じる"
          aria-expanded="true"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-4 block text-xs font-semibold text-ink">
        追加で相談したいこと（任意）
        <textarea
          value={additionalConcern}
          onChange={(event) => setAdditionalConcern(event.target.value)}
          maxLength={300}
          rows={3}
          placeholder="例：朝は広がるけど、重い仕上がりは苦手"
          className="mt-2 w-full resize-y rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-normal leading-6 text-ink outline-none transition placeholder:text-muted/70 focus:border-green"
        />
      </label>
      <p className="mt-1 text-right text-[11px] text-muted">{additionalConcern.length} / 300</p>

      <label className="mt-3 block text-xs font-semibold text-ink">
        予算（任意）
        <select
          value={budget}
          onChange={(event) => setBudget(event.target.value as AiExplanationBudget)}
          className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-normal text-ink outline-none transition focus:border-green"
        >
          <option value="">選択しない</option>
          {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>

      <button
        type="button"
        onClick={askAi}
        disabled={loading}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "理由を考えています..." : "自分に合う理由をAIに聞く"}
      </button>
      <p className="mt-2 text-[11px] leading-5 text-muted">入力内容は説明の生成にだけ使い、このサイトには保存しません。</p>

      <div aria-live="polite" aria-busy={loading}>
        {error ? (
          <p className="mt-4 flex gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-semibold leading-5 text-red-700" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </p>
        ) : null}

        {explanation ? (
          <div className="mt-5 rounded-xl border border-green/20 bg-white p-4 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green">AI explanation</p>
            <h4 className="mt-2 text-base font-semibold leading-6 text-ink">{explanation.headline}</h4>
            <p className="mt-3 text-sm leading-7 text-muted">{explanation.explanation}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold text-ink">合いやすい理由</p>
              <ol className="mt-2 grid gap-2 text-xs leading-6 text-muted">
                {explanation.reasons.map((reason, index) => (
                  <li key={`${index}-${reason}`} className="grid grid-cols-[22px_1fr] gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-[10px] font-bold text-green">{index + 1}</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 rounded-lg bg-soft p-3">
              <p className="text-xs font-semibold text-ink">注意点</p>
              <p className="mt-1 text-xs leading-6 text-muted">{explanation.caution}</p>
            </div>

            <div className="mt-4 border-t border-line pt-3">
              <p className="text-xs font-semibold text-green">もう少し教えてください</p>
              <p className="mt-1 text-xs leading-6 text-ink">{explanation.followUpQuestion}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
