'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      }
    };
    window.addEventListener('keyup', handleSpacebar);
    return () => window.removeEventListener('keyup', handleSpacebar);
  }, []);

  return (
    <div className="app-container">
      <Navigation />
      <main className="page-container" style={{ textAlign: 'center' }}>
        
        <div className="glass-card" style={{ padding: '4rem 2rem' }}>
          <h2 style={{ color: '#888' }}>Speedsolving Timer</h2>
          <h1 style={{ 
            fontSize: '6rem', 
            margin: '2rem 0', 
            fontFamily: 'monospace', 
            textShadow: '0 0 20px rgba(255,255,255,0.2)' 
          }}>
            {(time / 1000).toFixed(2)}s
          </h1>
          <p style={{ color: isRunning ? '#ff5800' : '#aaa', transition: 'color 0.2s' }}>
            {isRunning ? 'Solving...' : 'Press SPACE to start / stop'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: '#888' }}>Current Ao5</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>14.23</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: '#888' }}>Current Ao100</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>15.01</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255, 213, 0, 0.3)' }}>
            <h3 style={{ color: '#ffd500' }}>Personal Best</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold', color: '#ffd500', textShadow: '0 0 10px rgba(255,213,0,0.5)' }}>11.89</p>
          </div>
        </div>
        
      </main>
    </div>
  );
}
