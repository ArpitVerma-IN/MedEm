-- Enable RLS strictly on the updated table (It likely is already enabled, but this guarantees it)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Note: You already have basic self-read and self-update policies established from your earlier setup (`auth.uid() = profile_id`).

-- Policy #4: Doctors can view targeted patient medical profiles ONLY during emergencies IF consent is given.
-- We check if the requesting user's own profile shows their role as 'doctor'. If so, they can read patient data where `emergency_data_consent` is true.
CREATE POLICY "Verified Doctors can view consenting patient data"
ON public.profiles
FOR SELECT
USING (
  -- Does the target patient allow data sharing?
  emergency_data_consent = true 
  AND 
  -- Is the person trying to read it a confirmed doctor?
  EXISTS (
    SELECT 1 FROM public.profiles as responder
    WHERE responder.profile_id = auth.uid() 
    AND responder.role = 'Doctor'
  )
);
