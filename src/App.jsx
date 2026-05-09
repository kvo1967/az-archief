import { useState, useMemo } from 'react';
import {
  Search, Calendar, Trophy, Users, Filter,
  Grid3x3, Rows3, GitCommitVertical, MapPin,
} from 'lucide-react';

import rawData from './data/wedstrijden.json';
import { transformDataset, normaliseerCompetitie } from './utils/transform.js';

import Header from './components/Header.jsx';
import FilterSelect from './components/FilterSelect.jsx';
import MapView from './components/MapView.jsx';
import TimelineView from './components/TimelineView.jsx';
import GridView from './components/GridView.jsx';
import ListView from './components/ListView.jsx';
import EmptyState from './components/EmptyState.jsx';
import BookjeModal from './components/BookjeModal.jsx';

// Eénmalige transformatie van ruwe JSON
const ALLE_WEDSTRIJDEN = transformDataset(rawData).map((w) => ({
  ...w,
  competitie: normaliseerCompetitie(w.competitie),
}));

export default function App() {
  const [search, setSearch] = useState('');
  const [seizoen, setSeizoen] = useState('alle');
  const [tegenstander, setTegenstander] = useState('alle');
  const [competitie, setCompetitie] = useState('alle');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const seizoenen = useMemo(
    () => ['alle', ...new Set(ALLE_WEDSTRIJDEN.map((p) => p.seizoen))].sort().reverse(),
    []
  );
  const tegenstanders = useMemo(
    () => ['alle', ...new Set(ALLE_WEDSTRIJDEN.map((p) => p.tegenstander))].sort(),
    []
  );
  const competities = useMemo(
    () => ['alle', ...new Set(ALLE_WEDSTRIJDEN.map((p) => p.competitie))].sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALLE_WEDSTRIJDEN
      .filter((p) => {
        if (seizoen !== 'alle' && p.seizoen !== seizoen) return false;
        if (tegenstander !== 'alle' && p.tegenstander !== tegenstander) return false;
        if (competitie !== 'alle' && p.competitie !== competitie) return false;
        if (q) {
          const haystack = [
            p.tegenstander, p.seizoen, p.competitie,
            p.stad ?? '', p.stadion, p.wedstrijd,
          ].join(' ').toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  }, [search, seizoen, tegenstander, competitie]);

  const activeFilterCount =
    [seizoen, tegenstander, competitie].filter((f) => f !== 'alle').length +
    (search ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setSeizoen('alle');
    setTegenstander('alle');
    setCompetitie('alle');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F1E8',
        fontFamily: 'Georgia, "Times New Roman", serif',
        color: '#1a0a0a',
      }}
    >
      <div
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139,0,0,0.04) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(139,0,0,0.03) 0%, transparent 50%)`,
        }}
      />

      <Header
        totaal={ALLE_WEDSTRIJDEN.length}
        seizoenen={seizoenen.length - 1}
        tegenstanders={tegenstanders.length - 1}
      />

      {/* Filterbar */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(245, 241, 232, 0.97)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(139, 0, 0, 0.2)',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative', minWidth: 200 }}>
              <Search
                size={16}
                style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: '#8B0000',
                }}
              />
              <input
                type="text"
                placeholder="Zoek op tegenstander, stad, seizoen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.3rem',
                  border: '1px solid #8B0000', background: '#FAF7EE',
                  fontSize: '0.95rem', fontFamily: 'inherit', color: '#1a0a0a',
                  outline: 'none', borderRadius: 0,
                }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.7rem 1rem', border: '1px solid #8B0000',
                background: showFilters ? '#8B0000' : 'transparent',
                color: showFilters ? '#F5F1E8' : '#8B0000',
                fontFamily: 'inherit', fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600,
              }}
            >
              <Filter size={14} /> Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    background: showFilters ? '#F5F1E8' : '#8B0000',
                    color: showFilters ? '#8B0000' : '#F5F1E8',
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div style={{ display: 'flex', border: '1px solid #8B0000' }}>
              <ViewBtn active={view === 'map'} onClick={() => setView('map')} label="Kaart">
                <MapPin size={16} />
              </ViewBtn>
              <ViewBtn active={view === 'timeline'} onClick={() => setView('timeline')} label="Tijdlijn" border>
                <GitCommitVertical size={16} />
              </ViewBtn>
              <ViewBtn active={view === 'grid'} onClick={() => setView('grid')} label="Grid" border>
                <Grid3x3 size={16} />
              </ViewBtn>
              <ViewBtn active={view === 'list'} onClick={() => setView('list')} label="Lijst" border>
                <Rows3 size={16} />
              </ViewBtn>
            </div>
          </div>

          {showFilters && (
            <div
              style={{
                marginTop: '1rem', paddingTop: '1rem',
                borderTop: '1px dashed rgba(139, 0, 0, 0.3)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <FilterSelect
                label="Seizoen" icon={<Calendar size={14} />}
                value={seizoen} onChange={setSeizoen} options={seizoenen}
              />
              <FilterSelect
                label="Tegenstander" icon={<Users size={14} />}
                value={tegenstander} onChange={setTegenstander} options={tegenstanders}
              />
              <FilterSelect
                label="Competitie" icon={<Trophy size={14} />}
                value={competitie} onChange={setCompetitie} options={competities}
              />
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '0.6rem', background: 'transparent',
                    border: '1px dashed #8B0000', color: '#8B0000',
                    fontFamily: 'inherit', cursor: 'pointer',
                    fontSize: '0.85rem', alignSelf: 'end',
                  }}
                >
                  ✕ Wis alle filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resultaat-teller */}
      <div
        style={{
          maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1.5rem 0.5rem',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#5a3030', fontStyle: 'italic' }}>
          {filtered.length === 0
            ? 'Geen wedstrijden gevonden'
            : filtered.length === 1
            ? '1 wedstrijd gevonden'
            : `${filtered.length.toLocaleString('nl-NL')} wedstrijden gevonden`}
        </div>
      </div>

      {/* Hoofdcontent */}
      <main
        style={{
          maxWidth: 1400, margin: '0 auto', padding: '1.5rem',
          position: 'relative', zIndex: 1,
        }}
      >
        {filtered.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : view === 'map' ? (
          <MapView wedstrijden={filtered} onSelect={setSelected} />
        ) : view === 'timeline' ? (
          <TimelineView wedstrijden={filtered} onSelect={setSelected} />
        ) : view === 'grid' ? (
          <GridView wedstrijden={filtered} onSelect={setSelected} />
        ) : (
          <ListView wedstrijden={filtered} onSelect={setSelected} />
        )}
      </main>

      <footer
        style={{
          marginTop: '4rem', padding: '2rem 1.5rem',
          borderTop: '3px double #8B0000',
          textAlign: 'center', color: '#5a3030',
          fontSize: '0.85rem', fontStyle: 'italic',
        }}
      >
        Een collectie samengesteld door supporters · Voor het rood-witte geheugen
      </footer>

      {selected && <BookjeModal wedstrijd={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ViewBtn({ active, onClick, label, border, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        padding: '0.7rem 0.8rem', border: 'none',
        background: active ? '#8B0000' : 'transparent',
        color: active ? '#F5F1E8' : '#8B0000',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        borderLeft: border ? '1px solid #8B0000' : 'none',
      }}
    >
      {children}
    </button>
  );
}
