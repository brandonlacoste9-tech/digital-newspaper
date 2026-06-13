import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamesData as games } from '../data/games';
import { newsData, fetchLiveNews } from '../data/news';

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [topNews, setTopNews] = useState([]);

  useEffect(() => {
    setFeaturedGames(games.slice(0, 6));
    
    // Fetch live news on mount
    fetchLiveNews().then(liveData => {
      setTopNews(liveData);
    });
  }, []);

  const getGameUrl = (game) => `/article/${game.id}`;
  const getNewsUrl = (news) => `/news/${news.id}`;

  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      
      {/* Front Page Lead Story (News) */}
      {topNews.length > 0 && (
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '2px solid var(--border-color)' }}>
          <div style={{ flex: 2 }}>
            <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{topNews[0].category}</div>
            <img src={topNews[0].imageUrl} alt={topNews[0].title} style={{ width: '100%', height: '500px', objectFit: 'cover', marginBottom: '1.5rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
            <h2 className="headline" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
              <Link to={getNewsUrl(topNews[0])} state={{ article: topNews[0] }}>{topNews[0].title}</Link>
            </h2>
            <p className="subheadline" style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>
              {topNews[0].summary}
            </p>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
              By {topNews[0].author} • {topNews[0].date}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Secondary News */}
            {topNews.slice(1, 3).map(news => (
              <div key={news.id} className="article-card" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '0.5rem' }}>{news.category}</div>
                <img src={news.imageUrl} alt={news.title} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                <h3 className="headline" style={{ fontSize: '1.8rem', lineHeight: 1.2 }}>
                  <Link to={getNewsUrl(news)} state={{ article: news }}>{news.title}</Link>
                </h3>
                <p className="subheadline" style={{ fontSize: '1rem' }}>
                  {news.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Gaming Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h3 className="headline" style={{ fontSize: '2rem', borderBottom: '2px solid var(--text-primary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>Interactive Game Reviews</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          {featuredGames.slice(0, 3).map(game => (
            <div key={game.id} className="article-card">
              <h4 className="headline" style={{ fontSize: '1.5rem', lineHeight: 1.2 }}>
                <Link to={getGameUrl(game)}>Review: {game.title}</Link>
              </h4>
              <div style={{ margin: '1rem 0' }}>
                <img src={game.coverUrl} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
              </div>
              <p className="subheadline">
                An unprecedented approach to {game.category} gameplay. Play the embedded version now.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom News Section */}
      {topNews.length > 3 && (
        <div style={{ display: 'flex', gap: '3rem', borderTop: '2px solid var(--border-color)', paddingTop: '3rem' }}>
          <div style={{ flex: 1 }}>
            <h3 className="headline" style={{ fontSize: '2rem', marginBottom: '2rem' }}>More Headlines</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {topNews.slice(3).map(news => (
                <div key={news.id} style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                  <img src={news.imageUrl} alt={news.title} style={{ width: '150px', height: '100px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  <div>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '0.3rem' }}>{news.category}</div>
                    <h4 className="headline" style={{ fontSize: '1.3rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                      <Link to={getNewsUrl(news)} state={{ article: news }}>{news.title}</Link>
                    </h4>
                    <p className="subheadline" style={{ fontSize: '0.9rem' }}>
                      {news.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid var(--border-color)', paddingLeft: '3rem' }}>
            <h3 className="headline" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>More Interactive Games</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {featuredGames.slice(3, 6).map(game => (
                <div key={game.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={game.coverUrl} alt={game.title} style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  <h4 className="headline" style={{ fontSize: '1.1rem' }}>
                    <Link to={getGameUrl(game)}>{game.title} • Play Now</Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Massive Interactive Gaming Catalog */}
      <div style={{ marginTop: '5rem', borderTop: '4px solid var(--text-primary)', paddingTop: '3rem' }}>
        <h2 className="headline" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>The Interactive Review Catalog</h2>
        <p className="subheadline" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto', fontSize: '1.2rem' }}>
          Welcome to the largest collection of playable journalism on the web. Click any review below to launch the embedded interactive experience directly in your browser.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {games.slice(6, 66).map(game => (
            <Link key={game.id} to={getGameUrl(game)} className="article-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={game.coverUrl} alt={game.title} style={{ width: '100%', height: '150px', objectFit: 'cover', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }} />
              <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '0.3rem' }}>{game.category} • Review</div>
              <h4 className="headline" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{game.title}</h4>
            </Link>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button style={{ background: 'transparent', border: '2px solid var(--text-primary)', color: 'var(--text-primary)', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
            Load 50 More Interactive Reviews
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
