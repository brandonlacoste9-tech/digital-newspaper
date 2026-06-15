-- Create the hacker_articles table for the SEO Factory
CREATE TABLE IF NOT EXISTS public.hacker_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Hermes-7B',
  date TEXT,
  imageUrl TEXT,
  isHtml BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hacker_articles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the articles (for the Hacker Media frontend)
CREATE POLICY "Public articles are viewable by everyone."
ON public.hacker_articles FOR SELECT
USING (true);

-- Only admins/service role can insert (handled via Service Role key in the script, which bypasses RLS)
