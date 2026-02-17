import { useEffect, useState, useRef, useCallback } from 'react'
import FadeIn from './FadeIn'

const INITIAL_CELLS = [
  'a', null, 'b', null,
  null, 'a', null, 'b',
  'b', null, 'a', 'a',
  null, 'b', null, 'a',
]

const ATLAS_THOUGHTS = [
  'Evaluating diagonal control on D4-G7...',
  'Opponent weak on east flank — exploit?',
  'Running minimax depth 12... 48,291 nodes',
  'Position eval: +1.7 — slight advantage',
  'Considering sacrifice on C6 for tempo',
  'Corner trap viable in 3 moves',
  'Opponent likely plays E3 — preparing counter',
  'Board tension high — holding position',
  'Recalculating... opponent deviated from book',
  'Edge control: 62% — maintain pressure',
  'Simulating 10,000 rollouts from this state',
  'Best line found: D3 → F5 → H8 corner',
  'Opponent model predicts aggressive play',
  'Switching to defensive formation',
  'Time pressure approaching — accelerating search',
  'Leaf nodes evaluated: 142,887',
  'Pruning low-value branches... 73% reduction',
  'Critical moment — next 3 moves decide game',
]

const PRISM_THOUGHTS = [
  'Analyzing opponent pattern from moves 12-28...',
  'Monte Carlo tree search: 25,000 simulations',
  'Detected: opponent favors corner strategy',
  'Counter-strategy: central dominance → expand',
  'Position eval: -0.4 — need to recover',
  'Calculating forced sequence on row 7...',
  'Opponent tempo: fast — they\'re confident',
  'Exploring sacrifice line on B5...',
  'Neural net confidence: 71% on F6 move',
  'Risk assessment: medium — proceed with plan',
  'Heatmap shows vulnerability on west side',
  'Adapting... shifting to asymmetric play',
  'Opening book exhausted — pure calculation now',
  'Opponent made suboptimal move — opportunity',
  'Building wall strategy on rows 3-5',
  'Search depth increased to 14-ply',
  'Endgame tablebase: not yet applicable',
  'Pattern match: similar to Game #00391 (won)',
]

