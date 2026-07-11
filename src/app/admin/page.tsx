import Navigation from '@/components/Navigation';

export default function Admin() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="page-container">
        <h2>Admin Dashboard</h2>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Manage algorithms, users, and platform analytics.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Total Users</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>1,432</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Algorithms DB</h3>
            <button className="glass-button" style={{ width: '100%', marginBottom: '0.5rem' }}>Add New OLL</button>
            <button className="glass-button" style={{ width: '100%' }}>Add New PLL</button>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>System Health</h3>
            <p style={{ color: '#009e60' }}>Database: ONLINE</p>
            <p style={{ color: '#009e60', marginTop: '0.5rem' }}>API: ONLINE</p>
          </div>
        </div>
      </main>
    </div>
  );
}
