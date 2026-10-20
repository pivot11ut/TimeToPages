import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '../.scripture_cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const agent = new https.Agent({ keepAlive: true, maxSockets: 25 });

const STANDARD_BOOK_ABBREVIATIONS = {
  '1-ne': '1 Ne.',
  '2-ne': '2 Ne.',
  'jacob': 'Jacob',
  'enos': 'Enos',
  'jarom': 'Jarom',
  'omni': 'Omni',
  'w-of-m': 'W of M',
  'mosiah': 'Mosiah',
  'alma': 'Alma',
  'hel': 'Hel.',
  '3-ne': '3 Ne.',
  '4-ne': '4 Ne.',
  'morm': 'Morm.',
  'ether': 'Ether',
  'moro': 'Moro.',
  'dc': 'D&C',
  'od': 'OD',
  'moses': 'Moses',
  'abr': 'Abr.',
  'js-m': 'JS—M',
  'js-h': 'JS—H',
  'a-of-f': 'A of F',
  'gen': 'Gen.',
  'ex': 'Ex.',
  'lev': 'Lev.',
  'num': 'Num.',
  'deut': 'Deut.',
  'josh': 'Josh.',
  'judg': 'Judg.',
  'ruth': 'Ruth',
  '1-sam': '1 Sam.',
  '2-sam': '2 Sam.',
  '1-kgs': '1 Kgs.',
  '2-kgs': '2 Kgs.',
  '1-chr': '1 Chr.',
  '2-chr': '2 Chr.',
  'ezra': 'Ezra',
  'neh': 'Neh.',
  'esth': 'Esth.',
  'job': 'Job',
  'ps': 'Ps.',
  'prov': 'Prov.',
  'eccl': 'Eccl.',
  'song': 'Song.',
  'isa': 'Isa.',
  'jer': 'Jer.',
  'lam': 'Lam.',
  'ezek': 'Ezek.',
  'dan': 'Dan.',
  'hosea': 'Hosea',
  'joel': 'Joel',
  'amos': 'Amos',
  'obad': 'Obad.',
  'jonah': 'Jonah',
  'micah': 'Micah',
  'nahum': 'Nahum',
  'hab': 'Hab.',
  'zeph': 'Zeph.',
  'hag': 'Hag.',
  'zech': 'Zech.',
  'mal': 'Mal.',
  'matt': 'Matt.',
  'mark': 'Mark',
  'luke': 'Luke',
  'john': 'John',
  'acts': 'Acts',
  'rom': 'Rom.',
  '1-cor': '1 Cor.',
  '2-cor': '2 Cor.',
  'gal': 'Gal.',
  'eph': 'Eph.',
  'philip': 'Philip.',
  'col': 'Col.',
  '1-thes': '1 Thes.',
  '2-thes': '2 Thes.',
  '1-tim': '1 Tim.',
  '2-tim': '2 Tim.',
  'titus': 'Titus',
  'philem': 'Philem.',
  'heb': 'Heb.',
  'james': 'James',
  '1-pet': '1 Pet.',
  '2-pet': '2 Pet.',
  '1-jn': '1 John',
  '2-jn': '2 John',
  '3-jn': '3 John',
  'jude': 'Jude',
  'rev': 'Rev.'
};

function fetchUrl(url) {
  return new Promise((resolve) => {
    let retries = 3;
    function attempt() {
      const req = https.get(url, { agent, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      });
      req.on('error', () => {
        if (--retries > 0) setTimeout(attempt, 500);
        else resolve('');
      });
      req.setTimeout(12000, () => {
        req.destroy();
        if (--retries > 0) setTimeout(attempt, 500);
        else resolve('');
      });
    }
    attempt();
  });
}

