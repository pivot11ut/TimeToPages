import { OFFICIAL_BOOKS, OFFICIAL_PAGES } from './officialScripturePages';

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
    totalPages: 295,
    totalChapters: 138,
    description: 'Revelations given to Joseph Smith the Prophet and his successors.'
  },
  pgp: {
    id: 'pgp',
    name: 'Pearl of Great Price',
    shortName: 'PGP',
    colorBadgeClass: 'badge-pgp',
    totalPages: 61,
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

// Authoritative LDS print page index mapping scraped from churchofjesuschrist.org
export const BOOK_PAGE_MAP: BookMetadata[] = OFFICIAL_BOOKS;

export { OFFICIAL_BOOKS, OFFICIAL_PAGES };

// Rich curated dataset of key verses for time and page matches
export const CURATED_VERSES: ScriptureVerse[] = [
  // --- TIME 9:42 / 942 (Jeremiah 1:1 on LDS OT Page 942) ---
  {
    id: 'ot-jer-1-1',
    volumeId: 'ot',
    bookName: 'Jeremiah',
    chapter: 1,
    verse: 1,
    pageNumber: 942,
    text: 'The words of Jeremiah the son of Hilkiah, of the priests that were in Anathoth in the land of Benjamin:',
    context: 'On Page 942 of the LDS Old Testament (Time 9:42): Jeremiah is called as a prophet to declare the word of the Lord.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/jer/1?lang=eng&id=p1#p1'
  },

  // --- TIME 9:46 / 946 (Jeremiah 3:13 on LDS OT Page 946) ---
  {
    id: 'ot-jer-3-13',
    volumeId: 'ot',
    bookName: 'Jeremiah',
    chapter: 3,
    verse: 13,
    pageNumber: 946,
    text: 'Only acknowledge thine iniquity, that thou hast transgressed against the Lord thy God, and hast scattered thy ways to the strangers under every green tree, and ye have not obeyed my voice, saith the Lord.',
    context: 'On Page 946 of the LDS Old Testament (Time 9:46): The Lord invites backsliding Israel to repent and return unto Him.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/jer/3?lang=eng&id=p13#p13'
  },

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
    pageNumber: 58,
    text: 'And now, my sons, I speak unto you these things for your profit and learning; for there is a God, and he hath created all things, both the heavens and the earth, and all things that in them are, both things to act and things to be acted upon.',
    context: 'Lehi teaches Jacob about agency, creation, and the necessity of opposition in all things.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/2?lang=eng&id=p15#p15'
  },
  {
    id: 'bom-alma-3-20',
    volumeId: 'bom',
    bookName: 'Alma',
    chapter: 3,
    verse: 20,
    pageNumber: 215,
    text: 'Now it came to pass that not many days after the battle which was fought in the land of Zarahemla, by the Lamanites and the Amlicites, that there was another army of the Lamanites came in upon the people of Nephi, in the same place where the first army met the Amlicites.',
    context: 'On Page 215 of the Book of Mormon: The Nephites defend their families and liberty in Zarahemla.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/3?lang=eng&id=p20#p20'
  },
  {
    id: 'ot-gen-2-15',
    volumeId: 'ot',
    bookName: 'Genesis',
    chapter: 2,
    verse: 15,
    pageNumber: 4,
    text: 'And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it.',
    context: 'God places Adam in the Garden of Eden to care for the creation.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/gen/2?lang=eng&id=p15#p15'
  },
  {
    id: 'ot-num-14-7',
    volumeId: 'ot',
    bookName: 'Numbers',
    chapter: 14,
    verse: 7,
    pageNumber: 215,
    text: 'And they spake unto all the company of the children of Israel, saying, The land, which we passed through to search it, is an exceeding good land.',
    context: 'On Page 215 of the LDS Old Testament: Joshua and Caleb declare that the Promised Land is exceeding good.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/ot/num/14?lang=eng&id=p7#p7'
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
    pageNumber: 6,
    text: 'And I, God, set them in the firmament of the heaven to give light upon the earth.',
    context: 'The Creation of the sun, moon, and stars during the fourth period.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/2?lang=eng&id=p15#p15'
  },
  {
    id: 'dc-106-6',
    volumeId: 'dc',
    bookName: 'Doctrine & Covenants',
    chapter: 106,
    verse: 6,
    pageNumber: 215,
    text: 'And again, verily I say unto you, there was joy in heaven when my servant Warren bowed to my scepter, and separated himself from the crafts of men;',
    context: 'On Page 215 of the Doctrine and Covenants: Section 106 revelation given through Joseph Smith to Warren A. Cowdery.',
    gospelLibraryUrl: 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/106?lang=eng&id=p6#p6'
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

  // --- TIME 3:16 / 316 ---
  {
    id: 'nt-john-3-16',
    volumeId: 'nt',
    bookName: 'John',
    chapter: 3,
    verse: 16,
    pageNumber: 1329,
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
    pageNumber: 870,
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
    pageNumber: 1588,
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
