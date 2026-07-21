"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/diagnosis", label: "診断" },
  { href: "/search", label: "検索" },
  { href: "/reviews", label: "口コミ" },
  { href: "/mypage", label: "マイページ" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-white/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-[var(--header-height)] max-w-site items-center justify-between px-4">
        <Link href="/" className="block h-12 w-[132px] sm:w-[154px]" onClick={() => setOpen(false)}>
          <Image
            src="/care-hair-logo.png"
            alt="Care Hair"
            width={320}
            height={210}
            priority
            className="h-full w-full object-contain object-left"
          />
        </Link>

        <div className="hidden items-center gap-7 text-sm text-ink/80 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-green">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
          aria-label="メニュー"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "mx-4 mb-3 hidden rounded-brand border border-line bg-white p-2 shadow-brand md:hidden",
          open && "block"
        )}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-brand px-4 py-3 text-sm hover:bg-soft"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
