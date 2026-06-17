export const newsData = []; // Removed fake news

// Helper to fetch and parse RSS feeds via rss2json
const fetchRssNews = async (rssUrl, categoryName) => {
  try {
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    const data = await res.json();
    
    if (!data.items) return [];

    return data.items.map(item => {
      // Clean up HTML tags for the summary
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description || item.content || '';
      let summary = tempDiv.textContent || tempDiv.innerText || '';
      if (summary.length > 150) summary = summary.substring(0, 150) + '...';

      // Deterministic placeholder image if none is provided
      const seed = encodeURIComponent(item.guid || item.link);
      const fallbackImage = `https://picsum.photos/seed/${seed}/800/500`;

      // Extract image from enclosure or thumbnail if available
      let imageUrl = item.thumbnail || fallbackImage;
      if (item.enclosure && item.enclosure.link) {
        imageUrl = item.enclosure.link;
      } else if (!item.thumbnail && (item.description || item.content)) {
        // Try to extract an img tag
        const imgMatch = (item.description || item.content).match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      return {
        id: encodeURIComponent(item.guid || item.link),
        category: categoryName,
        title: item.title,
        summary: summary,
        content: item.content || item.description || "This is a secured external intelligence link. Bypass the Skillwall to gain access.",
        author: item.author || `${categoryName} Reporter`,
        date: new Date(item.pubDate).toLocaleDateString(),
        imageUrl: imageUrl,
        isHtml: true,
        originalLink: item.link,
        score: Math.floor(Math.random() * 500) + 50 // Fake score for UI consistency
      };
    });
  } catch (error) {
    console.error(`Failed to fetch RSS for ${categoryName}:`, error);
    return [];
  }
};

export const fetchLiveNews = async () => {
  try {
    // 1. Fetch top stories from official Hacker News API
    let hnArticles = [];
    try {
      const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const topIds = await hnRes.json();
      
      if (topIds && topIds.length) {
        const top10Ids = topIds.slice(0, 10);
        const itemPromises = top10Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        const items = await Promise.all(itemPromises);

        hnArticles = items.filter(Boolean).map(item => {
          const seed = item.id;
          const imageUrl = `https://picsum.photos/seed/${seed}/800/500`;

          let summary = item.title;
          let content = "This is a secured external intelligence link. Bypass the Skillwall to gain access.";
          
          if (item.text) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.text;
            summary = tempDiv.textContent || tempDiv.innerText || '';
            if (summary.length > 150) summary = summary.substring(0, 150) + '...';
            content = item.text;
          }

          return {
            id: String(item.id),
            category: 'Tech', // Mapped HN to Tech
            title: item.title,
            summary: summary,
            content: content,
            author: item.by,
            date: new Date(item.time * 1000).toLocaleDateString(),
            imageUrl: imageUrl,
            isHtml: !!item.text,
            originalLink: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            score: item.score
          };
        });
      }
    } catch (err) {
      console.error("Failed HN fetch", err);
    }

    // 2. Fetch other categories via RSS
    const [worldNews, aiNews, gamingNews] = await Promise.all([
      fetchRssNews('https://feeds.bbci.co.uk/news/world/rss.xml', 'World'),
      fetchRssNews('https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', 'AI'),
      fetchRssNews('https://www.polygon.com/rss/index.xml', 'Gaming')
    ]);

    // 3. Mix them all together so the front page looks diverse
    const allNews = [];
    
    // We want a good mix: 1 Tech, 1 AI, 1 World, 1 Gaming, repeat
    const maxLength = Math.max(hnArticles.length, worldNews.length, aiNews.length, gamingNews.length);
    for (let i = 0; i < maxLength; i++) {
      if (hnArticles[i]) allNews.push(hnArticles[i]);
      if (aiNews[i]) allNews.push(aiNews[i]);
      if (worldNews[i]) allNews.push(worldNews[i]);
      if (gamingNews[i]) allNews.push(gamingNews[i]);
    }

    return allNews;

  } catch (error) {
    console.error('Failed to fetch live news:', error);
    return []; 
  }
};
