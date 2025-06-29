/*
  # Fix profiles table RLS policies

  1. Policy Issues Fixed
    - Remove problematic policies causing infinite recursion
    - Add proper INSERT policy for user registration
    - Add proper SELECT policy for users to view their own profile
    - Add proper UPDATE policy for users to update their own profile

  2. Security
    - Users can only create profiles for themselves during registration
    - Users can only view and update their own profile
    - Teachers can view student profiles in their classes (separate policy)
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles in their classes" ON profiles;

-- Create proper INSERT policy for user registration
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create proper SELECT policy for users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create proper UPDATE policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for teachers to view student profiles in their classes
CREATE POLICY "Teachers can view student profiles in their classes"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'student' AND 
    id IN (
      SELECT ce.student_id
      FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      JOIN profiles teacher_profile ON teacher_profile.id = c.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    )
  );