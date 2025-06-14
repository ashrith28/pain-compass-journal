
ALTER TABLE public.pain_entries
ADD CONSTRAINT pain_entries_user_id_date_key UNIQUE (user_id, date);
