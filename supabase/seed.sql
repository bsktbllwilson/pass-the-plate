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
