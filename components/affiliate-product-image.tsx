import type { Product } from "@/types/product";

type AffiliateProductImageProps = {
  product: Pick<Product, "name" | "rakutenImageHtml">;
};

export function AffiliateProductImage({ product }: AffiliateProductImageProps) {
  if (!product.rakutenImageHtml?.trim()) return null;

  return (
    <div className="mx-auto w-full max-w-[264px] overflow-x-auto bg-white">
      <p className="mb-2 text-center text-xs text-muted">PR・楽天市場</p>
      <iframe
        title={`${product.name}の楽天商品画像リンク`}
        srcDoc={product.rakutenImageHtml}
        width={264}
        height={280}
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        className="block border-0"
      />
    </div>
  );
}
