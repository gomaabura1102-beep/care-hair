"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "ログインできませんでした。");
      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "ログインできませんでした。");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-brand border border-line bg-white p-7 shadow-brand sm:p-10">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-green">
        <LockKeyhole className="h-6 w-6" />
      </span>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green">Care Hair My Page</p>
      <h1 className="mt-2 text-2xl font-semibold">マイページにログイン</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        Care Hair運営者専用です。管理者として登録されたメールアドレスとパスワードを入力してください。
      </p>
      <label className="mt-7 grid gap-2 text-sm font-semibold">
        メールアドレス
        <input name="email" type="email" autoComplete="username" required className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none focus:border-green" />
      </label>
      <label className="mt-4 grid gap-2 text-sm font-semibold">
        パスワード
        <input name="password" type="password" autoComplete="current-password" required className="min-h-12 rounded-brand border border-line px-4 font-normal outline-none focus:border-green" />
      </label>
      {error && <p className="mt-4 rounded-brand bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      <Button type="submit" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "確認しています..." : "ログイン"}
      </Button>
      <p className="mt-4 text-xs leading-6 text-muted">
        ログイン後に、これまで保存された診断写真・質問回答・診断結果を確認できます。
      </p>
    </form>
  );
}
