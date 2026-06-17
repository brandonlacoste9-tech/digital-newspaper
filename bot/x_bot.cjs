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
    // Define promotional ads for the Empire
    const PROMO_ADS = [
      "🎮 Ready to bypass the Skillwall and play real games? Subscribe to the Zyeuté Arcade Hub for exclusive titles like Poutine Royale and Grid Rush! https://zyeute.com/arcade #IndieGames #Gaming",
      "💰 Did you know you can earn REAL Cennes just by reading the news on Hacker Media? Decrypt the intelligence and get paid. https://www.hackermedia.fun #ReadToEarn #CyberSecurity",
      "⚜️ Support independent Quebec tech! Join Zyeuté, the ultimate social network and arcade hub built by the Empire. https://zyeute.com #Quebec #Tech #Zyeute",
      "🤖 Ti-Guy is watching... Are you hacking the news or just reading it? Test your skills against the Skillwall today at https://www.hackermedia.fun #HackerNews #Coding"
    ];

    // 20% chance to post an ad instead of news
    const shouldPostAd = Math.random() < 0.20;
    
    let postText = '';

    if (shouldPostAd) {
      console.log('📢 Triggering Promotional Ad sequence...');
      postText = PROMO_ADS[Math.floor(Math.random() * PROMO_ADS.length)];
    } else {
      // 1. Fetch Top Story from Hacker News API
      console.log('📡 Fetching live intel from Hacker News...');
      const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const topIds = await topIdsRes.json();
      
      if (!topIds || topIds.length === 0) {
        throw new Error('No stories found.');
      }

      // Grab a random story from the top 15 to prevent Twitter "duplicate post" errors
      const randomIndex = Math.floor(Math.random() * 15);
      const topStoryId = topIds[randomIndex];
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStoryId}.json`);
      const story = await storyRes.json();

      if (!story || !story.title) {
        throw new Error('Failed to parse top story details.');
      }

      console.log(`✅ Acquired Target: "${story.title}" (Rank #${randomIndex + 1})`);

      // 2. Format the News Post
      postText = `🚨 BREAKING INTELLIGENCE 🚨\n\n"${story.title}"\n\nAccess the full intercepted source code and bypass the Skillwall here:\n${BASE_URL}/news/${topStoryId}\n\n#HackerNews #TechNews #CyberSecurity`;
    }

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
