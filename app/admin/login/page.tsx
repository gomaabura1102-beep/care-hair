import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "運営者ログイン", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  redirect("/mypage");
}
