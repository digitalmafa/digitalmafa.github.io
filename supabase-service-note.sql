-- Optional service note: blank notes are stored as NULL.
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS note text;

-- Standardize existing non-empty service prices to Indian Rupees.
UPDATE public.services
SET price = '₹' || btrim(price)
WHERE price IS NOT NULL
  AND btrim(price) <> ''
  AND btrim(price) !~* '^(₹|INR\s*)';
