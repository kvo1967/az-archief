export default function Header({ totaal, seizoenen, tegenstanders }) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        borderBottom: '3px double #8B0000',
        background: '#F5F1E8',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
                color: '#8B0000',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}
            >
              — Sinds 1954 —
            </div>
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                margin: 0,
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                fontWeight: 900,
                fontStyle: 'italic',
              }}
            >
              Het Archief
            </h1>
            <div
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                marginTop: '0.5rem',
                color: '#5a3030',
                fontStyle: 'italic',
              }}
            >
              AZ Programmaboekjes · Een collectie
            </div>
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: '0.85rem',
              color: '#5a3030',
              borderLeft: '1px solid #8B0000',
              paddingLeft: '1rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#8B0000' }}>
              {totaal.toLocaleString('nl-NL')} wedstrijden
            </div>
            <div>{seizoenen} seizoenen</div>
            <div>{tegenstanders} tegenstanders</div>
          </div>
        </div>
      </div>
    </header>
  );
}
