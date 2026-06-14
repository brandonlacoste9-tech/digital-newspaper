import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function Admin() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    summary: '',
    content: '',
    author: 'Hacker Media Editor',
    imageUrl: ''
  });
  
  const [status, setStatus] = useState('IDLE');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('UPLOADING');
    
    const articleId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dateStr = new Date().toLocaleDateString();

    const { data, error } = await supabase
      .from('hacker_articles')
      .insert([
        { 
          id: articleId,
          ...formData,
          date: dateStr
        }
      ]);

    if (error) {
      console.error(error);
      setStatus('ERROR');
    } else {
      setStatus('SUCCESS');
      setFormData({
        title: '',
        category: 'Tech',
        summary: '',
        content: '',
        author: 'Hacker Media Editor',
        imageUrl: ''
      });
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#00ff41',
      fontFamily: '"Courier New", Courier, monospace',
      padding: '4rem 2rem',
      backgroundImage: 'radial-gradient(circle at center, #111 0%, #000 100%)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Terminal size={40} color="#00ff41" />
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px #00ff41' }}>
              Mainframe Access
            </h1>
            <p style={{ margin: 0, color: '#888' }}>Secure uplink established. Awaiting input.</p>
          </div>
        </header>

        {status === 'SUCCESS' && (
          <div style={{ backgroundColor: '#00ff41', color: '#000', padding: '1rem', marginBottom: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu /> UPLOAD SUCCESSFUL. DATA INGESTED INTO MAINFRAME.
          </div>
        )}

        {status === 'ERROR' && (
          <div style={{ backgroundColor: '#ff003c', color: '#fff', padding: '1rem', marginBottom: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert /> UPLOAD FAILED. SYSTEM REJECTED PACKET.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_TITLE</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange} required
                style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.75rem', fontFamily: 'inherit', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#00ff41'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_CATEGORY</label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                style={{ backgroundColor: '#111', border: '1px solid #333', color: '#00ff41', padding: '0.75rem', fontFamily: 'inherit', outline: 'none' }}
              >
                <option value="Tech">Tech</option>
                <option value="AI">AI</option>
                <option value="Gaming">Gaming</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="World">World</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_THUMBNAIL_URL</label>
            <input 
              type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required
              placeholder="https://images.unsplash.com/..."
              style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.75rem', fontFamily: 'inherit', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00ff41'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_SUMMARY_DECRYPT</label>
            <textarea 
              name="summary" value={formData.summary} onChange={handleChange} required rows={3}
              style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.75rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = '#00ff41'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_RAW_CONTENT_STREAM</label>
            <textarea 
              name="content" value={formData.content} onChange={handleChange} required rows={10}
              style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.75rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = '#00ff41'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', letterSpacing: '1px' }}>_AUTHOR_ID</label>
            <input 
              type="text" name="author" value={formData.author} onChange={handleChange} required
              style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.75rem', fontFamily: 'inherit', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#00ff41'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'UPLOADING'}
            style={{ 
              marginTop: '1rem',
              backgroundColor: status === 'UPLOADING' ? '#333' : 'transparent', 
              color: status === 'UPLOADING' ? '#888' : '#00ff41', 
              border: '2px solid',
              borderColor: status === 'UPLOADING' ? '#333' : '#00ff41',
              padding: '1rem', 
              fontFamily: 'inherit', 
              fontSize: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              cursor: status === 'UPLOADING' ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              boxShadow: status === 'UPLOADING' ? 'none' : '0 0 15px rgba(0, 255, 65, 0.3)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              if (status !== 'UPLOADING') {
                e.target.style.backgroundColor = '#00ff41';
                e.target.style.color = '#000';
              }
            }}
            onMouseOut={(e) => {
              if (status !== 'UPLOADING') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#00ff41';
              }
            }}
          >
            {status === 'UPLOADING' ? 'TRANSMITTING...' : 'PUBLISH TO MAINFRAME'}
          </button>
        </form>
      </div>
    </div>
  );
}
