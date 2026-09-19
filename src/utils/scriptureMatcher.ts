import {
  BOOK_PAGE_MAP,
  CURATED_VERSES,
  VOLUMES,
  buildGospelLibraryUrl
} from '../data/ldsScripturesData';
import type {
  PageReferenceMatch,
  ScriptureVerse,
  VolumeId
} from '../data/ldsScripturesData';

export interface ParsedTimeInput {
  raw: string;
  cleanDigits: string;
  pageCandidates: number[];
  chapterVerseCandidates: { chapter: number; verse: number }[];
}

export interface MatchResults {
  inputTime: string;
  pageMatches: PageReferenceMatch[];
  verseMatches: ScriptureVerse[];
  totalMatches: number;
}

/**
 * Parses user input string (e.g. "215", "2:15", "02:15", "10:42", "6:29", "1829")
 * into numbers for page matching and chapter:verse candidates.
 */
export function parseTimeInput(input: string): ParsedTimeInput {
  const clean = input.replace(/[^\d:]/g, '').trim();
  const digitsOnly = clean.replace(/:/g, '');

  const pageCandidates: number[] = [];
  const chapterVerseCandidates: { chapter: number; verse: number }[] = [];

  if (!digitsOnly) {
    return { raw: input, cleanDigits: '', pageCandidates: [], chapterVerseCandidates: [] };
  }

  const numVal = parseInt(digitsOnly, 10);
  if (!isNaN(numVal) && numVal > 0) {
    pageCandidates.push(numVal);
  }

  // Handle explicit H:MM or M:SS colon format
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      chapterVerseCandidates.push({ chapter: parts[0], verse: parts[1] });
    }
  } else {
    // Digits without colon (e.g., 215 -> 2:15 and 21:5, 1042 -> 10:42)
    if (digitsOnly.length === 3) {
      // 215 -> 2:15
      const c1 = parseInt(digitsOnly.substring(0, 1), 10);
      const v1 = parseInt(digitsOnly.substring(1), 10);
      if (c1 > 0 && v1 >= 0) chapterVerseCandidates.push({ chapter: c1, verse: v1 });

      // 215 -> 21:5
      const c2 = parseInt(digitsOnly.substring(0, 2), 10);
      const v2 = parseInt(digitsOnly.substring(2), 10);
      if (c2 > 0 && v2 >= 0 && c2 !== c1) chapterVerseCandidates.push({ chapter: c2, verse: v2 });
    } else if (digitsOnly.length === 4) {
      // 1042 -> 10:42
      const c = parseInt(digitsOnly.substring(0, 2), 10);
      const v = parseInt(digitsOnly.substring(2), 10);
      if (c > 0 && v >= 0) chapterVerseCandidates.push({ chapter: c, verse: v });

      // 1042 -> 1:04 or 1:42
      const c2 = parseInt(digitsOnly.substring(0, 1), 10);
      const v2 = parseInt(digitsOnly.substring(1), 10);
      if (c2 > 0 && v2 >= 0) chapterVerseCandidates.push({ chapter: c2, verse: v2 });
    } else if (digitsOnly.length <= 2) {
      const val = parseInt(digitsOnly, 10);
      if (val > 0) {
        chapterVerseCandidates.push({ chapter: val, verse: val });
      }
    }
  }

  return {
    raw: input,
    cleanDigits: digitsOnly,
    pageCandidates,
    chapterVerseCandidates
  };
}

/**
 * Custom override mapping for known famous LDS print pages
 */
const EXACT_PAGE_CHAPTER_OVERRIDES: Record<string, string> = {
  'bom-215': 'Alma 14–15',
  'ot-215': 'Numbers 33–35',
  'dc-215': 'Section 107',
  'pgp-215': 'Pearl of Great Price (Section Range)',
};

/**
 * Finds matching LDS page numbers and scripture verses for given input.
 */
