import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { MyPageContent } from "@/features/mypage/my-page-content";

export const metadata: Metadata = {
  title: "マイページ",
  description: "Care Hairの使用開始日、再診断通知、診断履歴、ランキングを確認できます。"
};

export default function MyPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-soft py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="My page"
            title="続けて使うためのマイページ"
            lead="使い始めた日、再診断のタイミング、季節ごとのおすすめをまとめて確認できます。"
          />
          <MyPageContent />
        </div>
      </section>
    </main>
  );
}
