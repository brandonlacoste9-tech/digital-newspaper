import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gamesData as games } from '../data/games';

const Article = () => {
  const { id } = useParams();
  const { user, plan } = useAuth();
  const arcadeUrl = import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173';
  
  const [game, setGame] = useState(null);
  const [trialSeconds, setTrialSeconds] = useState(5400); // 1.5 hours
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = games.find(g => g.id.toString() === id);
    setGame(found);
    
    if (found) {
      if (user) {
        const fetchTrial = async () => {
          const { supabase } = await import('../supabaseClient');
          const { data } = await supabase.from('profiles').select('trial_time_remaining').eq('id', user.id).single();
          if (data) {
            setTrialSeconds(data.trial_time_remaining);
          }
          setLoading(false);
        };
        fetchTrial();
      } else {
        setLoading(false);
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (!user || plan === 'PRO' || trialSeconds <= 0 || loading) return;

    const interval = setInterval(() => {
      setTrialSeconds(prev => {
        const newTime = prev - 1;
        if (newTime % 5 === 0) {
          import('../supabaseClient').then(({ supabase }) => {
            supabase.from('profiles').update({ trial_time_remaining: newTime }).eq('id', user.id).then();
          });
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, plan, trialSeconds, loading]);

  if (!game) return <div className="container" style={{ padding: '4rem 2rem' }}><h1 className="headline">Article Not Found</h1></div>;

  const isLocked = !user || (plan !== 'PRO' && trialSeconds <= 0);

  return (
    <article className="container" style={{ padding: '4rem 2rem', maxWidth: '900px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
          Interactive Review • {game.category}
        </div>
        <h1 className="headline" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          The Rise of {game.title}: A New Era in Interactive Media
        </h1>
        <p className="subheadline" style={{ fontSize: '1.4rem', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto 2rem' }}>
          Our technology correspondent dives deep into the mechanics of this groundbreaking new HTML5 experience. Try the interactive demo below.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random" alt="Author" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>By Sarah Jenkins</div>
            <div>Published {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </header>

      <div style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '3rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '4rem', float: 'left', lineHeight: 0.8, paddingRight: '0.5rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>T</span>
          he landscape of digital entertainment has been shifting rapidly, and with the sudden surge in popularity of <strong>{game.title}</strong>, we are seeing a massive evolution in browser-based gaming.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Initially dismissed by hardcore enthusiasts, {game.category} titles have proven their staying power by offering frictionless, instantaneous engagement. 
          There is no 50GB download, no intrusive launcher—just pure, unadulterated mechanics.
        </p>
      </div>

      {/* Embedded Game Section */}
      <div style={{ margin: '4rem 0', padding: '2rem', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
        <h3 className="headline" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Interactive Demonstration</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Play the full version of {game.title} directly in this article.
        </p>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          {isLocked ? (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,10,12,0.9)', zIndex: 10, padding: '2rem', textAlign: 'center' }}>
              <h3 className="headline" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Access Restricted</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
                {!user 
                  ? "You must be logged in to access interactive article embeds." 
                  : "Your 1.5-hour free interactive trial has expired."}
              </p>
              {!user ? (
                <a href={`${arcadeUrl}/login`} className="btn btn-primary">Login to Read & Play</a>
              ) : (
                <a href={`${arcadeUrl}/pricing`} className="btn btn-primary" style={{ background: 'var(--accent-color)', color: '#fff' }}>Subscribe to Pro</a>
              )}
            </div>
          ) : (
            <>
              {plan === 'FREE' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'var(--accent-color)', padding: '0.5rem 1rem', borderRadius: '4px', zIndex: 5, fontWeight: 'bold', fontFamily: 'monospace' }}>
                  Trial: {Math.floor(trialSeconds / 60)}:{(trialSeconds % 60).toString().padStart(2, '0')}
                </div>
              )}
              <iframe 
                src={game.url} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title={game.title}
                allow="autoplay; fullscreen"
              />
            </>
          )}
        </div>
      </div>

      <div style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1.5rem' }}>
          As you can see from the interactive embed above, the technical prowess of <strong>{game.title}</strong> cannot be overstated. 
          It utilizes WebGL rendering to achieve what native desktop applications were struggling to do just five years ago.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          The integration of these games into everyday media—like this very newspaper—signals the next step in content consumption. 
          We are no longer just readers; we are players. And the lines between the two are blurring faster than we can track.
        </p>
      </div>
    </article>
  );
};

export default Article;
