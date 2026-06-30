-- Migration: Create configs table to store active calendar seed
CREATE TABLE IF NOT EXISTS public.configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default seed if not exists
INSERT INTO public.configs (key, value) VALUES ('active_calendar_seed', '1357') ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;

-- Read policies (allow public access to read data)
CREATE POLICY "Allow public read access on configs" ON public.configs FOR SELECT USING (true);

-- Write policy for service role/admin (we can just allow all for the table since we will secure the API endpoint)
CREATE POLICY "Allow admin write access on configs" ON public.configs FOR ALL USING (true);
