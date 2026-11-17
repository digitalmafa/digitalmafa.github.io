-- DigitalMAFA services table security policies
-- Run this in Supabase Dashboard > SQL Editor.
-- Admin user is authorized by their authenticated Supabase Auth UUID.

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public visitors can read only published services.
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
CREATE POLICY "Public can view published services"
ON public.services FOR SELECT
TO anon, authenticated
USING (published = TRUE);

-- The designated admin can also read drafts.
DROP POLICY IF EXISTS "Admin can view all services" ON public.services;
CREATE POLICY "Admin can view all services"
ON public.services FOR SELECT
TO authenticated
USING (auth.uid() = '69826f4a-5084-48b4-ad2b-259ff5ce96a6'::uuid);

-- Only the designated admin can insert services.
DROP POLICY IF EXISTS "Admin can insert services" ON public.services;
CREATE POLICY "Admin can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = '69826f4a-5084-48b4-ad2b-259ff5ce96a6'::uuid);

-- Only the designated admin can update services.
DROP POLICY IF EXISTS "Admin can update services" ON public.services;
CREATE POLICY "Admin can update services"
ON public.services FOR UPDATE
TO authenticated
USING (auth.uid() = '69826f4a-5084-48b4-ad2b-259ff5ce96a6'::uuid)
WITH CHECK (auth.uid() = '69826f4a-5084-48b4-ad2b-259ff5ce96a6'::uuid);

-- Only the designated admin can delete services.
DROP POLICY IF EXISTS "Admin can delete services" ON public.services;
CREATE POLICY "Admin can delete services"
ON public.services FOR DELETE
TO authenticated
USING (auth.uid() = '69826f4a-5084-48b4-ad2b-259ff5ce96a6'::uuid);
