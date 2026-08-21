import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { findScriptureMatches } from '../utils/scriptureMatcher';
import type { MatchResults } from '../utils/scriptureMatcher';
import { VOLUMES } from '../data/ldsScripturesData';

interface LiveClockViewProps {
  onClose: () => void;
}

export const LiveClockView: React.FC<LiveClockViewProps> = ({ onClose }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [matches, setMatches] = useState<MatchResults | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hours = use24Hour ? time.getHours() : time.getHours() % 12 || 12;
    const mins = time.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}${mins}`; // e.g. 215 or 629 or 1829

    const res = findScriptureMatches(timeStr, 'all');
    setMatches(res);
  }, [time, use24Hour]);

  const formattedHours = use24Hour ? time.getHours().toString().padStart(2, '0') : (time.getHours() % 12 || 12).toString();
  const formattedMins = time.getMinutes().toString().padStart(2, '0');
  const formattedSecs = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'radial-gradient(circle at 50% 30%, #0F1626 0%, #06080F 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: '#FFF',
      padding: '2rem',
      overflowY: 'auto'
    }}>
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button
          onClick={onClose}
          className="gold-glow-button"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Exit Wall Clock
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setUse24Hour(!use24Hour)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Format: {use24Hour ? '24-Hour (18:29)' : '12-Hour (6:29)'}
          </button>
        </div>
      </div>

      {/* Main Ambient Digital Clock Display */}
      <div style={{ textAlign: 'center', margin: '1rem 0 3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
          fontWeight: 800,
          letterSpacing: '0.05em',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F3CA68 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(243, 202, 104, 0.3)',
          lineHeight: 1
        }}>
          <span>{formattedHours}:{formattedMins}</span>
          <span style={{ fontSize: '0.4em', color: 'var(--text-muted)', marginLeft: '0.3em', WebkitTextFillColor: 'initial' }}>
            :{formattedSecs} {!use24Hour && ampm}
          </span>
        </div>

        <p style={{ color: 'var(--accent-gold)', fontSize: '1rem', marginTop: '0.5rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em' }}>
          Live Scripture Clock Correlation
        </p>
      </div>

      {/* Scripture Matches Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> Scriptures Correlating to {formattedHours}:{formattedMins}
        </h3>

        {matches && matches.totalMatches > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {matches.verseMatches.map((v) => (
              <div key={v.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge ${VOLUMES[v.volumeId].colorBadgeClass}`}>
                    {VOLUMES[v.volumeId].name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    LDS Page {v.pageNumber}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                  {v.bookName} {v.chapter}:{v.verse}
                </h4>

                <p style={{ fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', color: '#F1F5F9', marginBottom: '1rem' }}>
                  "{v.text}"
                </p>

                {v.context && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-gold)', paddingLeft: '0.5rem' }}>
                    {v.context}
                  </p>
                )}
              </div>
            ))}

            {matches.pageMatches.map((p, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge ${VOLUMES[p.volumeId].colorBadgeClass}`}>
                    {VOLUMES[p.volumeId].name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    LDS PRINT PAGE {p.pageNumber}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#FFF', marginBottom: '0.5rem' }}>
                  {p.bookName} ({p.chapterRange})
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Correlates to Page {p.pageNumber} in standard LDS print editions.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No exact preset verses for this minute. Updating automatically...
          </div>
        )}
      </div>
    </div>
  );
};
