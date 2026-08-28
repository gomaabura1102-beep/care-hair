import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/admin-login-form";
import { getAdminFromCookies } from "@/lib/server/admin-auth";

export const metadata: Metadata = {
  title: "マイページログイン",
  description: "Care Hair運営者専用のマイページログインです。",
  robots: { index: false, follow: false }
};
export const dynamic = "force-dynamic";

export default async function MyPage() {
  const admin = await getAdminFromCookies().catch(() => null);
  if (admin) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-soft px-4 pb-20 pt-[calc(var(--header-height)+5rem)]">
      <AdminLoginForm />
    </main>
  );
}
