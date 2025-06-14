
-- Create a table for pain entries
CREATE TABLE public.pain_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pain_level INT NOT NULL,
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the pain_entries table
COMMENT ON TABLE public.pain_entries IS 'Stores daily pain tracking entries for users.';
COMMENT ON COLUMN public.pain_entries.user_id IS 'Foreign key to the user who created the entry.';

-- Create a table for medications
CREATE TABLE public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  "time" TIME,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the medications table
COMMENT ON TABLE public.medications IS 'Stores medication information for users.';
COMMENT ON COLUMN public.medications.user_id IS 'Foreign key to the user who owns the medication entry.';

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE public.pain_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pain_entries table
CREATE POLICY "Users can view their own pain entries"
  ON public.pain_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pain entries"
  ON public.pain_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pain entries"
  ON public.pain_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pain entries"
  ON public.pain_entries FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for medications table
CREATE POLICY "Users can view their own medications"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
  ON public.medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
  ON public.medications FOR DELETE
  USING (auth.uid() = user_id);

