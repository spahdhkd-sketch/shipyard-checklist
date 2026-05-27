drop index if exists public.safety_items_category_section_order_idx;
drop index if exists public.safety_sections_category_order_idx;
drop index if exists public.safety_inspection_items_inspection_idx;
drop index if exists public.unsafe_issues_status_created_idx;
drop index if exists public.unsafe_issues_ship_idx;
drop index if exists public.worker_push_subscriptions_endpoint_idx;
drop index if exists public.admin_mutation_sessions_worker_idx;
drop index if exists public.admin_mutation_attempts_worker_idx;

comment on index public.issue_photos_target_idx is
  'Retained despite unused-index advisor because admin issue/material deletion resolves photo metadata by target_type and target_id.';
