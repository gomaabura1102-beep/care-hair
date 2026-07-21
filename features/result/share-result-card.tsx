"use client";

import { Copy, LineChart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";

type ShareResultCardProps = {
  hairBody: string;
  hairShape: string;
  shampoo: string;
  treatment: string;
};

export function ShareResultCard({ hairBody, hairShape, shampoo, treatment }: ShareResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const shareText = `Care Hairで診断したら「${hairBody} × ${hairShape}」タイプでした。おすすめは ${shampoo} / ${treatment}。`;

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const copyUrl = async () => {
    const text = `${shareText}\n${shareUrl || window.location.href}`;
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card as="section" className="mt-6 border-accent/30 bg-secondary">
      <div className="grid gap-6 md:grid-cols-[1fr_.8fr] md:items-center">
        <div>
          <CardEyebrow>Share</CardEyebrow>
          <h2 className="mt-3 text-2xl font-semibold">診断結果をシェアする</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            「あなたは{hairBody} × {hairShape}タイプでした！」として、URL付きで共有できます。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={copyUrl}>
              <Copy className="h-4 w-4" /> {copied ? "コピーしました" : "URLをコピー"}
            </Button>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-green px-6 py-3 text-sm font-medium text-green transition hover:-translate-y-0.5 hover:bg-green hover:text-white"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Share2 className="h-4 w-4" /> Xで共有
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-green"
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> LINEで共有
            </a>
          </div>
        </div>
        <div className="rounded-brand border border-line bg-white p-5">
          <div className="flex items-center gap-3 text-green">
            <LineChart className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.18em]">Care Hair Result</span>
          </div>
          <p className="mt-5 text-2xl font-semibold leading-snug">
            あなたは
            <br />
            {hairBody} × {hairShape}
          </p>
          <div className="mt-5 grid gap-2 text-sm text-muted">
            <p>シャンプー: {shampoo}</p>
            <p>トリートメント: {treatment}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
