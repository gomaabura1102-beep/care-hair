import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ReviewBoard } from "@/features/reviews/review-board";

export const metadata: Metadata = {
  title: "口コミ",
  description: "Care Hairで紹介している商品の口コミを確認・投稿できます。"
};

export default function ReviewsPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="Reviews"
            title="口コミ"
            lead="実際に使ってみた感想をもとに、商品選びの参考になる声をまとめています。投稿した口コミは、この端末のブラウザに保存されます。"
          />
          <ReviewBoard />
        </div>
      </section>
    </main>
  );
}
