import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Maximize2 } from 'lucide-react';
import { formatDatum } from '../utils/transform.js';

// Fix voor Leaflet's standaard marker icons (worden niet correct geladen via Vite bundler).
// We gebruiken div-icons dus dit is technisch niet nodig, maar voor de zekerheid:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper component die toegang krijgt tot de map om bounds te fitten
function MapBoundsUpdater({ stadions }) {
  const map = useMap();

  // Forceer recalc na mount — voorkomt witte vlak issue
  useEffect(() => {
    const timers = [
      setTimeout(() => map.invalidateSize(), 0),
      setTimeout(() => map.invalidateSize(), 100),
      setTimeout(() => map.invalidateSize(), 500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [map]);

  useEffect(() => {
    if (stadions.length === 0) return;
    const bounds = L.latLngBounds(stadions.map((s) => [s.lat, s.lon]));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
  }, [stadions, map]);

  return null;
}

function MapFlyController({ flyTarget }) {
  const map = useMap();
  useEffect(() => {
    if (flyTarget) map.flyTo([flyTarget.lat, flyTarget.lon], 12, { duration: 1.2 });
  }, [flyTarget, map]);
  return null;
}

const createStadionIcon = (count, isThuis) => {
  const size = Math.min(20 + Math.log2(count + 1) * 8, 56);
  return L.divIcon({
    className: 'az-stadion-marker',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${isThuis ? '#8B0000' : '#1a0a0a'};
        border: 3px solid #F5F1E8;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #F5F1E8;
        font-family: Georgia, serif;
        font-weight: 900; font-style: italic;
        font-size: ${Math.max(size * 0.32, 11)}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">${count}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function MapView({ wedstrijden, onSelect }) {
  const [flyTarget, setFlyTarget] = useState(null);

  // Filter alleen wedstrijden waarvan we de locatie kennen
  const metLocatie = wedstrijden.filter((w) => w.lat != null && w.lon != null);
  const zonderLocatie = wedstrijden.length - metLocatie.length;

  const stadions = useMemo(() => {
    const map = new Map();
    metLocatie.forEach((b) => {
      if (!map.has(b.stadion)) {
        map.set(b.stadion, {
          stadion: b.stadion,
          stad: b.stad,
          land: b.land,
          lat: b.lat,
          lon: b.lon,
          thuis: b.thuis,
          items: [],
        });
      }
      map.get(b.stadion).items.push(b);
    });
    return Array.from(map.values()).sort((a, b) => b.items.length - a.items.length);
  }, [metLocatie]);

  return (
    <div
      className="map-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <div
        style={{
          position: 'relative',
          border: '1px solid rgba(139,0,0,0.3)',
          boxShadow: '0 4px 16px rgba(139,0,0,0.1)',
          background: '#E8DFC8',
          height: 'min(70vh, 640px)',
          minHeight: 480,
        }}
      >
        <MapContainer
          center={[52.0, 5.0]}
          zoom={5}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          {stadions.map((s) => (
            <Marker
              key={s.stadion}
              position={[s.lat, s.lon]}
              icon={createStadionIcon(s.items.length, s.thuis)}
              eventHandlers={{
                click: () => {
                  if (s.items.length === 1) onSelect(s.items[0]);
                },
              }}
            >
              <Popup className="az-popup">
                <StadionPopup stadion={s} onSelect={onSelect} />
              </Popup>
            </Marker>
          ))}
          <MapBoundsUpdater stadions={stadions} />
          <MapFlyController flyTarget={flyTarget} />
        </MapContainer>

        <Legenda />

        {zonderLocatie > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 5,
              background: 'rgba(245, 241, 232, 0.95)',
              padding: '0.5rem 0.8rem',
              border: '1px solid rgba(139, 0, 0, 0.3)',
              fontSize: '0.75rem',
              color: '#5a3030',
              fontStyle: 'italic',
            }}
          >
            {zonderLocatie} zonder locatie
          </div>
        )}
      </div>

      <aside
        style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(139,0,0,0.2)',
          padding: '1.2rem',
          maxHeight: 'min(70vh, 640px)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: '#8B0000',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.3rem',
          }}
        >
          Stadions
        </div>
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            fontStyle: 'italic',
            marginBottom: '1rem',
            color: '#1a0a0a',
          }}
        >
          {stadions.length} {stadions.length === 1 ? 'locatie' : 'locaties'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stadions.map((s) => (
            <StadionItem
              key={s.stadion}
              stadion={s}
              onClick={() => setFlyTarget({ ...s, ts: Date.now() })}
              onSelectWedstrijd={onSelect}
            />
          ))}
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .map-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Legenda() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 500,
        background: 'rgba(245, 241, 232, 0.95)',
        backdropFilter: 'blur(6px)',
        padding: '0.7rem 0.9rem',
        border: '1px solid rgba(139, 0, 0, 0.3)',
        fontSize: '0.75rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: '#8B0000',
          fontWeight: 700,
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
        }}
      >
        Legenda
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#8B0000',
            border: '2px solid #F5F1E8',
          }}
        />
        <span style={{ color: '#1a0a0a' }}>Thuis</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#1a0a0a',
            border: '2px solid #F5F1E8',
          }}
        />
        <span style={{ color: '#1a0a0a' }}>Uit</span>
      </div>
      <div
        style={{
          borderTop: '1px dashed rgba(139,0,0,0.3)',
          marginTop: '0.4rem',
          paddingTop: '0.3rem',
          fontSize: '0.7rem',
          color: '#5a3030',
          fontStyle: 'italic',
        }}
      >
        Cijfer = aantal wedstrijden
      </div>
    </div>
  );
}

