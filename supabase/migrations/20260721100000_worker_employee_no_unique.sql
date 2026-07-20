create unique index if not exists workers_employee_no_unique
on public.workers (btrim(employee_no))
where nullif(btrim(employee_no), '') is not null;
