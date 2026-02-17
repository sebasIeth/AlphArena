import { useState, useEffect, useRef } from 'react'

// ─── Step 01: Fund Your Agent ───
// Coins/chips stack up one by one on hover
export function FundIllustration({ hovered }) {
  return (
    <div className="w-full h-32 relative overflow-hidden">
      {/* Wallet base */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-14 border-2 border-ink bg-cream flex items-end justify-center">
        <div className="w-20 h-1 bg-ink/10 mb-2" />
      </div>

      {/* Coins stacking */}
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: `${68 + i * 12}px`,
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? 'translateY(0) scale(1)'
              : 'translateY(-20px) scale(0.8)',
            transition: `all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
          }}
        >
          <div
            className={`h-3 border-2 border-ink ${
              i % 2 === 0 ? 'bg-indigo' : 'bg-indigo/30'
            }`}
            style={{ width: `${56 - i * 4}px` }}
          />
        </div>
      ))}

      {/* Dollar sign */}
      <div
        className="absolute top-2 right-4 font-serif font-black text-2xl text-indigo"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s ease 0.3s',
        }}
      >
        $
      </div>

      {/* Small floating indicators */}
      <div
        className="absolute top-4 left-4 w-2 h-2 bg-indigo"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s ease 0.2s',
        }}
      />
      <div
        className="absolute top-8 left-8 w-1.5 h-1.5 bg-ink/20"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s ease 0.35s',
        }}
      />
    </div>
  )
}

// ─── Step 02: Enter the Arena ───
// 4x4 board with pieces that slide around on hover
export function ArenaIllustration({ hovered }) {
  const [pieces, setPieces] = useState([
    { id: 0, row: 0, col: 0, type: 'a' },
    { id: 1, row: 0, col: 3, type: 'b' },
    { id: 2, row: 1, col: 2, type: 'a' },
    { id: 3, row: 2, col: 1, type: 'b' },
    { id: 4, row: 3, col: 3, type: 'a' },
    { id: 5, row: 3, col: 0, type: 'b' },
  ])
  const intervalRef = useRef(null)

  useEffect(() => {
    if (hovered) {
      // Move pieces around when hovered
      intervalRef.current = setInterval(() => {
        setPieces(prev =>
          prev.map(p => {
            const directions = [
              { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
              { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
            ]
            const dir = directions[Math.floor(Math.random() * directions.length)]
            const newRow = Math.max(0, Math.min(3, p.row + dir.dr))
            const newCol = Math.max(0, Math.min(3, p.col + dir.dc))
            // Only move if no other piece is there
            const occupied = prev.some(
              other => other.id !== p.id && other.row === newRow && other.col === newCol
            )
            if (!occupied) {
              return { ...p, row: newRow, col: newCol }
            }
            return p
          })
        )
      }, 600)
    } else {
      clearInterval(intervalRef.current)
      // Reset positions
      setPieces([
        { id: 0, row: 0, col: 0, type: 'a' },
        { id: 1, row: 0, col: 3, type: 'b' },
        { id: 2, row: 1, col: 2, type: 'a' },
        { id: 3, row: 2, col: 1, type: 'b' },
        { id: 4, row: 3, col: 3, type: 'a' },
        { id: 5, row: 3, col: 0, type: 'b' },
      ])
    }
    return () => clearInterval(intervalRef.current)
  }, [hovered])

  const cellSize = 28
  const gap = 2
  const boardSize = cellSize * 4 + gap * 3

  return (
    <div className="w-full h-32 flex items-center justify-center">
      <div
        className="relative border-2 border-ink transition-shadow duration-300"
        style={{
          width: boardSize,
          height: boardSize,
          boxShadow: hovered ? '4px 4px 0px var(--color-ink)' : '0px 0px 0px var(--color-ink)',
        }}
      >
        {/* Grid cells */}
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          const isDark = (row + col) % 2 === 1
          return (
            <div
              key={i}
              className={`absolute ${isDark ? 'bg-ink/[0.06]' : 'bg-transparent'}`}
              style={{
                width: cellSize,
                height: cellSize,
                left: col * (cellSize + gap),
                top: row * (cellSize + gap),
              }}
            />
          )
        })}

        {/* Pieces */}
        {pieces.map(piece => (
          <div
            key={piece.id}
            className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              piece.type === 'a' ? 'bg-indigo' : 'bg-ink/25'
            }`}
            style={{
              width: cellSize - 6,
              height: cellSize - 6,
              left: piece.col * (cellSize + gap) + 3,
              top: piece.row * (cellSize + gap) + 3,
            }}
          />
        ))}

        {/* Hover: scan line */}
        <div
          className="absolute left-0 right-0 h-[2px] bg-indigo/30 pointer-events-none"
          style={{
            top: hovered ? '100%' : '0%',
            transition: 'top 2s linear',
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  )
}

// ─── Step 03: Collect Winnings ───
// Trophy with rising bars/sparks on hover
export function WinningsIllustration({ hovered }) {
  return (
    <div className="w-full h-32 relative overflow-hidden flex items-end justify-center pb-2">
      {/* Rising bar chart behind trophy */}
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="absolute bottom-2"
          style={{
            left: `${15 + i * 18}%`,
            width: '8%',
            height: hovered ? `${30 + i * 14}%` : '8%',
            backgroundColor: i === 4 ? 'var(--color-indigo)' : 'var(--color-ink)',
            opacity: hovered ? (i === 4 ? 0.7 : 0.06 + i * 0.03) : 0.04,
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s`,
          }}
        />
      ))}

      {/* Trophy */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Cup */}
        <div
          className="relative"
          style={{
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <svg
            width="48"
            height="56"
            viewBox="0 0 48 56"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            strokeLinecap="square"
          >
            {/* Cup body */}
            <path d="M12 8h24v16c0 8-5 14-12 14S12 32 12 24V8z" />
            {/* Cup rim */}
            <line x1="10" y1="8" x2="38" y2="8" />
            {/* Handles */}
            <path d="M12 12H8c-2 0-4 2-4 4v2c0 2 2 4 4 4h4" />
            <path d="M36 12h4c2 0 4 2 4 4v2c0 2-2 4-4 4h-4" />
            {/* Stem */}
            <line x1="24" y1="38" x2="24" y2="46" />
            {/* Base */}
            <line x1="16" y1="46" x2="32" y2="46" />
            <line x1="14" y1="48" x2="34" y2="48" />
          </svg>

          {/* Star inside cup */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-indigo font-serif font-black text-sm"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            }}
          >
            ★
          </div>
        </div>
      </div>

      {/* Floating numbers (money amounts) */}
      {[
        { text: '+$120', x: '15%', delay: 0.1 },
        { text: '+$85', x: '72%', delay: 0.25 },
        { text: '+$240', x: '42%', delay: 0.4 },
      ].map((item, i) => (
        <div
          key={i}
          className="absolute font-mono text-xs font-semibold text-indigo"
          style={{
            left: item.x,
            top: hovered ? '10%' : '50%',
            opacity: hovered ? 1 : 0,
            transition: `all 0.5s ease ${item.delay}s`,
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Corner sparkles */}
      {[
        { top: '8%', right: '12%', delay: 0.15 },
        { top: '20%', left: '8%', delay: 0.3 },
        { top: '5%', left: '35%', delay: 0.45 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-indigo"
          style={{
            ...pos,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1) rotate(45deg)' : 'scale(0) rotate(0deg)',
            transition: `all 0.3s ease ${pos.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
