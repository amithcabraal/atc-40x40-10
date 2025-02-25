/*
  # Create sessions table

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `exercises` (jsonb array of exercises)
      - `rating` (integer, 1-5)
      - `notes` (text)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `sessions` table
    - Add policies for authenticated users to manage their own sessions
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  exercises jsonb NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own sessions"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE INDEX sessions_created_at_idx ON sessions(created_at);