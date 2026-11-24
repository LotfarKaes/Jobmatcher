-- CARD-03 Job Fetcher: run once in Supabase -> SQL Editor.
-- Stores jobs from the JobTech API (shared between users) and pasted jobs (private to their creator).
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  source text NOT NULL CHECK (source IN ('jobtech', 'url', 'manual')),
  external_id text, -- JobTech ad id, or null
  source_url text,
  apply_url text,
  title text NOT NULL,
  company text,
  location text,
  remote boolean,
  description text NOT NULL, -- clean plain text, capped at ~20k chars
  skills text [] NOT NULL DEFAULT '{}',
  salary_min INT,
  salary_max INT,
  salary_text text,
  posted_at text, -- as given by the source (JobTech sends local time without zone)
  deadline_at text,
  created_by uuid REFERENCES auth.users (id) DEFAULT auth.uid (),
  created_at timestamptz NOT NULL DEFAULT now (),
  UNIQUE (source, external_id)
);

ALTER TABLE public.jobs enable row level security;

DROP policy IF EXISTS "read jobs" ON public.jobs;

CREATE policy "read jobs" ON public.jobs FOR
SELECT
  TO authenticated using (
    source = 'jobtech'
    OR created_by = auth.uid ()
  );

DROP policy IF EXISTS "insert own jobs" ON public.jobs;

CREATE policy "insert own jobs" ON public.jobs FOR
INSERT
  TO authenticated
WITH
  CHECK (created_by = auth.uid ());