
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'nano',
  tier_label TEXT NOT NULL DEFAULT '',
  tier_description TEXT NOT NULL DEFAULT '',
  service_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (true);
