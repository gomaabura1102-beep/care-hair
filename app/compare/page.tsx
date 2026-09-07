import type { Metadata } from "next";
import { CompareProducts } from "@/features/compare/compare-products";

export const metadata: Metadata = {
  title: "商品を比較",
  description: "選んだヘアケア商品を最大3つまで、価格・仕上がり・髪質との相性で比較できます。"
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-soft pb-24 pt-[calc(var(--header-height)+3rem)] md:pb-16">
      <div className="mx-auto max-w-site px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Compare</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">迷った商品を、並べて比べる。</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">最大3商品まで比較できます。診断済みの場合は、最新の回答との相性も表示します。</p>
        <CompareProducts />
      </div>
    </main>
  );
}
