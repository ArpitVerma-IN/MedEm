-- 1. Create custom enum types for new data fields
DO $$ BEGIN
    CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. ALTER the existing public.profiles table to append the new hardened UI fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS gender public.gender_type,
  ADD COLUMN IF NOT EXISTS abha_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS blood_type TEXT,
  ADD COLUMN IF NOT EXISTS prior_conditions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS geofence_radius INTEGER DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS emergency_data_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Automatically update the `updated_at` parameter perfectly matching the Frontend React Hooks
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger is replaced cleanly if it already exists
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Note: An Auth Registration Bridge (handle_new_user) already exists or was likely bound to your initial setup. 
-- If you face "column missing" errors during new Sign-ups, we can explicitly alter that trigger next.
