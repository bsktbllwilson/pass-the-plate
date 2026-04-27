export type PlaybookPost = {
  slug: string
  title: string
  excerpt: string
  body_md: string
  category: 'buying' | 'selling' | 'legal' | 'visa_immigration' | 'market_entry' | 'operations' | 'finance'
  cover_image_url: string
  author_name: string
  published_at: string
}

export const POSTS: PlaybookPost[] = [
  {
    slug: 'asian-fb-market-entry-guide',
    title: 'The Asian F&B Market Entry Guide to the US',
    excerpt:
      "What it actually takes for an established Asian F&B operator to launch in the US — entity, capital, immigration, and operations sequenced in the order that real deals close.",
    body_md: `Most Asian F&B brands that try to enter the US fail not because of the market, but because of sequencing. Founders arrive with a strong concept and capital, then spend nine months working through entity formation, banking, lease negotiation, and visa filings in the wrong order — burning runway and missing the window of seasonal demand. The order matters.

The typical winning sequence starts with US entity formation (almost always a Delaware C-corp or LLC, depending on the visa pathway), followed by an EIN, a US business bank account, and a payroll provider. None of these require you to be physically present, but they do require a US address and, in some cases, a US-resident officer or registered agent. Skipping any one of these will block the next step in immigration filings.

Capital structuring comes next. The right structure depends on whether you intend to file E-2, L-1, or EB-5 — each has different requirements for source-of-funds documentation, capital deployment timelines, and the ratio of investment to debt. Treating capital structuring as an accounting exercise rather than an immigration one is the most common and most expensive mistake new operators make.

Lease and location come after the capital structure is set. A signed lease is required to demonstrate "active and operating" status for E-2 and L-1 filings, but signing too early — before your visa is approved — locks you into rent obligations you can't yet legally use. The right window is usually a 60-day commitment period with a contingency for visa approval.

Operationally, expect at least 90 days between visa approval and opening service. Permits, hood inspections, health department certifications, and liquor license filings all run on independent timelines and need to be started in parallel. Two of these — the hood inspection and the liquor license — routinely run 12 to 16 weeks in New York City.

Finally, the marketing investment to acquire the first 1,000 customers in the US is typically two to three times what brands budget based on their home-market experience. The audience is unfamiliar with your brand, and acquisition channels — Google, Yelp, OpenTable, Resy — operate on auction dynamics that favor incumbents until you build review velocity.`,
    category: 'market_entry',
    cover_image_url: '/images/brand/chef.JPG',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-09-12',
  },
  {
    slug: 'visa-eb5-e2-l1',
    title: 'Which Visa Works for Me? EB-5, E-2, or L-1?',
    excerpt:
      "A practical comparison of the three visa pathways most Asian F&B operators consider — including capital requirements, timelines, and the operational implications of each.",
    body_md: `The three visa pathways most relevant to Asian F&B founders entering the US — EB-5, E-2, and L-1 — solve different problems. Choosing the right one depends less on price and more on your timeline, your existing business operations, and your appetite for ongoing operational presence in the US.

The E-2 treaty investor visa is renewable, relatively fast (typically 3–8 months from filing), and has no fixed minimum capital requirement, though most successful F&B filings show $150,000 to $300,000 of committed capital. The catch: E-2 is only available to nationals of countries with a US treaty of commerce — which excludes mainland China and Vietnam, but includes Japan, Korea, Singapore, the Philippines, and Taiwan. E-2 holders can renew indefinitely as long as the business remains active and operating, but the visa never converts to a green card.

The L-1A intracompany transferee visa is designed for executives or managers who have worked at a qualifying related entity abroad for at least one year in the last three. For F&B founders with an existing operating business in their home country, L-1A is often the cleanest pathway — it permits a "new office" filing for L-1A specifically, and converts to an EB-1C green card after one year of qualifying US operations. Capital requirements are not statutory but practical: enough to demonstrate the new entity will support an executive role.

EB-5 is the only one of the three that delivers a green card directly. The minimum investment is currently $1,050,000 (or $800,000 in a Targeted Employment Area), and the investment must create at least 10 full-time US jobs within two years. Direct EB-5 — where the founder builds and operates their own US restaurant — is uncommon but increasingly used by operators with sufficient capital who want a permanent residency pathway tied to a business they directly control.

The most consequential decision is usually whether you want a renewable working visa or a permanent residency pathway. E-2 and L-1 deliver speed and flexibility; EB-5 delivers permanence at substantially higher capital cost and timeline (currently 24–48 months for I-526E adjudication for most chargeability countries).

Finally, the entity-structuring decisions you make on day one constrain the visa pathway available later. Founders who form an LLC and operate for a year before consulting an immigration attorney often discover they have inadvertently structured themselves out of the L-1A pathway. Talk to an attorney before you incorporate.`,
    category: 'visa_immigration',
    cover_image_url: '/images/brand/dumplings.JPG',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-10-03',
  },
  {
    slug: 'sba-7a-restaurant-buying',
    title: 'How to Use SBA 7(a) Loans to Buy Your First Restaurant',
    excerpt:
      "SBA 7(a) is the most common financing instrument for first-time restaurant buyers in the US — here's what to expect on equity injection, terms, and approval timelines.",
    body_md: `The SBA 7(a) loan is the single most-used financing product for first-time restaurant acquisitions in the United States. It allows up to $5 million of borrowing with a 10-year term and offers significantly more lender flexibility than conventional commercial loans — which is why most independent restaurant transactions over $500,000 close with an SBA component.

The minimum equity injection for an F&B acquisition under SBA 7(a) is 10% of the total project cost, but in practice most lenders require 15–20% to feel comfortable underwriting goodwill-heavy F&B deals. That equity can come from cash, retirement rollovers (ROBS), or — in some cases — seller financing structured as a standby note. Seller financing on a five-year standby that does not require principal or interest payments during the SBA term can count toward the buyer's equity injection, which is one of the most under-used negotiating levers in F&B M&A.

Term length is typically ten years for goodwill-heavy deals (without significant real estate) and up to 25 years if the deal includes owner-occupied real estate. Interest rates are typically prime plus 2.75–3.0%, adjusted quarterly, which translates to current rates in the 11–12% range. Monthly debt service should not consume more than 70% of historical net cash flow — most lenders use a 1.4x debt service coverage ratio (DSCR) as a hard floor.

Approval timelines vary widely. A clean deal — meaning a buyer with documented W-2 income, three years of personal tax returns, a credit score above 700, and a target with three years of clean P&Ls — can close in 45–60 days. A messier deal with cash sales, missing tax filings, or first-generation operator paperwork can take 90–120 days. The bottleneck is almost always the seller's documentation, not the buyer's qualifications.

The non-negotiable buyer prep work: three years of personal tax returns, a personal financial statement, a five-year personal résumé showing relevant operating experience, and a business plan that includes a 36-month cash flow projection. Most experienced SBA loan officers will provide a template for the projections during the pre-qualification call.

Use a preferred SBA lender. Preferred lenders have authority to approve loans without sending each file to the SBA for review, which compresses your timeline by 2–4 weeks. The list of preferred lenders is publicly available on the SBA website; ask any lender you talk to whether they hold PLP status before you submit a full application.`,
    category: 'finance',
    cover_image_url: '/images/brand/noodles.jpeg',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-10-21',
  },
  {
    slug: 'restaurant-due-diligence-checklist',
    title: '30-Point Due Diligence Checklist for Restaurant Acquisitions',
    excerpt:
      "The 30 verification items that separate a clean restaurant acquisition from a six-figure post-close surprise. Print this and check every box before you wire funds.",
    body_md: `Restaurant due diligence falls into five buckets: financial, operational, legal, real estate, and people. Skip any bucket and you'll discover what you missed in the first 90 days of ownership — usually expensively.

**Financial verification.** Pull three years of tax returns and reconcile them line-by-line to the seller's P&L. Bank statements should be requested for the same period and matched against deposits. Cash sales — common in older Asian F&B operations — should be verified against POS day-end reports, not just the seller's spreadsheet. Inventory should be physically counted no more than 72 hours before closing. Sales tax returns should be reviewed for the trailing eight quarters; underreported sales tax becomes a successor liability for the buyer in most states.

**Operational verification.** Walk every shift over a 14-day diligence window. Watch open, lunch, dinner, and close on at least one weekday and one weekend day. Map the kitchen workflow against the actual line — physical layout matters more than the seller's description. Verify the POS reports match the cash drawer counts at end of shift. Check the freezer and walk-in for hidden inventory or product nearing expiration. Test the hood, the dish machine, and the HVAC; replacement of any of the three is a five-figure repair.

**Legal verification.** Pull a UCC lien search on both the seller entity and the seller individually. Review all licenses — business license, sales tax certificate, food handler permits, liquor license — and confirm transferability or assignability. Read the lease in full, then read the assignment clause three times. Verify the rent has been paid current; landlord arrears can block lease assignment at the eleventh hour. Confirm there are no pending or threatened lawsuits, including former employee wage claims.

**Real estate verification.** Request a Phase I environmental review if the property has any history of dry cleaning, gas station, or auto repair use. Verify the certificate of occupancy matches the actual use. Confirm any unpermitted build-out is documented and a plan exists to remedy or accept it. Check the roof, the grease trap, and the gas line — these are the three highest-frequency capital surprises in restaurant M&A.

**People verification.** Interview the kitchen lead, the floor lead, and at least two line cooks privately, off-premises if possible. Ask each of them whether they intend to stay under new ownership. Document the answers. Review the most recent payroll register and confirm the staff count matches the seller's representation. Check whether any staff are paid in cash; if so, you have a tax exposure and an HR exposure that must be remediated post-close.

The 30 line items above expand into a 12-page checklist most experienced brokers can share. Get the full version from your broker before you sign the LOI, not after.`,
    category: 'buying',
    cover_image_url: '/images/brand/dinner_table.jpeg',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-11-08',
  },
  {
    slug: 'how-to-value-restaurant-before-selling',
    title: 'How To Value Your Restaurant Before Selling',
    excerpt:
      "The three valuation methods serious buyers actually use, and how to position your numbers to get a price that reflects what you've built.",
    body_md: `Restaurant valuation in the lower middle market — call it deals between $400,000 and $5 million in enterprise value — is dominated by three methods: SDE multiples, EBITDA multiples, and asset-plus-goodwill. Understanding all three matters because each appeals to a different type of buyer, and a well-prepared seller positions the deal for the buyer pool with the highest willingness to pay.

**SDE (Seller's Discretionary Earnings) multiples.** SDE is your net income, plus owner compensation, plus owner benefits, plus discretionary expenses. It's the most common method for owner-operator restaurant transactions. Typical SDE multiples for independent F&B operations range from 1.8x to 3.2x depending on stability, lease quality, brand strength, and concentration of revenue. A 30-year-old neighborhood institution on a below-market lease with a transferable liquor license sits at the top of that range; a three-year-old concept on month-to-month rent sits at the bottom.

**EBITDA multiples.** EBITDA is more relevant for buyers who plan to install a salaried general manager rather than operate the business themselves — typically restaurant groups, family offices, and PE-adjacent buyers. EBITDA multiples run 4x–6x for solid F&B operations and stretch higher (7x–9x) for proven multi-location concepts with documented unit economics. The shift from SDE to EBITDA almost always benefits the seller because EBITDA-buyer pools are larger and more capitalized.

**Asset-plus-goodwill.** This method is used most often for distressed sales or restaurants with weak or unverifiable financials. It values the equipment, the leasehold improvements, the inventory, and the liquor license separately, and adds a goodwill premium for the brand and customer base. For most healthy restaurants, this method significantly undervalues the business and should be avoided as the primary framing.

The single biggest mistake sellers make is leaving "add-backs" on the table. Add-backs are owner-related expenses that a buyer would not incur — owner salary in excess of a market-rate manager, family member payroll, owner vehicle, owner insurance, personal travel, and one-time non-recurring expenses. A typical owner-operated restaurant has $80,000–$150,000 of legitimate add-backs. Documenting and defending those add-backs in your CIM (confidential information memorandum) directly increases the multiple a buyer is willing to pay.

The second-biggest mistake is selling without a CIM. A CIM is a 12–20 page deal memo covering the concept, the numbers, the lease, the staff, the assets, and the growth opportunity. It is the single document buyers use to decide whether to issue an LOI. Sellers who go to market without a CIM lose 60–90 days of marketing time recreating it deal-by-deal as buyers ask the same questions.

Finally: do not list price your restaurant before getting at least three independent valuations from brokers who have closed comparable deals in the last 12 months. The price discovery is the single most consequential decision in the entire process.`,
    category: 'selling',
    cover_image_url: '/images/brand/dessert.JPG',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-11-22',
  },
  {
    slug: 'lease-assignments-asian-restaurant-owners',
    title: 'What Asian Restaurant Owners Need to Know About Lease Assignments',
    excerpt:
      "Lease assignment is where most Asian F&B sales unravel — here's how to identify the trap clauses and negotiate them out before they kill your deal.",
    body_md: `The lease is the single highest-leverage document in a restaurant sale, and lease assignment — the legal mechanism by which the lease transfers from seller to buyer — is where most deals stall, get re-priced, or fall apart. Sellers who don't understand their assignment clause six months before going to market often discover at the eleventh hour that their landlord holds total veto power over the sale.

**The first thing to read is the assignment clause itself.** Most restaurant leases require the landlord's written consent to any assignment. The critical question is whether that consent must be "reasonable" or whether the landlord may withhold consent at sole discretion. "Reasonable consent" clauses give you legal recourse if the landlord refuses an obviously qualified buyer; "sole discretion" clauses do not. Many leases written before 2015 — common for long-tenured Asian F&B operations — are written with sole-discretion consent.

**The second thing to read is the recapture clause.** A recapture clause gives the landlord the option to terminate the lease and take back the space when you request assignment. Recapture clauses are typically activated by the request itself, not by an actual assignment, which means asking for permission can cost you the lease. If you have a recapture clause, you need to negotiate around it before you list the business — typically by securing a non-binding indication from the landlord that they will not exercise recapture for a qualified buyer.

**The third thing to read is the personal guaranty.** The selling owner often signed a personal guaranty when the lease was originally executed. That guaranty does not automatically terminate on assignment. It is common for landlords to require the selling owner to remain on a "good guy" or full personal guaranty for 12–24 months post-assignment, which means the seller continues to be financially exposed to the buyer's performance. Negotiate a hard cap and a release date as part of the assignment.

**The fourth thing to read is the use clause.** Many leases restrict the type of cuisine that may be served, the operating hours, and the trade name. A buyer who wants to change the concept — say, from a dim sum house to a hot pot — may need landlord consent to amend the use clause, which is a separate negotiation from the assignment itself. Buyers should require concept-change consent as a closing condition.

**The fifth thing to read is the assignment fee.** Many leases include a transfer fee — sometimes a flat $5,000–$25,000, sometimes a percentage of the sale price. This fee is negotiable in most cases and frequently waived for clean assignments to qualified buyers. Sellers should not pay it without asking.

The practical takeaway: pull your lease today, mark it up with these five questions, and bring it to a real estate attorney before you list. The cost is $1,500–$3,000. The cost of discovering an assignment problem at month four of marketing is the entire deal.`,
    category: 'legal',
    cover_image_url: '/images/brand/girsl.JPG',
    author_name: 'Pass The Plate Editorial',
    published_at: '2025-12-09',
  },
]
