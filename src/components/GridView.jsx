import { useState } from 'react';
import BookjeCover from './BookjeCover.jsx';
import { formatDatum } from '../utils/transform.js';

const PAGINA_GROOTTE = 60;

export default function GridView({ wedstrijden, onSelect }) {
  const [zichtbaar, setZichtbaar] = useState(PAGINA_GROOTTE);

  const items = wedstrijden.slice(0, zichtbaar);
  const meerLaden = zichtbaar < wedstrijden.length;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {items.map((p, i) => (
          <BookjeCard key={p.id} wedstrijd={p} onClick={() => onSelect(p)} index={i} />
        ))}
      </div>

      {meerLaden && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setZichtbaar(zichtbaar + PAGINA_GROOTTE)}
            style={{
              padding: '0.85rem 2rem',
              background: '#8B0000',
              color: '#F5F1E8',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Meer laden ({wedstrijden.length - zichtbaar} resterend)
          </button>
        </div>
      )}
    </>
  );
}

function BookjeCard({ wedstrijd, onClick, index }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        animation: `fadeUp 0.5s ease ${Math.min(index * 0.02, 0.4)}s both`,
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '0.7',
          boxShadow: hover
            ? '0 12px 24px rgba(139,0,0,0.35), 0 0 0 1px rgba(139,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(139,0,0,0.2)',
          transform: hover ? 'translateY(-4px) rotate(-0.5deg)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          marginBottom: '0.7rem',
          background: '#1a0a0a',
        }}
      >
        <BookjeCover wedstrijd={wedstrijd} size="medium" />
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#1a0a0a',
          marginBottom: '0.15rem',
        }}
      >
        {wedstrijd.thuis ? `AZ — ${wedstrijd.tegenstander}` : `${wedstrijd.tegenstander} — AZ`}
      </div>
      <div
        style={{
          fontSize: '0.75rem',
          color: '#8B0000',
          display: 'flex',
          justifyContent: 'space-between',
          fontStyle: 'italic',
          gap: '0.5rem',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {wedstrijd.competitie}
        </span>
        <span style={{ flexShrink: 0 }}>{wedstrijd.seizoen.split('/')[0]}</span>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}
