# TimeToPages - Technical Design Document

**Application Name**: TimeToPages  
**Live Website**: [https://gunnvault.com](https://gunnvault.com)  
**Target Platform**: Web (SPA) & Standalone Desktop Application (macOS / Windows)  
**Target Audience**: Scripture readers, LDS scholars, teachers, and time-scripture correlation enthusiasts  
**Author / Core Maintainer**: Antigravity AI & Tim Gunn  

---

## 1. Executive Summary & Vision

**TimeToPages** is a specialized scripture correlation application designed to convert any time format (e.g., `215`, `2:15`, `10:42`, `12:27`) or numerical input into matching references across all five volumes of the **LDS Canon of Standard Works**:
- **Old Testament** (KJV LDS Edition)
- **New Testament** (KJV LDS Edition)
- **The Book of Mormon** (Another Testament of Jesus Christ)
- **Doctrine and Covenants**
- **Pearl of Great Price**

The application provides:
1. **Time-to-Page Correlation**: Resolving numbers like `215` directly to standard LDS print edition pages (e.g., Book of Mormon Page 215 = Alma 14–15; LDS Bible Page 215 = Numbers 33–35; D&C Page 215 = Section 107).
2. **Doctrine & Covenants Default Display**: By default, the application displays page matches alongside **Doctrine & Covenants** chapter & verse matches, keeping the initial interface clean, focused, and immediately relevant.
3. **Progressive Disclosure ("Show More")**: Users can expand on demand to view additional matching chapters and verses across the Book of Mormon, Old Testament, New Testament, and Pearl of Great Price.
4. **Official Gospel Library Deep Linking**: Every scripture title, reference card, and modal links directly to the official passage on `ChurchofJesusChrist.org`, highlighting the exact verse.
5. **Scripture Wall Clock**: An ambient live visualizer that automatically updates scriptures in real-time every minute as the clock ticks.

---

## 2. System Architecture & Tech Stack

```
+-------------------------------------------------------------------+
|                        TimeToPages Client                         |
|                                                                   |
|  +-------------------+   +--------------------+   +------------+  |
|  |   Header Bar      |   |   TimeInput Bar    |   | Live Clock |  |
|  | (Volume Selector) |   | (Presets & Modes)  |   | Visualizer |  |
|  +---------+---------+   +---------+----------+   +-----+------+  |
|            |                       |                    |         |
|            +-----------------------+--------------------+         |
|                                    |                              |
|                       +------------v------------+                 |
|                       |  scriptureMatcher.ts    |                 |
|                       |  (Parser & Resolution)  |                 |
|                       +------------+------------+                 |
|                                    |                              |
|          +-------------------------+-------------------------+    |
|          |                                                   |    |
|  +-------v--------------+                          +---------v-+  |
|  |  BOOK_PAGE_MAP       |                          | CURATED   |  |
|  | (Print Pages & Slugs)|                          | VERSES    |  |
|  +----------------------+                          +-----------+  |
+-------------------------------------------------------------------+
```

### Technology Stack
- **Framework**: React 19 + TypeScript 6 + Vite 8
- **Styling**: Vanilla CSS3 with CSS Custom Properties, Glassmorphism, tailored HSL color tokens, and Google Fonts (`Cinzel`, `Inter`, `Fira Code`)
- **Iconography**: Lucide React
- **Animations & Effects**: Canvas Confetti (bookmark animations), CSS Keyframe Transitions
- **Desktop Wrapper**: Electron 43 + Electron Builder (for packaging macOS `.app` and Windows `.exe`)
- **Web Hosting**: Static hosting via Hostinger (`https://gunnvault.com`)

---

## 3. Data Models & Schemas

### 3.1 Volume Metadata (`VolumeInfo`)
```typescript
export type VolumeId = 'ot' | 'nt' | 'bom' | 'dc' | 'pgp';

export interface VolumeInfo {
  id: VolumeId;
  name: string;
  shortName: string;
  colorBadgeClass: string;
  totalPages: number;
  totalBooks?: number;
  totalChapters: number;
  description: string;
}
```

### 3.2 Book Page Index Schema (`BookMetadata`)
Represents the page range of each book in the standard official LDS print editions (1979/2013 KJV LDS Bible; 1981/2013 Book of Mormon / Triple Combination), alongside its official Church Gospel Library slug:

```typescript
export interface BookMetadata {
  name: string;
  abbreviation: string;
  volumeId: VolumeId;
  slug: string;        // URL slug for ChurchofJesusChrist.org Gospel Library
  chapters: number;
  startPage: number;   // Starting page in standard print volume
  endPage: number;     // Ending page in standard print volume
}
```

### 3.3 Scripture Verse & Page Reference Schemas
```typescript
export interface ScriptureVerse {
  id: string;
  volumeId: VolumeId;
  bookName: string;
  chapter: number;
  verse: number;
  text?: string;
  pageNumber: number;
  context?: string;
  gospelLibraryUrl?: string;
  isCurated?: boolean;
}

export interface PageReferenceMatch {
  volumeId: VolumeId;
  volumeName: string;
  pageNumber: number;
  bookName: string;
  chapterRange: string;
  sampleVerse?: ScriptureVerse;
  note?: string;
  gospelLibraryUrl?: string;
}
```

### 3.4 Gospel Library URL Builder
```typescript
export function buildGospelLibraryUrl(volumeId: VolumeId, bookSlug: string, chapter: number, verse?: number): string {
  const volPath = volumeId === 'bom' ? 'bofm' : volumeId === 'dc' ? 'dc-testament' : volumeId;
  const bookPath = volumeId === 'dc' ? 'dc' : bookSlug;
  const verseParam = verse ? `?lang=eng&id=p${verse}#p${verse}` : '?lang=eng';
  return `https://www.churchofjesuschrist.org/study/scriptures/${volPath}/${bookPath}/${chapter}${verseParam}`;
}
```

---

## 4. Matching & Resolution Algorithms

### 4.1 Time Input Parsing (`parseTimeInput`)
Input values undergo cleaning and candidate generation:
- Input `"215"` -> Page candidate `215`, Chapter:Verse candidates `{ chapter: 2, verse: 15 }` and `{ chapter: 21, verse: 5 }`.
- Input `"2:15"` -> Page candidate `215`, Chapter:Verse candidate `{ chapter: 2, verse: 15 }`.
- Input `"1042"` -> Page candidate `1042`, Chapter:Verse candidates `{ chapter: 10, verse: 42 }` and `{ chapter: 1, verse: 42 }`.

### 4.2 Page Number Resolution (`findScriptureMatches`)
Given a target page $P$ (e.g. $P = 215$):
1. **Index Search**: Scans `BOOK_PAGE_MAP` for books satisfying $startPage \le P \le endPage$.
2. **Override Lookup**: Checks `EXACT_PAGE_CHAPTER_OVERRIDES` for precise historical page matches (e.g., `'bom-215' => 'Alma 14–15'`, `'dc-215' => 'Section 107'`).
3. **Interpolation Fallback**: Calculates estimated chapter range on page $P$:
   $$\text{offset} = P - \text{startPage}$$
   $$\text{estStart} = \left\lfloor \frac{\text{offset}}{\text{endPage} - \text{startPage} + 1} \times \text{chapters} \right\rfloor + 1$$
4. **Volume-Specific Sample Filtering**: Attaches sample verses matching both `targetPage` and `volumeId`.

### 4.3 Chapter & Verse Resolution & Categorization
- Matches are split into:
  - **Doctrine & Covenants Matches**: Displayed immediately in the default view.
  - **Additional Volume Matches**: Filtered for progressive disclosure via the "Show More Matches" toggle.
- Non-curated verses generate direct deep links with the official URL builder without repeating fallback quotes.

---

## 5. UI/UX Design System

### Color Palette & Design Tokens
- **Background**: Deep Celestial Obsidian (`#080A10`, `#0F1626`)
- **Accent Primary**: Sacred Gold (`#D4AF37`, `#F3CA68`, `#FFE29A`)
- **Volume Badges**:
  - Old Testament: Azure Blue (`#3B82F6`)
  - New Testament: Deep Indigo (`#6366F1`)
  - Book of Mormon: Sacred Gold (`#EAB308`)
  - Doctrine & Covenants: Emerald Green (`#10B981`)
  - Pearl of Great Price: Amethyst Rose (`#EC4899`)
- **Typography**:
  - Headers / Titles: `Cinzel` & `Playfair Display`
  - Body / UI: `Inter`
  - Numerical / Clock Displays: `Fira Code`

---

## 6. Distribution & Packaging Strategy

TimeToPages supports three deployment targets:
1. **Live Production Web App**: Deployed at [https://gunnvault.com](https://gunnvault.com) on Hostinger static hosting.
2. **Single-Page Web App (Vite Bundle)**: Built via `npm run build` outputting to `dist/` with relative asset base (`base: './'`).
3. **Standalone Desktop Application**: Packaged via Electron and Electron Builder (`npm run app:dir` / `npm run app:dist`) producing:
   - macOS: `release/mac-arm64/TimeToPages.app` and `TimeToPages-macOS.zip`
   - Windows: Portable `.exe` installer.

---

## 7. Future Roadmap & Enhancements

- [ ] **Expanded Audio Integration**: Embedded audio player for listening to chapter readings directly inside the app.
- [ ] **Cross-Reference Visualizer**: Interactive node diagram connecting Book of Mormon Isaiah passages to Old Testament chapters.
- [ ] **Custom Study Notes**: Ability to attach personal study notes to saved scripture time bookmarks.

