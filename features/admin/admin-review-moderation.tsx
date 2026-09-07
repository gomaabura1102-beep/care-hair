"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminProductReview } from "@/lib/server/admin-data";

export function AdminReviewModeration({ review }: { review: AdminProductReview }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const update = async (status: "published" | "rejected") => {
    setSubmitting(true); setError("");
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "変更できませんでした。");
      router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "変更できませんでした。"); setSubmitting(false); }
  };
  return <div className="mt-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => update("published")} disabled={submitting || review.moderation_status === "published"} className="min-h-9 rounded-full bg-green px-4 text-xs font-semibold text-white disabled:opacity-40">公開する</button><button type="button" onClick={() => update("rejected")} disabled={submitting || review.moderation_status === "rejected"} className="min-h-9 rounded-full border border-line px-4 text-xs font-semibold disabled:opacity-40">公開しない</button></div>{error ? <p className="mt-2 text-xs font-semibold text-red-700">{error}</p> : null}</div>;
}
