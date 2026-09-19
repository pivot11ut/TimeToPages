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

export interface BookMetadata {
  name: string;
  abbreviation: string;
  volumeId: VolumeId;
  slug: string;
  chapters: number;
  startPage: number; // LDS print edition starting page
  endPage: number;   // LDS print edition ending page
}

export interface ScriptureVerse {
  id: string;
  volumeId: VolumeId;
  bookName: string;
  chapter: number;
  verse: number;
  text?: string;
  pageNumber: number; // LDS Standard print page number
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

export const VOLUMES: Record<VolumeId, VolumeInfo> = {
  ot: {
    id: 'ot',
    name: 'Old Testament',
    shortName: 'OT',
    colorBadgeClass: 'badge-ot',
    totalPages: 1184,
    totalBooks: 39,
    totalChapters: 929,
    description: 'The King James Version of the Old Testament (LDS Edition).'
  },
  nt: {
    id: 'nt',
    name: 'New Testament',
    shortName: 'NT',
    colorBadgeClass: 'badge-nt',
    totalPages: 404, // 1187 - 1590
    totalBooks: 27,
    totalChapters: 260,
    description: 'The King James Version of the New Testament (LDS Edition).'
  },
  bom: {
    id: 'bom',
    name: 'The Book of Mormon',
    shortName: 'BOM',
    colorBadgeClass: 'badge-bom',
    totalPages: 531,
    totalBooks: 15,
    totalChapters: 239,
    description: 'Another Testament of Jesus Christ (1981/2013 LDS Edition).'
  },
  dc: {
    id: 'dc',
    name: 'Doctrine and Covenants',
    shortName: 'D&C',
    colorBadgeClass: 'badge-dc',
    totalPages: 294,
    totalChapters: 138,
    description: 'Revelations given to Joseph Smith the Prophet and his successors.'
  },
  pgp: {
    id: 'pgp',
    name: 'Pearl of Great Price',
    shortName: 'PGP',
    colorBadgeClass: 'badge-pgp',
    totalPages: 60,
    totalBooks: 5,
    totalChapters: 16,
    description: 'Selections from the Book of Moses, Book of Abraham, JS-Matthew, JS-History, & Articles of Faith.'
  }
};

/**
 * Builds official ChurchofJesusChrist.org Gospel Library URL
 */
export function buildGospelLibraryUrl(volumeId: VolumeId, bookSlug: string, chapter: number, verse?: number): string {
  const volPath = volumeId === 'bom' ? 'bofm' : volumeId === 'dc' ? 'dc-testament' : volumeId;
  const bookPath = volumeId === 'dc' ? 'dc' : bookSlug;
  const verseParam = verse ? `?lang=eng&id=p${verse}#p${verse}` : '?lang=eng';
  return `https://www.churchofjesuschrist.org/study/scriptures/${volPath}/${bookPath}/${chapter}${verseParam}`;
}

// Standard LDS print page index mapping
export const BOOK_PAGE_MAP: BookMetadata[] = [
  // --- BOOK OF MORMON (531 Pages) ---
  { name: '1 Nephi', abbreviation: '1 Ne.', volumeId: 'bom', slug: '1-ne', chapters: 22, startPage: 1, endPage: 52 },
  { name: '2 Nephi', abbreviation: '2 Ne.', volumeId: 'bom', slug: '2-ne', chapters: 33, startPage: 53, endPage: 117 },
  { name: 'Jacob', abbreviation: 'Jacob', volumeId: 'bom', slug: 'jacob', chapters: 7, startPage: 118, endPage: 139 },
  { name: 'Enos', abbreviation: 'Enos', volumeId: 'bom', slug: 'enos', chapters: 1, startPage: 140, endPage: 142 },
  { name: 'Jarom', abbreviation: 'Jarom', volumeId: 'bom', slug: 'jarom', chapters: 1, startPage: 143, endPage: 144 },
  { name: 'Omni', abbreviation: 'Omni', volumeId: 'bom', slug: 'omni', chapters: 1, startPage: 145, endPage: 147 },
  { name: 'Words of Mormon', abbreviation: 'W of M', volumeId: 'bom', slug: 'w-of-m', chapters: 1, startPage: 148, endPage: 149 },
  { name: 'Mosiah', abbreviation: 'Mosiah', volumeId: 'bom', slug: 'mosiah', chapters: 29, startPage: 150, endPage: 209 },
  { name: 'Alma', abbreviation: 'Alma', volumeId: 'bom', slug: 'alma', chapters: 63, startPage: 210, endPage: 366 },
  { name: 'Helaman', abbreviation: 'Helaman', volumeId: 'bom', slug: 'hel', chapters: 16, startPage: 367, endPage: 407 },
  { name: '3 Nephi', abbreviation: '3 Ne.', volumeId: 'bom', slug: '3-ne', chapters: 30, startPage: 408, endPage: 467 },
  { name: '4 Nephi', abbreviation: '4 Ne.', volumeId: 'bom', slug: '4-ne', chapters: 1, startPage: 468, endPage: 470 },
  { name: 'Mormon', abbreviation: 'Morm.', volumeId: 'bom', slug: 'morm', chapters: 9, startPage: 471, endPage: 487 },
  { name: 'Ether', abbreviation: 'Ether', volumeId: 'bom', slug: 'ether', chapters: 15, startPage: 488, endPage: 517 },
  { name: 'Moroni', abbreviation: 'Moro.', volumeId: 'bom', slug: 'moro', chapters: 10, startPage: 518, endPage: 531 },

  // --- OLD TESTAMENT (Pages 1 to 1184) ---
  { name: 'Genesis', abbreviation: 'Gen.', volumeId: 'ot', slug: 'gen', chapters: 50, startPage: 1, endPage: 78 },
  { name: 'Exodus', abbreviation: 'Ex.', volumeId: 'ot', slug: 'ex', chapters: 40, startPage: 79, endPage: 143 },
  { name: 'Leviticus', abbreviation: 'Lev.', volumeId: 'ot', slug: 'lev', chapters: 27, startPage: 144, endPage: 191 },
  { name: 'Numbers', abbreviation: 'Num.', volumeId: 'ot', slug: 'num', chapters: 36, startPage: 192, endPage: 256 },
  { name: 'Deuteronomy', abbreviation: 'Deut.', volumeId: 'ot', slug: 'deut', chapters: 34, startPage: 257, endPage: 314 },
  { name: 'Joshua', abbreviation: 'Josh.', volumeId: 'ot', slug: 'josh', chapters: 24, startPage: 315, endPage: 350 },
  { name: 'Judges', abbreviation: 'Judg.', volumeId: 'ot', slug: 'judg', chapters: 21, startPage: 351, endPage: 386 },
  { name: 'Ruth', abbreviation: 'Ruth', volumeId: 'ot', slug: 'ruth', chapters: 4, startPage: 387, endPage: 392 },
  { name: '1 Samuel', abbreviation: '1 Sam.', volumeId: 'ot', slug: '1-sam', chapters: 31, startPage: 393, endPage: 442 },
  { name: '2 Samuel', abbreviation: '2 Sam.', volumeId: 'ot', slug: '2-sam', chapters: 24, startPage: 443, endPage: 483 },
  { name: '1 Kings', abbreviation: '1 Kgs.', volumeId: 'ot', slug: '1-kgs', chapters: 22, startPage: 484, endPage: 531 },
  { name: '2 Kings', abbreviation: '2 Kgs.', volumeId: 'ot', slug: '2-kgs', chapters: 25, startPage: 532, endPage: 578 },
  { name: '1 Chronicles', abbreviation: '1 Chr.', volumeId: 'ot', slug: '1-chr', chapters: 29, startPage: 579, endPage: 618 },
  { name: '2 Chronicles', abbreviation: '2 Chr.', volumeId: 'ot', slug: '2-chr', chapters: 36, startPage: 619, endPage: 668 },
  { name: 'Ezra', abbreviation: 'Ezra', volumeId: 'ot', slug: 'ezra', chapters: 10, startPage: 669, endPage: 681 },
  { name: 'Nehemiah', abbreviation: 'Neh.', volumeId: 'ot', slug: 'neh', chapters: 13, startPage: 682, endPage: 699 },
  { name: 'Esther', abbreviation: 'Esth.', volumeId: 'ot', slug: 'esth', chapters: 10, startPage: 700, endPage: 711 },
  { name: 'Job', abbreviation: 'Job', volumeId: 'ot', slug: 'job', chapters: 42, startPage: 712, endPage: 752 },
  { name: 'Psalms', abbreviation: 'Ps.', volumeId: 'ot', slug: 'ps', chapters: 150, startPage: 753, endPage: 878 },
  { name: 'Proverbs', abbreviation: 'Prov.', volumeId: 'ot', slug: 'prov', chapters: 31, startPage: 879, endPage: 914 },
  { name: 'Ecclesiastes', abbreviation: 'Eccl.', volumeId: 'ot', slug: 'eccl', chapters: 12, startPage: 915, endPage: 925 },
  { name: 'Song of Solomon', abbreviation: 'Song.', volumeId: 'ot', slug: 'song', chapters: 8, startPage: 926, endPage: 932 },
  { name: 'Isaiah', abbreviation: 'Isa.', volumeId: 'ot', slug: 'isa', chapters: 66, startPage: 933, endPage: 1024 },
  { name: 'Jeremiah', abbreviation: 'Jer.', volumeId: 'ot', slug: 'jer', chapters: 52, startPage: 1025, endPage: 1106 },
  { name: 'Lamentations', abbreviation: 'Lam.', volumeId: 'ot', slug: 'lam', chapters: 5, startPage: 1107, endPage: 1114 },
  { name: 'Ezekiel', abbreviation: 'Ezek.', volumeId: 'ot', slug: 'ezek', chapters: 48, startPage: 1115, endPage: 1172 },
  { name: 'Daniel', abbreviation: 'Dan.', volumeId: 'ot', slug: 'dan', chapters: 12, startPage: 1173, endPage: 1195 },
  { name: 'Hosea', abbreviation: 'Hosea', volumeId: 'ot', slug: 'hos', chapters: 14, startPage: 1196, endPage: 1207 },
  { name: 'Joel', abbreviation: 'Joel', volumeId: 'ot', slug: 'joel', chapters: 3, startPage: 1208, endPage: 1212 },
  { name: 'Amos', abbreviation: 'Amos', volumeId: 'ot', slug: 'amos', chapters: 9, startPage: 1213, endPage: 1222 },
  { name: 'Obadiah', abbreviation: 'Obad.', volumeId: 'ot', slug: 'obad', chapters: 1, startPage: 1223, endPage: 1224 },
  { name: 'Jonah', abbreviation: 'Jonah', volumeId: 'ot', slug: 'jonah', chapters: 4, startPage: 1225, endPage: 1228 },
  { name: 'Micah', abbreviation: 'Micah', volumeId: 'ot', slug: 'micah', chapters: 7, startPage: 1229, endPage: 1236 },
  { name: 'Nahum', abbreviation: 'Nahum', volumeId: 'ot', slug: 'nahum', chapters: 3, startPage: 1237, endPage: 1239 },
  { name: 'Habakkuk', abbreviation: 'Hab.', volumeId: 'ot', slug: 'hab', chapters: 3, startPage: 1240, endPage: 1243 },
  { name: 'Zephaniah', abbreviation: 'Zeph.', volumeId: 'ot', slug: 'zeph', chapters: 3, startPage: 1244, endPage: 1247 },
  { name: 'Haggai', abbreviation: 'Haggai', volumeId: 'ot', slug: 'hag', chapters: 2, startPage: 1248, endPage: 1250 },
  { name: 'Zechariah', abbreviation: 'Zech.', volumeId: 'ot', slug: 'zech', chapters: 14, startPage: 1251, endPage: 1263 },
  { name: 'Malachi', abbreviation: 'Mal.', volumeId: 'ot', slug: 'mal', chapters: 4, startPage: 1264, endPage: 1269 },

  // --- NEW TESTAMENT (Pages 1187 to 1590) ---
  { name: 'Matthew', abbreviation: 'Matt.', volumeId: 'nt', slug: 'matt', chapters: 28, startPage: 1187, endPage: 1245 },
  { name: 'Mark', abbreviation: 'Mark', volumeId: 'nt', slug: 'mark', chapters: 16, startPage: 1246, endPage: 1282 },
  { name: 'Luke', abbreviation: 'Luke', volumeId: 'nt', slug: 'luke', chapters: 24, startPage: 1283, endPage: 1344 },
  { name: 'John', abbreviation: 'John', volumeId: 'nt', slug: 'john', chapters: 21, startPage: 1345, endPage: 1391 },
  { name: 'Acts', abbreviation: 'Acts', volumeId: 'nt', slug: 'acts', chapters: 28, startPage: 1392, endPage: 1450 },
  { name: 'Romans', abbreviation: 'Rom.', volumeId: 'nt', slug: 'rom', chapters: 16, startPage: 1451, endPage: 1474 },
  { name: '1 Corinthians', abbreviation: '1 Cor.', volumeId: 'nt', slug: '1-cor', chapters: 16, startPage: 1475, endPage: 1498 },
  { name: '2 Corinthians', abbreviation: '2 Cor.', volumeId: 'nt', slug: '2-cor', chapters: 13, startPage: 1499, endPage: 1513 },
  { name: 'Galatians', abbreviation: 'Gal.', volumeId: 'nt', slug: 'gal', chapters: 6, startPage: 1514, endPage: 1522 },
  { name: 'Ephesians', abbreviation: 'Eph.', volumeId: 'nt', slug: 'eph', chapters: 6, startPage: 1523, endPage: 1531 },
  { name: 'Philippians', abbreviation: 'Philip.', volumeId: 'nt', slug: 'philip', chapters: 4, startPage: 1532, endPage: 1538 },
  { name: 'Colossians', abbreviation: 'Col.', volumeId: 'nt', slug: 'col', chapters: 4, startPage: 1539, endPage: 1544 },
  { name: '1 Thessalonians', abbreviation: '1 Thes.', volumeId: 'nt', slug: '1-thes', chapters: 5, startPage: 1545, endPage: 1549 },
  { name: '2 Thessalonians', abbreviation: '2 Thes.', volumeId: 'nt', slug: '2-thes', chapters: 3, startPage: 1550, endPage: 1553 },
  { name: '1 Timothy', abbreviation: '1 Tim.', volumeId: 'nt', slug: '1-tim', chapters: 6, startPage: 1554, endPage: 1560 },
  { name: '2 Timothy', abbreviation: '2 Tim.', volumeId: 'nt', slug: '2-tim', chapters: 4, startPage: 1561, endPage: 1565 },
  { name: 'Titus', abbreviation: 'Titus', volumeId: 'nt', slug: 'titus', chapters: 3, startPage: 1566, endPage: 1569 },
  { name: 'Philemon', abbreviation: 'Philem.', volumeId: 'nt', slug: 'philem', chapters: 1, startPage: 1570, endPage: 1571 },
  { name: 'Hebrews', abbreviation: 'Heb.', volumeId: 'nt', slug: 'heb', chapters: 13, startPage: 1572, endPage: 1590 },
  { name: 'James', abbreviation: 'James', volumeId: 'nt', slug: 'james', chapters: 5, startPage: 1591, endPage: 1598 },
  { name: '1 Peter', abbreviation: '1 Pet.', volumeId: 'nt', slug: '1-pet', chapters: 5, startPage: 1599, endPage: 1606 },
  { name: '2 Peter', abbreviation: '2 Pet.', volumeId: 'nt', slug: '2-pet', chapters: 3, startPage: 1607, endPage: 1611 },
  { name: '1 John', abbreviation: '1 John', volumeId: 'nt', slug: '1-jn', chapters: 5, startPage: 1612, endPage: 1618 },
  { name: '2 John', abbreviation: '2 John', volumeId: 'nt', slug: '2-jn', chapters: 1, startPage: 1619, endPage: 1619 },
  { name: '3 John', abbreviation: '3 John', volumeId: 'nt', slug: '3-jn', chapters: 1, startPage: 1620, endPage: 1620 },
  { name: 'Jude', abbreviation: 'Jude', volumeId: 'nt', slug: 'jude', chapters: 1, startPage: 1621, endPage: 1622 },
  { name: 'Revelation', abbreviation: 'Rev.', volumeId: 'nt', slug: 'rev', chapters: 22, startPage: 1623, endPage: 1650 },

  // --- DOCTRINE AND COVENANTS (294 Pages) ---
  { name: 'Doctrine & Covenants', abbreviation: 'D&C', volumeId: 'dc', slug: 'dc', chapters: 138, startPage: 1, endPage: 294 },

  // --- PEARL OF GREAT PRICE (60 Pages) ---
  { name: 'Moses', abbreviation: 'Moses', volumeId: 'pgp', slug: 'moses', chapters: 8, startPage: 1, endPage: 28 },
  { name: 'Abraham', abbreviation: 'Abr.', volumeId: 'pgp', slug: 'abr', chapters: 5, startPage: 29, endPage: 42 },
  { name: 'Joseph Smith—Matthew', abbreviation: 'JS—M', volumeId: 'pgp', slug: 'js-m', chapters: 1, startPage: 43, endPage: 46 },
  { name: 'Joseph Smith—History', abbreviation: 'JS—H', volumeId: 'pgp', slug: 'js-h', chapters: 1, startPage: 47, endPage: 58 },
  { name: 'Articles of Faith', abbreviation: 'A of F', volumeId: 'pgp', slug: 'a-of-f', chapters: 1, startPage: 59, endPage: 60 }
];

// Rich curated dataset of key verses for time matches
export const CURATED_VERSES: ScriptureVerse[] = [
  // --- TIME 2:15 / 215 ---
  {
    id: 'bom-1ne-2-15',
    volumeId: 'bom',
    bookName: '1 Nephi',
    chapter: 2,
    verse: 15,
    pageNumber: 4,
    text: 'And my father dwelt in a tent.',
    context: 'Lehi leads his family into the wilderness following the command of the Lord to depart out of Jerusalem.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/2?lang=eng&id=p15#p15'
  },
  {
    id: 'bom-2ne-2-15',
    volumeId: 'bom',
    bookName: '2 Nephi',
    chapter: 2,
    verse: 15,
    pageNumber: 59,
    text: 'And now, my sons, I speak unto you these things for your profit and learning; for there is a God, and he hath created all things, both the heavens and the earth, and all things that in them are, both things to act and things to be acted upon.',
    context: 'Lehi teaches Jacob about agency, creation, and the necessity of opposition in all things.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/2?lang=eng&id=p15#p15'
  },
  {
    id: 'bom-alma-14-26',
    volumeId: 'bom',
    bookName: 'Alma',
    chapter: 14,
    verse: 26,
    pageNumber: 215,
    text: 'And Alma cried, saying: How long shall we suffer these great afflictions, O Lord? O Lord, give us strength according to our faith which is in Christ, even unto deliverance. And they broke the cords with which they were bound; and when the people saw this, they began to flee, for the fear of destruction had come upon them.',
    context: 'On Page 215 of the Book of Mormon: Alma and Amulek are miraculously delivered from the prison in Ammonihah as the walls fall.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/14?lang=eng&id=p26#p26'
  },
  {
    id: 'ot-gen-2-15',
    volumeId: 'ot',
    bookName: 'Genesis',
    chapter: 2,
    verse: 15,
    pageNumber: 3,
    text: 'And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it.',
    context: 'God places Adam in the Garden of Eden to care for the creation.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/gen/2?lang=eng&id=p15#p15'
  },
  {
    id: 'ot-num-33-50',
    volumeId: 'ot',
    bookName: 'Numbers',
    chapter: 33,
    verse: 50,
    pageNumber: 215,
    text: 'And the LORD spake unto Moses in the plains of Moab by Jordan near Jericho, saying, Speak unto the children of Israel, and say unto them, When ye are passed over Jordan into the land of Canaan...',
    context: 'On Page 215 of the LDS Old Testament: Moses receives instructions for entering the Promised Land.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/num/33?lang=eng&id=p50#p50'
  },
  {
    id: 'nt-matt-2-15',
    volumeId: 'nt',
    bookName: 'Matthew',
    chapter: 2,
    verse: 15,
    pageNumber: 1189,
    text: 'And was there until the death of Herod: that it might be fulfilled which was spoken of the Lord by the prophet, saying, Out of Egypt have I called my son.',
    context: 'Joseph and Mary flee to Egypt with the infant Jesus to escape King Herod.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/nt/matt/2?lang=eng&id=p15#p15'
  },
  {
    id: 'pgp-moses-2-15',
    volumeId: 'pgp',
    bookName: 'Moses',
    chapter: 2,
    verse: 15,
    pageNumber: 5,
    text: 'And I, God, set them in the firmament of the heaven to give light upon the earth.',
    context: 'The Creation of the sun, moon, and stars during the fourth period.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/2?lang=eng&id=p15#p15'
  },
  {
    id: 'dc-107-76',
    volumeId: 'dc',
    bookName: 'Doctrine & Covenants',
    chapter: 107,
    verse: 76,
    pageNumber: 215,
    text: 'But a bishop must be chosen from the High Priesthood, unless he is a literal descendant of Aaron...',
    context: 'On Page 215 of the Doctrine and Covenants: Section 107 on Priesthood Organization.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/107?lang=eng&id=p76#p76'
  },

  // --- TIME 2:25 / 225 ---
  {
    id: 'bom-2ne-2-25',
    volumeId: 'bom',
    bookName: '2 Nephi',
    chapter: 2,
    verse: 25,
    pageNumber: 60,
    text: 'Adam fell that men might be; and men are, that they might have joy.',
    context: 'Lehi teaches the fundamental purpose of human existence and the Fall of Adam.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/2?lang=eng&id=p25#p25'
  },
  {
    id: 'bom-alma-15-18',
    volumeId: 'bom',
    bookName: 'Alma',
    chapter: 15,
    verse: 18,
    pageNumber: 225,
    text: 'Now as I said, Alma having seen all these things, therefore he took Amulek and came over to the land of Zarahemla, and took him to his own house, and did administer unto him in his tribulations, and strengthened him in the Lord.',
    context: 'On Page 225 of the Book of Mormon: Alma ministers to Amulek in Zarahemla.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/15?lang=eng&id=p18#p18'
  },

  // --- TIME 3:16 / 316 ---
  {
    id: 'nt-john-3-16',
    volumeId: 'nt',
    bookName: 'John',
    chapter: 3,
    verse: 16,
    pageNumber: 1349,
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    context: 'Jesus teaches Nicodemus about the Father’s love and the Atonement.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/nt/john/3?lang=eng&id=p16#p16'
  },
  {
    id: 'bom-2ne-31-16',
    volumeId: 'bom',
    bookName: '2 Nephi',
    chapter: 31,
    verse: 16,
    pageNumber: 114,
    text: 'And now, my beloved brethren, I know by this that unless a man shall endure to the end, in following the example of the Son of the living God, he cannot be saved.',
    context: 'Nephi explains the Doctrine of Christ and baptism by water and the Holy Ghost.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/31?lang=eng&id=p16#p16'
  },
  {
    id: 'bom-alma-22-16',
    volumeId: 'bom',
    bookName: 'Alma',
    chapter: 22,
    verse: 16,
    pageNumber: 240,
    text: 'And Aaron said unto him: If thou desirest this thing, if thou wilt bow down before God, yea, if thou wilt repent of all thy sins, and will bow down before God, and call on his name in faith, believing that ye shall receive, then shalt thou receive the hope which thou desirest.',
    context: 'Aaron teaches the King of the Lamanites how to pray and receive eternal life.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/22?lang=eng&id=p16#p16'
  },

  // --- TIME 10:42 / 1042 ---
  {
    id: 'bom-alma-10-42',
    volumeId: 'bom',
    bookName: 'Alma',
    chapter: 10,
    verse: 42,
    pageNumber: 206,
    text: 'Now Amulek said these words, and the words were written unto the end that they might remain. And he began again to speak unto them.',
    context: 'Amulek testifies of the Resurrection and the Judgment seat of Christ before Zeezrom and the lawyers in Ammonihah.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/10?lang=eng&id=p42#p42'
  },
  {
    id: 'ot-isaiah-42-10',
    volumeId: 'ot',
    bookName: 'Isaiah',
    chapter: 42,
    verse: 10,
    pageNumber: 978,
    text: 'Sing unto the LORD a new song, and his praise from the end of the earth, ye that go down to the sea, and all that is therein; the isles, and the inhabitants thereof.',
    context: 'Isaiah prophesies of the glorious song of redemption across the earth.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/isa/42?lang=eng&id=p10#p10'
  },

  // --- TIME 12:27 / 1227 ---
  {
    id: 'bom-ether-12-27',
    volumeId: 'bom',
    bookName: 'Ether',
    chapter: 12,
    verse: 27,
    pageNumber: 512,
    text: 'And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them.',
    context: 'The Lord speaks to Moroni regarding faith, grace, and human weakness.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/12?lang=eng&id=p27#p27'
  },

  // --- TIME 7:14 / 714 ---
  {
    id: 'ot-isa-7-14',
    volumeId: 'ot',
    bookName: 'Isaiah',
    chapter: 7,
    verse: 14,
    pageNumber: 940,
    text: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
    context: 'Isaiah’s famous messianic prophecy of the virgin birth of Immanuel.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/isa/7?lang=eng&id=p14#p14'
  },
  {
    id: 'bom-2ne-17-14',
    volumeId: 'bom',
    bookName: '2 Nephi',
    chapter: 17,
    verse: 14,
    pageNumber: 85,
    text: 'Therefore, the Lord himself shall give you a sign—Behold, a virgin shall conceive, and shall bear a son, and shall call his name Immanuel.',
    context: 'Nephi quotes Isaiah 7:14 on the small plates of Nephi.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/17?lang=eng&id=p14#p14'
  },

  // --- TIME 18:29 / 6:29 ---
  {
    id: 'bom-3ne-18-29',
    volumeId: 'bom',
    bookName: '3 Nephi',
    chapter: 18,
    verse: 29,
    pageNumber: 442,
    text: 'For whoso eateth and drinketh my flesh and blood unworthily eateth and drinketh damnation to his soul; therefore if ye know that a man is unworthy to eat and drink of my flesh and blood ye shall forbid him.',
    context: 'Jesus instructs the twelve Nephite disciples concerning the administration of the sacrament.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/18?lang=eng&id=p29#p29'
  },
  {
    id: 'dc-18-10',
    volumeId: 'dc',
    bookName: 'Doctrine & Covenants',
    chapter: 18,
    verse: 10,
    pageNumber: 31,
    text: 'Remember the worth of souls is great in the sight of God.',
    context: 'Revelation given through Joseph Smith to Oliver Cowdery and David Whitmer regarding the calling of the Twelve.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/18?lang=eng&id=p10#p10'
  },

  // --- TIME 1:39 / 139 ---
  {
    id: 'pgp-moses-1-39',
    volumeId: 'pgp',
    bookName: 'Moses',
    chapter: 1,
    verse: 39,
    pageNumber: 4,
    text: 'For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man.',
    context: 'God reveals his eternal purpose to Moses upon an exceedingly high mountain.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/1?lang=eng&id=p39#p39'
  },

  // --- TIME 4:2 / 402 ---
  {
    id: 'dc-4-2',
    volumeId: 'dc',
    bookName: 'Doctrine & Covenants',
    chapter: 4,
    verse: 2,
    pageNumber: 7,
    text: 'Therefore, O ye that embark in the service of God, see that ye serve him with all your heart, might, mind and strength, that ye may stand blameless before God at the last day.',
    context: 'Revelation to Joseph Smith Sr. concerning missionary work and the field white already to harvest.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/4?lang=eng&id=p2#p2'
  },

  // --- TIME 21:5 / 215 ---
  {
    id: 'bom-3ne-21-5',
    volumeId: 'bom',
    bookName: '3 Nephi',
    chapter: 21,
    verse: 5,
    pageNumber: 449,
    text: 'And when these things come to pass that thy seed shall begin to know these things—it shall be a sign unto them, that they may know that the work of the Father hath already commenced unto the fulfilling of the covenant which he hath made unto the people who are of the house of Israel.',
    context: 'Jesus prophesies of the coming forth of the Book of Mormon as a sign of the gathering of Israel.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/21?lang=eng&id=p5#p5'
  },
  {
    id: 'nt-rev-21-5',
    volumeId: 'nt',
    bookName: 'Revelation',
    chapter: 21,
    verse: 5,
    pageNumber: 1648,
    text: 'And he that sat upon the throne said, Behold, I make all things new. And he said unto me, Write: for these words are true and faithful.',
    context: 'John beholds the New Jerusalem and the Voice from the throne renewing creation.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/nt/rev/21?lang=eng&id=p5#p5'
  },
  {
    id: 'dc-21-5',
    volumeId: 'dc',
    bookName: 'Doctrine & Covenants',
    chapter: 21,
    verse: 5,
    pageNumber: 42,
    text: 'For his word ye shall receive, as if from mine own mouth, in all patience and faith.',
    context: 'Given at the organization of the Church, April 6, 1830. The Saints are commanded to heed the words of the Prophet Joseph Smith.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/21?lang=eng&id=p5#p5'
  }
];
