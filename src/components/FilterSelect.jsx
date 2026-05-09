import { ChevronDown } from 'lucide-react';

export default function FilterSelect({ label, icon, value, onChange, options }) {
  return (
    <div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#8B0000',
          marginBottom: '0.4rem',
          fontWeight: 700,
        }}
      >
        {icon} {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 2rem 0.6rem 0.8rem',
            border: '1px solid #8B0000',
            background: '#FAF7EE',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            color: '#1a0a0a',
            outline: 'none',
            borderRadius: 0,
            appearance: 'none',
            cursor: 'pointer',
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o === 'alle' ? `Alle ${label.toLowerCase()}` : o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8B0000',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
