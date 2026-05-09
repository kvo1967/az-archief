export default function EmptyState({ onReset }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        color: '#8B0000',
        border: '1px dashed #8B0000',
        background: 'rgba(255,255,255,0.4)',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>⚽</div>
      <div style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
        Geen wedstrijden met deze filters
      </div>
      <button
        onClick={onReset}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1.2rem',
          background: '#8B0000',
          color: '#F5F1E8',
          border: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Wis filters
      </button>
    </div>
  );
}
