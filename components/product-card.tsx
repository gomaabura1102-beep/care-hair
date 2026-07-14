import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { FadeIn } from "@/components/fade-in";
import { ProductRadarChart } from "@/components/product-radar-chart";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <FadeIn>
      <Link
        href={`/products/${product.id}`}
        className="group block overflow-hidden rounded-brand border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-brand"
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
        <div className="p-6">
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
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-snug">{product.name}</h3>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-green transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-3 text-sm text-muted">{product.feature}</p>
          <ProductRadarChart product={product} compact className="mt-5" />
          <p className="mt-5 font-semibold text-green">{product.price}</p>
        </div>
      </Link>
    </FadeIn>
  );
}
