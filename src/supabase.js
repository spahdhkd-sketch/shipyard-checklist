import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://bxdwladbfszzdlfagyxc.supabase.co/rest/v1/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZHdsYWRiZnN6emRsZmFneXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDE1MzksImV4cCI6MjA5MzcxNzUzOX0.usDowLWEJhx6yVw2OwM6L5t-b4PJG3sN7EEFsj3_98c'
);
