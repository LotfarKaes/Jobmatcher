-- CARD-03 Job Fetcher: run once in Supabase -> SQL Editor.
-- Stores jobs from the JobTech API (shared between users) and pasted jobs (private to their creator).

create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('jobtech', 'url', 'manual')),
  external_id   text,                 -- JobTech ad id, or null
  source_url    text,
  apply_url     text,
  title         text not null,
  company       text,
  location      text,
  remote        boolean,
  description   text not null,        -- clean plain text, capped at ~20k chars
  skills        text[] not null default '{}',
  salary_min    int,
  salary_max    int,
  salary_text   text,
  posted_at     text,                 -- as given by the source (JobTech sends local time without zone)
  deadline_at   text,
  created_by    uuid references auth.users(id) default auth.uid(),
  created_at    timestamptz not null default now(),
  unique (source, external_id)
);

alter table public.jobs enable row level security;

drop policy if exists "read jobs" on public.jobs;
create policy "read jobs" on public.jobs for select to authenticated
  using (source = 'jobtech' or created_by = auth.uid());

drop policy if exists "insert own jobs" on public.jobs;
create policy "insert own jobs" on public.jobs for insert to authenticated
  with check (created_by = auth.uid());
