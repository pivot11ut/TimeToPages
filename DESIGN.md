# TimeToPages - Technical Design Document

**Application Name**: TimeToPages  
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

The application solves two main correlation challenges:
1. **Page Number Correlation**: Resolving numbers like `215` directly to standard LDS print edition pages (e.g., Book of Mormon Page 215 = Alma 14–15; LDS Bible Page 215 = Numbers 33–35; D&C Page 215 = Section 107).
2. **Chapter & Verse Correlation**: Mapping time formats like `2:15` or `21:5` to matching chapter and verse references (e.g., 1 Nephi 2:15: *"And my father dwelt in a tent."*, Genesis 2:15, Matthew 2:15, Moses 2:15).
3. **Scripture Wall Clock**: An ambient live visualizer that automatically updates scriptures in real-time every minute as the clock ticks.

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
|  | (Print Page Indexes) |                          | VERSES    |  |
|  +----------------------+                          +-----------+  |
+-------------------------------------------------------------------+
```

### Technology Stack
- **Framework**: React 19 + TypeScript 6 + Vite 8
- **Styling**: Vanilla CSS3 with CSS Custom Properties, Glassmorphism, tailored HSL color tokens, and Google Fonts (`Cinzel`, `Inter`, `Fira Code`)
- **Iconography**: Lucide React
- **Animations & Effects**: Canvas Confetti (bookmark animations), CSS Keyframe Transitions
- **Desktop Wrapper**: Electron 43 + Electron Builder (for packaging macOS `.app` and Windows `.exe`)

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
Represents the page range of each book in the standard official LDS print editions (1979/2013 KJV LDS Bible; 1981/2013 Book of Mormon / Triple Combination).

```typescript
export interface BookMetadata {
  name: string;
  abbreviation: string;
  volumeId: VolumeId;
  chapters: number;
  startPage: number; // Starting page in standard print volume
  endPage: number;   // Ending page in standard print volume
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
  text: string;
  pageNumber: number;
  context?: string;
  gospelLibraryUrl?: string;
}

export interface PageReferenceMatch {
  volumeId: VolumeId;
  volumeName: string;
  pageNumber: number;
  bookName: string;
  chapterRange: string;
  sampleVerse?: ScriptureVerse;
  note?: string;
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
2. **Override Lookup**: Checks `EXACT_PAGE_CHAPTER_OVERRIDES` for precise historical page matches (e.g., `'bom-215' => 'Alma 14–15'`).
3. **Interpolation Fallback**: Calculates estimated chapter range on page $P$:
   $$\text{offset} = P - \text{startPage}$$
   $$\text{estStart} = \left\lfloor \frac{\text{offset}}{\text{endPage} - \text{startPage} + 1} \times \text{chapters} \right\rfloor + 1$$
4. **Volume-Specific Sample Filtering**: Attaches sample verses matching both `targetPage` and `volumeId`.

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
1. **Single-Page Web App (Vite Bundle)**: Built via `npm run build` outputting to `dist/` with relative asset base (`base: './'`).
2. **Standalone Desktop Application**: Packaged via Electron and Electron Builder (`npm run app:dir` / `npm run app:dist`) producing:
   - macOS: `release/mac-arm64/TimeToPages.app` and `TimeToPages-macOS.zip`
   - Windows: Portable `.exe` installer.
3. **Offline Web Bundle**: Zipped `dist/` folder capable of opening `index.html` locally without internet or Node.js.

---

## 7. Future Roadmap & Enhancements

- [ ] **Expanded Audio Integration**: Embedded audio player for listening to chapter readings directly inside the app.
- [ ] **Cross-Reference Visualizer**: Interactive node diagram connecting Book of Mormon Isaiah passages to Old Testament chapters.
- [ ] **Custom Study Notes**: Ability to attach personal study notes to saved scripture time bookmarks.
