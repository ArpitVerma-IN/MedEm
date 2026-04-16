-- Create a custom enum type for role definitions, scaling from Phase 1 contexts
CREATE TYPE public.user_role AS ENUM ('patient', 'doctor');

-- Create a custom enum for gender mapping securely
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not');

-- Create the primary profiles table that explicitly maps 1-to-1 with Supabase Auth instances
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  
  -- Core Identity
  full_name TEXT,
  dob DATE,
  gender public.gender_type,
  
  -- Secure Medical Identifiers (AES-256 target strings for Phase 3)
  abha_id TEXT UNIQUE,
  
  -- Medical Context
  blood_type TEXT,
  prior_conditions TEXT[] DEFAULT '{}',
  
  -- Responder Context
  certifications_verified BOOLEAN DEFAULT FALSE,
  geofence_radius INTEGER DEFAULT 2000,
  
  -- Settings
  emergency_data_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (id)
);

-- Automatically update the `updated_at` parameter perfectly matching the Frontend React Hooks
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- The Auth Registration Bridge: Every time you run signup through the Frontend, this instantly mocks out their secure Profile row.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    -- Pull the custom embedded role explicitly submitted during Phase 2 SignupPage operations
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
