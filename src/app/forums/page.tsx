import Navigation from '@/components/Navigation';

export default function Forums() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Community Forums</h2>
          <button className="glass-button active">Share a Solve</button>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary-color)' }}>New PB! 11.89s Full Step</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.2rem' }}>Posted by CuberPro99 • 2 hours ago</p>
            </div>
            <button className="glass-button">View Reconstruction</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary-color)' }}>Help with G-perm recognition</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.2rem' }}>Posted by BeginnerCube • 5 hours ago</p>
            </div>
            <button className="glass-button">View Thread (12 replies)</button>
          </div>
        </div>
      </main>
    </div>
  );
}
