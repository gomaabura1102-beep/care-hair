import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultContent } from "./result-content";

export const metadata: Metadata = {
  title: "診断結果",
  description: "Care Hairの髪質診断結果とおすすめ商品ランキングです。"
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center pt-[var(--header-height)]">
          <p className="text-sm text-muted">診断結果を読み込んでいます。</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
