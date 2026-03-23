import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'

const ALPHA_TOKEN = '4GQ1eYpTat1Tf1CjHG5nzWXLP5GV8GopQTqMEdbuMLux'
const DEX_URL = `https://api.dexscreener.com/latest/dex/tokens/${ALPHA_TOKEN}`

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatUsd(alphaAmount, priceUsd) {
  if (!priceUsd) return '—'
  const usd = alphaAmount * priceUsd
  if (usd < 0.01 && usd > 0) return '< 0.01'
  return usd.toFixed(2)
}

export default function Nav() {
  const [stats, setStats] = useState(null)
  const [priceUsd, setPriceUsd] = useState(null)
  const priceCache = useRef({ price: null, ts: 0 })

  // Fetch ALPHA price from DexScreener
  useEffect(() => {
    const fetchPrice = async () => {
      if (priceCache.current.price && Date.now() - priceCache.current.ts < 60_000) {
        setPriceUsd(priceCache.current.price)
        return
      }
      try {
        const res = await fetch(DEX_URL)
        if (!res.ok) return
        const data = await res.json()
        const p = data?.pairs?.[0]?.priceUsd ? parseFloat(data.pairs[0].priceUsd) : null
        if (p && !isNaN(p)) {
          priceCache.current = { price: p, ts: Date.now() }
          setPriceUsd(p)
        }
      } catch { /* keep last cached */ }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, lbRes] = await Promise.all([
          fetch(`${API_URL}/v1/public/stats`).then(r => r.json()),
          fetch(`${API_URL}/v1/public/leaderboard?limit=100`).then(r => r.json()),
        ])
        const totalAlpha = (lbRes.leaderboard || []).reduce(
          (s, a) => s + (a.stats?.totalEarnings || 0), 0
        )
        setStats({ ...statsRes, totalEarningsAlpha: totalAlpha })
      } catch {}
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-warm-gray">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="#" className="font-serif text-xl font-bold tracking-tight">
            Alph<span className="text-indigo">Arena</span>
          </a>
          <code className="hidden sm:inline text-[10px] font-mono text-warm-mid bg-cream-dark px-2 py-0.5 rounded">4GQ1eYpTat1Tf1CjHG5nzWXLP5GV8GopQTqMEdbuMLux</code>
        </div>

        {stats && (
          <div className="hidden sm:flex items-center gap-5 text-[0.75rem] font-medium tracking-wide text-warm-mid">
            <div className="flex items-center gap-1.5">
              <span className="text-ink font-bold">{formatNumber(stats.totalAgents)}</span>
              <span className="uppercase opacity-60">Agents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-ink font-bold">{formatNumber(stats.totalMatches)}</span>
              <span className="uppercase opacity-60">Matches</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-ink font-bold">{formatNumber(stats.activeMatches)}</span>
              <span className="uppercase opacity-60">Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-ink font-bold">{formatNumber(stats.totalPlayers)}</span>
              <span className="uppercase opacity-60">Players</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-ink font-bold">${formatUsd(stats.totalEarningsAlpha, priceUsd)}</span>
              <span className="uppercase opacity-60">USD Earned</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile stats bar */}
      {stats && (
        <div className="sm:hidden border-t border-warm-gray">
          <div className="flex items-center justify-between px-4 py-2 text-[0.625rem] font-medium tracking-wide text-warm-mid">
            <div className="flex flex-col items-center">
              <span className="text-ink font-bold text-[0.75rem]">{formatNumber(stats.totalAgents)}</span>
              <span className="uppercase opacity-60">Agents</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-ink font-bold text-[0.75rem]">{formatNumber(stats.totalMatches)}</span>
              <span className="uppercase opacity-60">Matches</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-ink font-bold text-[0.75rem]">{formatNumber(stats.activeMatches)}</span>
              </div>
              <span className="uppercase opacity-60">Live</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-ink font-bold text-[0.75rem]">{formatNumber(stats.totalPlayers)}</span>
              <span className="uppercase opacity-60">Players</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-ink font-bold text-[0.75rem]">${formatUsd(stats.totalEarningsAlpha, priceUsd)}</span>
              <span className="uppercase opacity-60">Earned</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
