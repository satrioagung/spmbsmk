-- Supabase Schema for SPMB SMK Online

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Registrations Table
CREATE TABLE public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nisn TEXT NOT NULL UNIQUE,
  origin_school TEXT NOT NULL,
  kk_number TEXT NOT NULL,
  nik TEXT NOT NULL UNIQUE,
  birthplace TEXT NOT NULL,
  birthdate DATE NOT NULL,
  religion TEXT NOT NULL,
  father_name TEXT,
  father_nik TEXT,
  father_job TEXT,
  father_education TEXT,
  mother_name TEXT,
  mother_nik TEXT,
  mother_job TEXT,
  mother_education TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own registration." ON public.registrations FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Students can insert own registration." ON public.registrations FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Students can update own registration." ON public.registrations FOR UPDATE USING (auth.uid() = profile_id);

-- Admins policy
CREATE POLICY "Admins can view all registrations." ON public.registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all registrations." ON public.registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Announcements
CREATE TABLE public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
