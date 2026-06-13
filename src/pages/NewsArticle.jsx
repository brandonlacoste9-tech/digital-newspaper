import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchLiveNews } from '../data/news';

const NewsArticle = () => {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);

  useEffect(() => {
    if (!article) {
      // If no state was passed (e.g., direct link visit), try fetching
      fetchLiveNews().then(liveData => {
        const found = liveData.find(n => n.id === id);
        setArticle(found);
      });
    }
  }, [id, article]);

  if (!article) return <div className="container" style={{ padding: '4rem 2rem' }}><h1 className="headline">Story Not Found</h1></div>;

  return (
    <article className="container" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
          <Link to={`/category/${article.category}`} style={{ textDecoration: 'none' }}>{article.category}</Link>
        </div>
        <h1 className="headline" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          {article.title}
        </h1>
        <p className="subheadline" style={{ fontSize: '1.4rem', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto 2rem' }}>
          {article.summary}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <img src={`https://ui-avatars.com/api/?name=${article.author.replace(' ', '+')}&background=random`} alt={article.author} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>By {article.author}</div>
            <div>Published {article.date}</div>
          </div>
        </div>
      </header>

      <figure style={{ margin: '0 0 3rem 0' }}>
        <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
        <figcaption style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right', fontStyle: 'italic' }}>
          Exclusive photography for Gamer News.
        </figcaption>
      </figure>

      <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
        {article.isHtml ? (
          <div className="html-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          article.content.split('\n\n').map((paragraph, index) => {
            if (index === 0) {
              return (
                <p key={index} style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '4rem', float: 'left', lineHeight: 0.8, paddingRight: '0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </p>
              );
            }
            return <p key={index} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>;
          })
        )}
      </div>
      
      <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent-secondary)' }}>
        <h3 className="headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Support Independent Tech Journalism</h3>
        <p style={{ marginBottom: '1.5rem' }}>If you enjoyed this deep-dive, consider subscribing to The Arcade to gain full access to our interactive gaming catalogue and support our investigative journalism.</p>
        <a href={import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'} className="btn btn-primary" style={{ background: 'var(--accent-secondary)', color: '#fff' }}>Subscribe Now</a>
      </div>
    </article>
  );
};

export default NewsArticle;
