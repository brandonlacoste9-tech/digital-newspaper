export const newsData = []; // Removed fake news

export const fetchLiveNews = async () => {
  try {
    // 1. Fetch top stories from official Hacker News API
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topIds = await res.json();
    
    if (!topIds || !topIds.length) return [];

    // 2. Take top 15 stories and fetch their details
    const top15Ids = topIds.slice(0, 15);
    const itemPromises = top15Ids.map(id => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    );
    
    const items = await Promise.all(itemPromises);

    // 3. Map Hacker News format to Hacker Media format
    const liveArticles = items.filter(Boolean).map(item => {
      // Create a deterministic placeholder image based on HN id
      const seed = item.id;
      const imageUrl = `https://picsum.photos/seed/${seed}/800/500`;

      // Extract text summary if it's an Ask HN, otherwise use title as summary
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
        category: 'Hacker News',
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

    return liveArticles;

  } catch (error) {
    console.error('Failed to fetch live Hacker News:', error);
    return []; 
  }
};
