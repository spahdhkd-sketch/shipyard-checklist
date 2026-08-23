create table public.safety_setting_versions (
  config_version text primary key,
  lifecycle_status text not null default 'draft',
  effective_at timestamptz not null,
  change_summary text not null,
  settings jsonb not null,
  authored_by text not null,
  authored_at timestamptz not null default now(),
  reviewed_by text,
  reviewed_at timestamptz,
  published_by text,
  published_at timestamptz,
  base_version text references public.safety_setting_versions(config_version),
  rollback_target_version text references public.safety_setting_versions(config_version),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint safety_setting_versions_version_format
    check (config_version ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$'),
  constraint safety_setting_versions_lifecycle
    check (lifecycle_status in ('draft', 'review', 'published')),
  constraint safety_setting_versions_change_summary
    check (length(trim(change_summary)) between 1 and 1000),
  constraint safety_setting_versions_settings_shape
    check (
      jsonb_typeof(settings) = 'object'
      and settings ?& array['pledgeRules', 'pushCopy', 'restDayCalendar']
      and jsonb_typeof(settings -> 'pledgeRules') = 'object'
      and jsonb_typeof(settings -> 'pushCopy') = 'object'
      and jsonb_typeof(settings -> 'restDayCalendar') = 'object'
    ),
  constraint safety_setting_versions_author_ref
    check (authored_by ~ '^actor:v1:[A-Za-z0-9_-]{43}$'),
  constraint safety_setting_versions_review_ref
    check (reviewed_by is null or reviewed_by ~ '^actor:v1:[A-Za-z0-9_-]{43}$'),
  constraint safety_setting_versions_publisher_ref
    check (published_by is null or published_by ~ '^actor:v1:[A-Za-z0-9_-]{43}$'),
  constraint safety_setting_versions_distinct_base
    check (base_version is null or base_version <> config_version),
  constraint safety_setting_versions_distinct_rollback
    check (rollback_target_version is null or rollback_target_version <> config_version),
  constraint safety_setting_versions_lifecycle_metadata
    check (
      (
        lifecycle_status = 'draft'
        and reviewed_by is null
        and reviewed_at is null
        and published_by is null
        and published_at is null
      )
      or (
        lifecycle_status = 'review'
        and reviewed_by is not null
        and reviewed_at is not null
        and published_by is null
        and published_at is null
      )
      or (
        lifecycle_status = 'published'
        and reviewed_by is not null
        and reviewed_at is not null
        and published_by is not null
        and published_at is not null
      )
    )
);

alter table public.safety_setting_versions enable row level security;

revoke all on table public.safety_setting_versions from public, anon, authenticated;
grant select, insert, update, delete on table public.safety_setting_versions to service_role;

create index safety_setting_versions_published_effective_idx
  on public.safety_setting_versions (effective_at desc, published_at desc)
  where lifecycle_status = 'published';

create or replace function public.enforce_safety_setting_version_lifecycle()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  rollback_status text;
begin
  if tg_op = 'DELETE' then
    if old.lifecycle_status = 'published' then
      raise exception 'published_safety_settings_are_immutable'
        using errcode = '55000';
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if old.lifecycle_status = 'published' then
      raise exception 'published_safety_settings_are_immutable'
        using errcode = '55000';
    end if;

    if new.config_version is distinct from old.config_version
      or new.authored_by is distinct from old.authored_by
      or new.authored_at is distinct from old.authored_at
    then
      raise exception 'safety_settings_identity_is_immutable'
        using errcode = '55000';
    end if;

    if old.lifecycle_status = 'draft'
      and new.lifecycle_status not in ('draft', 'review')
    then
      raise exception 'safety_settings_must_enter_review_before_publish'
        using errcode = '55000';
    end if;

    if old.lifecycle_status = 'review' then
      if new.lifecycle_status not in ('review', 'published') then
        raise exception 'safety_settings_lifecycle_cannot_move_backward'
          using errcode = '55000';
      end if;

      if new.effective_at is distinct from old.effective_at
        or new.change_summary is distinct from old.change_summary
        or new.settings is distinct from old.settings
        or new.base_version is distinct from old.base_version
        or new.rollback_target_version is distinct from old.rollback_target_version
        or new.reviewed_by is distinct from old.reviewed_by
        or new.reviewed_at is distinct from old.reviewed_at
      then
        raise exception 'safety_settings_review_snapshot_is_locked'
          using errcode = '55000';
      end if;
    end if;

    new.updated_at := now();
  end if;

  if new.rollback_target_version is not null then
    select version.lifecycle_status
      into rollback_status
    from public.safety_setting_versions as version
    where version.config_version = new.rollback_target_version;

    if rollback_status is distinct from 'published' then
      raise exception 'safety_settings_rollback_target_must_be_published'
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_safety_setting_version_lifecycle() from public, anon, authenticated;

create trigger safety_setting_versions_lifecycle_guard
before insert or update or delete on public.safety_setting_versions
for each row execute function public.enforce_safety_setting_version_lifecycle();

create view public.safety_settings_published
with (security_barrier = true, security_invoker = false)
as
select
  config_version,
  lifecycle_status,
  effective_at,
  change_summary,
  settings,
  authored_at,
  reviewed_at,
  published_at,
  base_version,
  rollback_target_version
from public.safety_setting_versions
where lifecycle_status = 'published';

revoke all on table public.safety_settings_published from public;
grant select on table public.safety_settings_published to anon, authenticated;

comment on table public.safety_setting_versions is
  'Server-authoritative versioned pledge, push-copy, and rest-day configuration. Drafts progress through review to immutable published snapshots.';
comment on column public.safety_setting_versions.authored_by is
  'Opaque audit reference only. Do not store names, employee numbers, email addresses, session tokens, or other PII.';
comment on column public.safety_setting_versions.reviewed_by is
  'Opaque audit reference only. Do not store names, employee numbers, email addresses, session tokens, or other PII.';
comment on column public.safety_setting_versions.published_by is
  'Opaque audit reference only. Do not store names, employee numbers, email addresses, session tokens, or other PII.';
comment on view public.safety_settings_published is
  'Read-only published settings projection. Audit actor references and all non-published snapshots remain server-only.';
