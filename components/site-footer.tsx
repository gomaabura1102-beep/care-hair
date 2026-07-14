import Link from "next/link";
import { Instagram } from "lucide-react";

const instagramUrl = "https://www.instagram.com/carehair.1203?igsh=ZmI3eXBtbTc2YnBs";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-12 text-sm text-muted">
      <div className="mx-auto flex max-w-site flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-semibold tracking-[0.08em] text-ink">
          Care Hair
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <p>Hair care diagnosis for high school students.</p>
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
