-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table to mirror Firebase auth users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES users(firebase_uid) ON DELETE CASCADE
);

-- Create transcriptions table
CREATE TABLE IF NOT EXISTS transcriptions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  srt_content JSONB DEFAULT '[]'::jsonb,
  original_audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES users(firebase_uid) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only read/write their own data
DROP POLICY IF EXISTS "Users can read their own data" ON users;
CREATE POLICY "Users can read their own data" 
  ON users FOR SELECT 
  USING (firebase_uid = auth.uid());

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (firebase_uid = auth.uid());

-- Projects policies
DROP POLICY IF EXISTS "Users can read their own projects" ON projects;
CREATE POLICY "Users can read their own projects" 
  ON projects FOR SELECT 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  USING (user_id = auth.uid());

-- Transcriptions policies
DROP POLICY IF EXISTS "Users can read their own transcriptions" ON transcriptions;
CREATE POLICY "Users can read their own transcriptions" 
  ON transcriptions FOR SELECT 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own transcriptions" ON transcriptions;
CREATE POLICY "Users can insert their own transcriptions" 
  ON transcriptions FOR INSERT 
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own transcriptions" ON transcriptions;
CREATE POLICY "Users can update their own transcriptions" 
  ON transcriptions FOR UPDATE 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own transcriptions" ON transcriptions;
CREATE POLICY "Users can delete their own transcriptions" 
  ON transcriptions FOR DELETE 
  USING (user_id = auth.uid());

-- Create storage bucket for audio files if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'buckets') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('audio-uploads', 'audio-uploads', false)
    ON CONFLICT (id) DO NOTHING;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating bucket: %', SQLERRM;
END
$$;

-- Set up storage policies if storage schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects') THEN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can access their own audio files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;
    
    -- Create policies with explicit type casting
    CREATE POLICY "Users can upload their own audio files"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "Users can access their own audio files"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "Users can delete their own audio files"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating storage policies: %', SQLERRM;
END
$$;

-- Enable realtime subscriptions if the publication exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE transcriptions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error adding table to publication: %', SQLERRM;
END
$$;