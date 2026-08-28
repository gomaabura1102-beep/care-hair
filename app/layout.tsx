import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID ?? "G-3P4Z4240B8";

export const metadata: Metadata = {
  metadataBase: new URL("https://care-hair.vercel.app"),
  title: {
    default: "Care Hair | 男子高校生のためのヘアケア診断",
    template: "%s | Care Hair"
  },
  description:
    "Care Hairは、男子高校生が自分に合った市販シャンプー・トリートメントを見つけるためのヘアケア診断サービスです。",
  openGraph: {
    title: "Care Hair | 本当に合うヘアケアを。",
    description: "髪質・悩み・頭皮状態に合わせて、買いやすい市販ヘアケア商品を提案します。",
    type: "website",
    locale: "ja_JP"
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <GoogleAnalytics measurementId={googleAnalyticsId} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
