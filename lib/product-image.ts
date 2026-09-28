import type { OfficialProductImage } from "@/types/product";

// Validate registered URLs without extracting, rewriting, or fetching them.
export function isOfficialProductImage(image: OfficialProductImage): boolean {
  try {
    const photo = new URL(image.url);
    const link = new URL(image.affiliateUrl);
    if (!image.itemId?.trim() || [photo, link].some((url) =>
      url.protocol !== "https:" || url.username || url.password || url.port
    )) return false;

    if (image.source === "amazon" && image.obtainedVia === "creators-api") {
      return ["m.media-amazon.com", "images-na.ssl-images-amazon.com", "images-fe.ssl-images-amazon.com"].includes(photo.hostname)
        && ["www.amazon.co.jp", "amazon.co.jp", "amzn.to"].includes(link.hostname);
    }
    if (image.source === "rakuten" && image.obtainedVia === "rakuten-ichiba-api") {
      return ["image.rakuten.co.jp", "thumbnail.image.rakuten.co.jp"].includes(photo.hostname)
        && link.hostname === "hb.afl.rakuten.co.jp";
    }
    return false;
  } catch {
    return false;
  }
}
