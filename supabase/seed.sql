-- Pass The Plate — seed data
-- Listings for local development and previews. All rows are status='active'
-- with seller_id NULL so the marketplace renders without any auth wiring.
-- Partners and playbook posts will be appended in follow-up prompts.

insert into listings (
  slug,
  title,
  description,
  industry,
  cuisine,
  location,
  asking_price_cents,
  annual_revenue_cents,
  annual_profit_cents,
  year_established,
  staff_count,
  square_footage,
  cover_image_url,
  assets,
  view_count,
  status,
  seller_id
) values
(
  'grandmas-noods',
  'Grandma''s Noods',
  'A 17-year-old hand-pulled noodle counter on Main Street built around a Lanzhou recipe brought over by the current owner''s grandmother in the late 1990s. The signature beef-and-radish bowl moves more than 200 orders a day during the lunch rush.

The shop runs at near-capacity Tuesday through Saturday with a steady delivery business serving the surrounding office towers. Seven kitchen staff average six years of tenure, and the lease holds through 2031 with one five-year option.',
  'restaurant',
  'chinese',
  'Flushing, Queens, NY',
  138000000,
  165000000,
  29700000,
  2007,
  12,
  1800,
  '/listing-2.jpg',
  '["Hand-pull noodle station", "16-burner gas range with custom Type I hood", "Walk-in cooler (8x10)", "POS with bilingual kitchen display", "Beer & wine license (transferable)"]'::jsonb,
  2400,
  'active',
  null
),
(
  'bao-bao-town',
  'Bao Bao Town',
  'A bánh mì and bao counter on Mott Street that anchors a tight stretch of Manhattan Chinatown. The shop has worked off a four-page bilingual menu since 2014 and built a reliable hospital-delivery business that now drives roughly 60% of revenue.

Eight stools and a small standing bar handle dine-in traffic. Two full-time line cooks have signaled they would stay under new ownership, and the lease has six years left at $7,800 per month with a documented 3% annual escalator.',
  'restaurant',
  'vietnamese',
  'Chinatown, Manhattan, NY',
  92000000,
  104000000,
  16640000,
  2014,
  9,
  1200,
  '/listing-1.png',
  '["3-deck commercial bao steamer", "Sandwich prep line with refrigerated rail", "Two reach-in freezers", "POS with DoorDash and Uber Eats integration", "Vietnamese phin coffee setup", "Walk-in cooler (6x8)"]'::jsonb,
  2100,
  'active',
  null
),
(
  '1800-dumplings',
  '1800-Dumplings',
  'A 26-year-old dumpling house on Broadway in Elmhurst that hand-folds an average of 1,800 pieces a day across pork, chive-egg, and lamb-cumin varieties. A four-person folding line works alongside a wholesale account selling frozen trays to two local grocery chains.

The 38-seat dining room fills up for weekend dim-sum-style brunch, and wholesale revenue accounts for roughly 22% of top-line sales. The retiring owner is willing to stay on as a paid consultant for up to six months.',
  'restaurant',
  'chinese',
  'Elmhurst, Queens, NY',
  162000000,
  192000000,
  34560000,
  1998,
  15,
  2200,
  '/listing-3.jpg',
  '["Dedicated dumpling folding station (4 seats)", "Two 40-quart commercial mixers", "Walk-in freezer (10x12) for wholesale stock", "Vacuum tray sealer", "POS with bilingual receipts", "Two wholesale delivery vans (2019 and 2021)"]'::jsonb,
  1900,
  'active',
  null
),
(
  'yum-cha-matcha',
  'Yum Cha Matcha',
  'A modern Japanese-influenced bakery and matcha bar near the LIC waterfront, opened in 2019. The back kitchen turns out roughly 600 daikon-pastry rolls and 1,200 mochi-cream pastries a week, and the front of house pulls 75 ceremonial-grade matcha drinks on a typical weekday.

Weekend mornings clear 200 drinks before noon, fueled by a 38,000-follower Instagram audience. The owners are relocating overseas and are motivated to close before the end of Q3.',
  'bakery',
  'japanese',
  'Long Island City, Queens, NY',
  78000000,
  68000000,
  10880000,
  2019,
  6,
  950,
  '/listing-4.png',
  '["Two stone matcha mills", "Convection deck oven", "Two-group La Marzocco espresso bar", "Refrigerated and ambient display cases", "Six-month branded packaging supply"]'::jsonb,
  1700,
  'active',
  null
),
(
  'hello-chef',
  'Hello Chef',
  'An open-kitchen Sichuan concept on Orchard Street with a 22-seat counter facing a six-station wok line. The chef-owner trained in Chengdu and rotates the menu seasonally around regional dishes that have landed the room on three citywide press lists since 2021.

A four-week reservation backlog is now standard on weekends, and the operation is profitable across all four quarters without a sommelier or bar manager. The owner is opening a second concept in Boston and wants to divest cleanly.',
  'restaurant',
  'chinese',
  'Lower East Side, Manhattan, NY',
  245000000,
  268000000,
  53600000,
  2011,
  18,
  3200,
  '/images/brand/chef.JPG',
  '["Six-station wok line with high-pressure hood", "Open-counter dining (22 seats) plus 18-seat back room", "Full liquor license (transferable)", "Walk-in cooler and walk-in freezer", "Resy reservation contract through 2027", "Four-camera POS-integrated security system"]'::jsonb,
  800,
  'active',
  null
),
(
  'night-market-hawker',
  'Night Market Hawker',
  'A Singapore-style hawker concept on 8th Avenue in Sunset Park modeled after a Geylang stall. The chef-owner is a third-generation hawker who immigrated in 2014 and built the menu around chicken rice, char kway teow, and laksa.

A 28-seat dining room runs at 70/30 dine-in to delivery, with weekend evenings driving the largest single-shift volume. A leased back patio adds 12 seats from April through October. The owner will commit to a six-month transition.',
  'restaurant',
  'pan_asian',
  'Sunset Park, Brooklyn, NY',
  108000000,
  124000000,
  21080000,
  2016,
  11,
  1800,
  '/images/brand/dinner_table.jpeg',
  '["Five-station hawker-style cooking line", "Vented Type I hood (installed 2022)", "Outdoor patio lease (April–October)", "POS with QR-order tablets at every table", "Full chinaware and serviceware inventory", "90-day branded delivery packaging supply"]'::jsonb,
  600,
  'active',
  null
),
(
  'lotus-cocktail-lounge',
  'Lotus Cocktail Lounge',
  'A pan-Asian cocktail lounge on Berry Street with a 14-stool bar, two banquettes, and a 36-seat back garden open seasonally. The beverage program leans on rice spirits, shochu, and house-pickled garnishes; a tight nine-item plate menu is built for shared bar dining.

The room runs a four-night service week (Wed–Sat), a deliberate choice that has held labor at 24% of revenue. Two co-owners are amicably separating and committed to a clean handover with all custom bar tooling included.',
  'restaurant',
  'pan_asian',
  'Williamsburg, Brooklyn, NY',
  198000000,
  215000000,
  43000000,
  2015,
  14,
  2400,
  '/images/brand/girsl.JPG',
  '["Full liquor license (transferable)", "14-stool custom hardwood bar", "Back garden seating (36 seats, seasonal)", "Two-keg draft system (pre-plumbed for four)", "Resy reservation contract", "Walk-in beverage cooler"]'::jsonb,
  450,
  'active',
  null
),
(
  'ramen-ya',
  'Ramen-ya',
  'A 16-year-old tonkotsu shop on East 45th Street with a dedicated broth kitchen and a 48-seat dining room half a block from Grand Central. Two custom 80-gallon stock pots run a 24-hour pork-bone simmer that yields an average of 320 bowls per service.

Lunch is heavily commuter-driven and rebounded to 92% of pre-pandemic volume by mid-2024. The retiring owner will provide a 90-day transition, and a pre-built second location in Hudson Yards is available as a separate transaction.',
  'restaurant',
  'japanese',
  'Midtown East, Manhattan, NY',
  335000000,
  278000000,
  55600000,
  2008,
  22,
  4200,
  '/images/brand/noodles.jpeg',
  '["Two 80-gallon custom broth pots", "In-house noodle-cutting machine", "Vented broth kitchen separate from main line", "Beer and sake license (transferable)", "POS with multilingual menu support", "48-seat dining room plus 8-stool counter"]'::jsonb,
  380,
  'active',
  null
),
(
  'family-table',
  'Family Table',
  'A 32-year-old Vietnamese family restaurant on 5th Avenue, run by the same household since 1992. A 36-seat dining room serves phở, bún, and a small grill menu, with the kitchen staffed entirely by family members and one long-tenured cook.

Revenue has been steady but flat for a decade — clear room for marketing-driven growth under a new operator. The founding couple is retiring; the lease holds eight years at $4,200 per month for 1,400 square feet, and the buyer is asked to honor the current staff for 90 days.',
  'restaurant',
  'vietnamese',
  'Sunset Park, Brooklyn, NY',
  62000000,
  74000000,
  10360000,
  1992,
  8,
  1400,
  '/images/brand/IMG_2672.JPG',
  '["House phở broth and nuoc cham recipes (transferable)", "Eight-burner range with vented hood", "Walk-in cooler (8x8)", "36-seat dining room", "POS system (replaced 2023)", "Below-market lease through 2034"]'::jsonb,
  220,
  'active',
  null
);

