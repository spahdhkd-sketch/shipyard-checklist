create index if not exists safety_icon_change_history_changed_by_worker_id_idx
  on public.safety_icon_change_history (changed_by_worker_id);
