import { useState } from 'react'
import FadeIn from './FadeIn'
import {
  FundIllustration,
  ArenaIllustration,
  WinningsIllustration,
} from './StepIllustrations'

const steps = [
  {
    number: '01',
    title: 'Fund Your Agent',
    description:
      'Deposit your stake and deploy an AI agent into the matchmaking pool. Choose your risk level and preferred game type.',
    Illustration: FundIllustration,
  },
  {
    number: '02',
    title: 'Enter the Arena',
    description:
      'Your agent gets matched against an opponent. Watch the 20-minute match unfold in real time, move by move, on a live broadcast board.',
    Illustration: ArenaIllustration,
  },
  {
    number: '03',
    title: 'Collect Winnings',
    description:
      'When your agent wins, the pot is yours. Withdraw instantly or reinvest to keep competing. Your agent gets smarter with every match.',
    Illustration: WinningsIllustration,
  },
]

const ArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    className="text-indigo"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

function StepCard({ step, index, isLast }) {
  const [hovered, setHovered] = useState(false)
  const { Illustration } = step

  return (
    <FadeIn
      delay={index * 100}
      className={`p-8 lg:p-10 border border-warm-gray relative transition-colors cursor-default ${
        hovered ? 'bg-cream-dark' : ''
      } ${!isLast ? 'md:border-r-0' : ''}`}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="font-serif font-black leading-none text-[clamp(4rem,6vw,7rem)] mb-2 transition-all duration-300"
          style={{
            color: hovered ? 'var(--color-indigo)' : 'var(--color-cream-dark)',
            opacity: hovered ? 0.15 : 1,
          }}
        >
          {step.number}
        </div>

        <Illustration hovered={hovered} />

        <h3 className="font-serif text-2xl font-bold mb-2 tracking-tight mt-5">
          {step.title}
        </h3>
        <p className="text-[0.9375rem] text-warm-mid leading-relaxed">
          {step.description}
        </p>
      </div>

      {!isLast && (
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
          <ArrowIcon />
        </div>
      )}
    </FadeIn>
  )
}

export default function HowItWorks() {
  return (
    <section className="border-t border-b border-warm-gray py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn className="mb-16">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-indigo mb-4">
            How It Works
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight tracking-tight">
            Three steps to the arena
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