export function findScriptureMatches(input: string, selectedVolumeFilter: VolumeId | 'all' = 'all'): MatchResults {
  const parsed = parseTimeInput(input);
  const pageMatches: PageReferenceMatch[] = [];
  const verseMatches: ScriptureVerse[] = [];

  const targetPage = parsed.pageCandidates[0];

  if (targetPage) {
    // Search BOOK_PAGE_MAP for matching pages across volumes
    for (const book of BOOK_PAGE_MAP) {
      if (selectedVolumeFilter !== 'all' && book.volumeId !== selectedVolumeFilter) {
        continue;
      }

      if (targetPage >= book.startPage && targetPage <= book.endPage) {
        const overrideKey = `${book.volumeId}-${targetPage}`;
        let chapterRange = EXACT_PAGE_CHAPTER_OVERRIDES[overrideKey];

        const pageSpan = Math.max(1, book.endPage - book.startPage + 1);
        const pageOffset = targetPage - book.startPage;
        const estChapterStart = Math.max(1, Math.floor((pageOffset / pageSpan) * book.chapters) + 1);
        const estChapterEnd = Math.min(book.chapters, estChapterStart + 1);

        if (!chapterRange) {
          chapterRange =
            estChapterStart === estChapterEnd
              ? `${book.name} ${estChapterStart}`
              : `${book.name} ${estChapterStart}–${estChapterEnd}`;
        }

        // Find curated sample verse matching BOTH volumeId AND pageNumber!
        const sample = CURATED_VERSES.find(
          (v) => v.volumeId === book.volumeId && (v.pageNumber === targetPage || (v.bookName === book.name && Math.abs(v.pageNumber - targetPage) <= 2))
        );

        // Derive chapter number for Gospel Library link
        const chMatch = chapterRange.match(/\b(\d+)\b/);
        const startCh = chMatch ? parseInt(chMatch[1], 10) : estChapterStart;
        const pageGospelLibraryUrl = buildGospelLibraryUrl(book.volumeId, book.slug, startCh);

        pageMatches.push({
          volumeId: book.volumeId,
          volumeName: VOLUMES[book.volumeId].name,
          pageNumber: targetPage,
          bookName: book.name,
          chapterRange,
          sampleVerse: sample,
          note: `LDS Standard Print Edition, Page ${targetPage}`,
          gospelLibraryUrl: pageGospelLibraryUrl
        });
      }
    }
  }

  // Match Chapter & Verses from curated verses + generated references
  for (const cv of parsed.chapterVerseCandidates) {
    // 1. Check curated verses first (these have real scripture text)
    for (const verse of CURATED_VERSES) {
      if (selectedVolumeFilter !== 'all' && verse.volumeId !== selectedVolumeFilter) {
        continue;
      }
      if (verse.chapter === cv.chapter && verse.verse === cv.verse) {
        if (!verseMatches.some((v) => v.id === verse.id)) {
          verseMatches.push({
            ...verse,
            isCurated: true
          });
        }
      }
    }

    // 2. Generate matches for standard LDS books that contain this chapter:verse
    for (const book of BOOK_PAGE_MAP) {
      if (selectedVolumeFilter !== 'all' && book.volumeId !== selectedVolumeFilter) {
        continue;
      }
      if (book.chapters >= cv.chapter) {
        const id = `${book.volumeId}-${book.name.toLowerCase().replace(/\s+/g, '-')}-${cv.chapter}-${cv.verse}`;
        // If not already in curated verses
        if (!verseMatches.some((v) => v.id === id || (v.bookName === book.name && v.chapter === cv.chapter && v.verse === cv.verse))) {
          // Estimate page number for this chapter
          const pageSpan = Math.max(1, book.endPage - book.startPage + 1);
          const estPage = Math.min(
            book.endPage,
            Math.max(book.startPage, Math.round(book.startPage + ((cv.chapter - 1) / Math.max(1, book.chapters)) * pageSpan))
          );

          const scriptureUrl = buildGospelLibraryUrl(book.volumeId, book.slug, cv.chapter, cv.verse);

          verseMatches.push({
            id,
            volumeId: book.volumeId,
            bookName: book.name,
            chapter: cv.chapter,
            verse: cv.verse,
            pageNumber: estPage,
            text: '', // No repetitive placeholder!
            isCurated: false,
            context: `${book.name} Chapter ${cv.chapter}, Verse ${cv.verse} (Estimated LDS Print Page ${estPage})`,
            gospelLibraryUrl: scriptureUrl
          });
        }
      }
    }
  }

  return {
    inputTime: input,
    pageMatches,
    verseMatches,
    totalMatches: pageMatches.length + verseMatches.length
  };
}
