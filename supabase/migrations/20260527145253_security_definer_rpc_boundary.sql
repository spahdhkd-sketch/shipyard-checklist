revoke all on function public.verify_worker_login(text, text) from public, anon, authenticated;
revoke all on function public.worker_push_subscription_status(text) from public, anon, authenticated;

grant execute on function public.verify_worker_login(text, text) to service_role;
grant execute on function public.worker_push_subscription_status(text) to service_role;

comment on function public.verify_worker_login(text, text) is
  'Internal worker credential check retained for service-role use only; browser login uses the worker-push Edge Function.';

comment on function public.worker_push_subscription_status(text) is
  'Internal push subscription status helper retained for service-role use only; browser status checks use the worker-push Edge Function.';
