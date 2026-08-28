"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/mypage");
        router.refresh();
      }}
    >
      <LogOut className="h-4 w-4" /> ログアウト
    </Button>
  );
}
