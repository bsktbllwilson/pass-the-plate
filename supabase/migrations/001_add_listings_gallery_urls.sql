-- Pass The Plate — migration 001
-- Adds gallery_urls (text[]) to listings and backfills the nine seeded rows
-- with a small set of brand images that thematically fit each concept.
-- Idempotent — safe to re-run.

alter table listings
  add column if not exists gallery_urls text[] not null default '{}';

update listings set gallery_urls = array['/images/brand/noodles.jpeg', '/images/brand/dinner_table.jpeg'] where slug = 'grandmas-noods';
update listings set gallery_urls = array['/images/brand/dinner_table.jpeg', '/images/brand/dumplings.JPG'] where slug = 'bao-bao-town';
update listings set gallery_urls = array['/images/brand/dumplings.JPG', '/images/brand/dinner_table.jpeg'] where slug = '1800-dumplings';
update listings set gallery_urls = array['/images/brand/dessert.JPG'] where slug = 'yum-cha-matcha';
update listings set gallery_urls = array['/images/brand/dinner_table.jpeg', '/images/brand/noodles.jpeg'] where slug = 'hello-chef';
update listings set gallery_urls = array['/images/brand/noodles.jpeg', '/images/brand/chef.JPG'] where slug = 'night-market-hawker';
update listings set gallery_urls = array['/images/brand/dinner_table.jpeg', '/images/brand/dessert.JPG'] where slug = 'lotus-cocktail-lounge';
update listings set gallery_urls = array['/images/brand/dinner_table.jpeg', '/images/brand/chef.JPG'] where slug = 'ramen-ya';
update listings set gallery_urls = array['/images/brand/dinner_table.jpeg', '/images/brand/noodles.jpeg'] where slug = 'family-table';
