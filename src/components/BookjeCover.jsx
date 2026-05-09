import { useState } from 'react';
import { formatDatum } from '../utils/transform.js';

/**
 * Cover van een programmaboekje. Toont de echte afbeelding als die beschikbaar is,
 * anders een gestileerde placeholder met match-info.
 */
export default function BookjeCover({ wedstrijd, size = 'medium' }) {
  const [imageError, setImageError] = useState(false);
  const heeftBestand = wedstrijd.bestanden?.length > 0;
  const toonPlaceholder = !heeftBestand || imageError;

  const sizes = {
    small: { fontSize: { az: '1rem', label: '0.45rem', tegenstander: '0.5rem' }, padding: '0.3rem' },
    medium: { fontSize: { az: '1.5rem', label: '0.55rem', tegenstander: '0.85rem' }, padding: '0.5rem' },
    large: { fontSize: { az: '2rem', label: '0.65rem', tegenstander: '1.1rem' }, padding: '0.8rem' },
  };
  const s = sizes[size];

  if (!toonPlaceholder) {
    return (
      <img
        src={wedstrijd.bestanden[0]}
        alt={`Programmaboekje ${wedstrijd.wedstrijd}`}
        loading="lazy"
        onError={() => setImageError(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          display: 'block',
        }}
      />
    );
  }

  // Placeholder
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${wedstrijd.cover} 0%, ${wedstrijd.cover}dd 50%, #2a0808 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 22px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '8%', left: '8%', right: '8%',
          color: '#F5F1E8',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: s.fontSize.label,
            letterSpacing: '0.3em',
            opacity: 0.85,
            marginBottom: '0.3rem',
            fontWeight: 700,
          }}
        >
          OFFICIEEL PROGRAMMA
        </div>
        <div
          style={{
            fontSize: s.fontSize.az,
            fontWeight: 900,
            fontStyle: 'italic',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
          }}
        >
          AZ
        </div>
        <div
          style={{
            fontSize: s.fontSize.label,
            margin: '0.4rem 0',
            letterSpacing: '0.2em',
            opacity: 0.7,
          }}
        >
          — vs —
        </div>
        <div
          style={{
            fontSize: s.fontSize.tegenstander,
            fontWeight: 700,
            lineHeight: 1.1,
            fontStyle: 'italic',
          }}
        >
          {wedstrijd.tegenstander}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '8%', left: '8%', right: '8%',
          color: '#F5F1E8',
          textAlign: 'center',
          borderTop: '1px solid rgba(245,241,232,0.4)',
          paddingTop: '0.5rem',
        }}
      >
        <div style={{ fontSize: s.fontSize.label, letterSpacing: '0.2em', opacity: 0.8 }}>
          {wedstrijd.seizoen}
        </div>
        <div
          style={{
            fontSize: s.fontSize.label,
            marginTop: '0.2rem',
            opacity: 0.7,
            fontStyle: 'italic',
          }}
        >
          {formatDatum(wedstrijd.datum)}
        </div>
      </div>
      {/* Hoekvouw */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 0 16px 16px',
          borderColor: 'transparent transparent rgba(0,0,0,0.3) transparent',
        }}
      />
    </div>
  );
}
