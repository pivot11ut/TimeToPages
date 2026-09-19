import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TimeInput } from './components/TimeInput';
import { ScriptureCard } from './components/ScriptureCard';
import { LiveClockView } from './components/LiveClockView';
import { PassageModal } from './components/PassageModal';
import { Footer } from './components/Footer';
import { findScriptureMatches } from './utils/scriptureMatcher';
import type { PageReferenceMatch, ScriptureVerse, VolumeId } from './data/ldsScripturesData';
import { BookOpen, MapPin, Sparkles, Bookmark, X, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export function App() {
  const [timeInput, setTimeInput] = useState<string>('215'); // Default to 215 as requested by user!
  const [activeVolumeFilter, setActiveVolumeFilter] = useState<VolumeId | 'all'>('all');
  const [searchMode, setSearchMode] = useState<'all' | 'page' | 'verse'>('all');
  const [isClockMode, setIsClockMode] = useState<boolean>(false);
  const [showMoreVerses, setShowMoreVerses] = useState<boolean>(false);

  // Reader Modal state
  const [selectedItem, setSelectedItem] = useState<ScriptureVerse | PageReferenceMatch | null>(null);

  // Saved Bookmarks state stored in LocalStorage
  const [bookmarks, setBookmarks] = useState<(ScriptureVerse | PageReferenceMatch)[]>(() => {
    try {
      const saved = localStorage.getItem('timeToPages_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('timeToPages_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Reset showMoreVerses when time input changes
  useEffect(() => {
    setShowMoreVerses(false);
  }, [timeInput]);

  // Compute Scripture Matches dynamically based on time input and volume filter
  const matches = useMemo(() => {
    if (!timeInput.trim()) return null;
    return findScriptureMatches(timeInput, activeVolumeFilter);
  }, [timeInput, activeVolumeFilter]);

  // Separate D&C matches from other volume matches
  const dcVerses = useMemo(() => {
    if (!matches) return [];
    return matches.verseMatches.filter((v) => v.volumeId === 'dc');
  }, [matches]);

  const otherVerses = useMemo(() => {
    if (!matches) return [];
    return matches.verseMatches.filter((v) => v.volumeId !== 'dc');
  }, [matches]);

  // Handle "Use Current Time"
  const handleUseCurrentTime = () => {
    const now = new Date();
    const hrs = now.getHours() % 12 || 12;
    const mins = now.getMinutes().toString().padStart(2, '0');
    setTimeInput(`${hrs}${mins}`);
  };

  // Check if item is bookmarked
  const isBookmarked = (item: ScriptureVerse | PageReferenceMatch) => {
    const itemId = 'id' in item ? item.id : `page-${item.volumeId}-${item.pageNumber}`;
    return bookmarks.some((b) => ('id' in b ? b.id : `page-${b.volumeId}-${b.pageNumber}`) === itemId);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (item: ScriptureVerse | PageReferenceMatch) => {
    const itemId = 'id' in item ? item.id : `page-${item.volumeId}-${item.pageNumber}`;
    if (isBookmarked(item)) {
      setBookmarks((prev) => prev.filter((b) => ('id' in b ? b.id : `page-${b.volumeId}-${b.pageNumber}`) !== itemId));
    } else {
      setBookmarks((prev) => [item, ...prev]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <Header
        activeVolumeFilter={activeVolumeFilter}
        onFilterChange={setActiveVolumeFilter}
        isClockMode={isClockMode}
        onToggleClockMode={() => setIsClockMode(!isClockMode)}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setShowBookmarksDrawer(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Main Time Input Card */}
        <TimeInput
          value={timeInput}
          onChange={setTimeInput}
          onUseCurrentTime={handleUseCurrentTime}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
        />

        {/* Results Section */}
        {matches && (
          <div>
            {/* Header summary of results */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="var(--accent-gold)" size={20} />
                Scripture & Page Matches for <span className="gold-gradient-text">"{timeInput}"</span>
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Found {matches.totalMatches} reference{matches.totalMatches === 1 ? '' : 's'}
              </span>
            </div>

            {/* If no matches found */}
            {matches.totalMatches === 0 && (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#FFF' }}>
                  No matches found for "{timeInput}".
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  Try entering numbers like <strong>215</strong> (for Page 215 / 1 Ne 2:15), <strong>316</strong> (John 3:16), or <strong>1227</strong> (Ether 12:27).
                </p>
              </div>
            )}

            {/* LDS Print Edition Page Matches Grid */}
            {(searchMode === 'all' || searchMode === 'page') && matches.pageMatches.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MapPin size={18} color="var(--accent-gold)" />
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    LDS Print Edition Page Matches (Page {matches.pageMatches[0]?.pageNumber})
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {matches.pageMatches.map((pageMatch, idx) => (
                    <ScriptureCard
                      key={idx}
                      pageMatch={pageMatch}
                      isBookmarked={isBookmarked(pageMatch)}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenReader={setSelectedItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Verse Reference Matches Section */}
            {(searchMode === 'all' || searchMode === 'verse') && matches.verseMatches.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                {activeVolumeFilter === 'all' ? (
                  <div>
                    {/* D&C Verses Heading */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} color="var(--accent-gold)" />
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Doctrine & Covenants Matches
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {dcVerses.length} D&C reference{dcVerses.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* D&C Cards Grid */}
                    {dcVerses.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {dcVerses.map((verse) => (
                          <ScriptureCard
                            key={verse.id}
                            verse={verse}
                            isBookmarked={isBookmarked(verse)}
                            onToggleBookmark={handleToggleBookmark}
                            onOpenReader={setSelectedItem}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        No direct Doctrine & Covenants chapter/verse match for "{timeInput}".
                      </div>
                    )}

                    {/* Option to Show More (Other Standard Works) */}
                    {otherVerses.length > 0 && (
                      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                          onClick={() => setShowMoreVerses(!showMoreVerses)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1.75rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-gold)',
                            background: showMoreVerses ? 'rgba(243, 202, 104, 0.15)' : 'rgba(20, 26, 40, 0.85)',
                            color: 'var(--accent-gold)',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                          }}
                        >
                          {showMoreVerses ? (
                            <>
                              <ChevronUp size={18} />
                              <span>Show Fewer Matches (Doctrine & Covenants Only)</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown size={18} />
                              <span>Show More Matches ({otherVerses.length} more in Book of Mormon, Bible, & PGP)</span>
                            </>
                          )}
                        </button>

                        {/* Expanded Other Verses Grid */}
                        {showMoreVerses && (
                          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                              <Layers size={18} color="var(--accent-gold)" />
                              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Additional Scripture Matches (BOM, OT, NT, PGP)
                              </h4>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                              {otherVerses.map((verse) => (
                                <ScriptureCard
                                  key={verse.id}
                                  verse={verse}
                                  isBookmarked={isBookmarked(verse)}
                                  onToggleBookmark={handleToggleBookmark}
                                  onOpenReader={setSelectedItem}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* When user explicitly filters by a specific volume */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <BookOpen size={18} color="var(--accent-gold)" />
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Chapter & Verse Matches
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                      {matches.verseMatches.map((verse) => (
                        <ScriptureCard
                          key={verse.id}
                          verse={verse}
                          isBookmarked={isBookmarked(verse)}
                          onToggleBookmark={handleToggleBookmark}
                          onOpenReader={setSelectedItem}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Wall Clock Overlay Mode */}
      {isClockMode && (
        <LiveClockView onClose={() => setIsClockMode(false)} />
      )}

      {/* Reader Modal */}
      {selectedItem && (
        <PassageModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isBookmarked={isBookmarked(selectedItem)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Saved Bookmarks Drawer */}
      {showBookmarksDrawer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 140,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setShowBookmarksDrawer(false)}>
          <div style={{
            maxWidth: '450px',
            width: '100%',
            height: '100%',
            background: 'rgba(12, 16, 26, 0.98)',
            borderLeft: '1px solid var(--border-gold)',
            padding: '2rem',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bookmark size={20} /> Saved Scripture Verses
              </h3>
              <button onClick={() => setShowBookmarksDrawer(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>
                No bookmarks saved yet. Click the bookmark icon on any scripture card to save it here!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookmarks.map((b, idx) => (
                  <ScriptureCard
                    key={idx}
                    verse={'text' in b ? (b as ScriptureVerse) : undefined}
                    pageMatch={'chapterRange' in b ? (b as PageReferenceMatch) : undefined}
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenReader={setSelectedItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