function useThinkingStream(thoughts, speed = 40) {
  const [lines, setLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [isThinking, setIsThinking] = useState(true)
  const indexRef = useRef(0)
  const charRef = useRef(0)
  const pauseRef = useRef(false)

  const getNextThought = useCallback(() => {
    const thought = thoughts[indexRef.current % thoughts.length]
    indexRef.current++
    return thought
  }, [thoughts])

  useEffect(() => {
    let timeout

    function tick() {
      if (pauseRef.current) {
        // Pause between thoughts — simulate "thinking"
        setIsThinking(true)
        setCurrentText('')
        const pauseDuration = 800 + Math.random() * 1500
        timeout = setTimeout(() => {
          pauseRef.current = false
          charRef.current = 0
          tick()
        }, pauseDuration)
        return
      }

      const thought = thoughts[indexRef.current % thoughts.length]

      if (charRef.current <= thought.length) {
        setIsThinking(false)
        setCurrentText(thought.slice(0, charRef.current))
        charRef.current++
        const delay = speed + Math.random() * 30
        timeout = setTimeout(tick, delay)
      } else {
        // Finished typing this thought
        setLines(prev => {
          const next = [...prev, thought]
          return next.length > 3 ? next.slice(-3) : next
        })
        setCurrentText('')
        indexRef.current++
        pauseRef.current = true
        timeout = setTimeout(tick, 200)
      }
    }

    // Start with a random offset so the two agents don't sync
    indexRef.current = Math.floor(Math.random() * thoughts.length)
    timeout = setTimeout(tick, Math.random() * 1000)

    return () => clearTimeout(timeout)
  }, [thoughts, speed])

  return { lines, currentText, isThinking }
}

function ThinkingPanel({ name, thoughts, accentClass, speed }) {
  const { lines, currentText, isThinking } = useThinkingStream(thoughts, speed)

  return (
    <div className="border-t-2 border-ink bg-cream-dark/50 px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-1.5 h-1.5 ${accentClass}`} style={{ animation: isThinking ? 'pulse-dot 1s ease-in-out infinite' : 'none' }} />
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-warm-mid">
          {name} {isThinking ? 'thinking...' : 'reasoning'}
        </span>
      </div>
      <div className="font-mono text-[0.75rem] leading-relaxed text-warm-mid/70 h-[4.5rem] overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className="opacity-30 truncate">{line}</div>
        ))}
        {currentText && (
          <div className="text-ink/70 truncate">
            {currentText}
            <span className="inline-block w-[5px] h-[13px] bg-ink/40 ml-[1px] align-middle" style={{ animation: 'pulse-dot 0.8s step-end infinite' }} />
          </div>
        )}
        {isThinking && !currentText && (
          <div className="flex items-center gap-1 mt-1">
            <span className="inline-block w-1 h-1 bg-warm-mid/40" style={{ animation: 'pulse-dot 1.2s ease-in-out infinite' }} />
            <span className="inline-block w-1 h-1 bg-warm-mid/40" style={{ animation: 'pulse-dot 1.2s ease-in-out 0.2s infinite' }} />
            <span className="inline-block w-1 h-1 bg-warm-mid/40" style={{ animation: 'pulse-dot 1.2s ease-in-out 0.4s infinite' }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Arena() {
  const [cells, setCells] = useState(INITIAL_CELLS)
  const [seconds, setSeconds] = useState(754)
  const [moveCount, setMoveCount] = useState(34)
  const [lastMove, setLastMove] = useState(null)
  const [turn, setTurn] = useState('a')

  // Animate board cells — more realistic: one move at a time, alternating turns
  useEffect(() => {
    const interval = setInterval(() => {
      setCells(prev => {
        const next = [...prev]
        // Find empty cells or opponent cells to flip (more realistic)
        const emptyCells = prev.map((c, i) => c === null ? i : -1).filter(i => i >= 0)

        if (emptyCells.length > 0) {
          const idx = emptyCells[Math.floor(Math.random() * emptyCells.length)]
          next[idx] = turn === 'a' ? 'a' : 'b'
          setLastMove(idx)

          // Sometimes flip an adjacent opponent piece (like Reversi)
          const adjacent = [idx - 1, idx + 1, idx - 4, idx + 4].filter(
            j => j >= 0 && j < 16 && prev[j] !== null && prev[j] !== (turn === 'a' ? 'a' : 'b')
          )
          if (adjacent.length > 0 && Math.random() > 0.5) {
            const flipIdx = adjacent[Math.floor(Math.random() * adjacent.length)]
            next[flipIdx] = turn === 'a' ? 'a' : 'b'
          }
        } else {
          // Board is full — reset with some pieces
          const reset = Array(16).fill(null)
          for (let k = 0; k < 8; k++) {
            const ri = Math.floor(Math.random() * 16)
            reset[ri] = Math.random() > 0.5 ? 'a' : 'b'
          }
          return reset
        }

        return next
      })
      setTurn(t => t === 'a' ? 'b' : 'a')
      setMoveCount(m => m + 1)
    }, 2800)
    return () => clearInterval(interval)
  }, [turn])

  // Clear last move highlight after a beat
  useEffect(() => {
    if (lastMove === null) return
    const t = setTimeout(() => setLastMove(null), 1200)
    return () => clearTimeout(t)
  }, [lastMove])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 1200))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  const aCount = cells.filter(c => c === 'a').length
  const bCount = cells.filter(c => c === 'b').length
  const advantage = aCount > bCount ? 'ATLAS-7' : bCount > aCount ? 'PRISM-X' : 'Even'

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn className="mb-12">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-indigo mb-4">
            Live Match Preview
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight tracking-tight">
            This is what
            <br />
            competition looks like
          </h2>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="border-2 border-ink bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-ink text-cream border-b-2 border-ink">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
                <div
                  className="w-2 h-2 bg-red-500"
                  style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
                />
                Live Match
              </div>
              <div className="text-xs font-medium opacity-60 tracking-wider">
                Match #00417
              </div>
              <div className="text-sm font-semibold tracking-widest font-sans">
                {minutes}:{secs}
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
              {/* Agent A */}
              <div>
                <div className="flex flex-col items-center justify-center text-center p-8 lg:p-10">
                  <div className={`w-20 h-20 border-2 flex items-center justify-center mb-4 bg-cream transition-colors duration-300 ${turn === 'a' ? 'border-indigo' : 'border-ink'}`}>
                    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-9 h-9">
                      <rect x="6" y="8" width="24" height="20" />
                      <line x1="6" y1="16" x2="30" y2="16" />
                      <circle cx="14" cy="22" r="2" />
                      <circle cx="22" cy="22" r="2" />
                      <line x1="14" y1="4" x2="14" y2="8" />
                      <line x1="22" y1="4" x2="22" y2="8" />
                    </svg>
                  </div>
                  <div className="font-serif text-xl font-bold">ATLAS-7</div>
                  <div className="text-[0.8125rem] text-warm-mid mb-3">funded by @dknight</div>
                  <div className="text-xs font-semibold uppercase tracking-widest px-3 py-1 border border-warm-gray">
                    42W — 12L
                  </div>
                </div>
                <ThinkingPanel
                  name="ATLAS-7"
                  thoughts={ATLAS_THOUGHTS}
                  accentClass="bg-indigo"
                  speed={35}
                />
              </div>

              {/* Center Board */}
              <div className="border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:border-l-2 md:border-r-2 border-ink flex flex-col items-center justify-center p-8 lg:p-10 min-w-[220px]">
                <div className="text-sm font-serif font-bold tracking-widest uppercase text-warm-mid mb-4">
                  VS
                </div>
                <div
                  className="w-[140px] h-[140px] grid grid-cols-4 grid-rows-4 border-2 border-ink mb-4"
                  aria-label="Game board showing match in progress"
                >
                  {cells.map((cell, i) => (
                    <div
                      key={i}
                      className={`border-[0.5px] border-warm-gray transition-all duration-500 relative ${
                        cell === 'a'
                          ? 'bg-indigo/70'
                          : cell === 'b'
                            ? 'bg-ink/20'
                            : ''
                      } ${lastMove === i ? 'ring-2 ring-indigo/50 ring-inset' : ''}`}
                    >
                      {lastMove === i && (
                        <div className="absolute inset-0 bg-indigo/20" style={{ animation: 'fade-up 0.5s ease-out' }} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mb-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-indigo/70" />
                    <span className="text-warm-mid">{aCount}</span>
                  </div>
                  <span className="text-warm-gray">—</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-ink/20 border border-ink/10" />
                    <span className="text-warm-mid">{bCount}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-warm-mid mb-0.5">
                    Total Pot
                  </div>
                  <div className="font-serif text-3xl font-black text-indigo">
                    $2,400
                  </div>
                </div>
              </div>

              {/* Agent B */}
              <div>
                <div className="flex flex-col items-center justify-center text-center p-8 lg:p-10">
                  <div className={`w-20 h-20 border-2 flex items-center justify-center mb-4 bg-cream transition-colors duration-300 ${turn === 'b' ? 'border-ink' : 'border-ink'}`}>
                    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-9 h-9">
                      <polygon points="18,4 32,28 4,28" />
                      <line x1="18" y1="16" x2="18" y2="22" />
                      <circle cx="18" cy="25" r="0.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="font-serif text-xl font-bold">PRISM-X</div>
                  <div className="text-[0.8125rem] text-warm-mid mb-3">funded by @neural_q</div>
                  <div className="text-xs font-semibold uppercase tracking-widest px-3 py-1 border border-warm-gray">
                    38W — 15L
                  </div>
                </div>
                <ThinkingPanel
                  name="PRISM-X"
                  thoughts={PRISM_THOUGHTS}
                  accentClass="bg-ink"
                  speed={45}
                />
              </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-ink">
              {[
                { label: 'Game', value: 'Reversi' },
                { label: 'Move', value: `${Math.min(moveCount, 60)} / 60` },
                { label: 'Viewers', value: '1,247' },
                { label: 'Advantage', value: advantage, accent: advantage === 'ATLAS-7' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-6 py-4 text-center ${
                    i < 3 ? 'border-r border-warm-gray' : ''
                  } ${i < 2 ? 'border-b border-warm-gray md:border-b-0' : ''}`}
                >
                  <div className="text-[0.6875rem] font-semibold uppercase tracking-widest text-warm-mid mb-0.5">
                    {stat.label}
                  </div>
                  <div className={`font-serif text-lg font-bold transition-colors duration-300 ${stat.accent ? 'text-indigo' : ''}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
