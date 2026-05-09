import { useState } from 'react';
import { formatDatum } from '../utils/transform.js';

const PAGINA_GROOTTE = 100;

export default function ListView({ wedstrijden, onSelect }) {
  const [zichtbaar, setZichtbaar] = useState(PAGINA_GROOTTE);
  const items = wedstrijden.slice(0, zichtbaar);
  const meerLaden = zichtbaar < wedstrijden.length;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((p) => (
          <BookjeRow key={p.id} wedstrijd={p} onClick={() => onSelect(p)} />
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

function BookjeRow({ wedstrijd, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr auto auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.8rem 1rem',
        background: hover ? 'rgba(139,0,0,0.06)' : 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(139,0,0,0.15)',
        borderLeft: `4px solid ${wedstrijd.cover}`,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          width: 50,
          height: 65,
          background: wedstrijd.cover,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5F1E8',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: '1.1rem',
          overflow: 'hidden',
        }}
      >
        {wedstrijd.bestanden?.length > 0 ? (
          <img
            src={wedstrijd.bestanden[0]}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.textContent = 'AZ';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          'AZ'
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            marginBottom: '0.15rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {wedstrijd.thuis ? `AZ — ${wedstrijd.tegenstander}` : `${wedstrijd.tegenstander} — AZ`}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5a3030', fontStyle: 'italic' }}>
          {formatDatum(wedstrijd.datum)} · {wedstrijd.competitie}
          {wedstrijd.stad && ` · ${wedstrijd.stad}`}
        </div>
      </div>
      <div
        style={{
          fontSize: '0.75rem',
          color: '#8B0000',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        {wedstrijd.seizoen}
      </div>
      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: 900,
          color: '#1a0a0a',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 40,
          textAlign: 'right',
        }}
      >
        {wedstrijd.uitslag}
      </div>
    </button>
  );
}
