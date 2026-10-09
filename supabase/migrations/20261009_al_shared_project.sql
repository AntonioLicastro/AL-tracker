-- Moves A/L Tracker into the shared Platinum Supabase project (the one used by
-- Easy Mileage, Compliance Wizard, Retention Hub and Platinum Hub) so it can be
-- a Platinum Hub tile with single sign-on.
--
-- Do NOT run the four older migrations in this folder against the shared
-- project: 20260819 creates open "anyone with the anon key" policies. This file
-- creates the same tables with sign-in required, restricted to a named list.
-- Run this one first, then 20261009_al_move_data.sql.
--
-- The shared project allows any @platinumhomecare.ie person to sign up, so
-- being signed in is not enough: access is the al_access list below. Add or
-- remove people with a plain insert/delete; no policy change needed.

do $$ begin
  create type public.al_team as enum ('rms', 'slt_support');
exception when duplicate_object then null; end $$;

create table if not exists public.al_staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team public.al_team not null,
  color text not null,
  sort_order int not null
);

create table if not exists public.al_leave_days (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.al_staff(id) on delete cascade,
  leave_date date not null,
  created_at timestamptz not null default now(),
  unique (staff_id, leave_date)
);

create index if not exists al_leave_days_date_idx on public.al_leave_days (leave_date);

create table if not exists public.al_access (
  email text primary key check (email = lower(email)),
  note text,
  created_at timestamptz not null default now()
);

-- No policies on al_access: only the service role and the security-definer
-- function below can read it, so nobody can grant themselves access.
alter table public.al_access enable row level security;
alter table public.al_staff enable row level security;
alter table public.al_leave_days enable row level security;

-- John Smith kept the original spreadsheet; Antonio maintains the app.
insert into public.al_access (email, note) values
  ('johnsmith@platinumhomecare.ie', 'Original owner of the SLT holidays spreadsheet'),
  ('antoniolicastro@platinumhomecare.ie', 'App maintainer')
on conflict (email) do nothing;

create or replace function public.has_al_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.al_access where email = lower(auth.jwt() ->> 'email'))
$$;

revoke execute on function public.has_al_access() from public, anon;
grant execute on function public.has_al_access() to authenticated;

drop policy if exists "al_staff open access" on public.al_staff;
drop policy if exists "al_leave_days open access" on public.al_leave_days;
drop policy if exists "al_staff_access" on public.al_staff;
drop policy if exists "al_leave_days_access" on public.al_leave_days;

create policy "al_staff_access" on public.al_staff
  for all to authenticated using (public.has_al_access()) with check (public.has_al_access());

create policy "al_leave_days_access" on public.al_leave_days
  for all to authenticated using (public.has_al_access()) with check (public.has_al_access());
