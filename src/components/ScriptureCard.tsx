import React, { useState } from 'react';
import { Book, Bookmark, BookOpen, Check, Copy, ExternalLink, Eye, MapPin } from 'lucide-react';
import type { PageReferenceMatch, ScriptureVerse } from '../data/ldsScripturesData';
import { VOLUMES } from '../data/ldsScripturesData';
import confetti from 'canvas-confetti';

interface ScriptureCardProps {
  verse?: ScriptureVerse;
  pageMatch?: PageReferenceMatch;
  isBookmarked: boolean;
  onToggleBookmark: (item: ScriptureVerse | PageReferenceMatch) => void;
  onOpenReader: (item: ScriptureVerse | PageReferenceMatch) => void;
}

export const ScriptureCard: React.FC<ScriptureCardProps> = ({
  verse,
  pageMatch,
  isBookmarked,
  onToggleBookmark,
  onOpenReader,
}) => {
  const [copied, setCopied] = useState(false);

  const volId = verse ? verse.volumeId : pageMatch!.volumeId;
  const volInfo = VOLUMES[volId];

  const title = verse
    ? `${verse.bookName} ${verse.chapter}:${verse.verse}`
    : `${pageMatch!.bookName} (${pageMatch!.chapterRange})`;

  const pageNum = verse ? verse.pageNumber : pageMatch!.pageNumber;

  const scriptureUrl = verse?.gospelLibraryUrl || pageMatch?.gospelLibraryUrl || 'https://www.churchofjesuschrist.org/study/scriptures';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = verse
      ? verse.text
        ? `"${verse.text}" — ${verse.bookName} ${verse.chapter}:${verse.verse} (${scriptureUrl})`
        : `${verse.bookName} ${verse.chapter}:${verse.verse} (LDS Print Page ${verse.pageNumber}) — ${scriptureUrl}`
      : `${pageMatch!.volumeName} Page ${pageMatch!.pageNumber} (${pageMatch!.chapterRange}) — ${scriptureUrl}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = verse || pageMatch!;
    if (!isBookmarked) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F3CA68', '#FFE29A', '#C49826']
      });
    }
    onToggleBookmark(target);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header: Badge & Type */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${volInfo.colorBadgeClass}`}>
              {volInfo.name}
            </span>

            {pageMatch && (
              <span className="badge" style={{ background: 'rgba(243, 202, 104, 0.15)', color: 'var(--accent-gold)', border: '1px solid var(--border-gold)' }}>
                <MapPin size={12} /> LDS Page {pageNum}
              </span>
            )}
            {verse && (
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                Verse Reference
              </span>
            )}
          </div>

          <button
            onClick={handleBookmark}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isBookmarked ? 'var(--accent-gold)' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              padding: '0.2rem'
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this scripture'}
          >
            <Bookmark size={20} fill={isBookmarked ? 'var(--accent-gold)' : 'none'} />
          </button>
        </div>

        {/* Title - Clickable Hyperlink directly to Church Gospel Library */}
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <a
            href={scriptureUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'var(--transition-smooth)'
            }}
            title={`Open ${title} on ChurchofJesusChrist.org`}
          >
            <Book size={18} color="var(--accent-gold)" />
            <span>{title}</span>
            <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </a>
        </h3>

        {/* Main Body Text */}
        {verse ? (
          verse.isCurated && verse.text ? (
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#E2E8F0', fontStyle: 'italic', marginBottom: '1rem' }}>
              "{verse.text}"
            </p>
          ) : (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                Reference to <strong>{verse.bookName} {verse.chapter}:{verse.verse}</strong> in the {volInfo.name}.
              </p>
              <a
                href={scriptureUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  background: 'rgba(243, 202, 104, 0.12)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <BookOpen size={16} />
                <span>Read {verse.bookName} {verse.chapter}:{verse.verse} on Gospel Library</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Standard 1981/2013 LDS Print Edition <strong>Page {pageMatch!.pageNumber}</strong> contains chapters:
            </p>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#FFF' }}>
              {pageMatch!.chapterRange}
            </div>
            {pageMatch!.sampleVerse && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Sample verse on this page: "{pageMatch!.sampleVerse.text}"
              </div>
            )}
          </div>
        )}

        {/* Context Note */}
        {verse?.context && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--accent-gold)', paddingLeft: '0.6rem', marginBottom: '1.25rem' }}>
            {verse.context}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={12} />
          <span>Page {pageNum}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onOpenReader(verse || pageMatch!)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Eye size={13} />
            <span>Read Context</span>
          </button>

          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(243, 202, 104, 0.1)',
              border: copied ? '1px solid #10B981' : '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              color: copied ? '#6EE7B7' : 'var(--accent-gold)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <a
            href={scriptureUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(243, 202, 104, 0.08)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'var(--transition-smooth)'
            }}
            title="Open on Church Gospel Library"
          >
            <ExternalLink size={13} />
            <span>Gospel Library</span>
          </a>
        </div>
      </div>
    </div>
  );
};
