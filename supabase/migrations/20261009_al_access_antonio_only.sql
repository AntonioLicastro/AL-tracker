-- A/L Tracker is hidden from everyone but Antonio while it's being set up.
-- To open it up later, insert people into public.al_access.
delete from public.al_access where email <> 'antoniolicastro@platinumhomecare.ie';
