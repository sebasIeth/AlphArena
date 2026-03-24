import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'

const ALPHA_TOKEN = '4GQ1eYpTat1Tf1CjHG5nzWXLP5GV8GopQTqMEdbuMLux'
const DEX_URL = `https://api.dexscreener.com/latest/dex/tokens/${ALPHA_TOKEN}`

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatTotalUsd(alphaAmount, usdcAmount, priceUsd) {
  const alphaUsd = priceUsd ? alphaAmount * priceUsd : 0
  const total = alphaUsd + usdcAmount
  if (total <= 0) return '0.00'
  if (total < 0.01) return '< 0.01'
  return total.toFixed(2)
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
        const lb = lbRes.leaderboard || []
        const totalAlpha = lb.reduce((s, a) => s + (a.stats?.earningsAlpha || a.earningsAlpha || 0), 0)
        const totalUsdc = lb.reduce((s, a) => s + (a.stats?.earningsUsdc || a.earningsUsdc || 0), 0)
        setStats({ ...statsRes, totalEarningsAlpha: totalAlpha, totalEarningsUsdc: totalUsdc })
      } catch {}
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-warm-gray">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-serif text-xl font-bold tracking-tight">
          Alph<span className="text-indigo">Arena</span>
        </a>

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
              <span className="text-ink font-bold">${formatTotalUsd(stats.totalEarningsAlpha, stats.totalEarningsUsdc || 0, priceUsd)}</span>
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
              <span className="text-ink font-bold text-[0.75rem]">${formatTotalUsd(stats.totalEarningsAlpha, stats.totalEarningsUsdc || 0, priceUsd)}</span>
              <span className="uppercase opacity-60">Earned</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
