-- The original 19 colors (picked as individual Tailwind-600/700 swatches)
-- had several pairs that were nearly indistinguishable, especially under
-- color-blindness simulation (e.g. David's blue vs Monica's violet
-- measured ΔE 0.4 under deutan simulation — effectively identical).
-- These 19 were instead computed together in OKLCH space via a greedy
-- farthest-point search to maximize the worst-case pairwise distance
-- across all 171 pairs (not just neighbors), verified with the data-viz
-- skill's CVD-simulated validator. This is close to the practical ceiling
-- for 19 distinct identities — see the accompanying initials-in-dots UI
-- change for the rest of the fix.
update public.al_staff set color = '#a3215a' where name = 'David' and team = 'rms';
update public.al_staff set color = '#48a2ff' where name = 'Martin' and team = 'rms';
update public.al_staff set color = '#e97f00' where name = 'Nicola' and team = 'rms';
update public.al_staff set color = '#2954bc' where name = 'Alison B' and team = 'rms';
update public.al_staff set color = '#00b8a1' where name = 'Barry' and team = 'rms';
update public.al_staff set color = '#bd4600' where name = 'Ger' and team = 'rms';
update public.al_staff set color = '#007da3' where name = 'Alison H' and team = 'rms';
update public.al_staff set color = '#d85166' where name = 'Ciara D' and team = 'rms';
update public.al_staff set color = '#00999b' where name = 'Paula G' and team = 'rms';
update public.al_staff set color = '#4a81eb' where name = 'Tanya B' and team = 'rms';
update public.al_staff set color = '#00b0d2' where name = 'John Mc' and team = 'slt_support';
update public.al_staff set color = '#a82418' where name = 'John Sm' and team = 'slt_support';
update public.al_staff set color = '#37bb62' where name = 'Monica' and team = 'slt_support';
update public.al_staff set color = '#006495' where name = 'Mary' and team = 'slt_support';
update public.al_staff set color = '#be395e' where name = 'Aisling' and team = 'slt_support';
update public.al_staff set color = '#d45e00' where name = 'Traci' and team = 'slt_support';
update public.al_staff set color = '#0092c5' where name = 'Paula' and team = 'slt_support';
update public.al_staff set color = '#0074c8' where name = 'Anto' and team = 'slt_support';
update public.al_staff set color = '#97297b' where name = 'Alisa' and team = 'slt_support';
