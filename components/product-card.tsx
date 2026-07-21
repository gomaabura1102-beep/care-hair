import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Card } from "@/components/ui/card";
import { getProductCareContent } from "@/data/product-care-content";
import { getProductInsight } from "@/data/product-insights";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const content = getProductCareContent(product);
  const insight = getProductInsight(product);

  return (
    <FadeIn>
      <Card as="article" interactive className="h-full overflow-hidden p-0">
        <Link href={`/products/${product.id}`} className="group flex h-full flex-col">
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
              {insight.hairTypes.slice(0, 2).map((tag) => (
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
                {content.recommendedFor.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-6">
              <p className="font-semibold text-green">{product.price}</p>
              <span className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-green px-5 text-sm font-semibold text-green transition group-hover:bg-green group-hover:text-white">
                詳しく見る <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </Card>
    </FadeIn>
  );
}
