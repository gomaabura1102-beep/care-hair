import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { FadeIn } from "@/components/fade-in";
import { getProductCareContent } from "@/data/product-care-content";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const content = getProductCareContent(product);

  return (
    <FadeIn>
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-brand border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-brand"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-green">
              {product.type === "shampoo" ? "シャンプー" : "トリートメント"}
            </span>
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-soft px-3 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold leading-snug">{product.name}</h3>
          <p className="mt-3 text-sm text-muted">{product.feature}</p>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm font-semibold text-green">こんな人におすすめ</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
              {content.recommendedFor.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-green">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto pt-6">
            <p className="font-semibold text-green">{product.price}</p>
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-green px-5 text-sm font-semibold text-green transition group-hover:bg-green group-hover:text-white">
              詳しく見る
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
