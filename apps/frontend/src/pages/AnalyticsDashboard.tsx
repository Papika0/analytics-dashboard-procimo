function AnalyticsDashboard() {
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-gray-900)' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: 'var(--color-gray-600)', marginTop: '0.5rem' }}>
          Sales data visualization and analytics
        </p>
      </header>

      <main>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <p style={{ color: 'var(--color-gray-500)', textAlign: 'center' }}>
            🚀 Dashboard components will be added in Phase 2
          </p>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsDashboard;
