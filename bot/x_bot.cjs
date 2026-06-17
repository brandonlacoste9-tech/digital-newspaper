require('dotenv').config();
const SocialPost = require('social-media-api');

// Hacker Media Config
const BASE_URL = 'https://www.hackermedia.fun';

// Ayrshare Initialization
const ayrshare = new SocialPost(process.env.AYRSHARE_API_KEY || '');

async function postTopStory() {
  console.log('🤖 Firing up the Autonomous Social Bot...');

  if (!process.env.AYRSHARE_API_KEY) {
    console.error('❌ AYRSHARE_API_KEY is missing. Please configure your .env file or GitHub Secrets.');
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

    // Grab the #1 story
    const topStoryId = topIds[0];
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`);
    const story = await storyRes.json();

    if (!story || !story.title) {
      throw new Error('Failed to parse top story details.');
    }

    console.log(`✅ Acquired Target: "${story.title}"`);

    // 2. Format the Post
    const postText = `🚨 BREAKING INTELLIGENCE 🚨\n\n"${story.title}"\n\nAccess the full intercepted source code and bypass the Skillwall here:\n${BASE_URL}/news/${topStoryId}\n\n#HackerNews #TechNews #CyberSecurity`;

    console.log('📝 Formatting Post:');
    console.log('-----------------------------------');
    console.log(postText);
    console.log('-----------------------------------');

    // 3. Transmit via Ayrshare (to Twitter)
    console.log('🚀 Transmitting payload via Ayrshare...');
    
    const postResponse = await ayrshare.post({
      post: postText,
      platforms: ['twitter'], // It will post to whatever platforms are linked in the Ayrshare dashboard
      shortenLinks: false
    });

    if (postResponse.status === 'error') {
      throw new Error(postResponse.message);
    }
    
    console.log(`🏆 SUCCESS! Intelligence leaked successfully.`);
    console.log(postResponse);

  } catch (error) {
    console.error('❌ Bot Execution Failed:', error);
    process.exit(1);
  }
}

postTopStory();