async function getCachedOrFetch(url, cacheKey) {
  const filePath = path.join(CACHE_DIR, `${cacheKey.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  const html = await fetchUrl(url);
  if (html && html.length > 500) {
    fs.writeFileSync(filePath, html, 'utf-8');
  }
  return html;
}

async function getVolumeUris(volPath) {
  const html = await getCachedOrFetch(`https://www.churchofjesuschrist.org/study/scriptures/${volPath}?lang=eng`, `toc_${volPath}`);
  const match = html.match(/window\.__INITIAL_STATE__=\"([^\"]+)\"/);
  if (!match) return [];
  const decoded = Buffer.from(match[1], 'base64').toString('utf-8');
  const json = JSON.parse(decoded);
  const bookStore = Object.values(json.reader?.bookStore || {})[0];
  const uris = [];
  if (bookStore && bookStore.entries) {
    for (const entry of bookStore.entries) {
      if (entry.section && entry.section.childUris) {
        uris.push(...entry.section.childUris);
      } else if (entry.content && entry.content.uri) {
        uris.push(entry.content.uri);
      }
    }
  }
  return uris;
}

function normalizeSpaces(str) {
  return str.replace(/[\u00a0\s]+/g, ' ').trim();
}

function cleanText(html) {
  return normalizeSpaces(
    html
      .replace(/<sup class=\"marker\">[^<]*<\/sup>/g, '')
      .replace(/<[^>]+>/g, '')
  );
}

async function run() {
  console.log('Starting official LDS scripture pages processing...');
  const volumes = [
    { id: 'bofm', volKey: 'bom', name: 'The Book of Mormon', initialPage: 1 },
    { id: 'dc-testament', volKey: 'dc', name: 'Doctrine and Covenants', initialPage: 1 },
    { id: 'pgp', volKey: 'pgp', name: 'Pearl of Great Price', initialPage: 1 },
    { id: 'nt', volKey: 'nt', name: 'New Testament', initialPage: 1187 },
    { id: 'ot', volKey: 'ot', name: 'Old Testament', initialPage: 1 }
  ];

  const fullData = {
    books: [],
    pages: {} // key: `${volKey}-${pageNum}`
  };

  for (const vol of volumes) {
    console.log(`\nFetching TOC for ${vol.name} (${vol.id})...`);
    const allUris = await getVolumeUris(vol.id);
    const chapterUris = allUris.filter((u) => /\/\d+$/.test(u));
    console.log(`Found ${chapterUris.length} chapters for ${vol.name}.`);

    const chapterData = new Array(chapterUris.length);
    let completed = 0;
    const concurrency = 20;
    const queue = chapterUris.map((uri, idx) => ({ uri, idx }));

    const workers = Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        const url = `https://www.churchofjesuschrist.org${item.uri}?lang=eng`;
        const cacheKey = item.uri.replace(/\//g, '_');
        const html = await getCachedOrFetch(url, cacheKey);
        chapterData[item.idx] = { uri: item.uri, html };
        completed++;
        if (completed % 50 === 0 || completed === chapterUris.length) {
          process.stdout.write(`  [${vol.volKey.toUpperCase()}] ${completed}/${chapterUris.length} chapters cached/loaded\r`);
        }
      }
    });

    await Promise.all(workers);
    console.log(`\nProcessing ${chapterData.length} chapters for ${vol.name}...`);

    let currentPage = vol.initialPage;
    const bookRanges = new Map(); // slug -> { name, slug, startPage, endPage, chapters: Set }

    // Temporary storage for page occurrences:
    // pageKey -> { volumeId, pageNumber, occurrences: [ { bookName, bookSlug, chNum, verseRef, verseText, url } ] }
    const pageOccurrences = new Map();

    for (const item of chapterData) {
      if (!item || !item.html) continue;

      const parts = item.uri.split('/');
      const chNum = parseInt(parts[parts.length - 1], 10);
      const bookSlug = parts[parts.length - 2];

      const titleMatch = item.html.match(/<title[^>]*>(.*?)<\/title>/);
      let pageTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      let bookName = normalizeSpaces(pageTitle.replace(/\s+\d+$/, '').trim());
      if (!bookName) bookName = bookSlug;

      if (!bookRanges.has(bookSlug)) {
        bookRanges.set(bookSlug, {
          slug: bookSlug,
          name: bookName,
          abbreviation: STANDARD_BOOK_ABBREVIATIONS[bookSlug] || bookName,
          volumeId: vol.volKey,
          startPage: currentPage,
          endPage: currentPage,
          chapters: new Set()
        });
      }
      const bInfo = bookRanges.get(bookSlug);
      bInfo.chapters.add(chNum);

      const pageSections = item.html.split(/<span class=\"page-break\" data-page=\"(\d+)\"><\/span>/);

      const recordSection = (pageNum, contentHtml) => {
        bInfo.startPage = Math.min(bInfo.startPage, pageNum);
        bInfo.endPage = Math.max(bInfo.endPage, pageNum);

        const pageKey = `${vol.volKey}-${pageNum}`;
        if (!pageOccurrences.has(pageKey)) {
          pageOccurrences.set(pageKey, {
            volumeId: vol.volKey,
            pageNumber: pageNum,
            sections: []
          });
        }
        const pObj = pageOccurrences.get(pageKey);

        // Find verses
        const verseMatches = [...contentHtml.matchAll(/<p class=\"verse\"[^>]*id=\"p(\d+)\"[^>]*>([\s\S]*?)<\/p>/g)];
        let firstVerseRef = '';
        let firstVerseText = '';
        let url = `https://www.churchofjesuschrist.org${item.uri}?lang=eng`;

        if (verseMatches.length > 0) {
          const vNum = parseInt(verseMatches[0][1], 10);
          firstVerseRef = `${bookName} ${chNum}:${vNum}`;
          firstVerseText = cleanText(verseMatches[0][2]).replace(/^\d+\s*/, '');
          url = `https://www.churchofjesuschrist.org${item.uri}?lang=eng&id=p${vNum}#p${vNum}`;
        }

        pObj.sections.push({
          bookName,
          bookSlug,
          chNum,
          verseRef: firstVerseRef,
          verseText: firstVerseText,
          url
        });
      };

      if (pageSections[0]) {
        recordSection(currentPage, pageSections[0]);
      }

      for (let i = 1; i < pageSections.length; i += 2) {
        const pageNum = parseInt(pageSections[i], 10);
        currentPage = pageNum;
        const sectionContent = pageSections[i + 1] || '';
        recordSection(pageNum, sectionContent);
      }
    }

    // Now consolidate each page's sections
    for (const [pageKey, pObj] of pageOccurrences.entries()) {
      // Group sections by bookName preserving order
      const bookGroups = new Map();
      let primaryVerseRef = '';
      let primaryVerseText = '';
      let primaryUrl = '';

      for (const sec of pObj.sections) {
        if (!bookGroups.has(sec.bookName)) {
          bookGroups.set(sec.bookName, {
            bookName: sec.bookName,
            bookSlug: sec.bookSlug,
            chapters: new Set(),
            url: sec.url
          });
        }
        bookGroups.get(sec.bookName).chapters.add(sec.chNum);

        if (!primaryVerseRef && sec.verseRef) {
          primaryVerseRef = sec.verseRef;
          primaryVerseText = sec.verseText;
          primaryUrl = sec.url;
        }
      }

      // Format chapter range string
      const bookRangesFormatted = [];
      const bookNames = [];
      let primarySlug = '';

      for (const [bName, group] of bookGroups.entries()) {
        bookNames.push(bName);
        if (!primarySlug) primarySlug = group.bookSlug;
        const chs = Array.from(group.chapters).sort((a, b) => a - b);
        if (chs.length === 1) {
          bookRangesFormatted.push(`${bName} ${chs[0]}`);
        } else if (chs.length > 1) {
          bookRangesFormatted.push(`${bName} ${chs[0]}–${chs[chs.length - 1]}`);
        } else {
          bookRangesFormatted.push(bName);
        }
      }

      const chapterRange = bookRangesFormatted.join(' / ');
      const combinedBookName = bookNames.join(' / ');

      // Fallbacks for Declaration or special sections
      if (!primaryVerseRef) {
        if (combinedBookName.includes('Official Declaration')) {
          primaryVerseRef = chapterRange;
          primaryVerseText = 'Official Declaration issued by the First Presidency and the Quorum of the Twelve Apostles.';
        } else if (pObj.volumeId === 'pgp' && pObj.pageNumber >= 59) {
          primaryVerseRef = 'Joseph Smith—History (Oliver Cowdery Account)';
          primaryVerseText = 'These were days never to be forgotten—to sit under the sound of a voice dictated by the inspiration of heaven, awakened the utmost gratitude of this bosom!';
        }
      }

      fullData.pages[pageKey] = {
        volumeId: pObj.volumeId,
        pageNumber: pObj.pageNumber,
        bookName: combinedBookName,
        bookSlug: primarySlug,
        chapterRange,
        verseRef: primaryVerseRef || chapterRange,
        verseText: primaryVerseText,
        url: primaryUrl || `https://www.churchofjesuschrist.org/study/scriptures/${vol.id}?lang=eng`
      };
    }

    for (const b of bookRanges.values()) {
      fullData.books.push({
        name: b.name,
        abbreviation: b.abbreviation,
        slug: b.slug,
        volumeId: b.volumeId,
        chapters: b.chapters.size,
        startPage: b.startPage,
        endPage: b.endPage
      });
    }
  }

  const outPath = path.resolve(__dirname, '../src/data/officialScripturePages.json');
  fs.writeFileSync(outPath, JSON.stringify(fullData, null, 2), 'utf-8');
  console.log(`\nSuccessfully wrote official LDS scripture data to ${outPath}`);
  console.log(`Total books: ${fullData.books.length}`);
  console.log(`Total pages indexed: ${Object.keys(fullData.pages).length}`);
}

run().catch(console.error);
