-- RandomQuest Database Schema

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if this table already existed with fewer columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- User categories
CREATE TABLE IF NOT EXISTS user_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved challenges
CREATE TABLE IF NOT EXISTS saved_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_challenges ENABLE ROW LEVEL SECURITY;

-- Profiles policies (drop first so re-runs don't error)
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE USING (auth.uid() = id);

-- User categories policies
DROP POLICY IF EXISTS "user_categories_select" ON user_categories;
DROP POLICY IF EXISTS "user_categories_insert" ON user_categories;
DROP POLICY IF EXISTS "user_categories_delete" ON user_categories;
CREATE POLICY "user_categories_select" ON user_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_categories_insert" ON user_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_categories_delete" ON user_categories FOR DELETE USING (auth.uid() = user_id);

-- Challenges policies
DROP POLICY IF EXISTS "challenges_select" ON challenges;
DROP POLICY IF EXISTS "challenges_insert" ON challenges;
DROP POLICY IF EXISTS "challenges_update" ON challenges;
CREATE POLICY "challenges_select" ON challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "challenges_insert" ON challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "challenges_update" ON challenges FOR UPDATE USING (auth.uid() = user_id);

-- Saved challenges policies
DROP POLICY IF EXISTS "saved_challenges_select" ON saved_challenges;
DROP POLICY IF EXISTS "saved_challenges_insert" ON saved_challenges;
DROP POLICY IF EXISTS "saved_challenges_delete" ON saved_challenges;
CREATE POLICY "saved_challenges_select" ON saved_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_challenges_insert" ON saved_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_challenges_delete" ON saved_challenges FOR DELETE USING (auth.uid() = user_id);
