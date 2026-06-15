const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Config
const SUPABASE_URL = 'https://eurrfbiavliahmhdxybp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnJmYmlhdmxpYWhtaGR4eWJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTIwNjIxNSwiZXhwIjoyMDk2NzgyMjE1fQ.e-hA90MNp__Aq278mriB8Cd0Ba65HabaRnWm22-MQ9o';
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const topics = [
  "Why browser games like Cyberpunk Sniper 3D are taking over the workplace",
  "The resurgence of free HTML5 arcade games in 2026",
  "How crypto-backed gaming is changing digital ownership",
  "Top 5 reasons you should be playing games in your browser instead of downloading them"
];

async function generateArticle() {
  console.log('🤖 Firing up the SEO Factory...');
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  console.log(`📝 Chosen Topic: "${randomTopic}"`);

  const prompt = `You are an expert tech and gaming journalist for "Hacker Media". 
Write an engaging, SEO-optimized 300-word news article about: ${randomTopic}.
You MUST return your entire response as a valid JSON object with EXACTLY these four keys:
{
  "category": "Gaming or Tech or Web3",
  "title": "A catchy, clickbait headline",
  "summary": "A 2-sentence summary of the article",
  "content": "The full article text, using paragraphs separated by \\n\\n"
}
Do NOT output any markdown code blocks (like \`\`\`json). Just output the raw JSON object.`;

  try {
    console.log('🧠 Pinging local Hermes LLM...');
    
    // Using dynamic import for node-fetch to avoid CommonJS/ESM issues if installed
    // Actually, Node 18+ has global fetch()
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'hermes',
        prompt: prompt,
        stream: false,
        format: 'json' // Ollama supports strict JSON format mode!
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Received transmission from Hermes.');
    
    let articleData;
    try {
      articleData = JSON.parse(data.response.trim());
    } catch (e) {
      console.error('Failed to parse JSON from LLM:', data.response);
      return;
    }

    console.log('📰 Article parsed successfully!');
    console.log('Title:', articleData.title);

    // Pick a random thumbnail from Unsplash
    const randomImages = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1940&auto=format&fit=crop"
    ];

    const newArticle = {
      category: articleData.category || "Gaming",
      title: articleData.title,
      summary: articleData.summary,
      content: articleData.content,
      author: "Hermes-7B (AI)",
      date: new Date().toLocaleDateString(),
      imageUrl: randomImages[Math.floor(Math.random() * randomImages.length)],
      isHtml: false
    };

    console.log('💾 Inserting into Supabase [hacker_articles]...');
    const { error: dbError } = await supabase
      .from('hacker_articles')
      .insert([newArticle]);

    if (dbError) {
      throw new Error(`Supabase Insert Error: ${dbError.message}`);
    }

    console.log('🏆 SUCCESS! Article is live on Hacker Media.');

  } catch (error) {
    console.error('❌ Generator Failed:', error);
  }
}

generateArticle();
