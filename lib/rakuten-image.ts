/** Use the product photo included in Rakuten's generated image link. */
export function getRakutenImageSrc(affiliateImageUrl?: string): string | undefined {
  if (!affiliateImageUrl) return undefined;

  try {
    const affiliate = new URL(affiliateImageUrl);
    if (affiliate.protocol !== "https:") return undefined;
    if (affiliate.hostname !== "hbb.afl.rakuten.co.jp" || !affiliate.pathname.startsWith("/hgb/")) {
      return undefined;
    }

    const photoUrl = affiliate.searchParams.get("pc");
    if (!photoUrl) return affiliate.href;
    const photo = new URL(photoUrl);
    if (
      photo.protocol === "https:" &&
      !photo.username && !photo.password && !photo.port &&
      ["image.rakuten.co.jp", "thumbnail.image.rakuten.co.jp"].includes(photo.hostname)
    ) {
      return photo.href;
    }
    return affiliate.href;
  } catch {
    return undefined;
  }
}
