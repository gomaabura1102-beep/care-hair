"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const instagramUrl = "https://www.instagram.com/carehair.1203?igsh=ZmI3eXBtbTc2YnBs";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_.85fr]">
      <form className="rounded-brand border border-line bg-white p-5 shadow-brand sm:p-7" onSubmit={submit}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Contact form</p>
        <h2 className="mt-3 text-3xl font-medium">お問い合わせ</h2>
        <div className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            お名前
            <input
              name="name"
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
              placeholder="例: 山田 太郎"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            メールアドレス
            <input
              name="email"
              type="email"
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
              placeholder="example@example.com"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            内容
            <select
              name="category"
              className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none transition focus:border-green"
            >
              <option>サービスについて</option>
              <option>商品情報について</option>
              <option>口コミについて</option>
              <option>その他</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            メッセージ
            <textarea
              name="message"
              className="min-h-40 rounded-brand border border-line px-4 py-3 font-normal leading-7 outline-none transition focus:border-green"
              placeholder="お問い合わせ内容を入力してください"
              required
            />
          </label>
          <Button type="submit">
            <Mail className="h-4 w-4" />
            送信する
          </Button>
          {sent && <p className="text-sm text-green">送信内容を受け付けました。実運用時は送信先メールやフォームサービスと接続してください。</p>}
        </div>
      </form>

      <aside className="rounded-brand border border-line bg-soft p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">Instagram</p>
        <h2 className="mt-3 text-2xl font-medium">Care Hair公式Instagram</h2>
        <p className="mt-4 leading-7 text-muted">
          ヘアケアに関する情報やサービスの更新内容を、見やすくまとめて確認できます。
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-green px-5 text-sm font-semibold text-green transition hover:-translate-y-0.5 hover:bg-green hover:text-white"
        >
          <Instagram className="h-4 w-4" />
          Instagramを見る
        </a>
      </aside>
    </div>
  );
}
