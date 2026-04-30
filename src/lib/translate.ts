import 'server-only'
import Anthropic from '@anthropic-ai/sdk'

// Translation helper backed by Claude. Used to auto-translate
// seller-submitted listing content into Simplified Chinese on first
// /zh visit; results are cached back to the DB so subsequent reads
// are free.
//
// Partners and playbook content do NOT call into here — those are
// editorial and need a native Mandarin reviewer pass. Manual
// translations land via SQL updates.

const TRANSLATION_SYSTEM_PROMPT = `You are a professional translator specializing in Asian F&B business and M&A content. Translate the user's English text into Simplified Chinese (zh-CN, mainland-style).

Style guidance:
- Idiomatic, professional Mandarin that reads as if written natively. Avoid awkward calques.
- Use PRC business / M&A vocabulary: 交易平台 (not 市场) for marketplace, 经审核的买家 for vetted buyers, 成交佣金 for success fee, SBA 贷款 for SBA loan.
- Keep industry / regulatory terms in English when they are the standard form: SBA, EB-5, E-2, L-1A, POS, LLC, LOI.
- Preserve dollar figures exactly as written ($240B, $1.2M, etc).
- Preserve neighborhood / proper-noun toponyms in English unless the established Chinese form is widely used (法拉盛 for Flushing is fine; Williamsburg stays English).
- Preserve markdown formatting if present (#, ##, -, **bold**, _italic_, links).
- Person names stay English unless the user input is already in Chinese.

Output ONLY the translated text. No commentary, no quotes, no labels.`

let cachedClient: Anthropic | null = null
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!cachedClient) cachedClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return cachedClient
}

export async function translateText(input: string): Promise<string | null> {
  if (!input.trim()) return ''
  const client = getClient()
  if (!client) {
    console.warn('translateText skipped: ANTHROPIC_API_KEY not set')
    return null
  }
  try {
    const result = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: TRANSLATION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input }],
    })
    const block = result.content.find((b) => b.type === 'text')
    return block && block.type === 'text' ? block.text.trim() : null
  } catch (err) {
    console.error('translateText error:', err)
    return null
  }
}
