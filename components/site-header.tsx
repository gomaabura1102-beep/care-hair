"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useRef } from "react";

const links = [
  { href: "/", label: "ホーム", description: "トップページへ" },
  { href: "/diagnosis", label: "髪質診断", description: "11の質問で診断" },
  { href: "/search", label: "商品を探す", description: "髪質や悩みで検索" },
  { href: "/reviews", label: "口コミ", description: "みんなの感想を見る" },
  { href: "/compare", label: "商品を比較", description: "選んだ3商品を見比べる" },
  { href: "/mypage", label: "マイページ", description: "診断・お気に入り・使用記録" },
  { href: "/about-recommendation", label: "診断の仕組み", description: "おすすめ理由と限界" },
  { href: "/about", label: "Care Hairについて", description: "サービスへの想い" }
];

export function SiteHeader() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e5edf2] bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[var(--header-height)] max-w-site items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex h-[68px] w-[104px] items-center" aria-label="Care Hair ホーム">
          <Image
            src="/care-hair-logo.png"
            alt="Care Hair"
            width={508}
            height={378}
            priority
            className="h-[64px] w-auto object-contain object-left"
          />
        </Link>

        <details ref={menuRef} className="group">
          <summary
            className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full text-[#102d44] outline-none transition hover:bg-[#eff7fb] hover:text-[#55a9da] focus-visible:ring-2 focus-visible:ring-[#8dc8e8] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
            aria-label="メニュー"
          >
            <Menu className="h-7 w-7 stroke-[1.7] group-open:hidden" />
            <X className="hidden h-7 w-7 stroke-[1.7] group-open:block" />
          </summary>

          <div className="absolute inset-x-0 top-full hidden overflow-hidden border-b border-[#dfeaf0] bg-white px-4 pb-5 pt-3 shadow-[0_18px_36px_rgba(16,45,68,.12)] group-open:block">
            <div className="mx-auto grid max-h-[calc(100vh-var(--header-height)-2rem)] max-w-site gap-2 overflow-y-auto sm:grid-cols-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="group/menu-link flex min-h-16 items-center justify-between rounded-xl border border-[#e5edf2] bg-white px-4 transition hover:border-[#8dc8e8] hover:bg-[#f7fbfd]"
                >
                  <span>
                    <span className="block text-sm font-semibold text-[#15324a]">{link.label}</span>
                    <span className="mt-0.5 block text-[11px] text-[#71818d]">{link.description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#55a9da] transition group-hover/menu-link:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