-- Pass The Plate — partner directory
-- Vetted F&B-focused service providers (lenders, attorneys, brokers,
-- accountants, insurance) shown on the partners surface. Four are featured
-- across the major specialty buckets; all rows are pre-approved so they
-- render in development without a moderation step.

insert into partners (
  full_name,
  job_title,
  company,
  email,
  phone,
  website,
  address,
  languages,
  bio,
  specialty,
  approved,
  featured,
  referral_source
) values
(
  'Wei Chen',
  'Senior SBA Loan Officer',
  'East River Capital Bank',
  'wei.chen@eastrivercap.com',
  '(212) 555-0142',
  'https://eastrivercap.com',
  '295 Madison Ave, Suite 1402, New York, NY 10017',
  ARRAY['English', 'Mandarin', 'Cantonese'],
  'Wei structures SBA 7(a) and 504 loans for first-generation restaurant operators across the five boroughs and routinely closes acquisitions in under 60 days. He has financed more than 80 F&B deals since 2019 and works directly with sellers and brokers to keep escrow and SBA paperwork moving in parallel.',
  'sba_lender',
  true,
  true,
  null
),
(
  'Maria Gutierrez',
  'VP, SBA Lending',
  'Borough Community Lenders',
  'maria.gutierrez@boroughcommunity.com',
  '(212) 555-0186',
  'https://boroughcommunity.com',
  '84-09 Roosevelt Ave, Jackson Heights, NY 11372',
  ARRAY['English', 'Spanish'],
  'Maria leads SBA underwriting for the bank''s Queens and Bronx markets and specializes in immigrant-owned bakeries, taquerias, and corner restaurants. She walks first-time buyers through prequal, deposit, and post-close working-capital lines without requiring a polished pitch deck.',
  'sba_lender',
  true,
  false,
  null
),
(
  'Daniel Park',
  'SBA Underwriter',
  'Hudson Crossing Bank',
  'daniel.park@hudsoncrossing.com',
  '(212) 555-0203',
  'https://hudsoncrossing.com',
  '1185 Avenue of the Americas, 14th Fl, New York, NY 10036',
  ARRAY['English', 'Korean'],
  'Daniel underwrites SBA 7(a) loans up to $5M for Korean-American restaurant and grocery operators in Manhattan and northern Queens. He is known for converting messy seller financials into bankable packages and routinely partners with the buyer''s CPA to clean up two prior tax years before submission.',
  'sba_lender',
  true,
  false,
  null
),
(
  'Linh Nguyen',
  'Managing Partner',
  'Nguyen & Patel Immigration Law',
  'linh.nguyen@nguyenpatel.com',
  '(212) 555-0247',
  'https://nguyenpatel.com',
  '30 Vesey St, Suite 800, New York, NY 10007',
  ARRAY['English', 'Vietnamese'],
  'Linh handles E-2 and EB-5 visa applications for foreign-national restaurant buyers and has secured investor visas tied to more than 40 F&B acquisitions since 2017. She coordinates directly with brokers and SBA lenders so visa timelines do not stall closing.',
  'immigration_attorney',
  true,
  true,
  null
),
(
  'Carlos Ramirez',
  'Senior Immigration Counsel',
  'Five Boroughs Immigration Group',
  'carlos.ramirez@5boroimmigration.com',
  '(212) 555-0291',
  'https://5boroimmigration.com',
  '32-44 31st St, Astoria, NY 11106',
  ARRAY['English', 'Spanish'],
  'Carlos represents Latino restaurateurs on H-2B visas for kitchen staff and L-1 transfers for owner-operators expanding into the U.S. He maintains an active relationship with the Department of Labor and helps clients respond to RFEs without losing the prevailing-wage clock.',
  'immigration_attorney',
  true,
  false,
  null
),
(
  'Jennifer Liu',
  'Partner',
  'Liu Law Group',
  'jennifer.liu@liulawgroup.com',
  '(212) 555-0314',
  'https://liulawgroup.com',
  '41 Elizabeth St, Suite 503, New York, NY 10013',
  ARRAY['English', 'Mandarin', 'Cantonese'],
  'Jennifer advises Mandarin- and Cantonese-speaking buyers on E-2 treaty investor visas tied to restaurant and grocery acquisitions. She is fluent in cross-border tax compliance and routinely coordinates with mainland China and Hong Kong counsel on source-of-funds documentation.',
  'immigration_attorney',
  true,
  false,
  null
),
(
  'Sophia Tran',
  'Senior Broker',
  'Crossroads Restaurant Brokers',
  'sophia.tran@crossroadsbrokers.com',
  '(212) 555-0358',
  'https://crossroadsbrokers.com',
  '28 W 36th St, 9th Fl, New York, NY 10018',
  ARRAY['English', 'Vietnamese'],
  'Sophia brokers full-service restaurant sales between $500K and $4M with a focus on Vietnamese, pan-Asian, and Sichuan concepts. She runs every listing with a bilingual marketing package and a pre-vetted buyer pool so sellers can move quickly without re-cutting the deal.',
  'bilingual_broker',
  true,
  true,
  null
),
(
  'Kevin Cho',
  'Managing Broker',
  'Asian American Hospitality Brokers',
  'kevin.cho@aahbrokers.com',
  '(212) 555-0402',
  'https://aahbrokers.com',
  '35-30 Union St, Flushing, NY 11354',
  ARRAY['English', 'Korean'],
  'Kevin specializes in turnkey Korean BBQ, banchan, and bakery sales across Flushing, Murray Hill, and Bayside. He handles seller financials, lease assignment negotiation, and POS handover in-house so a buyer can take possession with revenue intact.',
  'bilingual_broker',
  true,
  false,
  null
),
(
  'Diego Ruiz',
  'Senior Broker',
  'Plate & Counter Brokerage',
  'diego.ruiz@plateandcounter.com',
  '(212) 555-0436',
  'https://plateandcounter.com',
  '162 Smith St, Brooklyn, NY 11201',
  ARRAY['English', 'Spanish'],
  'Diego represents both Latino sellers and bilingual buyers on Brooklyn taqueria, panaderia, and corner-restaurant deals from Sunset Park to Bushwick. He handles letters of intent, asset allocations, and DOH walkthroughs so first-time buyers do not get blindsided at closing.',
  'bilingual_broker',
  true,
  false,
  null
),
(
  'Anna Wong',
  'Managing Partner',
  'Wong & Sato CPA',
  'anna.wong@wongsato.com',
  '(212) 555-0471',
  'https://wongsato.com',
  '22 E Broadway, Suite 401, New York, NY 10002',
  ARRAY['English', 'Cantonese', 'Mandarin'],
  'Anna leads a 14-CPA practice that handles Quality of Earnings reports, sell-side cleanup, and post-close tax structuring for F&B operators across Manhattan and Brooklyn. She rebuilds three years of cash-heavy financials into bankable packages and represents clients in IRS audits without breaking stride on the closing timeline.',
  'accountant',
  true,
  true,
  null
),
(
  'Roberto Salazar',
  'Senior Tax Accountant',
  'Salazar Associates',
  'roberto.salazar@salazarcpa.com',
  '(212) 555-0519',
  'https://salazarcpa.com',
  '2785 3rd Ave, Bronx, NY 10455',
  ARRAY['English', 'Spanish'],
  'Roberto provides bilingual accounting and tax planning for Bronx and upper Manhattan restaurant owners, including S-corp elections, sales-tax filings, and payroll cleanup. He works with first-time buyers on opening-balance-sheet preparation so the new ownership entity is audit-ready from day one.',
  'accountant',
  true,
  false,
  null
),
(
  'Sandra Morales',
  'Senior Hospitality Insurance Broker',
  'Five Boroughs Insurance Group',
  'sandra.morales@5boroins.com',
  '(212) 555-0563',
  'https://5boroins.com',
  '88 Pine St, 18th Fl, New York, NY 10005',
  ARRAY['English', 'Spanish'],
  'Sandra places general liability, liquor liability, workers'' comp, and property coverage for independent F&B operators across all five boroughs. She quotes binder-ready policies with five business days'' notice so a closing does not slip on the insurance contingency.',
  'insurance',
  true,
  false,
  null
);

