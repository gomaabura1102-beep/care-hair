import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ReviewPageContent } from "@/features/reviews/review-page-content";

export const metadata: Metadata = {
  title: "口コミ",
  description: "Care Hairを使用した人の口コミを掲載しています。"
};

export default function ReviewsPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="Reviews"
            title="口コミ"
            lead="Care Hairを使った人の感想を、髪質や悩みとあわせて確認できます。自分に近い髪質の声を参考にしてください。"
          />
          <ReviewPageContent />
        </div>
      </section>
    </main>
  );
}
