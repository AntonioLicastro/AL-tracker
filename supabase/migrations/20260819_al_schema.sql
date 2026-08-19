-- Digitizes "SLT holidays 2026.xlsx": two color-coded team calendars
-- (RMs, SLT+Support) where each person's leave days were manually filled
-- in with their assigned color. Staff names below are the exact labels
-- used in that workbook's key (e.g. "Alison B" / "Alison H" to
-- disambiguate two Alisons) rather than guessed full names, so nobody
-- gets misattributed.

create type public.al_team as enum ('rms', 'slt_support');

create table public.al_staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team public.al_team not null,
  color text not null,
  sort_order int not null,
  user_id uuid unique references auth.users(id),
  is_manager boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.al_leave_days (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.al_staff(id) on delete cascade,
  leave_date date not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (staff_id, leave_date)
);

create index al_leave_days_date_idx on public.al_leave_days (leave_date);

alter table public.al_staff enable row level security;
alter table public.al_leave_days enable row level security;

-- Shared calendar: every signed-in user sees everyone's staff row and leave days.
create policy "al_staff select all" on public.al_staff
  for select to authenticated using (true);

create policy "al_leave_days select all" on public.al_leave_days
  for select to authenticated using (true);

-- Onboarding: a signed-in user can attach themselves to exactly one
-- still-unclaimed staff row ("which one are you?"). Once claimed, this
-- policy no longer matches that row, so it can't be re-claimed by mistake.
create policy "al_staff self claim" on public.al_staff
  for update to authenticated
  using (user_id is null)
  with check (user_id = auth.uid());

-- Marking leave: your own staff row, or any row if you're the manager.
create policy "al_leave_days insert own or manager" on public.al_leave_days
  for insert to authenticated
  with check (
    staff_id in (select id from public.al_staff where user_id = auth.uid())
    or exists (select 1 from public.al_staff where user_id = auth.uid() and is_manager)
  );

create policy "al_leave_days delete own or manager" on public.al_leave_days
  for delete to authenticated
  using (
    staff_id in (select id from public.al_staff where user_id = auth.uid())
    or exists (select 1 from public.al_staff where user_id = auth.uid() and is_manager)
  );

insert into public.al_staff (name, team, color, sort_order) values
  ('David', 'rms', '#2563eb', 1),
  ('Martin', 'rms', '#dc2626', 2),
  ('Nicola', 'rms', '#16a34a', 3),
  ('Alison B', 'rms', '#9333ea', 4),
  ('Barry', 'rms', '#ea580c', 5),
  ('Ger', 'rms', '#0d9488', 6),
  ('Alison H', 'rms', '#db2777', 7),
  ('Ciara D', 'rms', '#ca8a04', 8),
  ('Paula G', 'rms', '#4f46e5', 9),
  ('Tanya B', 'rms', '#65a30d', 10),
  ('John Mc', 'slt_support', '#0891b2', 1),
  ('John Sm', 'slt_support', '#be123c', 2),
  ('Monica', 'slt_support', '#7c3aed', 3),
  ('Mary', 'slt_support', '#059669', 4),
  ('Aisling', 'slt_support', '#c2410c', 5),
  ('Traci', 'slt_support', '#4338ca', 6),
  ('Paula', 'slt_support', '#a16207', 7),
  ('Anto', 'slt_support', '#0369a1', 8),
  ('Alisa', 'slt_support', '#be185d', 9);
