export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-10 text-sm text-zinc-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 md:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>
          Data berasal dari Kemnaker & sumber publik. MagangHub mengkurasi ulang informasi agar pencarian jauh
          lebih terarah.
        </p>
        <p className="text-xs text-zinc-500">Powered by MagangHub API</p>
      </div>
    </footer>
  );
}
