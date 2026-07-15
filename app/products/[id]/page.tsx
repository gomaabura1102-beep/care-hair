import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { getProductCareContent } from "@/data/product-care-content";
import { buttonVariants } from "@/components/ui/button";
import { ProductReviewForm } from "@/features/reviews/product-review-form";

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

            <div className="mt-10 rounded-brand border border-line bg-white p-6 md:p-8">
              <h2 className="text-2xl font-medium">こんな人におすすめ</h2>
              <ul className="mt-5 grid gap-3 text-muted sm:grid-cols-2">
                {content.recommendedFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span className="text-green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-brand bg-soft p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Care Hair reason</p>
              <h2 className="mt-3 text-2xl font-medium">Care Hairがおすすめする理由</h2>
              <p className="mt-4 leading-8 text-muted">{content.recommendReason}</p>
            </div>

            <div className="mt-8 rounded-brand border border-line bg-white p-6 md:p-8">
              <h2 className="text-2xl font-medium">商品の特徴</h2>
              <div className="mt-6 grid gap-px overflow-hidden rounded-brand bg-line">
                {[
                  ["香り", content.features.scent],
                  ["仕上がり", content.features.finish],
                  ["泡立ち", content.features.foam]
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 bg-white p-5 md:grid-cols-[140px_1fr]">
                    <b className="text-green">{label}</b>
                    <span className="leading-7 text-muted">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-brand border border-line bg-white p-6 md:p-8">
              <h2 className="text-2xl font-medium">口コミまとめ</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-brand bg-soft p-5">
                  <h3 className="font-semibold text-green">良かったという声</h3>
                  <p className="mt-3 leading-7 text-muted">{content.reviewSummary.good}</p>
                </div>
                <div className="rounded-brand bg-soft p-5">
                  <h3 className="font-semibold text-green">気になったという声</h3>
                  <p className="mt-3 leading-7 text-muted">{content.reviewSummary.concern}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={product.amazonUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg" })}>
                Amazonで詳しく見る
              </Link>
              <Link href="/products" className={buttonVariants({ variant: "outline" })}>
                一覧へ戻る
              </Link>
            </div>

            <ProductReviewForm />
          </article>
        </div>
      </section>
    </main>
  );
}
