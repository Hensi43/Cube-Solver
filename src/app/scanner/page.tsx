import Navigation from '@/components/Navigation';

export default function Scanner() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="page-container">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <h2>Cube Scanner</h2>
          <p>Hold your cube up to the camera or enter the colors manually.</p>
          
          <div style={{ width: '100%', height: '400px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#aaa' }}>Camera Feed (WebRTC)</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="glass-button active">Start Scan</button>
            <button className="glass-button">Manual Entry</button>
          </div>
        </div>
      </main>
    </div>
  );
}
