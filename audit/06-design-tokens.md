# Design Token Audit — Pass The Plate

## Tailwind config status

There is **no `tailwind.config.{ts,js,mjs}`**. The project uses Tailwind v4 with an `@theme` block in `src/app/globals.css`. That block declares only two tokens — `--font-display` and `--font-body` — and no color tokens at all:

```css
@theme {
  --font-display: 'please-display-vf', 'Please Display VF', Georgia, serif;
  --font-body: 'proxima-nova', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
```

Consequence: `bg-brand-orange`, `text-cream`, `border-divider`, etc. don't exist as utility classes. Every brand color is hardcoded inline as `style={{ background: '...' }}` or as an arbitrary-value Tailwind class like `bg-[#FCE16E]` / `bg-[rgb(248,243,223)]`.

## Hex grep

| Color | Files |
|---|---|
| `#E8542C` (brand orange) | `src/components/widget/ChatWidget.tsx:17` (as `const ORANGE`) — **only** here |
| `#F5EDDC` (cream) | `src/components/auth/AuthShell.tsx:7`; `src/app/account/page.tsx:17`; `src/app/about/page.tsx:68`; `src/app/buy/page.tsx:96`; `src/app/buy/[slug]/page.tsx:53`; `src/app/contact/page.tsx:25`; `src/app/partners/page.tsx:95`; `src/app/playbook/page.tsx:53,73`; `src/app/playbook/[slug]/page.tsx:33`; `src/app/sell/page.tsx:38`; `src/app/verify/page.tsx:16` |
| `#FCE16E` (yellow) | `src/app/playbook/CategoryFilter.tsx:39`; `src/app/playbook/SubscribeCard.tsx:15`; `src/app/playbook/page.tsx:107,120`; `src/app/playbook/[slug]/page.tsx:52,89`; `src/app/sell/page.tsx:83,97` |
| `#0A0A0A` | none |
| `#1F1F1F` | none |
| `#6B6B6B` (muted) | `src/components/sections/PartnerLogos.tsx:13`; `src/app/about/page.tsx:177` |
| `#E5DCC5` (border) | `src/components/widget/ChatWidget.tsx:19` (as `const BORDER`) — **only** here |

## RGB grep — the *actual* brand color usage

The brand orange is almost never spelled `#E8542C`. It's spelled `rgb(...)` inline, and it appears as **two slightly different shades**:

- `rgb(230,78,33)` ≈ `#E64E21` — appears in ~21 files.
- `rgb(230,80,37)` ≈ `#E65025` — appears in ~6 files (`SiteHeader.tsx`, `BuySellSplit` wrapper, `FindYourNextBigDeal`, `Subscribe`, `ValueProps`, `UserMenu`).

Both files (`buttons inside SiteHeader` vs `buttons inside BuySellSplit`) sit on screen at the same time on multiple pages. The two shades are visually almost identical but are different paints — a real bug, not a perception thing.

The cream background has the same problem: `rgb(248,243,222)` (in globals.css `body`, `FindYourNextBigDeal`, `Subscribe`) vs `rgb(248,243,223)` (in `SiteFooter`, `UserMenu`). One unit off in blue. Same root cause.

Files with the most inline brand-color usage (orange or cream as `rgb(...)`):

- `src/components/auth/SignUpForm.tsx` — 3 inline orange refs
- `src/components/sections/SellForm.tsx` — 3
- `src/components/sections/SiteHeader.tsx` — 2 + cream
- `src/components/sections/BuySellSplit.tsx` — 2
- `src/components/auth/SignInForm.tsx`, `ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`, `SignOutButton.tsx` — 1 each
- `src/components/marketing/HeroSearch.tsx`, `src/components/marketing/ValueProps.tsx` — 1 each
- `src/app/about/page.tsx`, `src/app/buy/page.tsx`, `src/app/buy/SearchBar.tsx`, `src/app/buy/FilterBar.tsx`, `src/app/buy/[slug]/InquiryForm.tsx`, `src/app/buy/[slug]/page.tsx`, `src/app/contact/page.tsx`, `src/app/contact/ContactForm.tsx`, `src/app/sell/page.tsx`, `src/app/partners/page.tsx`, `src/app/playbook/[slug]/Markdown.tsx` — 1+ each

## Inline typography

- `fontFamily: 'var(--font-display)'` or `'var(--font-body)'` appears in **38 files**, ~200 occurrences. Every heading and body text on the site sets the font family inline rather than via `font-display` / `font-sans` Tailwind utilities (which don't exist because Tailwind v4 only registered them as CSS variables, not as utility classes).
- `fontSize:` appears inline **140 times**, almost always with `clamp(...)` for fluid typography. There is no shared scale (`text-display-xl`, `text-body-md`, etc.).
- `fontWeight:` appears inline only once: `src/components/layout/UserMenu.tsx:84` (`fontWeight: 600`). Everywhere else, font weight is set via `font-medium` / `font-semibold` Tailwind utilities — that part is consistent.

The `@theme` block in `globals.css` *should* be exporting `font-display` and `font-body` as Tailwind utility classes (Tailwind v4 generates `font-display` from `--font-display` automatically). It's possible those utilities work and the inline `fontFamily` is just legacy — worth a one-line test (replace one inline `style` with `className="font-display"` and check the rendered font).

## Verdict

Tokens exist as PMS-style values in the designer's head; they don't exist in code. Two oranges, two creams, two background patterns for forms (white vs `#FAF6EB`), and a yellow that's spelled `#FCE16E` literally everywhere it appears. Almost every JSX file sets `fontFamily` inline.

## Top 5 files for token cleanup

Prioritized by leverage (fix once, repaint many):

1. **Define the tokens.** Add `--color-brand-orange`, `--color-cream`, `--color-yellow`, `--color-muted`, `--color-border` to the `@theme` block in `src/app/globals.css`. Pick **one** orange and **one** cream. This is the highest-leverage change in the codebase and unlocks every following item.
2. **`src/components/sections/BuySellSplit.tsx`** — uses both shades of orange across two adjacent CTAs on every page that imports it. The most visible single-file payoff.
3. **`src/components/sections/SiteHeader.tsx`** — sets the orange header bar that frames every page; switching it to a token guarantees the header matches all CTAs below it.
4. **`src/components/auth/SignUpForm.tsx`** (and the rest of `src/components/auth/`) — five forms that each duplicate `bg-[#FAF6EB]` input styling and `rgb(230,78,33)` button styling. After tokens land, this is the cluster that benefits most from a parallel `ui/Input` + `ui/Button` extraction (see `05-component-duplication.md`).
5. **`src/app/playbook/page.tsx` + `src/app/playbook/[slug]/page.tsx`** — six independent inline uses of `#FCE16E` for the category pill. Hot path for any future rebrand; should become a single `<CategoryPill>` reading from a token.
