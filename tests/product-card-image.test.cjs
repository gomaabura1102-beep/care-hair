const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const React = require("react");
const { create, act } = require("react-test-renderer");

// Transpile these small TS modules using the project's existing TypeScript dependency.
const root = path.resolve(__dirname, "..");
function load(relative) {
  const filename = path.join(root, relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS }
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (name) => {
    if (!name.startsWith("@/")) return require(name);
    const file = name.slice(2);
    return load(fs.existsSync(path.join(root, `${file}.tsx`)) ? `${file}.tsx` : `${file}.ts`);
  };
  new Function("require", "module", "exports", code)(localRequire, mod, mod.exports);
  return mod.exports;
}
const { ProductCardImage } = load("components/product-card-image.tsx");
const { isOfficialProductImage } = load("lib/product-image.ts");
const { products } = load("data/products.ts");
// Test-only URLs: never fetched or added to production product data.
const amazon = { source: "amazon", obtainedVia: "creators-api", itemId: "test-asin", url: "https://m.media-amazon.com/images/I/test.jpg", affiliateUrl: "https://www.amazon.co.jp/dp/TEST?tag=test-22" };
const rakuten = { source: "rakuten", obtainedVia: "rakuten-ichiba-api", itemId: "test:123", url: "https://thumbnail.image.rakuten.co.jp/test.jpg?_ex=240x240", affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/test/?pc=unchanged&tag=unchanged" };
const product = { id: "test", name: "テスト商品" };
const render = (props) => create(React.createElement(ProductCardImage, { product: { ...product, ...props } }));

test("missing images render an original non-clickable placeholder", () => {
  const view = render({});
  assert.match(JSON.stringify(view.toJSON()), /商品画像準備中/);
  assert.equal(view.root.findAllByType("img").length, 0);
  assert.equal(view.root.findAllByType("a").length, 0);
});
test("legacy affiliate image URL alone never authorizes an image", () => {
  const view = render({ affiliateImageUrl: "https://hbb.afl.rakuten.co.jp/hgb/test/?pc=secret" });
  assert.equal(view.root.findAllByType("img").length, 0);
});
test("all existing products remain usable without authorized image metadata", () => {
  assert.equal(products.length, 24);
  for (const p of products) {
    assert.ok(p.name && p.price && p.tags.length && p.amazonAffiliateUrl && p.affiliateUrl);
    assert.match(JSON.stringify(render(p).toJSON()), /商品画像準備中/);
  }
});
test("provider images retain their exact URLs and matching affiliate URLs", () => {
  for (const metadata of [amazon, rakuten]) {
    const view = render({ officialImages: [metadata] });
    assert.equal(view.root.findByType("img").props.src, metadata.url);
    assert.equal(view.root.findByType("a").props.href, metadata.affiliateUrl);
    act(() => view.root.findByType("img").props.onLoad({ currentTarget: { naturalWidth: 240, naturalHeight: 300 } }));
    assert.equal(view.root.findAllByType("img").length, 1);
  }
});
test("one image is displayed and failure switches both photo and link together", () => {
  const view = render({ officialImages: [amazon, rakuten] });
  assert.equal(view.root.findAllByType("img").length, 1);
  act(() => view.root.findByType("img").props.onError());
  assert.equal(view.root.findByType("img").props.src, rakuten.url);
  assert.equal(view.root.findByType("a").props.href, rakuten.affiliateUrl);
  act(() => view.root.findByType("img").props.onError());
  assert.equal(view.root.findAllByType("img").length, 0);
  assert.match(JSON.stringify(view.toJSON()), /商品画像準備中/);
});
test("a 1px response falls back without retrying indefinitely", () => {
  const view = render({ officialImages: [rakuten] });
  act(() => view.root.findByType("img").props.onLoad({ currentTarget: { naturalWidth: 1, naturalHeight: 1 } }));
  assert.equal(view.root.findAllByType("img").length, 0);
});
test("a new URL can load after the previous URL failed", () => {
  const view = render({ officialImages: [amazon] });
  act(() => view.root.findByType("img").props.onError());
  act(() => view.update(React.createElement(ProductCardImage, { product: { ...product, officialImages: [rakuten] } })));
  assert.equal(view.root.findByType("img").props.src, rakuten.url);
});
test("invalid URLs, unverified methods and provider mismatches are rejected", () => {
  for (const patch of [
    { url: "not-a-url" }, { url: "http://m.media-amazon.com/test.jpg" },
    { url: "https://m.media-amazon.com.evil.example/test.jpg" },
    { url: "https://user:pass@m.media-amazon.com/test.jpg" },
    { affiliateUrl: rakuten.affiliateUrl }, { obtainedVia: "scraped" }, { itemId: "" }
  ]) assert.equal(isOfficialProductImage({ ...amazon, ...patch }), false);
});
test("Rakuten generated HTML is preserved verbatim, outside the page styles", () => {
  const html = '<a href="https://example.com">test fixture</a>';
  const view = render({ rakutenImageHtml: html });
  assert.equal(view.root.findByType("iframe").props.srcDoc, html);
  assert.equal(view.root.findAllByType("img").length, 0);
});
