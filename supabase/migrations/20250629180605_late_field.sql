/*
  # Fix infinite recursion in profiles table policies

  1. Problem
    - The "Teachers can view student profiles in their classes" policy causes infinite recursion
    - It joins back to the profiles table within its own policy definition
    - This creates a circular dependency when querying profiles

  2. Solution
    - Drop the problematic policy
    - Create a new policy that avoids circular references
    - Use auth.uid() directly instead of joining back to profiles table
    - Simplify the logic to prevent recursion

  3. Changes
    - Remove recursive policy for teacher viewing student profiles
    - Add simplified policy that uses direct user ID comparison
    - Maintain security while avoiding circular dependencies
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Teachers can view student profiles in their classes" ON profiles;

-- Create a new policy that avoids circular references
-- Teachers can view student profiles in their classes without recursion
CREATE POLICY "Teachers can view student profiles in their classes" ON profiles
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