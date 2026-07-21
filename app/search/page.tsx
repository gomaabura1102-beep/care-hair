import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ProductSearch } from "@/features/search/product-search";

export const metadata: Metadata = {
  title: "条件から探す",
  description: "髪質・悩み・香り・ブランド・価格帯からCare Hairの商品候補を探せます。"
};

export default function SearchPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="bg-soft py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="Search"
            title="条件から、自分に近い商品を探す。"
            lead="診断結果を補助するための検索ページです。髪質や悩みを入れて、候補を絞り込めます。"
          />
          <ProductSearch />
        </div>
      </section>
    </main>
  );
}
