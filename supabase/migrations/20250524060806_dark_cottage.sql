/*
  # Create profiles table and storage

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `avatar_url` (text)
      - `updated_at` (timestamp)

  2. Storage
    - Create bucket for profile avatars
    
  3. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  avatar_url text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND owner = auth.uid());