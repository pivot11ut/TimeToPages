# TimeToPages - LDS Scripture Time & Page Reference App

**TimeToPages** is a modern web and desktop application designed to convert any time (e.g. `215`, `2:15`, `10:42`, `12:27`) or numerical input into correlating LDS canon scripture references and print page numbers across all 5 standard works: **Old Testament, New Testament, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price**.

**Live Website**: [https://gunnvault.com](https://gunnvault.com)

---

## 🌟 Key Features

1. **Dual Time-to-Scripture Lookup**:
   - **Page Mode**: Map inputs like `215` to standard print page 215 in the KJV LDS Bible (Numbers 33–35), Book of Mormon (Alma 14–15), D&C (Section 107), and Pearl of Great Price.
   - **Chapter & Verse Mode**: Map inputs like `2:15` or `21:5` to Chapter 2 Verse 15 (*1 Nephi 2:15: "And my father dwelt in a tent."*, Genesis 2:15, Matthew 2:15, Moses 2:15) or Chapter 21 Verse 5 (*D&C 21:5*).
2. **Default View**:
   - Displays **Time to Page Numbers** across the standard works.
   - Displays **Doctrine & Covenants** chapter & verse matches directly in the initial view.
3. **Progressive Disclosure ("Show More Matches")**:
   - Clean, uncluttered layout with a single-click toggle to reveal additional matches across the **Book of Mormon, Old Testament, New Testament, and Pearl of Great Price**.
4. **Official Church Gospel Library Deep Links**:
   - Every card title, reference link, and reader popup dynamically links directly to the official chapter & verse on `ChurchofJesusChrist.org`, highlighting the specific verse.
5. **Scripture Wall Clock**:
   - Ambient full-screen wall clock mode updating live scriptures every minute as the time ticks.
6. **Passage Reader & Bookmarking**:
   - Read full chapter background context, copy citations, save persistent bookmarks, and open direct links on Church Gospel Library.
7. **Standalone Desktop & Web Packaging**:
   - Available on the web at [gunnvault.com](https://gunnvault.com) or as a desktop application (`TimeToPages.app` / `.exe`).

---

## 📖 Architecture & Design Document

For full technical design, data schemas, matching algorithms, and system architecture, see [DESIGN.md](file:///Users/timgunn/src/TimeToPages/DESIGN.md).

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Standalone Desktop Application Package
```bash
# Build desktop app folder (.app for macOS)
npm run app:dir

# Build release installers
npm run app:dist
```

---

## 📄 License & Disclaimer

*This application is created for scripture study and time correlation. It is not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.*

