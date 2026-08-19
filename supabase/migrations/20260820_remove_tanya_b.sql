-- Tanya B is no longer on the RMs team; leave days cascade-delete with her.
delete from public.al_staff where name = 'Tanya B' and team = 'rms';
