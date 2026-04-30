'use client'
import { useState } from 'react'
import type { Faq } from '@/data/faqs'

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map(faq => {
        const isOpen = open === faq.id
        return (
          <div key={faq.id} className="rounded-2xl bg-white border border-black/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-black/[0.02] transition-colors"
            >
              <span className="font-display font-medium" style={{ fontSize: '1.125rem', lineHeight: '1.35' }}>
                {faq.question}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
                className="flex-shrink-0 transition-transform"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
              >
                <line x1="8" y1="2" x2="8" y2="14" />
                <line x1="2" y1="8" x2="14" y2="8" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-6 pb-6" style={{ fontSize: '1rem', lineHeight: '1.65', color: 'rgba(0,0,0,0.72)' }}>
                {faq.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
