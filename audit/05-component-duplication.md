# Component Duplication Audit — Pass The Plate

There is no `src/components/ui/` directory. No shared `Button`, `Input`, `Card`, or `Badge` primitive exists. As a result, the orange CTA, the rounded input, and the white listing card are all inlined dozens of times.

### Search bars

- **Canonical version:** none. Two purpose-specific components live side by side and don't share a primitive:
  - `src/components/marketing/HeroSearch.tsx` — city text + industry dropdown + orange submit. Used by homepage `Hero` (`src/components/sections/Hero.tsx:19`) and the `/sell` "Listing Hotspots" section (`src/app/sell/page.tsx:88`).
  - `src/app/buy/SearchBar.tsx` — single keyword input + orange submit, lives next to `FilterBar` on `/buy`.
- **Other pages with no search:** `/partners` has none; `/playbook` uses chip-style `CategoryFilter.tsx` (not a search).
- **Recommendation:** the two existing search forms serve different jobs (filter-builder vs free-text), so keep them split — but extract the shared row of `<input>` + orange `<button>` into a single `SearchInputRow` so a future tweak to padding/radius doesn't have to be made twice.

### Listing cards

- **Canonical version:** none. Three different visual treatments, none shared.
  - `src/components/sections/TrendingHotspots.tsx:23` — full-bleed photo with overlaid title + meta gradient (homepage hero style).
  - `src/app/buy/page.tsx:124-165` — white card with photo, title, price grid, description, orange "View Listing" CTA (grid view).
  - `src/app/buy/[slug]/page.tsx` doesn't render related listings — no third style — but the playbook related-posts grid (`src/app/playbook/[slug]/page.tsx:77-97`) uses yet another card pattern with the yellow category pill.
- **Duplicates found:** all three are inline JSX in their consuming files. The grid-view card on `/buy` is the most reused-looking (cover image + title + meta + price grid + CTA) and is also the most likely to appear next on `/account` ("My favorites") and on `/sell` ("Similar listings sold").
- **Recommendation:** extract `ListingCardCompact` (the `/buy` style) into `src/components/listings/ListingCard.tsx` and let `TrendingHotspots` keep its bespoke "hero tile" treatment. Don't try to unify all three — the homepage tile is a marketing surface, not a card.

### CTA buttons

- **Canonical version:** none. There is no `src/components/ui/Button.tsx`. Every orange call-to-action is inline-styled.
- **Duplicates found:** the orange-pill `<button>` / `<a>` pattern (`background: 'rgb(230,78,33)'` or `'rgb(230,80,37)'`, white text, rounded-full or rounded-3xl, `font-medium`) appears at minimum in:
  - `src/components/sections/BuySellSplit.tsx:14, 18`
  - `src/components/sections/FindYourNextBigDeal.tsx:11` (inverted: cream bg, orange text)
  - `src/components/sections/SellForm.tsx:124`
  - `src/components/sections/Subscribe.tsx` (black bg variant — same shape)
  - `src/components/marketing/HeroSearch.tsx:70`
  - `src/components/auth/{SignInForm,SignUpForm,ForgotPasswordForm,ResetPasswordForm,SignOutButton}.tsx`
  - `src/app/buy/SearchBar.tsx:31`, `src/app/buy/page.tsx:158`, `src/app/buy/[slug]/InquiryForm.tsx:60`
  - `src/app/contact/ContactForm.tsx:60`
  - `src/app/sell/page.tsx:62, 68`
  - `src/app/playbook/SubscribeCard.tsx`
- Two slightly-different orange shades are in use (`rgb(230,78,33)` ≈ `#E64E21` vs `rgb(230,80,37)` ≈ `#E65025`) — depending on the file, "the brand orange" is one or the other. See `06-design-tokens.md`.
- **Recommendation:** create `src/components/ui/Button.tsx` with `variant: 'primary' | 'inverse' | 'ghost'` and `size: 'sm' | 'md' | 'lg'`, then ban inline `background: 'rgb(230,...)'` via a lint rule. This single component would replace ~25 inline button styles and would also fix the two-shades-of-orange bug for free.

### Form inputs

- **Canonical version:** none. There is no `src/components/ui/Input.tsx`.
- **Duplicates found:** `<input>` and `<textarea>` are styled inline in:
  - `src/components/auth/SignInForm.tsx:7` defines a local constant `inputClasses` and reuses it three times in the same file.
  - `src/components/auth/{SignUpForm,ForgotPasswordForm,ResetPasswordForm}.tsx` each have their own near-identical class strings (`rounded-full border border-black/15 bg-[#FAF6EB] px-5 py-3`).
  - `src/components/sections/SellForm.tsx`, `src/components/sections/Subscribe.tsx`, `src/components/marketing/HeroSearch.tsx`, `src/app/buy/SearchBar.tsx`, `src/app/buy/FilterBar.tsx`, `src/app/buy/[slug]/InquiryForm.tsx`, `src/app/contact/ContactForm.tsx`, `src/app/playbook/SubscribeCard.tsx` each have their own class strings.
- The auth forms use `bg-[#FAF6EB]` (cream-tinted), but other forms use `bg-white`. Two separate input styles exist and they're getting copy-pasted within their cohort.
- **Recommendation:** extract `Input`, `Textarea`, and a wrapper `Field` (label + input + error) into `src/components/ui/`. Pass an optional `tone: 'default' | 'auth'` to keep the cream-vs-white background distinction explicit, then delete `inputClasses` from `SignInForm` and the inline string from every other consumer.

### `FindYourNextBigDeal` and `BuySellSplit`

- **Canonical version:** both are single components. Confirmed.
  - `src/components/sections/FindYourNextBigDeal.tsx` (one definition).
  - `src/components/sections/BuySellSplit.tsx` (one definition).
- **Duplicates found:** none — every page imports from these paths. They're rendered on `/`, `/about`, `/buy`, `/buy/[slug]`, `/sell`, `/contact`, `/playbook`, `/playbook/[slug]`.
- **Recommendation:** no change needed. Worth noting these two are the *good* example — extracted once, imported everywhere — and they're also the best argument for promoting `Button`, `Input`, and `ListingCard` to the same treatment.

### Bonus finding — `AuthShell`

`src/components/auth/AuthShell.tsx` already wraps sign-in / sign-up / forgot / reset with a shared layout (header, white card, footer). This is the model the `ListingCard` and `Button` extractions should follow.

### Bonus finding — site-wide chrome

`SiteHeader`, `SiteFooter`, `Hero`, `StatsBand`, `PartnerLogos`, `ValueProps`, `Subscribe` are all single components used across multiple pages. The duplication problem is concentrated entirely in *primitives* (button, input, card), not in *sections*.
