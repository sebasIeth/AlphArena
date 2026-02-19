export default function Footer() {
  return (
    <footer className="border-t border-warm-gray py-10">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="font-serif text-lg font-bold tracking-tight">
            Alph<span className="text-indigo">Arena</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-warm-mid px-3 py-1 border border-warm-gray">
            Coming Soon
          </div>
        </div>

        <a
          href="https://x.com/alpharena_"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-warm-mid transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Follow us
        </a>
      </div>
    </footer>
  )
}
