"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteDiagnosisButton({ diagnosisId }: { diagnosisId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    if (!window.confirm("写真・質問回答・診断ラベルを削除します。削除後は元に戻せません。よろしいですか？")) return;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/diagnoses/${diagnosisId}`, { method: "DELETE" });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "削除できませんでした。");
      router.push("/diagnosis");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "削除できませんでした。");
      setDeleting(false);
    }
  };

  return (
    <div className="mt-5">
      <button type="button" onClick={remove} disabled={deleting} className="text-xs text-muted underline underline-offset-4 hover:text-red-700 disabled:opacity-50">
        {deleting ? "削除しています..." : "この診断データと写真を削除する"}
      </button>
      {error && <p className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
