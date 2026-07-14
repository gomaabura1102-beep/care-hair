import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { products } from "@/data/products";
import { buttonVariants } from "@/components/ui/button";
import { ProductRadarChart } from "@/components/product-radar-chart";

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

  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-site gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="relative aspect-[1/1.08] overflow-hidden rounded-brand bg-white shadow-brand lg:sticky lg:top-28">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-8"
            />
          </div>

          <article>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-green">
              {product.type === "shampoo" ? "Shampoo" : "Treatment"}
            </p>
            <h1 className="text-balance text-4xl font-medium leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-6 text-lg leading-8 text-muted">{product.feature}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-green">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-brand border border-line bg-line">
              {[
                ["おすすめポイント", product.point],
                ["向いている髪質", product.fit],
                ["価格", product.price],
                ["香り", product.scent],
                ["使用感", product.texture],
                ["成分傾向", product.ingredients],
                ["口コミ傾向", product.review]
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 bg-white p-5 md:grid-cols-[150px_1fr]">
                  <b className="text-green">{label}</b>
                  <span className="text-muted">{value}</span>
                </div>
              ))}
            </div>

            <ProductRadarChart product={product} className="mt-8 shadow-brand" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={product.amazonUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
                Amazonで探す <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href="/products" className={buttonVariants({ variant: "outline" })}>
                一覧へ戻る
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
