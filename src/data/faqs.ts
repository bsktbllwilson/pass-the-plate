export type Faq = {
  id: string
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    id: 'whats-included',
    question: "What's included in my Pass The Plate plan?",
    answer:
      "Every plan includes a bilingual listing, valuation tools, advisor matchmaking, and access to our vetted buyer network. Higher tiers add a dedicated success manager, priority placement in newsletter and search, and unlimited document review with our partner attorneys.",
  },
  {
    id: 'change-plan',
    question: 'How can I upgrade, downgrade, or cancel my subscription?',
    answer:
      "You can change or cancel your plan at any time from the billing tab in your account settings. Downgrades take effect at the end of your current billing period; upgrades are prorated and take effect immediately. There are no cancellation fees and no questions asked.",
  },
  {
    id: 'data-use',
    question: 'Where will my information be used?',
    answer:
      "Your business and financial information is shared only with vetted buyers who have completed our verification — proof of funds or SBA pre-qualification — and only after you approve each match. We never sell your data and never share contact information without your consent.",
  },
  {
    id: 'who-benefits',
    question: 'Who can benefit from the Pass The Plate plan?',
    answer:
      "Owners selling an Asian F&B business, buyers seeking their first restaurant, multi-unit operators expanding into new markets, and immigrants entering the U.S. market on E-2, L-1, or EB-5 visas. Our advisor network is structured to support all four use cases.",
  },
  {
    id: 'find-broker',
    question: "I'd like a personal broker, how can I find one that fits my needs?",
    answer:
      "Tell us your language, market, and deal size from the partner-match form and we'll introduce you to two or three bilingual brokers who have closed similar deals. Initial calls are free and there's no obligation to engage.",
  },
  {
    id: 'buying-process',
    question: 'What is the buying process like? Are there any additional fees?',
    answer:
      "After you find a listing, you'll submit proof of funds, sign an NDA, then receive the full CIM and meet the seller. Diligence typically runs 30–60 days. Pass The Plate charges buyers nothing — fees are paid by sellers as a success fee, only if a deal closes.",
  },
]
