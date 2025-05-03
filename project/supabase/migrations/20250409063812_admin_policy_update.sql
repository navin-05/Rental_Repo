/*
  # Update Admin Policy for Cars Table

  This migration updates the policy for inserting cars to also check for localStorage isAdmin flag.
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Only admins can insert cars" ON cars;

-- Create a new policy that checks both email and localStorage flag
CREATE POLICY "Only admins can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.email LIKE '%admin%'
        OR auth.users.raw_user_meta_data->>'isAdmin' = 'true'
      )
    )
  ); 