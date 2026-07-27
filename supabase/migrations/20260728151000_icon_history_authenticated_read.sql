revoke all on table public.safety_icon_change_history from anon;
grant select on table public.safety_icon_change_history to authenticated;

drop policy if exists "authenticated read icon history" on public.safety_icon_change_history;
create policy "authenticated read icon history"
on public.safety_icon_change_history
for select
to authenticated
using (true);
