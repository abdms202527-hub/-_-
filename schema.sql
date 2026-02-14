
-- 1. UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  flipbook_url TEXT NOT NULL,
  category TEXT,
  year TEXT,
  publish_date DATE DEFAULT CURRENT_DATE,
  is_latest BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. MEDIA TABLE (Ensuring title exists for Media Gallery)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  title TEXT DEFAULT 'Untitled Image',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- If table already exists but title is missing, add it manually
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='media' AND column_name='title') THEN
        ALTER TABLE media ADD COLUMN title TEXT DEFAULT 'Untitled Image';
    END IF;
END $$;

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT,
  device TEXT,
  platform TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. SECURITY (RLS)
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read publications" ON publications;
    CREATE POLICY "Public read publications" ON publications FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public read notices" ON notices;
    CREATE POLICY "Public read notices" ON notices FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public read settings" ON site_settings;
    CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public read media" ON media;
    CREATE POLICY "Public read media" ON media FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public insert analytics" ON analytics;
    CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);
    
    -- Admin write policies
    DROP POLICY IF EXISTS "Admin modify publications" ON publications;
    CREATE POLICY "Admin modify publications" ON publications FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin modify notices" ON notices;
    CREATE POLICY "Admin modify notices" ON notices FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin modify media" ON media;
    CREATE POLICY "Admin modify media" ON media FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin modify settings" ON site_settings;
    CREATE POLICY "Admin modify settings" ON site_settings FOR ALL USING (true);
END $$;

-- IMPORTANT: If you still see "Could not find column", please go to 
-- Supabase Dashboard -> Project Settings -> API -> "PostgREST Reload" (if available)
-- Or simply wait 2-3 minutes for the schema cache to automatically refresh.
