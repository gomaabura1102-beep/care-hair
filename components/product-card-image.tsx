"use client";

import { useState } from "react";
import { AffiliateProductImage } from "@/components/affiliate-product-image";
import { isOfficialProductImage } from "@/lib/product-image";
import type { Product } from "@/types/product";

export function ProductCardImage({ product }: { product: Product }) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const image = product.officialImages?.find((candidate) =>
    isOfficialProductImage(candidate) && !failedUrls.includes(candidate.url)
  );

  if (!image && product.rakutenImageHtml?.trim()) {
    return <AffiliateProductImage product={product} />;
  }

  const fail = () => {
    if (image) setFailedUrls((urls) => urls.includes(image.url) ? urls : [...urls, image.url]);
  };

  return (
    <div className="h-44 bg-white sm:h-48">
      {image ? (
        <a
          href={image.affiliateUrl}
          target="_blank"
          rel="nofollow noopener noreferrer sponsored"
          aria-label={`${product.name}を${image.source === "amazon" ? "Amazon" : "楽天"}で見る`}
          className="relative flex h-full items-center justify-center px-6 pb-7 pt-3"
        >
          {/* Keep the API-provided URL intact and load it without an image proxy. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${product.id}:${image.url}`}
            src={image.url}
            alt={`${product.name}の商品画像`}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            onError={fail}
            onLoad={(event) => {
              if (event.currentTarget.naturalWidth <= 1 || event.currentTarget.naturalHeight <= 1) fail();
            }}
            className="h-full w-full object-contain"
          />
          <span className="absolute bottom-2 text-[10px] text-muted">
            PR・{image.source === "amazon" ? "Amazon" : "楽天市場"}
          </span>
        </a>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-soft/50 text-muted">
          <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full border border-green/10 bg-secondary/50 text-xs font-medium tracking-wider text-green">CH</span>
          <span className="text-xs">商品画像準備中</span>
        </div>
      )}
    </div>
  );
}
