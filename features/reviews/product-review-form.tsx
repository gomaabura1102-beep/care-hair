"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";
import { concernOptions, hairTypeOptions, type ReviewHairType } from "@/data/review-form-options";
import { products } from "@/data/products";

type ProductReviewFormProps = { defaultProductId?: string };

export function ProductReviewForm({ defaultProductId }: ProductReviewFormProps) {
  const [hairType, setHairType] = useState<ReviewHairType>("normal");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.get("name"), ageGroup: formData.get("ageGroup"), hairType, concerns,
          productId: formData.get("productId"), usagePeriod: formData.get("usagePeriod"), rating,
          positive: formData.get("good"), negative: formData.get("concern"), fragrance: formData.get("fragrance"),
          finish: formData.get("finish"), useAgain: formData.get("useAgain")
        })
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "口コミを送信できませんでした。");
      setMessage("口コミを受け付けました。内容確認後に公開されます。");
      setConcerns([]);
      setRating(4);
      form.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "口コミを送信できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleConcern = (concern: string) => setConcerns((current) => current.includes(concern) ? current.filter((item) => item !== concern) : [...current, concern]);

  return (
    <Card as="section" className="mt-8">
      <CardEyebrow>Review</CardEyebrow><h2 className="mt-3 text-3xl font-medium">口コミを入力する</h2>
      <p className="mt-3 text-sm leading-7 text-muted">メールアドレスや本名は入力しないでください。投稿は内容を確認してから公開します。</p>
      <form className="mt-7 grid gap-5" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ニックネーム"><input name="name" className={inputClass} placeholder="例: 高2・R" required maxLength={30} /></Field>
          <Field label="年代"><select name="ageGroup" className={inputClass} required><option value="中学生">中学生</option><option value="高校生">高校生</option><option value="大学生以上">大学生以上</option></select></Field>
          <Field label="髪質"><select name="hairType" value={hairType} onChange={(event) => setHairType(event.target.value as ReviewHairType)} className={inputClass}>{hairTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
          <Field label="使用した商品"><select name="productId" defaultValue={defaultProductId} className={inputClass} required>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></Field>
          <Field label="使用期間"><select name="usagePeriod" className={inputClass}><option>1週間未満</option><option>1〜2週間</option><option>3週間〜1か月</option><option>1か月以上</option></select></Field>
          <Field label="香り"><select name="fragrance" className={inputClass}><option>好き</option><option>普通</option><option>苦手</option></select></Field>
          <Field label="仕上がり"><select name="finish" className={inputClass}><option>軽い</option><option>ちょうどよい</option><option>重い</option><option>よく分からない</option></select></Field>
          <Field label="また使いたい"><select name="useAgain" className={inputClass}><option>はい</option><option>まだ分からない</option><option>いいえ</option></select></Field>
        </div>

        <fieldset className="rounded-brand border border-line p-4"><legend className="px-2 text-sm font-semibold">髪の悩み（複数可）</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{concernOptions.map((concern) => <label key={concern} className="flex items-center gap-3 text-sm text-muted"><input type="checkbox" checked={concerns.includes(concern)} onChange={() => toggleConcern(concern)} className="h-4 w-4 accent-green" />{concern}</label>)}</div></fieldset>
        <fieldset className="rounded-brand border border-line p-4"><legend className="px-2 text-sm font-semibold">総合評価</legend><div className="mt-3 flex gap-2">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} className={`h-11 w-11 rounded-full border text-lg ${value <= rating ? "border-green bg-green text-white" : "border-line text-muted"}`} aria-label={`${value}点`}>★</button>)}</div></fieldset>
        <Field label="良かったところ"><textarea name="good" className={`${inputClass} min-h-28 py-3`} required maxLength={1000} /></Field>
        <Field label="気になったところ"><textarea name="concern" className={`${inputClass} min-h-28 py-3`} required maxLength={1000} /></Field>
        <Button type="submit" disabled={submitting}>{submitting ? "送信しています..." : "口コミを送信する"}</Button>
        {message ? <p className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-green" role="status">{message}</p> : null}
        {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
      </form>
    </Card>
  );
}

const inputClass = "min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal outline-none transition focus:border-green";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-semibold">{label}{children}</label>; }
