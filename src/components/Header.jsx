import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Menu, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout, plan } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const arcadeUrl = import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173';

  return (
    <header className="masthead">
      {/* Trading Ticker (Money Line) */}
      <div style={{ background: '#111', color: '#00ff88', padding: '0.2rem 0', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
        <div style={{ display: 'inline-block', animation: 'scroll-ticker 20s linear infinite' }}>
          <span style={{ marginRight: '2rem' }}>INC ▲ 4.2% ($142.50)</span>
          <span style={{ marginRight: '2rem', color: '#ff3333' }}>TECH ▼ 1.1% ($3,204.11)</span>
          <span style={{ marginRight: '2rem' }}>BTC ▲ 8.9% ($82,410.00)</span>
          <span style={{ marginRight: '2rem' }}>ETH ▲ 5.4% ($4,102.50)</span>
          <span style={{ marginRight: '2rem' }}>QNTM ▲ 12.1% ($89.20)</span>
          <span style={{ marginRight: '2rem', color: '#ff3333' }}>META ▼ 0.5% ($310.15)</span>
          <span style={{ marginRight: '2rem' }}>NVDA ▲ 2.3% ($945.80)</span>
          
          {/* Duplicate for seamless looping */}
          <span style={{ marginRight: '2rem' }}>INC ▲ 4.2% ($142.50)</span>
          <span style={{ marginRight: '2rem', color: '#ff3333' }}>TECH ▼ 1.1% ($3,204.11)</span>
          <span style={{ marginRight: '2rem' }}>BTC ▲ 8.9% ($82,410.00)</span>
          <span style={{ marginRight: '2rem' }}>ETH ▲ 5.4% ($4,102.50)</span>
        </div>
        <style>{`
          @keyframes scroll-ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {/* Top bar: Date and Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            {user ? (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} /> {user.email}
                  {plan === 'PRO' && <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold' }}>PRO</span>}
                </span>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Logout</button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', color: 'var(--text-primary)' }}>
            HACKER MEDIA
          </Link>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <Menu size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Sections</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Link to="/" style={{ color: 'var(--text-primary)' }}>Front Page</Link>
            <Link to="/category/World" style={{ color: 'var(--text-secondary)' }}>World</Link>
            <Link to="/category/Tech" style={{ color: 'var(--text-secondary)' }}>Technology</Link>
            <Link to="/category/AI" style={{ color: 'var(--text-secondary)' }}>AI</Link>
            <Link to="/category/Gaming" style={{ color: 'var(--text-secondary)' }}>Gaming</Link>
            <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>Real Hacker News</a>
          </div>

          <div style={{ cursor: 'pointer' }}>
            <Search size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
