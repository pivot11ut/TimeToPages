import React from 'react';
import { VOLUMES } from '../data/ldsScripturesData';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(5, 7, 12, 0.95)',
      padding: '3rem 1.5rem 2rem',
      marginTop: '4rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: About */}
          <div>
            <h4 className="gold-gradient-text" style={{ fontSize: '1.2rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              TimeToPages
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              TimeToPages converts any time or number (e.g. 215 or 2:15) into correlating LDS canon scripture references and print page numbers across all 5 standard works.
            </p>
          </div>

          {/* Column 2: Standard Works */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              The 5 LDS Standard Works
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {Object.values(VOLUMES).map((vol) => (
                <li key={vol.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className={`badge ${vol.colorBadgeClass}`} style={{ fontSize: '0.65rem' }}>{vol.shortName}</span>
                  <span>{vol.name} ({vol.totalPages} pp.)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Pagination Info */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Standard LDS Page Indexes
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              Page mappings use standard official 1979/2013 LDS KJV Bible editions (1590 pp.) and 1981/2013 Book of Mormon (531 pp.), Doctrine & Covenants (294 pp.), and Pearl of Great Price (60 pp.).
            </p>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem'
        }}>
          <div>
            TimeToPages • Created for scripture study and time correlation.
          </div>
          <div>
            Official scriptures can be accessed online at{' '}
            <a href="https://www.churchofjesuscrist.org/study/scriptures" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>
              ChurchofJesusChrist.org
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
