-- Add Delivery Days to DigitalMAFA services. Run once in Supabase Dashboard > SQL Editor.
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS delivery_days integer;

-- Optional: ensure future values cannot be zero or negative. Existing NULL values remain valid.
ALTER TABLE public.services
DROP CONSTRAINT IF EXISTS services_delivery_days_positive;
ALTER TABLE public.services
ADD CONSTRAINT services_delivery_days_positive
CHECK (delivery_days IS NULL OR delivery_days >= 1);
