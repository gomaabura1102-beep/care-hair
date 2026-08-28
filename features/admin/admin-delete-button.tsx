"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminDeleteButton({ diagnosisId }: { diagnosisId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={deleting}
        className="border-red-300 text-red-700 hover:border-red-700 hover:bg-red-700"
        onClick={async () => {
          if (!window.confirm(`診断データ ${diagnosisId} とすべての画像を完全に削除します。元に戻せません。よろしいですか？`)) return;
          setDeleting(true);
          setError("");
          const response = await fetch(`/api/admin/diagnoses/${diagnosisId}`, { method: "DELETE" });
          const body = (await response.json()) as { error?: string };
          if (!response.ok) {
            setError(body.error ?? "削除できませんでした。");
            setDeleting(false);
            return;
          }
          router.push("/admin");
          router.refresh();
        }}
      >
        <Trash2 className="h-4 w-4" /> {deleting ? "削除しています..." : "診断データを削除"}
      </Button>
      {error && <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}
