import { useState, useMemo, useRef, useEffect } from 'react';
import { formatDatum } from '../utils/transform.js';

export default function TimelineView({ wedstrijden, onSelect }) {
  const grouped = useMemo(() => {
    const map = new Map();
    wedstrijden.forEach((b) => {
      if (!map.has(b.seizoen)) map.set(b.seizoen, []);
      map.get(b.seizoen).push(b);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([seizoen, items]) => ({
        seizoen,
        items: items.sort((a, b) => new Date(b.datum) - new Date(a.datum)),
      }));
  }, [wedstrijden]);

  const [activeSeizoen, setActiveSeizoen] = useState(null);
  const seizoenRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveSeizoen(visible[0].target.dataset.seizoen);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.5, 1] }
    );
    Object.values(seizoenRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [grouped]);

  const scrollTo = (seizoen) => {
    seizoenRefs.current[seizoen]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '1.5rem',
        position: 'relative',
      }}
    >
      <aside
        className="timeline-nav"
        style={{
          position: 'sticky',
          top: 90,
          alignSelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          paddingRight: '1rem',
          borderRight: '1px solid rgba(139,0,0,0.2)',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: '#8B0000',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
          }}
        >
          Seizoenen
        </div>
        {grouped.map(({ seizoen, items }) => (
          <button
            key={seizoen}
            onClick={() => scrollTo(seizoen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              color: activeSeizoen === seizoen ? '#8B0000' : '#5a3030',
              fontWeight: activeSeizoen === seizoen ? 700 : 400,
              borderLeft: `3px solid ${activeSeizoen === seizoen ? '#8B0000' : 'transparent'}`,
              marginLeft: '-1.05rem',
              paddingLeft: '0.75rem',
              transition: 'all 0.2s ease',
              fontVariantNumeric: 'tabular-nums',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              minWidth: 100,
            }}
          >
            <span>{seizoen.split('/')[0]}</span>
            <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{items.length}</span>
          </button>
        ))}
      </aside>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 11,
            top: 30,
            bottom: 30,
            width: 2,
            background:
              'linear-gradient(to bottom, #8B0000 0%, #8B0000 70%, rgba(139,0,0,0.2) 100%)',
          }}
        />
        {grouped.map(({ seizoen, items }, gi) => (
          <section
            key={seizoen}
            ref={(el) => (seizoenRefs.current[seizoen] = el)}
            data-seizoen={seizoen}
            style={{ marginBottom: gi === grouped.length - 1 ? 0 : '3rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#8B0000',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 4px #F5F1E8, 0 0 0 5px rgba(139,0,0,0.3)',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#F5F1E8',
                  }}
                />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}
                >
                  Seizoen {seizoen}
                </h2>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#5a3030',
                    fontStyle: 'italic',
                    marginTop: '0.2rem',
                  }}
                >
                  {items.length} {items.length === 1 ? 'wedstrijd' : 'wedstrijden'}
                  {' · '}
                  {[...new Set(items.map((i) => i.competitie))].join(', ')}
                </div>
              </div>
            </div>
            <div
              style={{
                paddingLeft: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {items.map((b, idx) => (
                <TimelineItem
                  key={b.id}
                  wedstrijd={b}
                  onClick={() => onSelect(b)}
                  index={idx}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function TimelineItem({ wedstrijd, onClick, index }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '70px 1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.9rem 1.2rem',
        background: hover ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(139,0,0,0.15)',
        borderLeft: `4px solid ${wedstrijd.cover}`,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: hover ? '0 4px 12px rgba(139,0,0,0.12)' : 'none',
        animation: `slideIn 0.4s ease ${Math.min(index * 0.02, 0.3)}s both`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -47,
          top: '50%',
          width: 35,
          height: 1,
          background: 'rgba(139,0,0,0.3)',
          transform: 'translateY(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -53,
          top: '50%',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: hover ? '#8B0000' : '#F5F1E8',
          border: '2px solid #8B0000',
          transform: 'translateY(-50%)',
          transition: 'background 0.2s ease',
          zIndex: 1,
        }}
      />
      <div
        style={{
          width: 60,
          height: 78,
          background: `linear-gradient(135deg, ${wedstrijd.cover} 0%, ${wedstrijd.cover}dd 50%, #2a0808 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5F1E8',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      >
        {wedstrijd.bestanden?.length > 0 ? (
          <img
            src={wedstrijd.bestanden[0]}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, fontStyle: 'italic' }}>AZ</div>
            <div
              style={{
                fontSize: '0.5rem',
                fontWeight: 700,
                textAlign: 'center',
                padding: '0 4px',
                lineHeight: 1.1,
                marginTop: '0.15rem',
              }}
            >
              {wedstrijd.tegenstander.length > 10
                ? wedstrijd.tegenstander.slice(0, 9) + '…'
                : wedstrijd.tegenstander}
            </div>
          </>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.7rem',
            color: '#8B0000',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
          }}
        >
          {formatDatum(wedstrijd.datum)}
          {wedstrijd.thuis === false && <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>· UIT</span>}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.05rem',
            marginBottom: '0.2rem',
            fontStyle: 'italic',
          }}
        >
          {wedstrijd.thuis ? `AZ — ${wedstrijd.tegenstander}` : `${wedstrijd.tegenstander} — AZ`}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5a3030', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span>{wedstrijd.competitie}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ fontStyle: 'italic' }}>
            {wedstrijd.stadion}
            {wedstrijd.stad && `, ${wedstrijd.stad}`}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: '#8B0000',
            fontWeight: 700,
            opacity: 0.6,
            marginBottom: '0.15rem',
          }}
        >
          UITSLAG
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#1a0a0a',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {wedstrijd.uitslag}
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </button>
  );
}
