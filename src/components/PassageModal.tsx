import React from 'react';
import { X, MapPin, ExternalLink, Bookmark, BookOpen } from 'lucide-react';
import type { PageReferenceMatch, ScriptureVerse } from '../data/ldsScripturesData';
import { VOLUMES } from '../data/ldsScripturesData';

interface PassageModalProps {
  item: ScriptureVerse | PageReferenceMatch | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (item: ScriptureVerse | PageReferenceMatch) => void;
}

export const PassageModal: React.FC<PassageModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!item) return null;

  const isVerse = 'chapter' in item && 'verse' in item;
  const verse = isVerse ? (item as ScriptureVerse) : null;
  const pageMatch = !isVerse ? (item as PageReferenceMatch) : null;

  const volId = item.volumeId;
  const volInfo = VOLUMES[volId];

  const title = verse
    ? `${verse.bookName} ${verse.chapter}:${verse.verse}`
    : `${pageMatch!.bookName} (${pageMatch!.chapterRange})`;

  const pageNum = verse ? verse.pageNumber : pageMatch!.pageNumber;
  const scriptureUrl = verse?.gospelLibraryUrl || pageMatch?.gospelLibraryUrl || 'https://www.churchofjesuschrist.org/study/scriptures';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 150,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Header Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className={`badge ${volInfo.colorBadgeClass}`}>
            {volInfo.name}
          </span>
          <span className="badge" style={{ background: 'rgba(243, 202, 104, 0.15)', color: 'var(--accent-gold)', border: '1px solid var(--border-gold)' }}>
            <MapPin size={12} /> LDS Standard Print Page {pageNum}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1rem' }}>
          <a
            href={scriptureUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            title="Open in Gospel Library"
          >
            <span>{title}</span>
            <ExternalLink size={18} style={{ opacity: 0.7 }} />
          </a>
        </h2>

        {/* Main Content */}
        {verse ? (
          <div style={{ marginBottom: '1.5rem' }}>
            {verse.isCurated && verse.text ? (
              <div style={{
                background: 'rgba(10, 14, 24, 0.6)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-gold)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#FFF',
                fontStyle: 'italic',
                marginBottom: '1rem'
              }}>
                "{verse.text}"
              </div>
            ) : (
              <div style={{
                background: 'rgba(10, 14, 24, 0.6)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-gold)',
                marginBottom: '1rem'
              }}>
                <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Passage reference: <strong>{verse.bookName} {verse.chapter}:{verse.verse}</strong> in the {volInfo.name}.
                </p>
                <a
                  href={scriptureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.1rem',
                    background: 'rgba(243, 202, 104, 0.15)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-gold)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none'
                  }}
                >
                  <BookOpen size={16} />
                  <span>Read {verse.bookName} {verse.chapter}:{verse.verse} on ChurchofJesusChrist.org</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {verse.context && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Chapter Context & Background
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                  {verse.context}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              This page corresponds to standard official LDS printing layouts (1979/2013 LDS Bible & 1981/2013 Book of Mormon / Triple Combination).
            </p>
            <div style={{ background: 'rgba(10, 14, 24, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.3rem' }}>
                Included Chapter Span:
              </div>
              <div style={{ fontSize: '1.1rem', color: '#FFF', fontFamily: 'var(--font-mono)' }}>
                {pageMatch!.chapterRange}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button
            onClick={() => onToggleBookmark(item)}
            className={isBookmarked ? "gold-glow-button" : ""}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: isBookmarked ? 'none' : '1px solid var(--border-subtle)',
              background: isBookmarked ? undefined : 'rgba(255, 255, 255, 0.08)',
              color: isBookmarked ? '#080A10' : 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Bookmark size={16} fill={isBookmarked ? '#080A10' : 'none'} />
            <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Reference'}</span>
          </button>

          <a
            href={scriptureUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-gold)',
              background: 'rgba(243, 202, 104, 0.1)',
              color: 'var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ExternalLink size={16} />
            <span>Open on Gospel Library Online</span>
          </a>
        </div>

      </div>
    </div>
  );
};
