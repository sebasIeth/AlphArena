export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-warm-gray">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-serif text-xl font-bold tracking-tight">
          Alph<span className="text-indigo">Arena</span>
        </a>
        <a
          href="#early-access"
          className="text-sm font-semibold uppercase tracking-widest px-6 py-2.5 border-2 border-ink bg-transparent transition-colors hover:bg-ink hover:text-cream"
        >
          Get Early Access
        </a>
      </div>
    </nav>
  )
}
