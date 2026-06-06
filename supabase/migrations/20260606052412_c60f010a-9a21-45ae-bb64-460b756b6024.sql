CREATE TABLE public.rate_offsets (
  item_name TEXT PRIMARY KEY,
  buying_offset NUMERIC NOT NULL DEFAULT 0,
  selling_offset NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.rate_offsets TO service_role;
ALTER TABLE public.rate_offsets ENABLE ROW LEVEL SECURITY;