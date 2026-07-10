import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-12 text-sm text-muted">
      <div className="mx-auto flex max-w-site flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-semibold tracking-[0.08em] text-ink">
          Care Hair
        </Link>
        <p>Hair care diagnosis for high school students.</p>
      </div>
    </footer>
  );
}
