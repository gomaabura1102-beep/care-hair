"use client";

import { useState } from "react";
import { getOfficialProductImages } from "@/lib/product-image";
import type { Product } from "@/types/product";

type AffiliateProductImageProps = {
  product: Pick<Product, "officialImages" | "affiliateImageUrl" | "affiliateUrl" | "amazonAffiliateUrl" | "name">;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
};

export function AffiliateProductImage(props: AffiliateProductImageProps) {
  const images = getOfficialProductImages(props.product);
  // Reset failure state when a product or its supplied metadata changes.
  const identity = JSON.stringify([props.product.name, images]);
  return <ProductImageDisplay key={identity} {...props} images={images} />;
}

function ProductImageDisplay({ product, className = "", imageClassName = "", priority = false, sizes, images }: AffiliateProductImageProps & { images: ReturnType<typeof getOfficialProductImages> }) {
  const [failed, setFailed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const image = images.find((candidate) => !failed.includes(candidate.url));
  const placeholder = (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#eef6f2_0%,#f8faf8_100%)] text-muted">
      <svg aria-hidden="true" width="32" height="40" viewBox="0 0 32 40" fill="none" className="text-green/40">
        <path d="M11 7h10v6H11zM13 2h6v5h-6zM11 13h10c4 0 6 3 6 7v15c0 2-2 3-4 3H9c-2 0-4-1-4-3V20c0-4 2-7 6-7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 23h12M10 28h8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="text-xs">商品画像準備中</span>
    </div>
  );
  const fail = () => {
    if (image) setFailed((previous) => [...previous, image.url]);
    setLoaded(false);
  };
  return (
    <div className={`relative block overflow-hidden bg-white ${className}`}>
      {!loaded || !image ? placeholder : null}
      {image ? (
        <a href={image.href} target="_blank" rel="nofollow noopener noreferrer sponsored"
          aria-label={`${product.name}を${image.source === "amazon" ? "Amazon" : "楽天"}で見る`}
          data-image-source={image.source} className="absolute inset-0">
          {/* Provider URL is used unchanged; never proxy, download or infer it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={image.url} src={image.url} alt={`${product.name}の商品画像`}
            loading={priority ? "eager" : "lazy"} decoding="async" sizes={sizes}
            className={`absolute inset-0 h-full w-full object-contain ${loaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
            onError={fail} onLoad={(event) => {
              if (event.currentTarget.naturalWidth <= 1 || event.currentTarget.naturalHeight <= 1) fail();
              else setLoaded(true);
            }} />
          <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[10px] text-muted">
            PR · {image.source === "amazon" ? "Amazon" : "楽天"}
          </span>
        </a>
      ) : null}
    </div>
  );
}
