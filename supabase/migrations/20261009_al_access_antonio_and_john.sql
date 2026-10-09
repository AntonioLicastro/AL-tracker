-- A/L Tracker access is limited to Antonio and John Smith for now.
-- To open it up later, insert people into public.al_access.
insert into public.al_access (email, note) values
  ('johnsmith@platinumhomecare.ie', 'Original owner of the SLT holidays spreadsheet'),
  ('antoniolicastro@platinumhomecare.ie', 'App maintainer')
on conflict (email) do nothing;

delete from public.al_access
where email not in ('johnsmith@platinumhomecare.ie', 'antoniolicastro@platinumhomecare.ie');