-- Pass The Plate — playbook posts
-- Long-form editorial content for the Playbook surface. All rows are
-- published with staggered published_at timestamps so the index sorts
-- naturally by recency.

insert into playbook_posts (
  slug,
  title,
  excerpt,
  body_md,
  category,
  cover_image_url,
  author_name,
  published,
  published_at
) values
(
  'asian-fnb-market-entry-guide-us',
  'The Asian F&B Market Entry Guide to the US',
  'New York rewards Asian F&B operators who arrive with capital structured for the SBA process and a visa pathway tied to the deal — not the other way around.',
  $$New York is the densest Asian F&B market in the country, with established supply chains for fresh noodles, soy products, and live seafood that you will not find at scale anywhere else in the U.S. That density is the reason most foreign operators arrive here first — and also the reason the city is unforgiving when you skip steps.

The most common entry mistake is chasing a buildout. New construction in NYC means 9–14 months of permitting, hood and grease-trap approvals, and Department of Buildings sign-offs before you can serve a single bowl. Acquisitions move in 60–90 days because the kitchen, hood, gas line, and certificate of occupancy already exist. For a first deal, buying an operating restaurant is almost always the right move.

Capital prep matters more than the listing you fall in love with. Plan for 10–25% down on the purchase price, plus three to six months of working capital. If part of your down payment is coming from family in Asia, document the wire trail and gift letters now — SBA underwriters and immigration officers will ask for the same paperwork from different angles, and unexplained transfers will stall both processes simultaneously.

If you are buying from outside the U.S., pick the visa first and size the deal around it. An E-2 application looks at the investment relative to the cost of the business; an EB-5 has a hard floor of $800K in a Targeted Employment Area. Working backwards from a visa makes the search disciplined instead of aspirational.$$,
  'market_entry',
  '/images/brand/chef.JPG',
  'Pass The Plate Editorial',
  true,
  now() - interval '27 days'
),
(
  'eb5-e2-l1-which-visa',
  'Which Visa Works for Me? EB-5, E-2, or L-1?',
  'For most first-time restaurant buyers from Asia, E-2 wins on speed and cost; EB-5 buys a green card; L-1 only works if you already operate a related business overseas.',
  $$The E-2 treaty investor visa is the workhorse for first-time restaurant buyers — when you qualify. It is fast (3–6 months), there is no fixed minimum investment (we typically see $100K–$300K for a small restaurant), and it renews indefinitely as long as the business operates. The catch: your country of citizenship has to be on the State Department's treaty list. Taiwan, South Korea, Japan, Thailand, the Philippines, and Singapore are in. Mainland China, India, and Vietnam are not. If you hold a passport from Grenada or Turkey by investment, you are eligible — that is a legitimate path some buyers take.

EB-5 buys you a conditional green card and, after two years, full permanent residency for you, your spouse, and unmarried children under 21. The minimum investment is $800K in a Targeted Employment Area (most NYC outer-borough neighborhoods qualify) or $1.05M elsewhere. The job-creation requirement is 10 full-time positions within two years, which a real restaurant can usually meet but a ghost kitchen cannot. Source-of-funds documentation is the single hardest part — plan on six to nine months just for that paperwork.

L-1 is narrow: you must have run a qualifying business outside the U.S. for at least one year as an executive or specialized employee, and the U.S. entity has to be related (parent, subsidiary, branch, or affiliate). For most independent restaurant buyers this does not fit. It works when an established Hong Kong or Seoul restaurant group is opening a Manhattan location.

Talk to an immigration attorney before you sign an LOI. The same restaurant can be a strong E-2 deal and a weak EB-5 deal simply because of how the purchase price allocates between goodwill, equipment, and working capital.$$,
  'visa_immigration',
  '/images/brand/dumplings.JPG',
  'Pass The Plate Editorial',
  true,
  now() - interval '2 days'
),
(
  'sba-7a-loan-first-restaurant',
  'How to Use SBA 7(a) Loans to Buy Your First Restaurant',
  'An SBA 7(a) can finance up to 90% of a restaurant acquisition on 10-year terms, but the seller''s books need to be clean before underwriting will touch the deal.',
  $$The SBA 7(a) program goes up to $5M, requires 10–15% down from the buyer, and amortizes over 10 years for a business-only acquisition (25 years if real estate is included). For a first-time restaurant buyer that often means putting $150K–$250K down on a $1.5M deal — the bank covers the rest. Rates float around prime + 2.25% to 2.75% depending on loan size.

Underwriting kills most restaurant deals at the financials stage. The bank wants three years of seller tax returns, three years of P&Ls that reconcile to those returns, monthly bank statements, sales tax filings, and a current rent roll. Cash sales that never hit the tax return are the most common dealbreaker — if the seller's "real" revenue is 30% higher than what the IRS sees, the bank can only lend against the documented number. Same with off-the-books staff and informal rent arrangements.

Get pre-qualified before you sign an LOI, not after. A serious lender can issue a pre-qual letter against your personal financials in two weeks; that letter strengthens your offer and gives you a realistic ceiling. Once you are under contract the clock is real: a 7(a) typically takes 60–90 days from complete application to funding, and any document gap restarts a 5–10 day cycle.

Use a Preferred Lender (PLP) bank rather than a bank that submits to SBA centrally. PLPs underwrite in-house with delegated authority, which usually saves three to four weeks. East Coast banks with strong restaurant practices include Live Oak, Newtek, and several community banks in Queens and Manhattan. Ask the lender how many F&B 7(a) deals they closed last year — under 10 is a yellow flag.$$,
  'finance',
  '/images/brand/noodles.jpeg',
  'Pass The Plate Editorial',
  true,
  now() - interval '5 days'
),
(
  '30-point-due-diligence-checklist',
  '30-Point Due Diligence Checklist for Restaurant Acquisitions',
  'A serious due diligence pass on an NYC restaurant goes well beyond financials — Department of Health grades, lease assignment terms, and equipment age can each break the deal on their own.',
  $$**Financials (10 items).** Three years of federal and state tax returns; three years of monthly P&Ls reconciled to those returns; current AR and AP aging; quarterly sales tax filings; payroll registers including any 1099 contractors; merchant processor statements (Square, Toast, Clover); third-party delivery statements (DoorDash, Uber Eats, Grubhub); 12 months of bank statements; vendor invoices for the top 10 suppliers; current inventory count with cost basis.

**Legal and licensing (8 items).** The full lease and any amendments — confirm the assignment clause, percentage rent, CAM, and remaining option terms; current liquor license and any pending complaints; DOH inspection history for the last three years (publicly searchable); fire and FDNY records; sidewalk café permit if applicable; certificate of occupancy matching the restaurant use; pending lawsuits or workers' comp claims; any ABC violations.

**Operational (7 items).** Equipment list with age, model, and service contracts; hood cleaning records (most leases require quarterly); walk-in cooler and freezer inspection; HVAC service history; pest control contract; current POS contract and any data export rights; key vendor relationships including any volume rebates that do not transfer.

**People (5 items).** Staff roster with tenure, role, and pay rate; immigration status disclosure under a confidentiality agreement (this matters more than buyers expect); whether key staff have signed letters of intent to stay; any non-compete or non-solicitation clauses; the chef's recipes — confirm they transfer in the asset purchase agreement.

Red flags that should re-open price negotiation: declining covers over the last 12 months that cannot be explained by a temporary closure, a lease with under five years remaining and no option, deferred maintenance over $50K, recipes that exist only in the owner's head, or a cash-sales gap above 15% of reported revenue.$$,
  'buying',
  '/images/brand/dinner_table.jpeg',
  'Pass The Plate Editorial',
  true,
  now() - interval '9 days'
),
(
  'valuing-restaurant-before-selling',
  'How To Value Your Restaurant Before Selling',
  'Most NYC restaurants sell at 2–4× SDE depending on location, lease length, and revenue stability — clean tax returns are what move the multiple, not the dining-room story.',
  $$Seller's Discretionary Earnings (SDE) is the right number for most independent restaurants under $3M in revenue. Start with net income on the tax return, then add back: owner compensation and benefits; one-time expenses (a new walk-in, a one-off legal bill); interest and depreciation; any personal expenses run through the business that a buyer would not have. The result is what the business actually generates for an owner-operator. That is the number a multiple gets applied to.

Multiples by segment, drawn from NYC closings over the last 24 months: a small takeout-driven shop with under $500K revenue trades at 1.5–2.5× SDE. A full-service neighborhood restaurant with stable repeat business sits at 2–3×. An established concept with a real brand, a long lease, and documented systems can clear 3–4×, occasionally higher. Lease length is the single biggest swing factor — under five years remaining will knock at least half a turn off your multiple, no matter how good the food is.

There is also an asset value floor: equipment at depreciated replacement cost, leasehold improvements, transferable licenses (especially liquor), and any recipe IP. For most restaurants this floor sits between $150K and $500K and matters when SDE-based valuation comes in low.

If you are 12 months out from selling, the work is bookkeeping. Run cash sales through the POS and the tax return — a year of clean reporting moves the bankable revenue number more than any cosmetic upgrade. Renew or extend the lease. Document SOPs and recipes so a buyer is not buying you. Service the major equipment. Asking price is what you list at; closing price is what survives the buyer's due diligence and the lender's appraisal — in this market they are typically 10–20% apart.$$,
  'selling',
  '/images/brand/girsl.JPG',
  'Pass The Plate Editorial',
  true,
  now() - interval '14 days'
),
(
  'lease-assignments-asian-restaurant-owners',
  'What Asian Restaurant Owners Need to Know About Lease Assignments',
  'A restaurant lease assignment is a separate transaction from the business sale, and most NYC landlords run a 30–60 day approval window — start it the day you sign the LOI.',
  $$Almost every NYC commercial lease has an assignment clause that requires landlord consent. That consent is rarely automatic. The landlord will run a credit check on the buyer, ask for two years of personal and business financials, request a business plan, and almost always require a personal guaranty. Build 30–60 days into your closing timeline for this — and start the package the day the LOI is signed, not the day the contract is signed.

There are two paths and they are not the same. A pure assignment transfers the existing lease as-is, with the buyer stepping into the seller's shoes. A new lease means the landlord rewrites terms, and that is where the leverage shifts: rent often resets to current market, the security deposit goes up, option years can shrink, and personal guaranty terms can expand. If you are the buyer, push hard for a clean assignment. If you are the seller, you cannot fully control which path the landlord chooses, but you can introduce the buyer early and warmly.

Older Asian-American landlords in Flushing, Sunset Park, and parts of Manhattan often run on relationship as much as paperwork. An in-person meeting in the buyer's primary language — Mandarin, Cantonese, Korean, or Vietnamese — has closed more lease assignments in this market than any spreadsheet. If your broker does not speak the landlord's language, bring someone who does. This is not a shortcut around the financial review; it is what makes the financial review go smoothly.

Two specifics worth pushing back on. Personal guaranties on commercial leases default to the full lease term, but a "good guy" guaranty (limited to surrender, with no future liability) is standard in NYC and most landlords will accept it. And any "additional rent" pass-throughs — real estate tax escalations, CAM increases — should be capped, not open-ended.$$,
  'legal',
  '/images/brand/dessert.JPG',
  'Pass The Plate Editorial',
  true,
  now() - interval '21 days'
);
