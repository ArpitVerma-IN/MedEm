-- Fix for Google OAuth Signups: Google doesn't send a custom "role" metadata field automatically.
-- We must update the trigger to default to 'patient' if the role is missing, otherwise the profile creation crashes.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    -- If role is missing (Google Auth), default to 'patient'
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role),
    -- If full_name is missing, try to grab the default name Google provides
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
