-- John Smith ("John Sm" in the SLT+Support key) is the manager who
-- maintained the original spreadsheet; give him rights to mark leave
-- for anyone, not just himself.
update public.al_staff
set is_manager = true
where name = 'John Sm' and team = 'slt_support';
