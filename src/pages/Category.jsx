import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchLiveNews } from '../data/news';
import { gamesData as games } from '../data/games';

const Category = () => {
  const { catId } = useParams();
  const [articles, setArticles] = useState([]);
  const [interactiveGames, setInteractiveGames] = useState([]);

  useEffect(() => {
    // Fetch live news and filter
    fetchLiveNews().then(liveData => {
      const foundNews = liveData.filter(n => n.category.toLowerCase() === catId.toLowerCase() || (catId.toLowerCase() === 'tech' && n.category.toLowerCase() !== 'gaming'));
      setArticles(foundNews);
    });
    
    // Also find games loosely matching
    if (catId.toLowerCase() === 'gaming') {
      setInteractiveGames(games.slice(0, 4));
    } else {
      // Just some random games for the sidebar
      setInteractiveGames(games.slice(4, 8));
    }
  }, [catId]);

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '4px solid var(--text-primary)', paddingBottom: '1rem' }}>
        <h1 className="headline" style={{ fontSize: '3rem', textTransform: 'uppercase' }}>{catId} News</h1>
      </header>

      <div style={{ display: 'flex', gap: '3rem' }}>
        {/* Main News Feed */}
        <div style={{ flex: 2 }}>
          {articles.length === 0 ? (
            <p className="subheadline">No breaking news in this category right now. Check back later.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {articles.map((article, i) => (
                <div key={article.id} style={{ display: 'flex', gap: '2rem', borderBottom: i !== articles.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: '2rem' }}>
                  <div style={{ flex: 1 }}>
                    <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{article.date}</div>
                    <h2 className="headline" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                      <Link to={`/news/${article.id}`} state={{ article }}>{article.title}</Link>
                    </h2>
                    <p className="subheadline" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{article.summary}</p>
                    <Link to={`/news/${article.id}`} state={{ article }} style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>Read Full Story →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Interactive Games */}
        <div style={{ flex: 1, borderLeft: '1px solid var(--border-color)', paddingLeft: '3rem' }}>
          <h3 className="headline" style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '2px solid var(--accent-color)', display: 'inline-block' }}>Interactive Games</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {interactiveGames.map(game => (
              <div key={game.id} className="article-card" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                <img src={game.coverUrl} alt={game.title} style={{ width: '100%', height: '120px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                <h4 className="headline" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                  <Link to={`/article/${game.id}`}>{game.title}</Link>
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
