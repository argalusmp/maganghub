"use client";

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          MagangHub
        </Link>
      </div>
    </header>
  );
}
