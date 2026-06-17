require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

// Hacker Media Config
const BASE_URL = 'https://www.hackermedia.fun';

// X API Credentials
const client = new TwitterApi({
  appKey: process.env.X_APP_KEY || '',
  appSecret: process.env.X_APP_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessSecret: process.env.X_ACCESS_SECRET || '',
});

const rwClient = client.readWrite;

async function postTopStory() {
  console.log('🤖 Firing up the X Bot...');

  if (!process.env.X_APP_KEY) {
    console.error('❌ X_APP_KEY is missing. Please configure your .env file or GitHub Secrets.');
    process.exit(1);
  }

  try {
    // 1. Fetch Top Story from Hacker News API
    console.log('📡 Fetching live intel from Hacker News...');
    const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topIds = await topIdsRes.json();
    
    if (!topIds || topIds.length === 0) {
      throw new Error('No stories found.');
    }

    // We will just grab the #1 story
    const topStoryId = topIds[0];
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`);
    const story = await storyRes.json();

    if (!story || !story.title) {
      throw new Error('Failed to parse top story details.');
    }

    console.log(`✅ Acquired Target: "${story.title}"`);

    // 2. Format the Tweet
    const tweetText = `🚨 BREAKING INTELLIGENCE 🚨\n\n"${story.title}"\n\nAccess the full intercepted source code and bypass the Skillwall here:\n${BASE_URL}/news/${topStoryId}\n\n#HackerNews #TechNews #CyberSecurity`;

    console.log('📝 Formatting Tweet:');
    console.log('-----------------------------------');
    console.log(tweetText);
    console.log('-----------------------------------');

    // 3. Post to X
    console.log('🚀 Transmitting to X network...');
    const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
    
    console.log(`🏆 SUCCESS! Intelligence leaked successfully. Tweet ID: ${createdTweet.id}`);

  } catch (error) {
    console.error('❌ Bot Execution Failed:', error);
    process.exit(1);
  }
}

postTopStory();
