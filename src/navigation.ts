export type ContentSectionId = 'about' | 'sax' | 'performances' | 'academy' | 'blog' | 'contact';
export type SiteSectionId = 'hero' | ContentSectionId;

/* A full-page detail view (artist bio, course, tour, workshop, video, post)
   reachable by clicking an item. Routed through the URL hash. */
export type DetailKind = 'post' | 'course' | 'tour' | 'workshop' | 'media' | 'artist' | 'booking' | 'gallery';
export interface DetailRoute {
  kind: DetailKind;
  id: string;
}
export type OpenDetail = (kind: DetailKind, id: string) => void;

/* URL-hash segments for detail views, in Vietnamese without diacritics.
   Single source of truth shared by the router (App) and links (sections). */
export const KIND_TO_SEGMENT: Record<DetailKind, string> = {
  post: 'bai-viet',
  course: 'khoa-hoc',
  tour: 'luu-dien',
  workshop: 'su-kien',
  media: 'video',
  artist: 'nghe-si',
  booking: 'dat-lich',
  gallery: 'thu-vien-anh',
};

export const SEGMENT_TO_KIND: Record<string, DetailKind> = {
  'bai-viet': 'post',
  'khoa-hoc': 'course',
  'luu-dien': 'tour',
  'su-kien': 'workshop',
  video: 'media',
  'nghe-si': 'artist',
  'dat-lich': 'booking',
  'thu-vien-anh': 'gallery',
};

/* Detail kinds reached as a standalone action (no item id in the URL). */
export const ID_LESS_DETAIL_KINDS: DetailKind[] = ['artist', 'booking', 'gallery'];

export interface ContentTab {
  id: ContentSectionId;
  label: string;
  eyebrow: string;
}

export const contentTabs: ContentTab[] = [
  { id: 'about', label: 'Giới thiệu', eyebrow: 'Nghệ sĩ' },
  { id: 'performances', label: 'Biểu diễn', eyebrow: 'Sân khấu' },
  { id: 'academy', label: 'Dạy học', eyebrow: 'Academy' },
  { id: 'sax', label: 'Cây kèn', eyebrow: 'Nhạc cụ' },
  { id: 'blog', label: 'Blog', eyebrow: 'Ghi chép' },
  { id: 'contact', label: 'Liên hệ', eyebrow: 'Tư vấn' },
];
