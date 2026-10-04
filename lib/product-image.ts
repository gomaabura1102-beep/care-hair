import type { OfficialProductImage, Product } from "@/types/product";

function host(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password && !parsed.port
      ? parsed.hostname : null;
  } catch { return null; }
}

/** Validation is defensive; metadata must still be supplied by an authorized operator/API. */
export function getOfficialProductImages(product: Pick<Product, "officialImages" | "affiliateUrl" | "amazonAffiliateUrl">) {
  return (product.officialImages ?? []).flatMap<OfficialProductImage & { href: string }>((image: OfficialProductImage) => {
    if (!image.itemId?.trim()) return [];
    const imageHost = host(image.url);
    const href = image.source === "amazon" ? product.amazonAffiliateUrl : product.affiliateUrl;
    if (!href) return [];
    const linkHost = host(href);
    if (image.source === "amazon" && image.obtainedVia === "amazon-associates-api"
      && imageHost === "m.media-amazon.com"
      && (linkHost === "amzn.to" || linkHost === "www.amazon.co.jp" || linkHost === "amazon.co.jp")) {
      return [{ ...image, href }];
    }
    if (image.source === "rakuten"
      && ((image.obtainedVia === "rakuten-ichiba-api" && imageHost === "thumbnail.image.rakuten.co.jp")
        || (image.obtainedVia === "rakuten-affiliate" && imageHost === "hbb.afl.rakuten.co.jp"))
      && linkHost === "hb.afl.rakuten.co.jp") {
      return [{ ...image, href }];
    }
    return [];
  });
}
