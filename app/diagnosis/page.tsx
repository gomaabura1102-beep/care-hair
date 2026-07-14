import type { Metadata } from "next";
import { DiagnosisForm } from "@/features/diagnosis/diagnosis-form";

export const metadata: Metadata = {
  title: "髪質診断",
  description: "髪質、悩み、頭皮状態に答えて、自分に合うヘアケア商品を診断します。"
};

export default function DiagnosisPage() {
  return (
    <main className="noise min-h-screen pt-[var(--header-height)]">
      <section className="grid min-h-[calc(100vh-var(--header-height))] place-items-center px-3 py-12 sm:px-4">
        <DiagnosisForm />
      </section>
    </main>
  );
}
