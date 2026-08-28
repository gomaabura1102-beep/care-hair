import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/admin-login-form";
import { getAdminFromCookies } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "運営者ログイン", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getAdminFromCookies().catch(() => null);
  if (admin) redirect("/admin");
  return <main className="grid min-h-screen place-items-center bg-soft px-4 py-24"><AdminLoginForm /></main>;
}
