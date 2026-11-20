-- DigitalMAFA Favorites / Wishlist (Firebase Auth + Supabase)
-- First configure Firebase as a Third-Party Auth provider in Supabase.

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  service_id text not null,
  service_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint favorites_user_service_unique unique (user_id, service_id),
  constraint favorites_expiry_after_created check (expires_at > created_at)
);

create index if not exists favorites_user_expiry_idx
  on public.favorites (user_id, expires_at);

alter table public.favorites enable row level security;

drop policy if exists "Users read own favorites" on public.favorites;
drop policy if exists "Users insert own favorites" on public.favorites;
drop policy if exists "Users update own favorites" on public.favorites;
drop policy if exists "Users delete own favorites" on public.favorites;

-- Firebase JWT subject is the Firebase UID (text, not auth.uid() UUID).
-- Include anon because Firebase JWTs without a custom role claim are mapped
-- to the anon Postgres role by Supabase. Unauthenticated requests have no sub.
create policy "Users read own favorites" on public.favorites
  for select to anon, authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "Users insert own favorites" on public.favorites
  for insert to anon, authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "Users update own favorites" on public.favorites
  for update to anon, authenticated
  using (user_id = (select auth.jwt()->>'sub'))
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "Users delete own favorites" on public.favorites
  for delete to anon, authenticated
  using (user_id = (select auth.jwt()->>'sub'));

-- Daily cleanup: records become inaccessible exactly at expires_at; this job
-- physically deletes expired rows once per day. The page also cleans up on visit.
create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule(jobid) from cron.job where jobname = 'digitalmafa-delete-expired-favorites';

select cron.schedule(
  'digitalmafa-delete-expired-favorites',
  '15 0 * * *',
  $$delete from public.favorites where expires_at <= now();$$
);
