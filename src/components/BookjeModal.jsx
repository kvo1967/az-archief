import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDatum } from '../utils/transform.js';

export default function BookjeModal({ wedstrijd, onClose }) {
  const [paginaIndex, setPaginaIndex] = useState(0);
  const heeftBestanden = wedstrijd.bestanden?.length > 0;
  const meerderePaginas = wedstrijd.bestanden?.length > 1;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(26, 10, 10, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#F5F1E8',
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '1px solid #8B0000',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Sluiten"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: '#1a0a0a',
            color: '#F5F1E8',
            border: 'none',
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Cover sectie */}
        {heeftBestanden ? (
          <div
            style={{
              background: '#1a0a0a',
              position: 'relative',
              maxHeight: '70vh',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={wedstrijd.bestanden[paginaIndex]}
              alt={`Pagina ${paginaIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />

            {meerderePaginas && (
              <>
                <button
                  onClick={() =>
                    setPaginaIndex((i) => (i - 1 + wedstrijd.bestanden.length) % wedstrijd.bestanden.length)
                  }
                  aria-label="Vorige pagina"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(245,241,232,0.9)',
                    color: '#8B0000',
                    border: '1px solid #8B0000',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPaginaIndex((i) => (i + 1) % wedstrijd.bestanden.length)}
                  aria-label="Volgende pagina"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(245,241,232,0.9)',
                    color: '#8B0000',
                    border: '1px solid #8B0000',
                    width: 40,
                    height: 40,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(26,10,10,0.85)',
                    color: '#F5F1E8',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.8rem',
                    fontFamily: 'Georgia, serif',
                    letterSpacing: '0.1em',
                  }}
                >
                  {paginaIndex + 1} / {wedstrijd.bestanden.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              background: `linear-gradient(135deg, ${wedstrijd.cover} 0%, ${wedstrijd.cover}dd 50%, #2a0808 100%)`,
              padding: '3rem 2rem',
              color: '#F5F1E8',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.04) 20px, rgba(255,255,255,0.04) 22px)`,
              }}
            />
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.4em',
                  opacity: 0.8,
                  marginBottom: '0.8rem',
                  fontWeight: 700,
                }}
              >
                OFFICIEEL PROGRAMMA · {wedstrijd.thuis ? 'THUIS' : wedstrijd.thuis === false ? 'UIT' : ''}
              </div>
              <div
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                }}
              >
                AZ
              </div>
              <div style={{ fontSize: '0.75rem', margin: '0.8rem 0', letterSpacing: '0.3em', opacity: 0.7 }}>
                — versus —
              </div>
              <div
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  lineHeight: 1,
                }}
              >
                {wedstrijd.tegenstander}
              </div>
              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(245,241,232,0.3)',
                  fontSize: '0.85rem',
                  opacity: 0.85,
                  letterSpacing: '0.1em',
                }}
              >
                {formatDatum(wedstrijd.datum)}
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '2rem' }}>
          <div
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 900,
              fontStyle: 'italic',
              marginBottom: '0.3rem',
              color: '#1a0a0a',
            }}
          >
            {wedstrijd.thuis ? `AZ — ${wedstrijd.tegenstander}` : `${wedstrijd.tegenstander} — AZ`}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#5a3030', fontStyle: 'italic', marginBottom: '1.5rem' }}>
            {formatDatum(wedstrijd.datum)}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <DetailItem label="Seizoen" value={wedstrijd.seizoen} />
            <DetailItem label="Competitie" value={wedstrijd.competitie} />
            <DetailItem
              label="Stadion"
              value={wedstrijd.stad ? `${wedstrijd.stadion}, ${wedstrijd.stad}` : wedstrijd.stadion}
            />
            <DetailItem label="Eindstand" value={wedstrijd.uitslag} large />
          </div>

          {!heeftBestanden && (
            <div
              style={{
                padding: '1rem',
                background: 'rgba(139,0,0,0.06)',
                borderLeft: '3px solid #8B0000',
                fontSize: '0.9rem',
                color: '#5a3030',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              Voor deze wedstrijd is nog geen programmaboekje gescand in het archief.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function DetailItem({ label, value, large }) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#8B0000',
          marginBottom: '0.3rem',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: large ? '1.5rem' : '1rem',
          fontWeight: large ? 900 : 600,
          color: '#1a0a0a',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
}
