'use client';

import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';

// Dynamically import the 3D cube component to avoid SSR issues with Three.js
const Cube = dynamic(() => import('@/components/Cube'), {
  ssr: false,
  loading: () => <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading 3D Engine...</div>
});

export default function Home() {
  return (
    <div className="app-container">
      <Navigation />

      <main className="main-content">
        <div className="cube-container">
          <Cube />
        </div>
        
        <div className="controls-overlay glass-panel">
          <button className="glass-button">Scramble</button>
          <button className="glass-button">Solve</button>
          <button className="glass-button">Step Back</button>
          <button className="glass-button">Step Fwd</button>
        </div>
      </main>
    </div>
  );
}
