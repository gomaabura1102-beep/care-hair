"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";

type AffiliateProductImageProps = {
  product: Pick<Product, "affiliateUrl" | "affiliateImageUrl" | "id" | "name">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
};

export function AffiliateProductImage({
  product,
  className = "",
  imageClassName = "",
  priority = false,
  sizes
}: AffiliateProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const imageSrc = product.affiliateImageUrl;
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
      {imageSrc && failedSrc !== imageSrc ? <Image
        // Load the official affiliate image directly, without a local copy or proxy.
        src={imageSrc}
        alt={`${product.name}の商品画像`}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized
        onError={() => setFailedSrc(imageSrc)}
        onLoad={(event) => {
          // Some unavailable affiliate images return a successful 1px tracking image.
          if (event.currentTarget.naturalWidth <= 1 || event.currentTarget.naturalHeight <= 1) {
            setFailedSrc(imageSrc);
          }
        }}
        className={`object-contain ${imageClassName}`}
      /> : (
        <span className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center text-sm text-muted">
          <span>商品画像を表示できません</span>
          <span className="font-semibold text-green">楽天で商品を見る</span>
        </span>
      )}
    </a>
  );
}
