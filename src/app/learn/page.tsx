import Navigation from '@/components/Navigation';

export default function Learn() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="page-container">
        <h2>Learning Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          
          <div className="glass-card">
            <h3>Beginner Method</h3>
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>Learn the layer-by-layer method. Perfect for first-timers.</p>
            <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
              <div style={{ width: '45%', background: 'var(--primary-color)', height: '100%', borderRadius: '4px', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '0.5rem', color: '#888' }}>45% Complete</p>
            <button className="glass-button active" style={{ width: '100%', marginTop: '1rem' }}>Continue</button>
          </div>

          <div className="glass-card">
            <h3>CFOP Method</h3>
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>Advanced speedcubing method (Cross, F2L, OLL, PLL).</p>
            <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
              <div style={{ width: '0%', background: 'var(--primary-color)', height: '100%', borderRadius: '4px' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '0.5rem', color: '#888' }}>0% Complete</p>
            <button className="glass-button" style={{ width: '100%', marginTop: '1rem' }}>Start Module</button>
          </div>
          
          <div className="glass-card">
            <h3>Yau Method (4x4+)</h3>
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>Edge pairing and centers for big cubes.</p>
            <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}></div>
            <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '0.5rem', color: '#888' }}>Locked</p>
            <button className="glass-button" style={{ width: '100%', marginTop: '1rem', opacity: 0.5 }} disabled>Locked</button>
          </div>

        </div>
      </main>
    </div>
  );
}
