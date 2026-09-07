import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/features/admin/admin-login-form";
import { MyPageContent } from "@/features/mypage/my-page-content";
import { getAdminFromCookies } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "マイページ", description: "診断結果・お気に入り・使用中の商品を確認できます。" };
export const dynamic = "force-dynamic";

export default async function MyPage() {
  const admin = await getAdminFromCookies().catch(() => null);
  return (
    <main className="min-h-screen bg-soft pb-24 pt-[calc(var(--header-height)+3rem)] md:pb-16">
      <div className="mx-auto max-w-site px-4">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-green">My page</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">あなたのヘアケア記録</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">診断して終わりではなく、選んだ商品と使った後の変化を一か所で確認できます。</p>
        <div className="mt-9"><MyPageContent /></div>

        <section className="mt-12 border-t border-line pt-8">
          <details className="rounded-[20px] border border-line bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-green [&::-webkit-details-marker]:hidden"><ShieldCheck className="h-5 w-5" />Care Hair運営者はこちら</summary>
            <div className="mt-6 flex justify-center">
              {admin ? <div className="w-full max-w-md rounded-brand bg-secondary p-6 text-center"><p className="font-semibold">運営者としてログイン中です</p><Link href="/admin" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-green px-5 text-sm font-semibold text-white">診断データ管理へ</Link></div> : <AdminLoginForm />}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
