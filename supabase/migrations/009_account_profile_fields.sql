-- Pass The Plate — migration 009
-- Adds rich profile fields used by the new /account dashboard:
--   role_title, company, locations, is_verified_partner,
--   membership_tier, avatar_url
--
-- (Note: 008 was already used for listings RLS / storage; this is the
-- next available slot. The original brief named this 008, but renumbering
-- avoids clobbering the prior migration history.)
--
-- After applying, run the verification select at the bottom to confirm
-- the seed update populated Mathiew's profile.

alter table public.profiles
  add column if not exists role_title text,
  add column if not exists company text,
  add column if not exists locations text[],
  add column if not exists is_verified_partner boolean default false,
  add column if not exists membership_tier text default 'first_bite',
  add column if not exists avatar_url text;

-- Seed Mathiew's profile (founder).
update public.profiles
set
  full_name = 'Mathiew Wilson',
  role_title = 'Founder & Principal Broker',
  company = 'Alignment New York',
  locations = array['New York, USA', 'Lake Como, Italy', 'Shanghai, China'],
  is_verified_partner = true,
  membership_tier = 'chefs_table'
where id = '1c8b6ef8-ef2e-43b7-93e9-268c9fd2ad9d';

-- Verification (uncomment and run in SQL editor):
-- select id, full_name, role_title, company, locations, is_verified_partner, membership_tier from profiles where id = '1c8b6ef8-ef2e-43b7-93e9-268c9fd2ad9d';
