"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Home, MessageCircle, ShoppingBag, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/diagnosis", label: "診断", icon: ClipboardList },
  { href: "/search", label: "商品", icon: ShoppingBag },
  { href: "/reviews", label: "口コミ", icon: MessageCircle },
  { href: "/mypage", label: "マイページ", icon: UserRound }
];

export function MobileNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-white/95 px-1 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(22,45,37,.08)] backdrop-blur md:hidden" aria-label="メインメニュー">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return <Link key={item.href} href={item.href} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-green" : "text-muted"}`} aria-current={active ? "page" : undefined}><item.icon className={`h-5 w-5 stroke-[1.7] ${active && item.href === "/" ? "fill-current" : ""}`} />{item.label}</Link>;
      })}
    </nav>
  );
}
