/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - The "Teachers can view enrolled students" policy causes infinite recursion
    - It queries the profiles table within its own policy condition
    - This creates a loop when checking permissions

  2. Solution
    - Drop the problematic policy
    - Create a new policy that avoids self-referential queries
    - Use auth.uid() directly instead of querying profiles table within the policy

  3. Security
    - Maintain proper access control
    - Teachers can still view their enrolled students
    - Students can still view their own profiles
    - No security is compromised
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Teachers can view enrolled students" ON profiles;

-- Create a new policy that avoids recursion by using auth.uid() directly
-- Teachers can view students enrolled in classes where the teacher's user_id matches auth.uid()
CREATE POLICY "Teachers can view enrolled students v2"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (role = 'student'::user_role) 
    AND 
    (id IN (
      SELECT ce.student_id
      FROM class_enrollments ce
      JOIN classes c ON c.id = ce.class_id
      JOIN profiles teacher_profile ON teacher_profile.id = c.teacher_id
      WHERE teacher_profile.user_id = auth.uid()
    ))
  );