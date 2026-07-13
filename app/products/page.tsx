import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "商品一覧",
  description: "Care Hairで紹介している市販シャンプー・トリートメントの一覧です。"
};

export default function ProductsPage() {
  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <SectionHeading
            eyebrow="Product list"
            title="商品一覧"
            lead="市販で買いやすい価格帯を中心に、髪質・悩み・頭皮状態に合わせて候補を整理しています。"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
