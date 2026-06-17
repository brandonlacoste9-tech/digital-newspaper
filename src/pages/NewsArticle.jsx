import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchLiveNews } from '../data/news';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import CyberToast from './CyberToast';

const NewsArticle = () => {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article || null);
  
  // Skillwall State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (!article) {
      fetchLiveNews().then(liveData => {
        const found = liveData.find(n => n.id === id);
        setArticle(found);
      });
    }
  }, [id, article]);

  // Skillwall Timer Effect
  useEffect(() => {
    let timer;
    if (isPlayingGame) {
      // Allow proceeding after 10 seconds of "hacking/playing"
      timer = setTimeout(() => {
        setCanProceed(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isPlayingGame]);

  if (!article) return <div className="container" style={{ padding: '4rem 2rem' }}><h1 className="headline">Decrypting Intelligence...</h1></div>;

  const { user } = useAuth();
  const [toastMsg, setToastMsg] = useState(null);
  const [toastAmount, setToastAmount] = useState(0);

  const handleStartHack = () => {
    setIsPlayingGame(true);
  };

  const handleHackComplete = async () => {
    setIsPlayingGame(false);
    setIsUnlocked(true);

    if (user) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          // Send request to Zyeute backend
          const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const res = await fetch(`${backendUrl}/api/rewards/skillwall`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setToastAmount(data.reward);
            setToastMsg(data.message);
          } else if (res.status === 429) {
            setToastAmount(0);
            setToastMsg("DAILY INTEL LIMIT REACHED. NO FUNDS TRANSFERRED.");
          }
        }
      } catch (err) {
        console.error("Failed to acquire cennes:", err);
      }
    }
  };

  return (
    <article className="container" style={{ padding: '4rem 2rem', maxWidth: '800px', position: 'relative' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
          <Link to={`/category/${article.category}`} style={{ textDecoration: 'none' }}>{article.category}</Link>
        </div>
        <h1 className="headline" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          {article.title}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Source: {article.author}</div>
            <div>Intercepted {article.date}</div>
            <div style={{ color: '#00ff88', marginTop: '0.5rem' }}>HN Score: {article.score}</div>
          </div>
        </div>
      </header>

      <figure style={{ margin: '0 0 3rem 0' }}>
        <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
      </figure>

      {/* SKILLWALL INTERCEPTION */}
      {!isUnlocked ? (
        <div style={{ position: 'relative', marginTop: '2rem' }}>
          {/* Blurred/Encrypted Content */}
          <div style={{ filter: 'blur(10px)', userSelect: 'none', opacity: 0.5, pointerEvents: 'none' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████</p>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████</p>
          </div>

          {/* Overlay Panel */}
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'rgba(5, 5, 10, 0.95)', border: '2px solid #ff2a2a', borderRadius: '16px',
            padding: '3rem', width: '90%', textAlign: 'center', boxShadow: '0 0 40px rgba(255, 42, 42, 0.2)',
            zIndex: 10
          }}>
            <h2 className="headline" style={{ color: '#ff2a2a', fontSize: '2.5rem', marginBottom: '1rem' }}>SECURITY CLEARANCE REQUIRED</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              This intelligence is encrypted. You must bypass the Skillwall to access the source link.
            </p>
            
            {!isPlayingGame ? (
              <button onClick={handleStartHack} className="btn btn-primary" style={{ background: '#ff2a2a', color: '#fff', fontSize: '1.2rem', padding: '1rem 3rem' }}>
                DECRYPT LINK (Play Mini-Game)
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '400px', border: '2px solid #00ff88', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <iframe 
                    src="https://tbot.xyz/lumber/" 
                    title="Skillwall Decryption Game"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                </div>
                {!canProceed ? (
                  <div style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: '1.2rem', animation: 'pulse 1s infinite' }}>
                    Decrypting... Please play to maintain connection...
                  </div>
                ) : (
                  <button onClick={handleHackComplete} className="btn btn-primary" style={{ background: '#00ff88', color: '#000', fontSize: '1.2rem', padding: '1rem 3rem', animation: 'pulse 2s infinite' }}>
                    HACK COMPLETE: UNLOCK INTELLIGENCE
                  </button>
                )}
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* UNLOCKED CONTENT */
        <div className="animate-fade-in" style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-primary)', background: 'rgba(0, 255, 136, 0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00ff88', marginBottom: '1rem', fontWeight: 'bold' }}>
            <span>✓ ENCRYPTION BYPASSED</span>
          </div>
          
          {article.isHtml && article.content !== "This is a secured external intelligence link. Bypass the Skillwall to gain access." ? (
            <div className="html-content" dangerouslySetInnerHTML={{ __html: article.content }} style={{ marginBottom: '2rem' }} />
          ) : (
            <p style={{ marginBottom: '2rem' }}>{article.content}</p>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href={article.originalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00b3ff', color: '#000', fontSize: '1.3rem', padding: '1.2rem 4rem', borderRadius: '50px' }}>
              ACCESS EXTERNAL SOURCE
            </a>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-secondary)', borderTop: '4px solid var(--accent-secondary)' }}>
        <h3 className="headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Support Independent Tech Journalism</h3>
        <p style={{ marginBottom: '1.5rem' }}>If you enjoyed this deep-dive, consider subscribing to The Arcade to gain full access to our interactive gaming catalogue and bypass future Skillwalls.</p>
        <a href={import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'} className="btn btn-primary" style={{ background: 'var(--accent-secondary)', color: '#fff' }}>Subscribe Now</a>
      </div>

      {toastMsg && (
        <CyberToast 
          message={toastMsg} 
          amount={toastAmount} 
          onClose={() => setToastMsg(null)} 
        />
      )}
    </article>
  );
};

export default NewsArticle;
