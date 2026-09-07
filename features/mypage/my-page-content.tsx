"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CalendarDays, ChevronRight, Clock3, Heart, History, PackageCheck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Card, CardEyebrow } from "@/components/ui/card";
import { products } from "@/data/products";
import { UsagePhotoRecord } from "@/features/mypage/usage-photo-record";
import { saveUsageFeedback, useCareHairState } from "@/lib/user-state";
import type { UsageRecord } from "@/types/user-state";

export function MyPageContent() {
  const { state, hydrated } = useCareHairState();
  const latest = state.diagnoses[0];
  const favorites = state.favoriteProductIds.map(findProduct).filter(Boolean);
  const recent = state.recentlyViewedProductIds.map(findProduct).filter(Boolean).slice(0, 4);

  if (!hydrated) return <div className="rounded-[20px] border border-line bg-white p-8 text-sm text-muted">マイページを読み込んでいます。</div>;

  return (
    <div className="grid gap-8">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <Card as="section" className="bg-[#173f35] text-white">
          <CardEyebrow className="text-white/60">Latest diagnosis</CardEyebrow>
          {latest ? (
            <>
              <p className="mt-4 text-sm text-white/65">{formatDate(latest.createdAt)}</p>
              <h2 className="mt-3 text-3xl font-semibold">{latest.labels.hairBody}</h2>
              <p className="mt-2 text-lg text-white/80">{latest.labels.hairShape}・{latest.labels.condition}</p>
              <Link href={`/result?id=${latest.diagnosisId}`} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#173f35]">結果をもう一度見る <ChevronRight className="h-4 w-4" /></Link>
            </>
          ) : (
            <EmptyState title="診断履歴はまだありません" text="最初の診断をすると、結果とおすすめ商品がこの端末に保存されます。" href="/diagnosis" action="無料で診断する" light />
          )}
        </Card>

        <Card as="section">
          <div className="flex items-center gap-3"><PackageCheck className="h-6 w-6 text-green" /><h2 className="text-xl font-semibold">使用中の商品</h2></div>
          {state.usages.filter((usage) => !usage.feedback).length ? (
            <div className="mt-5 grid gap-4">{state.usages.filter((usage) => !usage.feedback).slice(0, 2).map((usage) => <UsageCard key={usage.id} usage={usage} />)}</div>
          ) : <EmptyState title="使用中の商品はありません" text="商品詳細の「この商品を使い始める」から記録できます。" href="/search" action="商品を探す" />}
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3"><Heart className="h-6 w-6 text-green" /><div><p className="text-xs font-bold uppercase tracking-[.16em] text-green">Favorites</p><h2 className="mt-1 text-2xl font-semibold">お気に入り</h2></div></div>
        {favorites.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{favorites.map((product) => <ProductCard key={product!.id} product={product!} />)}</div> : <EmptyPanel title="お気に入りはまだありません" text="商品カードのハートを押すと、ここでいつでも見返せます。" />}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card as="section">
          <div className="flex items-center gap-3"><History className="h-6 w-6 text-green" /><h2 className="text-xl font-semibold">診断履歴</h2></div>
          {state.diagnoses.length ? <div className="mt-5 grid gap-3">{state.diagnoses.map((item) => <Link key={item.diagnosisId} href={`/result?id=${item.diagnosisId}`} className="flex items-center justify-between gap-4 rounded-xl border border-line p-4 transition hover:border-green"><span><span className="block text-sm font-semibold">{item.labels.hairBody} × {item.labels.hairShape}</span><span className="mt-1 block text-xs text-muted">{formatDate(item.createdAt)}・{item.mode === "photo" ? "写真＋質問" : "質問のみ"}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-green" /></Link>)}</div> : <EmptyPanel title="履歴はまだありません" text="診断を完了すると表示されます。" />}
        </Card>

        <Card as="section">
          <div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-green" /><h2 className="text-xl font-semibold">使用履歴</h2></div>
          {state.usages.length ? <div className="mt-5 grid gap-3">{state.usages.map((usage) => { const product = findProduct(usage.productId); return <div key={usage.id} className="rounded-xl border border-line p-4"><p className="font-semibold">{product?.name ?? "商品情報なし"}</p><p className="mt-1 text-xs text-muted">開始日 {formatDate(usage.startDate)}</p><p className="mt-2 text-sm text-green">{usage.feedback ? "使用後の記録あり" : "使用中"}</p></div>; })}</div> : <EmptyPanel title="使用履歴はまだありません" text="使い始めた商品と開始日がここに残ります。" />}
        </Card>
      </section>

      {recent.length ? (
        <section><div className="mb-5 flex items-center gap-3"><Clock3 className="h-6 w-6 text-green" /><h2 className="text-2xl font-semibold">最近見た商品</h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{recent.map((product) => <ProductCard key={product!.id} product={product!} />)}</div></section>
      ) : null}

      <div className="rounded-[20px] border border-line bg-soft p-5 text-xs leading-6 text-muted">診断履歴・お気に入り・使用記録は、このブラウザの端末内に保存されます。ブラウザのデータを削除した場合や別の端末では引き継がれません。診断写真は、同意した写真診断の場合だけ非公開の運営用保存領域へ送信されます。</div>
    </div>
  );
}

function UsageCard({ usage }: { usage: UsageRecord }) {
  const product = findProduct(usage.productId);
  const [open, setOpen] = useState(false);
  const elapsedDays = Math.max(0, Math.floor((Date.now() - new Date(usage.startDate).getTime()) / 86400000));
  const due = elapsedDays >= 14;

  return (
    <div className="rounded-xl border border-line p-4">
      <p className="font-semibold">{product?.name ?? "商品情報なし"}</p>
      <p className="mt-1 text-xs text-muted">使用開始から{elapsedDays}日</p>
      {due ? <button type="button" onClick={() => setOpen((value) => !value)} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-green px-4 text-xs font-semibold text-white"><RotateCcw className="h-4 w-4" />使ってみてどうでしたか？</button> : <p className="mt-3 text-xs leading-6 text-muted">14日後を目安に使用感を記録できます。</p>}
      {open ? <FeedbackForm usageId={usage.id} onDone={() => setOpen(false)} /> : null}
      <details className="mt-4 rounded-xl bg-soft p-3">
        <summary className="cursor-pointer text-xs font-semibold text-green">使用前・使用後の写真を記録</summary>
        <UsagePhotoRecord usageId={usage.id} />
      </details>
    </div>
  );
}

function FeedbackForm({ usageId, onDone }: { usageId: string; onDone: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const score = (name: string) => Number(form.get(name) ?? 3);
    saveUsageFeedback(usageId, { manageability: score("manageability"), frizz: score("frizz"), dryness: score("dryness"), fragrance: score("fragrance"), washFeel: score("washFeel"), continueUse: String(form.get("continueUse") ?? "maybe") as "yes" | "maybe" | "no", note: String(form.get("note") ?? "") });
    onDone();
  };
  return <form onSubmit={submit} className="mt-4 grid gap-3 border-t border-line pt-4">{[["manageability","扱いやすさ"],["frizz","広がりにくさ"],["dryness","乾燥しにくさ"],["fragrance","香り"],["washFeel","洗い心地"]].map(([name,label]) => <label key={name} className="grid grid-cols-[1fr_90px] items-center gap-3 text-xs font-semibold">{label}<select name={name} defaultValue="3" className="min-h-10 rounded-lg border border-line bg-white px-2 font-normal">{[1,2,3,4,5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>)}<label className="grid gap-2 text-xs font-semibold">使い続けたいですか？<select name="continueUse" defaultValue="maybe" className="min-h-10 rounded-lg border border-line bg-white px-3 font-normal"><option value="yes">はい</option><option value="maybe">まだ分からない</option><option value="no">いいえ</option></select></label><label className="grid gap-2 text-xs font-semibold">メモ（任意）<textarea name="note" className="min-h-20 rounded-lg border border-line p-3 font-normal" maxLength={500} /></label><button className="min-h-11 rounded-full bg-green px-4 text-sm font-semibold text-white">記録する</button></form>;
}

function EmptyState({ title, text, href, action, light = false }: { title: string; text: string; href: string; action: string; light?: boolean }) { return <div className="mt-5"><h2 className="text-xl font-semibold">{title}</h2><p className={`mt-3 text-sm leading-7 ${light ? "text-white/70" : "text-muted"}`}>{text}</p><Link href={href} className={`mt-5 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold ${light ? "bg-white text-[#173f35]" : "border border-green text-green"}`}>{action}</Link></div>; }
function EmptyPanel({ title, text }: { title: string; text: string }) { return <div className="mt-5 rounded-xl border border-dashed border-line bg-soft p-6 text-center"><p className="font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted">{text}</p></div>; }
function findProduct(id: string) { return products.find((product) => product.id === id); }
function formatDate(value: string) { return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value)); }
