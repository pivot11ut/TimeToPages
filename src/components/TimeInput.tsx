import React from 'react';
import { Clock, Sparkles, X, Zap } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (val: string) => void;
  onUseCurrentTime: () => void;
  searchMode: 'all' | 'page' | 'verse';
  onSearchModeChange: (mode: 'all' | 'page' | 'verse') => void;
}

const PRESETS = [
  { label: '2:15 / 215', val: '215', desc: '1 Ne 2:15 & BOM Page 215' },
  { label: '3:16 / 316', val: '316', desc: 'John 3:16 & 2 Ne 31:16' },
  { label: '10:42 / 1042', val: '1042', desc: 'Alma 10:42 & Isa 42:10' },
  { label: '12:27 / 1227', val: '1227', desc: 'Ether 12:27' },
  { label: '7:14 / 714', val: '714', desc: 'Isaiah 7:14 (Immanuel)' },
  { label: '18:29 / 6:29', val: '1829', desc: '3 Ne 18:29 & D&C 18:10' },
  { label: '1:39 / 139', val: '139', desc: 'Moses 1:39 (Work & Glory)' },
];

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  onUseCurrentTime,
  searchMode,
  onSearchModeChange,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      
      {/* Title & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
          Enter a Time or Page Number
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
          Type any time like <strong style={{ color: '#FFF' }}>215</strong> or <strong style={{ color: '#FFF' }}>2:15</strong> to discover matching LDS print edition page numbers and correlate Book, Chapter, and Verse references across all 5 standard works.
        </p>
      </div>

      {/* Main Input Box */}
      <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto 1.5rem' }}>
        <div style={{
          position: 'absolute',
          left: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Clock size={24} />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 215, 2:15, 1042, 1227..."
          style={{
            width: '100%',
            padding: '1.1rem 3.5rem 1.1rem 3.5rem',
            fontSize: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#FFFFFF',
            background: 'rgba(10, 14, 24, 0.9)',
            border: '2px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            boxShadow: '0 0 25px rgba(243, 202, 104, 0.15)',
            letterSpacing: '0.05em'
          }}
        />

        {value ? (
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={22} />
          </button>
        ) : (
          <button
            onClick={onUseCurrentTime}
            title="Use current local time"
            style={{
              position: 'absolute',
              right: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(243, 202, 104, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Zap size={14} />
            <span>NOW</span>
          </button>
        )}
      </div>

      {/* Mode Switches */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => onSearchModeChange('all')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
            background: searchMode === 'all' ? 'rgba(243, 202, 104, 0.2)' : 'transparent',
            color: searchMode === 'all' ? 'var(--accent-gold)' : 'var(--text-muted)'
          }}
        >
          All Matches
        </button>
        <button
          onClick={() => onSearchModeChange('page')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
            background: searchMode === 'page' ? 'rgba(243, 202, 104, 0.2)' : 'transparent',
            color: searchMode === 'page' ? 'var(--accent-gold)' : 'var(--text-muted)'
          }}
        >
          LDS Print Pages Only
        </button>
        <button
          onClick={() => onSearchModeChange('verse')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)',
            background: searchMode === 'verse' ? 'rgba(243, 202, 104, 0.2)' : 'transparent',
            color: searchMode === 'verse' ? 'var(--accent-gold)' : 'var(--text-muted)'
          }}
        >
          Chapters & Verses Only
        </button>
      </div>

      {/* Quick Preset Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', width: '100%', justifyContent: 'center', marginBottom: '0.2rem' }}>
          <Sparkles size={12} color="var(--accent-gold)" /> Try popular scripture time examples:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.val}
            onClick={() => onChange(preset.val)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.color = 'var(--accent-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <strong>{preset.label}</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
              ({preset.desc})
            </span>
          </button>
        ))}
      </div>

    </div>
  );
};
