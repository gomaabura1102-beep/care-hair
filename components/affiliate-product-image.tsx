import Image from "next/image";
import type { Product } from "@/types/product";

type AffiliateProductImageProps = {
  product: Pick<Product, "affiliateImageUrl" | "affiliateUrl" | "name">;
  className?: string;
  imageClassName?: string;
  sizes: string;
};

export function AffiliateProductImage({
  product,
  className = "",
  imageClassName = "",
  sizes
}: AffiliateProductImageProps) {
  if (!product.affiliateUrl || !product.affiliateImageUrl) return null;

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="nofollow noopener noreferrer sponsored"
      aria-label={`${product.name}を楽天で見る`}
      className={`relative block overflow-hidden bg-white ${className}`}
    >
      <span className="absolute right-2 top-2 z-10 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-wide text-muted shadow-sm">
        PR
      </span>
      <Image
        src={product.affiliateImageUrl}
        alt={`${product.name}の商品画像`}
        fill
        sizes={sizes}
        className={`object-contain ${imageClassName}`}
      />
    </a>
  );
}
