const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_APP_KEY || '',
  appSecret: process.env.X_APP_SECRET || '',
  accessToken: process.env.X_ACCESS_TOKEN || '',
  accessSecret: process.env.X_ACCESS_SECRET || '',
});

async function test() {
  try {
    const user = await client.v2.me();
    console.log('✅ Authentication successful!');
    console.log('Logged in as:', user.data.username);
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
  }
}

test();
