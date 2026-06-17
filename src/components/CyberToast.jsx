import React, { useEffect, useState } from 'react';

const CyberToast = ({ message, amount, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay to animate in
    const inTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide after 5 seconds
    const outTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // allow fade out animation to finish
    }, 5000);

    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: isVisible ? '2rem' : '-100%',
      transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      background: 'rgba(0, 10, 5, 0.95)',
      border: '1px solid #00ff88',
      borderLeft: '4px solid #00ff88',
      padding: '1.5rem',
      borderRadius: '4px',
      color: '#00ff88',
      fontFamily: 'monospace',
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      minWidth: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>SYSTEM: REWARD ISSUED</span>
        <span style={{ color: '#00b3ff' }}>+{amount} CENNES</span>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#88ffcc' }}>
        {'>'} {message}
      </div>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 136, 0.05) 51%, transparent 51%)',
        backgroundSize: '100% 4px',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
    </div>
  );
};

export default CyberToast;
