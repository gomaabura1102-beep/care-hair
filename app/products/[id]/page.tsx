import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductReviewForm } from "@/features/reviews/product-review-form";
import { ProductActions } from "@/features/products/product-actions";
import { products } from "@/data/products";
import { getProductCareContent } from "@/data/product-care-content";
import { getProductInsight } from "@/data/product-insights";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";
import { Star } from "lucide-react";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return { title: "商品詳細" };
  }

  return {
    title: product.name,
    description: product.feature,
    openGraph: {
      title: `${product.name} | Care Hair`,
      description: product.feature,
      images: [{ url: product.image }]
    }
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((item) => item.id === params.id);

  if (!product) notFound();

  const content = getProductCareContent(product);
  const insight = getProductInsight(product);

  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <div className="relative mx-auto aspect-[1/1.02] max-w-3xl overflow-hidden rounded-brand bg-white shadow-brand">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-8"
            />
          </div>

          <article className="mx-auto mt-12 max-w-4xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">
              {product.type === "shampoo" ? "Shampoo" : "Treatment"}
            </p>
            <h1 className="text-balance text-4xl font-medium leading-tight md:text-6xl">{product.name}</h1>

            <Card as="section" className="mt-10 md:p-8">
              <h2 className="text-2xl font-medium">こんな人におすすめ</h2>
              <ul className="mt-5 grid gap-3 text-muted sm:grid-cols-2">
                {content.recommendedFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card as="section" className="mt-8 bg-soft md:p-8">
              <CardEyebrow>Care Hair reason</CardEyebrow>
              <h2 className="mt-3 text-2xl font-medium">Care Hairがおすすめする理由</h2>
              <p className="mt-4 leading-8 text-muted">{content.recommendReason}</p>
            </Card>

            <Card as="section" className="mt-8 md:p-8">
              <h2 className="text-2xl font-medium">向いている人</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InfoBlock title="向いている髪質" items={insight.hairTypes} />
                <InfoBlock title="向いている悩み" items={insight.concerns} />
              </div>
            </Card>

            <Card as="section" className="mt-8 md:p-8">
              <h2 className="text-2xl font-medium">商品の特徴</h2>
              <div className="mt-6 grid gap-px overflow-hidden rounded-brand bg-line">
                {[
                  ["香り", content.features.scent],
                  ["洗い上がり", insight.washFeel],
                  ["仕上がり", content.features.finish],
                  ["泡立ち", content.features.foam]
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 bg-white p-5 md:grid-cols-[140px_1fr]">
                    <b className="text-green">{label}</b>
                    <span className="leading-7 text-muted">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card as="section" className="mt-8 md:p-8">
              <CardEyebrow>Amazon Customer Reviews</CardEyebrow>
              <h2 className="mt-3 text-2xl font-medium">Amazon口コミまとめ</h2>
              {insight.amazonReview ? (
                <>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex text-[#55a9da]" aria-label={`Amazon評価 ${insight.amazonReview.rating}点`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(insight.amazonReview?.rating ?? 0) ? "fill-current" : "opacity-30"}`}
                        />
                      ))}
                    </span>
                    <b>{insight.amazonReview.rating}</b>
                    <span className="text-muted">{insight.amazonReview.reviewCount.toLocaleString("ja-JP")}件</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Amazon.co.jpの商品ページを{insight.amazonReview.checkedAt.replaceAll("-", "/")}に確認。評価・件数は変動します。
                  </p>
                  {insight.amazonReview.reviewCount >= 10 ? (
                    <>
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-brand bg-soft p-5"><h3 className="font-semibold text-green">良かったという声</h3><p className="mt-3 leading-7 text-muted">{insight.amazonReview.goodSummary}</p></div>
                        <div className="rounded-brand bg-soft p-5"><h3 className="font-semibold text-green">気になったという声</h3><p className="mt-3 leading-7 text-muted">{insight.amazonReview.concernSummary}</p></div>
                      </div>
                      <p className="mt-4 text-xs leading-6 text-muted">Amazonのカスタマーレビューに見られる傾向をCare Hairが要約しています。口コミは個人の感想です。</p>
                    </>
                  ) : (
                    <p className="mt-5 rounded-brand bg-soft p-5 text-sm leading-7 text-muted">口コミ数が10件未満のため、傾向の要約はまだ表示していません。</p>
                  )}
                </>
              ) : (
                <div className="mt-5 rounded-brand bg-soft p-5">
                  <p className="leading-7 text-muted">
                    この商品はAmazonの評価と口コミをまだ確認できていません。仮の星や件数は表示していません。
                  </p>
                </div>
              )}
            </Card>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={insight.amazonReview?.sourceUrl ?? product.amazonUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg" })}>
                Amazonで詳しく見る
              </Link>
              <Link href="/search" className={buttonVariants({ variant: "outline" })}>
                条件検索へ
              </Link>
            </div>

            <ProductActions productId={product.id} />

            <ProductReviewForm defaultProductId={product.id} />
          </article>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-semibold text-green">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-soft px-3 py-1 text-sm text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
