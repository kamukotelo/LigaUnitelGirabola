-- Database migrations initialization for Futibool engine projects

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Competitions Table
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    logo_url TEXT,
    season TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Players Table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    club TEXT,
    photo_url TEXT,
    birth_date DATE,
    stats_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE SET NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    score TEXT DEFAULT '0-0',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Read policies (allow public access to read data)
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public read access on matches" ON public.matches FOR SELECT USING (true);
