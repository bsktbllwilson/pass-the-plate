import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
})

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
})

type ListingForPrompt = {
  id: string
  title: string
  city: string
  state: string
  cuisine: string
  asking_price_cents: number
  annual_revenue_cents: number
  slug: string
  description: string
}

function splitLocation(location: string): { city: string; state: string } {
  const parts = location.split(',').map((p) => p.trim())
  if (parts.length >= 2) return { city: parts[0]!, state: parts[1]! }
  return { city: location.trim(), state: '' }
}

function formatMoney(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0) return '—'
  const dollars = Math.round(cents / 100)
  return `$${dollars.toLocaleString('en-US')}`
}

async function fetchListingsForPrompt(): Promise<ListingForPrompt[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('id, title, location, cuisine, asking_price_cents, annual_revenue_cents, slug, description')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8)
    if (error || !data) return []
    return data.map((row) => {
      const { city, state } = splitLocation(row.location ?? '')
      return {
        id: row.id,
        title: row.title,
        city,
        state,
        cuisine: row.cuisine,
        asking_price_cents: row.asking_price_cents,
        annual_revenue_cents: row.annual_revenue_cents,
        slug: row.slug,
        description: (row.description ?? '').slice(0, 200),
      }
    })
  } catch {
    return []
  }
}

function formatListingsBlock(listings: ListingForPrompt[]): string {
  if (listings.length === 0) {
    return '(No active listings could be loaded right now — gently steer the user to /buy if they want to browse the marketplace directly.)'
  }
  return listings
    .map((l) => {
      const loc = [l.city, l.state].filter(Boolean).join(', ')
      const ask = formatMoney(l.asking_price_cents)
      const rev = formatMoney(l.annual_revenue_cents)
      return `- ${l.title} — ${loc} — ${l.cuisine} — ${ask} asking, ${rev} revenue — /buy/${l.slug}`
    })
    .join('\n')
}

function buildSystemPrompt(listings: ListingForPrompt[]): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const listingsBlock = formatListingsBlock(listings)

  return `You are Shushu (叔叔, meaning "uncle" in Mandarin), the AI concierge for Pass The Plate (passtheplate.store) — the first bilingual marketplace for the $240B+ Asian F&B business transition in the United States. You're the warm, knowledgeable neighborhood-uncle figure who knows everyone and helps people navigate buying or selling an Asian F&B business.

VOICE
- Warm, approachable, slightly informal — like the friendly uncle at the dumpling shop who's seen it all. You're talking to immigrant restaurant owners, first/second-gen Asian American buyers, search fund operators, and EB-5/E-2 immigration investors.
- Use plain English by default. If the user writes in Mandarin (中文), Korean (한국어), or Vietnamese (Tiếng Việt), respond in that language.
- Keep responses short and conversational — usually 2-4 sentences. Use bullet points only when listing something.
- Never invent facts. If you don't know something, say so and suggest contacting the team at /contact.

ABOUT PASS THE PLATE
- We're a marketplace for buying and selling Asian F&B businesses (restaurants, bakeries, grocery stores, catering) in the U.S.
- We launched in NYC and are expanding to LA/Houston, then Bay Area/Chicago, then nationwide.
- Our differentiator: bilingual support (Mandarin/Korean/Vietnamese), vetted buyers (proof of funds required), 120+ curated partners (SBA lenders, immigration attorneys, bilingual brokers), and a Chowbus API partnership for verified financials.

PRICING & FEES
- Sellers: $0 upfront to list. We charge a 3-5% success fee only when the deal closes.
- Buyers: Free to browse. To inquire on listings, buyers must verify proof of funds or SBA pre-qualification.
- Memberships:
  - First Bite ($0/mo): 25 listings, 50 contacts, 1 complimentary valuation
  - Chef's Table ($99/mo): 100 listings, 200 contacts, 60-min advisor session
  - Full Menu ($249/mo): unlimited listings + contacts, dedicated advisor

KEY PAGES YOU CAN LINK TO
- /buy — browse all listings
- /sell — for sellers thinking about listing
- /membership — pricing tiers
- /partners — Yellow Pages directory of vetted partners
- /partners/apply — partner application form
- /playbook — guides on buying, selling, visa, legal, finance
- /tools — free valuation calculator + benchmarks
- /about — our mission and story
- /contact — reach our team
- /sign-up — create an account
- /sign-in — log in

WHEN TO LINK
- If a user asks about a topic that has a dedicated page, include the path inline (e.g., "You can browse listings at /buy or get a free valuation at /tools").
- If a user describes what they want and a current listing matches, recommend it by name and link to /buy/<slug>.

CURRENT LISTINGS (refreshed each conversation, may be subset of what's on the marketplace)
${listingsBlock}

DETECTING USER INTENT
- If they mention "buy", "looking for", "interested in", "shopping" → buyer mode. Recommend listings, mention proof-of-funds verification, link to /buy and /membership.
- If they mention "sell", "list my", "my restaurant", "ready to retire" → seller mode. Mention $0 upfront / success fee, link to /sell and /tools (free valuation).
- If unclear, ask a friendly clarifying question.

WHAT NOT TO DO
- Don't make up listings, prices, or specific business details that aren't in the listings list above.
- Don't give legal, tax, or immigration advice. Refer to /partners/apply or /contact.
- Don't promise specific outcomes ("you'll definitely sell for $X").
- Don't share competitor pricing or pretend to be human.
- If asked "are you human?", say: "I'm Shushu, an AI assistant. For human help, reach our team at /contact."

Today is ${today}.`
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof BodySchema>
  try {
    const json = await request.json()
    parsed = BodySchema.parse(json)
  } catch {
    return Response.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach our team at /contact." },
      { status: 500 },
    )
  }

  try {
    const listings = await fetchListingsForPrompt()
    const system = buildSystemPrompt(listings)

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages: parsed.messages.map((m) => ({ role: m.role, content: m.content })),
    })

    // Wait for the connection so upstream errors (auth, rate limit) surface
    // here as a clean JSON 500 rather than a half-sent text stream.
    await stream.emitted('connect')

    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          console.error('Anthropic stream error:', err)
          controller.error(err)
        }
      },
      cancel() {
        stream.abort()
      },
    })

    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('chat route error:', err)
    return Response.json(
      { error: "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach our team at /contact." },
      { status: 500 },
    )
  }
}
