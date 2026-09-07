import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

const instagramUrl = "https://www.instagram.com/carehair.1203?igsh=ZmI3eXBtbTc2YnBs";

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-24 pt-12 text-sm text-muted md:pb-12">
      <div className="mx-auto flex max-w-site flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="block h-12 w-[132px]">
          <Image
            src="/care-hair-logo.png"
            alt="Care Hair"
            width={320}
            height={210}
            className="h-full w-full object-contain object-left"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about-recommendation" className="transition hover:text-green">診断の仕組み</Link>
          <Link href="/mypage" className="transition hover:text-green">マイページ</Link>
          <p>Hair care diagnosis for students.</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green transition hover:text-ink"
            aria-label="Care Hair公式Instagram"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
