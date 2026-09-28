import Image from "next/image";
import type { Product } from "@/types/product";

type AffiliateProductImageProps = {
  product: Pick<Product, "affiliateUrl" | "id" | "name">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
};

const pngProductIds = new Set([
  "cow-moist-treatment",
  "minon-treatment",
  "the-answer-shampoo",
  "the-answer-treatment"
]);

function getProductImageSrc(productId: string) {
  const extension = pngProductIds.has(productId) ? "png" : "jpeg";
  return `/products/${productId}.${extension}`;
}

export function AffiliateProductImage({
  product,
  className = "",
  imageClassName = "",
  priority = false,
  sizes
}: AffiliateProductImageProps) {
  if (!product.affiliateUrl) return null;

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
        // Affiliate image URLs can return a blank tracking image. Keep the link,
        // while displaying the stable product photo bundled with this site.
        src={getProductImageSrc(product.id)}
        alt={`${product.name}の商品画像`}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-contain ${imageClassName}`}
      />
    </a>
  );
}
