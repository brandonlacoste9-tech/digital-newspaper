-- Run this in your Supabase SQL Editor to create the Hacker Media articles table

CREATE TABLE IF NOT EXISTS hacker_articles (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS but allow anyone to read and insert (since this is just a quick MVP admin panel)
ALTER TABLE hacker_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON hacker_articles
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON hacker_articles
  FOR INSERT WITH CHECK (true);
