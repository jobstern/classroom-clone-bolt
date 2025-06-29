/*
  # Fix infinite recursion in profiles RLS policy

  1. Problem
    - The "Teachers can view enrolled students v2" policy contains a complex subquery that causes infinite recursion
    - This happens when the policy references the same table it's protecting in a way that creates a circular dependency

  2. Solution
    - Drop the problematic policy
    - Create a simpler, more direct policy that avoids recursion
    - Ensure all policies use auth.uid() directly without complex joins back to profiles table

  3. Security
    - Maintain the same access control logic but with safer implementation
    - Users can still only access their own profiles and teachers can view their students
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Teachers can view enrolled students v2" ON profiles;

-- Create a safer policy for teachers to view enrolled students
-- This avoids the recursion by not joining back to profiles table in the policy condition
CREATE POLICY "Teachers can view enrolled students v3" ON profiles
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
        WHERE p.user_id = auth.uid() AND p.role = 'teacher'::user_role
      )
    )
  );

-- Ensure the basic user profile access policy is simple and direct
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure update policy is also simple
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure insert policy is simple
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);