# TimeToPages - LDS Scripture Time & Page Reference App

**TimeToPages** is a modern web and desktop application designed to convert any time (e.g. `215`, `2:15`, `10:42`, `12:27`) or numerical input into correlating LDS canon scripture references and print page numbers across all 5 standard works: **Old Testament, New Testament, Book of Mormon, Doctrine and Covenants, and Pearl of Great Price**.

---

## 🌟 Key Features

1. **Dual Time-to-Scripture Lookup**:
   - **Page Mode**: Map inputs like `215` to standard print page 215 in the KJV LDS Bible (Numbers 33–35), Book of Mormon (Alma 14–15), D&C (Section 107), and Pearl of Great Price.
   - **Chapter & Verse Mode**: Map inputs like `2:15` or `21:5` to Chapter 2 Verse 15 (*1 Nephi 2:15: "And my father dwelt in a tent."*, Genesis 2:15, Matthew 2:15, Moses 2:15) or Chapter 21 Verse 5.
2. **Scripture Wall Clock**:
   - Ambient full-screen wall clock mode updating live scriptures every minute as the time ticks.
3. **Passage Reader & Bookmarking**:
   - Read full chapter background context, copy citations, save persistent bookmarks, and open direct links on Church Gospel Library.
4. **Standalone Desktop & Web Packaging**:
   - Runs as a local web app or desktop application (`TimeToPages.app` / `.exe`).

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