function StadionPopup({ stadion, onSelect }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', minWidth: 240 }}>
      <div
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: '#8B0000',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}
      >
        {stadion.thuis ? '— Thuis —' : '— Uit —'}
      </div>
      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 900,
          fontStyle: 'italic',
          color: '#1a0a0a',
          lineHeight: 1.1,
        }}
      >
        {stadion.stadion}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#5a3030', fontStyle: 'italic', marginTop: '0.2rem' }}>
        {stadion.stad}, {stadion.land}
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(139,0,0,0.2)',
          marginTop: '0.6rem',
          paddingTop: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {stadion.items.slice(0, 8).map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              padding: '0.2rem 0',
              fontSize: '0.78rem',
              color: '#1a0a0a',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              borderBottom: '1px dotted rgba(139,0,0,0.15)',
            }}
          >
            <span style={{ fontStyle: 'italic' }}>vs {b.tegenstander}</span>
            <span style={{ color: '#8B0000', fontSize: '0.7rem' }}>
              {b.seizoen.split('/')[0]}
            </span>
          </button>
        ))}
        {stadion.items.length > 8 && (
          <div
            style={{
              fontSize: '0.7rem',
              color: '#5a3030',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '0.2rem',
            }}
          >
            + {stadion.items.length - 8} meer
          </div>
        )}
      </div>
    </div>
  );
}

function StadionItem({ stadion, onClick, onSelectWedstrijd }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: '#FAF7EE',
        border: '1px solid rgba(139,0,0,0.2)',
        borderLeft: `4px solid ${stadion.thuis ? '#8B0000' : '#1a0a0a'}`,
        transition: 'all 0.2s ease',
      }}
    >
      <button
        onClick={() => {
          setExpanded(!expanded);
          onClick();
        }}
        style={{
          width: '100%',
          padding: '0.7rem 0.9rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <MapPin size={14} style={{ color: stadion.thuis ? '#8B0000' : '#1a0a0a', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1a0a0a',
              fontStyle: 'italic',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {stadion.stadion}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#5a3030', marginTop: '0.1rem' }}>
            {stadion.stad}, {stadion.land}
          </div>
        </div>
        <div
          style={{
            background: stadion.thuis ? '#8B0000' : '#1a0a0a',
            color: '#F5F1E8',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            minWidth: 24,
            textAlign: 'center',
          }}
        >
          {stadion.items.length}
        </div>
      </button>

      {expanded && (
        <div
          style={{
            padding: '0 0.9rem 0.7rem',
            borderTop: '1px dashed rgba(139,0,0,0.2)',
            paddingTop: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            maxHeight: 250,
            overflowY: 'auto',
          }}
        >
          {stadion.items.map((b) => (
            <button
              key={b.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWedstrijd(b);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                padding: '0.3rem 0',
                borderBottom: '1px dotted rgba(139,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: '#1a0a0a',
              }}
            >
              <span style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                vs {b.tegenstander}
              </span>
              <span
                style={{
                  color: '#8B0000',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatDatum(b.datum).split(' ').slice(-1)[0]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
