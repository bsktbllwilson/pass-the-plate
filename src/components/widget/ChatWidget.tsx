'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUp, X } from 'lucide-react'

type Role = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: Role
  content: string
  ts: number
}

const STORAGE_KEY = 'shushu.chat.v1'
const ORANGE = '#E8542C'
const CREAM = '#FAF6EE'
const BORDER = '#E5DCC5'
const INK = '#1a1a1a'
const ERROR_TEXT =
  "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach our team at /contact."

const SUGGESTED_PROMPTS = [
  'How does the success fee work?',
  'Show me restaurants for sale in Brooklyn',
  'I want to sell my business — where do I start?',
  "What's a fair asking price for my restaurant?",
]

type AvatarMood = 'happy' | 'flex' | 'sleepy' | 'cheeky'
const AVATAR_SRC: Record<AvatarMood, string> = {
  happy: '/shushu/happy.png',
  flex: '/shushu/flex.png',
  sleepy: '/shushu/sleepy.png',
  cheeky: '/shushu/cheeky.png',
}
const IDLE_TIMEOUT_MS = 30_000
const FLEX_DURATION_MS = 1_500
const CHEEKY_DURATION_MS = 2_000

const WELCOME_TEXT =
  "Hey, I'm Shushu \u{1F44B} (uncle in Mandarin). I'm Pass The Plate's bilingual concierge. Whether you're looking to buy your first Asian F&B business or sell the one you've poured your life into, I'm here to help. What can I help you with today?"

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  let h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${m.toString().padStart(2, '0')}${ampm}`
}

function loadFromSession(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        typeof m.id === 'string' &&
        typeof m.ts === 'number',
    )
  } catch {
    return []
  }
}

function renderInlineLinks(text: string, key: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /(https?:\/\/[^\s)]+|\/[a-z0-9][a-z0-9/_-]*)/gi
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const href = match[0]
    nodes.push(
      <a
        key={`${key}-l-${i++}`}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="underline underline-offset-2"
        style={{ color: ORANGE }}
      >
        {href}
      </a>,
    )
    lastIndex = match.index + href.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const lines = message.content.split('\n')
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-[15px] leading-snug whitespace-pre-wrap break-words ${
          isUser ? 'text-white' : 'border'
        }`}
        style={
          isUser
            ? { background: ORANGE }
            : { background: '#fff', borderColor: BORDER, color: INK }
        }
      >
        {lines.map((line, i) => (
          <span key={i}>
            {renderInlineLinks(line, `${message.id}-${i}`)}
            {i < lines.length - 1 ? '\n' : null}
          </span>
        ))}
      </div>
      <span className="text-[11px]" style={{ color: '#8a8377' }}>
        {formatTime(message.ts)}
      </span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Image
        src="/shushu/running.png"
        alt=""
        width={36}
        height={36}
        className="w-9 h-9 object-contain animate-bounce"
        priority={false}
      />
      <div
        className="rounded-2xl border px-4 py-3 flex gap-1.5"
        style={{ background: '#fff', borderColor: BORDER }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block animate-bounce"
          style={{ background: '#bdb6a6', animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 rounded-full inline-block animate-bounce"
          style={{ background: '#bdb6a6', animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 rounded-full inline-block animate-bounce"
          style={{ background: '#bdb6a6', animationDelay: '300ms' }}
        />
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [bouncing, setBouncing] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('happy')

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const avatarClickCountRef = useRef(0)
  const avatarClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setMoodFor = useCallback((mood: AvatarMood, duration: number) => {
    setAvatarMood(mood)
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
    moodTimerRef.current = setTimeout(() => setAvatarMood('happy'), duration)
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    setAvatarMood((m) => (m === 'sleepy' ? 'happy' : m))
    idleTimerRef.current = setTimeout(() => {
      setAvatarMood((m) => (m === 'happy' ? 'sleepy' : m))
    }, IDLE_TIMEOUT_MS)
  }, [])

  useEffect(() => {
    setMessages(loadFromSession())
    setHydrated(true)
    const t = setTimeout(() => setBouncing(false), 2000)
    return () => {
      clearTimeout(t)
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (avatarClickTimerRef.current) clearTimeout(avatarClickTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      return
    }
    resetIdleTimer()
  }, [isOpen, resetIdleTimer])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // ignore quota errors
    }
  }, [messages, hydrated])

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, isOpen, isLoading])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      } else if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, textarea, input, a[href], [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    setTimeout(() => textareaRef.current?.focus(), 50)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = '0px'
    const next = Math.min(ta.scrollHeight, 120)
    ta.style.height = `${next}px`
  }, [input, isOpen])

  const showWelcome = messages.length === 0
  const isLong = messages.length >= 20

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      setError(null)
      const userMsg: ChatMessage = {
        id: makeId(),
        role: 'user',
        content: trimmed,
        ts: Date.now(),
      }
      const next = [...messages, userMsg]
      setMessages(next)
      setInput('')
      setIsLoading(true)
      setStreamingText('')

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          setError(ERROR_TEXT)
          setIsLoading(false)
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          if (value) {
            acc += decoder.decode(value, { stream: true })
            setStreamingText(acc)
          }
        }
        acc += decoder.decode()
        if (acc.trim().length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: 'assistant',
              content: acc,
              ts: Date.now(),
            },
          ])
          setMoodFor('flex', FLEX_DURATION_MS)
        } else {
          setError(ERROR_TEXT)
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          console.error('chat fetch error:', err)
          setError(ERROR_TEXT)
        }
      } finally {
        setStreamingText('')
        setIsLoading(false)
        abortRef.current = null
        resetIdleTimer()
      }
    },
    [isLoading, messages, setMoodFor, resetIdleTimer],
  )

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      void sendMessage(input)
    },
    [input, sendMessage],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void sendMessage(input)
      }
    },
    [input, sendMessage],
  )

  const handleSuggested = useCallback(
    (prompt: string) => {
      setInput(prompt)
      resetIdleTimer()
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [resetIdleTimer],
  )

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setBouncing(false)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    abortRef.current?.abort()
    setTimeout(() => buttonRef.current?.focus(), 0)
  }, [])

  const handleAvatarClick = useCallback(() => {
    avatarClickCountRef.current += 1
    if (avatarClickTimerRef.current) clearTimeout(avatarClickTimerRef.current)
    avatarClickTimerRef.current = setTimeout(() => {
      avatarClickCountRef.current = 0
    }, 800)
    if (avatarClickCountRef.current >= 3) {
      avatarClickCountRef.current = 0
      setMoodFor('cheeky', CHEEKY_DURATION_MS)
    }
  }, [setMoodFor])

  const fontStyle = useMemo<React.CSSProperties>(
    () => ({ fontFamily: 'var(--font-body)' }),
    [],
  )

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={handleOpen}
          aria-label="Open chat with Shushu"
          className={`fixed bottom-6 right-6 z-50 w-[144px] h-[144px] flex items-end justify-center transition-transform hover:scale-105 ${
            bouncing ? 'animate-bounce' : ''
          }`}
        >
          <Image
            src="/shushu/hello.png"
            alt=""
            width={216}
            height={216}
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))' }}
            priority
          />
        </button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Shushu"
          aria-modal="true"
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 sm:h-[600px] flex flex-col bg-white sm:rounded-2xl shadow-2xl border overflow-hidden"
          style={{ borderColor: BORDER, ...fontStyle }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 text-white shrink-0"
            style={{ background: ORANGE, height: 64 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleAvatarClick}
                tabIndex={-1}
                aria-hidden
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                style={{ background: CREAM }}
              >
                <Image
                  src={AVATAR_SRC[avatarMood]}
                  alt=""
                  width={48}
                  height={48}
                  className="w-[120%] h-[120%] object-cover object-top transition-opacity"
                  key={avatarMood}
                />
              </button>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-medium text-base truncate">Shushu</span>
                <span className="flex items-center gap-1.5 text-xs opacity-90">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#22c55e' }}
                    aria-hidden
                  />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close chat"
              className="p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{ background: CREAM }}
          >
            {showWelcome && (
              <>
                <div className="flex justify-center pt-2 pb-1">
                  <Image
                    src="/shushu/happy.png"
                    alt=""
                    width={140}
                    height={140}
                    className="w-28 h-28 object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div
                    className="max-w-[85%] rounded-2xl border px-4 py-2 text-[15px] leading-snug"
                    style={{ background: '#fff', borderColor: BORDER, color: INK }}
                  >
                    {WELCOME_TEXT}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSuggested(p)}
                      className="text-left text-[14px] rounded-full border px-3 py-2 transition-colors hover:bg-white"
                      style={{ borderColor: BORDER, background: '#fff', color: INK }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isLoading && streamingText.length === 0 && <TypingIndicator />}

            {isLoading && streamingText.length > 0 && (
              <MessageBubble
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingText,
                  ts: Date.now(),
                }}
              />
            )}

            {error && (
              <div role="alert" className="flex items-end gap-2">
                <Image
                  src="/shushu/sad.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain shrink-0"
                />
                <div
                  className="text-[13px] rounded-2xl border px-3 py-2"
                  style={{
                    background: '#fff5f3',
                    borderColor: '#f5c5b8',
                    color: '#9a3412',
                  }}
                >
                  {renderInlineLinks(error, 'err')}
                </div>
              </div>
            )}

            {isLong && (
              <div
                className="text-[12px] text-center rounded-full px-3 py-1.5 mx-auto"
                style={{ background: '#fff', border: `1px solid ${BORDER}`, color: '#6b6557' }}
              >
                This is getting long! For complex questions, try{' '}
                <a href="/contact" className="underline" style={{ color: ORANGE }}>
                  /contact
                </a>{' '}
                for a real person.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input footer */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t bg-white p-3 flex items-end gap-2"
            style={{ borderColor: BORDER }}
          >
            <div
              className="flex-1 rounded-3xl px-4 py-2 flex items-center"
              style={{ background: CREAM, border: `1px solid ${BORDER}` }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  resetIdleTimer()
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Shushu anything…"
                aria-label="Type your message"
                className="w-full resize-none bg-transparent outline-none text-[15px] leading-snug placeholder:text-[#8a8377]"
                style={{ color: INK, maxHeight: 120 }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || input.trim().length === 0}
              aria-label="Send message"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-opacity disabled:opacity-40"
              style={{ background: ORANGE }}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
