-- Pass The Plate — migration 010
-- Locale (zh-CN) translation columns for DB-backed content surfaces.
--
-- Architecture: parallel *_zh columns on each translatable table.
-- When the active locale is 'zh', the lib/* fetch helpers overlay
-- the *_zh value over the canonical English column at read time;
-- a null *_zh falls back to the English value, so /zh pages render
-- without holes even if a row hasn't been translated yet.
--
-- Listings translate automatically via the new lib/translate.ts
-- (Anthropic SDK) the first time a Chinese reader hits a detail
-- page; the result is cached back into title_zh / description_zh
-- so the second visit is a regular read.
--
-- Partners and playbook posts intentionally do NOT auto-translate.
-- Bio and article content is high-stakes editorial copy that needs
-- a native Mandarin reviewer pass. PR3b/PR3c land manual translations
-- by populating these columns directly via SQL.
--
-- locale_translation_updated_at lets us detect when an English source
-- has been edited after a Chinese translation was cached, so a
-- future cron / webhook can re-translate stale rows.

alter table public.listings
  add column if not exists title_zh text,
  add column if not exists description_zh text,
  add column if not exists locale_translation_updated_at timestamptz;

alter table public.partners
  add column if not exists job_title_zh text,
  add column if not exists company_zh text,
  add column if not exists bio_zh text,
  add column if not exists locale_translation_updated_at timestamptz;

alter table public.playbook_posts
  add column if not exists title_zh text,
  add column if not exists excerpt_zh text,
  add column if not exists body_md_zh text,
  add column if not exists locale_translation_updated_at timestamptz;

-- Verification (uncomment in SQL editor):
-- select column_name from information_schema.columns where table_schema='public' and table_name='listings' and column_name like '%_zh%';
-- select column_name from information_schema.columns where table_schema='public' and table_name='partners' and column_name like '%_zh%';
-- select column_name from information_schema.columns where table_schema='public' and table_name='playbook_posts' and column_name like '%_zh%';
