import React from 'react';
import { BookOpen, Clock, Bookmark } from 'lucide-react';
import type { VolumeId } from '../data/ldsScripturesData';
import { VOLUMES } from '../data/ldsScripturesData';

interface HeaderProps {
  activeVolumeFilter: VolumeId | 'all';
  onFilterChange: (filter: VolumeId | 'all') => void;
  isClockMode: boolean;
  onToggleClockMode: () => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeVolumeFilter,
  onFilterChange,
  isClockMode,
  onToggleClockMode,
  bookmarkCount,
  onOpenBookmarks,
}) => {
  return (
    <header style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(8, 10, 16, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(243, 202, 104, 0.2) 0%, rgba(196, 152, 38, 0.4) 100%)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            boxShadow: '0 4px 16px rgba(243, 202, 104, 0.2)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="gold-gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, lineHeight: 1.1 }}>
              TimeToPages
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              LDS Canon Scripture & Page Reference
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onToggleClockMode}
            className={isClockMode ? "gold-glow-button" : ""}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: isClockMode ? 'none' : '1px solid var(--border-subtle)',
              background: isClockMode ? undefined : 'rgba(255, 255, 255, 0.05)',
              color: isClockMode ? '#080A10' : 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Clock size={16} />
            <span>{isClockMode ? 'Exit Scripture Clock' : 'Scripture Wall Clock'}</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              position: 'relative'
            }}
          >
            <Bookmark size={16} color={bookmarkCount > 0 ? "var(--accent-gold)" : "currentColor"} />
            <span>Saved</span>
            {bookmarkCount > 0 && (
              <span style={{
                background: 'var(--accent-gold)',
                color: '#080A10',
                borderRadius: '9999px',
                padding: '0.1rem 0.4rem',
                fontSize: '0.7rem',
                fontWeight: 800,
                marginLeft: '0.2rem'
              }}>
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Volume Filter Bar */}
      {!isClockMode && (
        <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderTop: '1px solid var(--border-subtle)', padding: '0.5rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem' }}>
              Volume:
            </span>

            <button
              onClick={() => onFilterChange('all')}
              className={`badge ${activeVolumeFilter === 'all' ? 'badge-bom' : ''}`}
              style={{
                cursor: 'pointer',
                background: activeVolumeFilter === 'all' ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.06)',
                color: activeVolumeFilter === 'all' ? '#080A10' : 'var(--text-muted)',
                border: activeVolumeFilter === 'all' ? 'none' : '1px solid var(--border-subtle)',
                padding: '0.35rem 0.8rem',
                fontSize: '0.75rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              All Standard Works
            </button>

            {Object.values(VOLUMES).map((vol) => (
              <button
                key={vol.id}
                onClick={() => onFilterChange(vol.id)}
                className={`badge ${vol.colorBadgeClass}`}
                style={{
                  cursor: 'pointer',
                  opacity: activeVolumeFilter === 'all' || activeVolumeFilter === vol.id ? 1 : 0.4,
                  transform: activeVolumeFilter === vol.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'var(--transition-smooth)',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.75rem'
                }}
              >
                {vol.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
