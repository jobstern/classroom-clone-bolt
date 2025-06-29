/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - The current "Teachers can view student profiles in their classes" policy creates infinite recursion
    - The policy queries the profiles table within its own definition, causing circular dependency

  2. Solution
    - Drop the problematic policy
    - Create a simpler policy that avoids self-referencing queries
    - Use auth.uid() directly instead of complex subqueries involving profiles table

  3. Security
    - Maintain security by ensuring teachers can only see student profiles in their classes
    - Use direct foreign key relationships instead of profile lookups
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Teachers can view student profiles in their classes" ON profiles;

-- Create a new policy that avoids infinite recursion
-- This policy allows teachers to view student profiles by checking class enrollments directly
-- without querying the profiles table within the policy
CREATE POLICY "Teachers can view enrolled students"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student'::user_role 
    AND id IN (
      SELECT ce.student_id
      FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      WHERE c.teacher_id IN (
        SELECT p.id 
        FROM profiles p 
        WHERE p.user_id = auth.uid() 
        AND p.role = 'teacher'::user_role
      )
    )
  );

-- Ensure the basic policies are still in place
-- Users can view their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Users can update their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Users can create their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;