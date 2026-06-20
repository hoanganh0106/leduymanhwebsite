export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  /* Optional rich fields used by the course detail page. Safe to omit — the
     page renders only the blocks it has data for. */
  level?: string;
  forWho?: string;
  highlights?: string[];
  curriculum?: { label: string; detail: string }[];
  outcomes?: string[];
}

export interface Workshop {
  id?: string;
  date: string;
  year: string;
  title: string;
  location: string;
  status: string;
  price: string;
  /* Optional rich fields for the workshop detail page. */
  image?: string;
  description?: string;
  agenda?: string[];
  seats?: string;
}

export interface Tour {
  id?: string;
  month: string;
  year: string;
  title: string;
  location: string;
  role: string;
  tag: string;
  /* Optional rich fields for the tour detail page. */
  image?: string;
  description?: string;
  setlist?: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  /* Optional context shown on the video detail page. */
  description?: string;
}

export interface ArtistProfile {
  name: string;
  role: string;
  tagline: string;
  portrait: string;
  bio: string[];
  facts: { label: string; value: string }[];
  milestones: { year: string; title: string; detail: string }[];
  repertoire: string[];
}

export interface BlogPost {
  id?: string;
  slug?: string;
  title: string;
  desc?: string;
  excerpt?: string;
  content?: string;
  image: string;
  date: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  course: string;
  note: string;
}

export const defaultHeroImage =
  'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=1100';

export const defaultAboutImage =
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1000';

export interface SiteImages {
  hero_image: string;
  about_image: string;
}

export const heroParticles = [
  { size: 3, left: 8, opacity: 0.28, duration: 16, delay: 0 },
  { size: 2, left: 17, opacity: 0.36, duration: 19, delay: 3 },
  { size: 4, left: 28, opacity: 0.3, duration: 22, delay: 6 },
  { size: 2, left: 41, opacity: 0.24, duration: 17, delay: 2 },
  { size: 5, left: 53, opacity: 0.32, duration: 24, delay: 7 },
  { size: 3, left: 64, opacity: 0.28, duration: 18, delay: 4 },
  { size: 2, left: 76, opacity: 0.34, duration: 21, delay: 1 },
  { size: 4, left: 88, opacity: 0.26, duration: 20, delay: 5 },
];

export const courses: Course[] = [
  {
    id: 'beginner',
    title: 'BEGINNER',
    subtitle: 'Nền tảng vàng cho người mới bắt đầu',
    description:
      'Lộ trình từ con số 0. Học viên được hướng dẫn chi tiết cách lấy hơi bụng, điều chỉnh khẩu hình, làm quen với phím bấm và diễn tấu các tác phẩm nhạc trữ tình, pop ballad cơ bản sau 12 buổi.',
    duration: '3 tháng (24 buổi)',
    price: 'Liên hệ tư vấn',
    image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=1000',
    level: 'Cơ bản · chưa cần biết nhạc lý',
    forWho: 'Người lần đầu cầm kèn, muốn chơi được những bản ballad yêu thích một cách bài bản.',
    highlights: [
      'Lớp nhỏ, kèm sát từng hơi thở và khẩu hình',
      'Giáo trình bản quyền biên soạn riêng theo từng buổi',
      'Mượn kèn tập trong buổi học nếu chưa sở hữu nhạc cụ',
    ],
    curriculum: [
      { label: 'Buổi 1–6', detail: 'Hơi thở bụng, khẩu hình, tư thế và cách tạo âm ổn định trên từng nốt.' },
      { label: 'Buổi 7–14', detail: 'Đọc nốt, gam trưởng cơ bản, luyện ngón và cảm nhịp với máy đập.' },
      { label: 'Buổi 15–24', detail: 'Diễn tấu hoàn chỉnh 2–3 bản ballad/pop và một buổi thu âm kỷ niệm.' },
    ],
    outcomes: [
      'Chơi trọn vẹn 2–3 ca khúc trữ tình quen thuộc',
      'Lấy hơi sâu, giữ tiếng kèn không bị bí hay rè',
      'Tự luyện tập đúng phương pháp tại nhà',
    ],
  },
  {
    id: 'intermediate',
    title: 'INTERMEDIATE',
    subtitle: 'Làm chủ tone nhạc & kỹ thuật ngón nâng cao',
    description:
      'Khóa học giúp tinh luyện luồng hơi, sửa tone mỏng/khàn, học kỹ thuật láy, rung nghệ thuật (vibrato), và kỹ thuật luyến âm mượt mà. Đặc biệt rèn luyện tư duy xử lý giai điệu đậm chất Jazz/Soul.',
    duration: '4 tháng (32 buổi)',
    price: 'Liên hệ tư vấn',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    level: 'Trung cấp · đã chơi được bản hoàn chỉnh',
    forWho: 'Người đã qua nền tảng, muốn tiếng kèn dày, có màu và biết tự xử lý giai điệu.',
    highlights: [
      'Tập trung sửa tone: từ mỏng/khàn sang ấm, dày và bay',
      'Vibrato, bend, growl và các kỹ thuật biểu cảm',
      'Tư duy ngẫu hứng nền tảng trên vòng hoà thanh Jazz/Soul',
    ],
    curriculum: [
      { label: 'Tháng 1', detail: 'Tinh chỉnh luồng hơi và điểm tựa âm thanh, chuẩn hoá intonation.' },
      { label: 'Tháng 2', detail: 'Vibrato nghệ thuật, luyến âm, các thế ngón nhanh và sạch.' },
      { label: 'Tháng 3', detail: 'Phân tích câu nhạc Jazz/Soul, phrasing và cách "kể chuyện" bằng giai điệu.' },
      { label: 'Tháng 4', detail: 'Dàn dựng tiết mục cá nhân và biểu diễn trước nhóm.' },
    ],
    outcomes: [
      'Tiếng kèn dày, ấm và đồng đều ở mọi quãng',
      'Xử lý phrasing có chiều sâu, giàu cảm xúc',
      'Bước đầu ngẫu hứng trên các vòng hoà thanh quen thuộc',
    ],
  },
  {
    id: 'private',
    title: 'PRIVATE 1:1',
    subtitle: 'Đặc quyền đào tạo cá nhân hóa',
    description:
      'Lộ trình tối thượng thiết kế riêng theo dòng nhạc yêu thích (Jazz, Pop, Chamber) và trình độ của học viên. Thời gian linh hoạt, giảng viên trực tiếp sửa từng lỗi nhỏ và định hướng biểu diễn chuyên nghiệp.',
    duration: 'Linh hoạt',
    price: 'Đăng ký nhận báo giá',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1000',
    level: 'Mọi trình độ · thiết kế riêng',
    forWho: 'Người muốn lộ trình may đo theo mục tiêu riêng và thời gian linh hoạt.',
    highlights: [
      'Giáo án cá nhân hoá theo dòng nhạc và mục tiêu của bạn',
      'Nghệ sĩ Lê Duy Mạnh trực tiếp đứng lớp và chỉnh từng lỗi nhỏ',
      'Định hướng biểu diễn, thu âm và xây dựng tiết mục cá nhân',
    ],
    curriculum: [
      { label: 'Khảo sát', detail: 'Đánh giá trình độ, gu âm nhạc và đặt mục tiêu rõ ràng theo mốc thời gian.' },
      { label: 'Đồng hành', detail: 'Mỗi buổi điều chỉnh theo tiến độ thực tế, tài liệu riêng cho từng tuần.' },
      { label: 'Hoàn thiện', detail: 'Dàn dựng tiết mục đỉnh cao và buổi biểu diễn/thu âm tốt nghiệp.' },
    ],
    outcomes: [
      'Lộ trình bám sát đúng mục tiêu cá nhân',
      'Phong thái biểu diễn chuyên nghiệp, tự tin trên sân khấu',
      'Một tiết mục hoàn chỉnh được dàn dựng cùng nghệ sĩ',
    ],
  },
];

export const workshops: Workshop[] = [
  {
    id: 'ws-beginner',
    date: '20 JUN',
    year: '2026',
    title: 'Workshop Saxophone Cho Người Mới Bắt Đầu',
    location: 'Heritage Space, Hà Nội',
    status: 'Đăng ký',
    price: 'Miễn phí',
    seats: 'Giới hạn 20 chỗ',
    image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=1200',
    description:
      'Buổi trải nghiệm 90 phút dành cho người chưa từng cầm kèn: bạn sẽ tự tạo ra âm thanh đầu tiên của mình trên cây saxophone và hiểu một lộ trình học bài bản trông như thế nào.',
    agenda: [
      'Làm quen cấu tạo kèn, lắp dăm và tư thế cầm đúng',
      'Bài tập hơi thở bụng và tạo âm thanh đầu tiên',
      'Thử một câu giai điệu ngắn cùng nghệ sĩ',
      'Hỏi đáp & tư vấn lộ trình cá nhân',
    ],
  },
  {
    id: 'ws-tone',
    date: '05 JUL',
    year: '2026',
    title: 'Chuyên Đề Luyện Tone & Kiểm Soát Hơi Nâng Cao',
    location: 'Trực tuyến (Zoom Premium Live)',
    status: 'Đăng ký',
    price: '300.000đ',
    seats: 'Phát trực tiếp, có ghi hình xem lại',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
    description:
      'Chuyên đề chuyên sâu cho người đã chơi được, tập trung vào gốc rễ của một tiếng kèn đẹp: điểm tựa hơi, độ mở khẩu hình và cách giữ tone ổn định khi lên cao.',
    agenda: [
      'Giải phẫu một tiếng kèn "ấm và bay"',
      'Bài tập long-tone và overtone theo nhóm',
      'Sửa các lỗi tone thường gặp trực tiếp trên sóng',
      'Bộ bài tập 21 ngày mang về tự luyện',
    ],
  },
  {
    id: 'ws-acoustic',
    date: '18 JUL',
    year: '2026',
    title: 'Saxophone Acoustic Night & Talkshow',
    location: 'The Classical Lounge, Hà Nội',
    status: 'Xem chi tiết',
    price: 'Vé mời giới hạn',
    seats: 'Số lượng vé mời có hạn',
    image: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&q=80&w=1200',
    description:
      'Một đêm acoustic ấm cúng kết hợp talkshow, nơi nghệ sĩ Lê Duy Mạnh biểu diễn và chia sẻ câu chuyện đằng sau từng tác phẩm cùng khán giả yêu saxophone.',
    agenda: [
      'Mini-set acoustic mở màn',
      'Talkshow: hành trình theo đuổi saxophone',
      'Giao lưu và hỏi đáp cùng khán giả',
      'Chụp ảnh lưu niệm cùng nghệ sĩ',
    ],
  },
];

export const recentTours: Tour[] = [
  {
    id: 'tour-summer',
    month: 'Th06',
    year: '2026',
    title: 'Đêm nhạc "Hơi Thở Mùa Hạ"',
    location: 'Nhà hát Lớn Hà Nội',
    role: 'Nghệ sĩ độc tấu khách mời',
    tag: 'Concert',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    description:
      'Đêm nhạc thính phòng mở màn mùa hạ tại Nhà hát Lớn Hà Nội, nơi saxophone đối thoại cùng dàn dây trong những bản tình ca bất hủ được phối mới tinh tế.',
    setlist: ['Hạ Trắng', 'Diễm Xưa', 'My Way', 'Besame Mucho', 'Hà Nội Mùa Vắng Những Cơn Mưa'],
  },
  {
    id: 'tour-jazztrio',
    month: 'Th05',
    year: '2026',
    title: 'Lưu diễn Saxophone & Jazz Trio',
    location: 'Đà Nẵng · Hội An · Nha Trang',
    role: 'Trưởng nhóm biểu diễn',
    tag: 'Lưu diễn',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=1200',
    description:
      'Chuỗi đêm diễn ven biển cùng Jazz Trio, mang không khí phóng khoáng và ngẫu hứng đến ba thành phố biển miền Trung trong ba đêm liên tiếp.',
    setlist: ['Autumn Leaves', 'Fly Me To The Moon', 'Take Five', 'Bésame Mucho', 'Quê Hương'],
  },
  {
    id: 'tour-gala',
    month: 'Th04',
    year: '2026',
    title: 'Gala "Giai Điệu Phương Nam"',
    location: 'Nhà Văn hóa Thanh Niên, TP.HCM',
    role: 'Biểu diễn & giao lưu',
    tag: 'Gala',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1200',
    description:
      'Chương trình gala quy tụ nhiều nghệ sĩ, nơi saxophone góp một màu sắc trữ tình trong đêm nhạc tôn vinh giai điệu phương Nam đậm chất tự sự.',
    setlist: ['Dạ Cổ Hoài Lang', 'Còn Thương Rau Đắng Mọc Sau Hè', 'Lý Ngựa Ô'],
  },
  {
    id: 'tour-masterclass',
    month: 'Th03',
    year: '2026',
    title: 'Masterclass & Acoustic Session',
    location: 'Học viện Âm nhạc Quốc gia Việt Nam',
    role: 'Giảng viên khách mời',
    tag: 'Masterclass',
    image: 'https://images.unsplash.com/photo-1466428996289-fb355538da1b?auto=format&fit=crop&q=80&w=1200',
    description:
      'Buổi masterclass dành cho sinh viên nhạc viện, kết hợp phần trình diễn acoustic và chia sẻ phương pháp luyện hơi, xử lý tone và phong thái biểu diễn.',
    setlist: ['Phần giảng: Luyện hơi & tone', 'Demo: Summertime', 'Q&A cùng sinh viên'],
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: 'vid-1',
    title: 'Hạ Trắng (Trịnh Công Sơn) - Live Acoustic',
    category: 'VIDEO BIỂU DIỄN',
    duration: '05:42',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Bản acoustic ghi hình trực tiếp, nơi tiếng saxophone giữ trọn cái buông lơi và khoảng lặng đặc trưng trong âm nhạc Trịnh Công Sơn — không kỹ thuật phô diễn, chỉ có hơi thở và cảm xúc.',
  },
  {
    id: 'vid-2',
    title: 'Hướng dẫn cách lấy hơi bụng chuẩn xác nhất',
    category: 'BÀI HỌC SAXOPHONE',
    duration: '12:15',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Bài học nền tảng phân tích cơ chế hơi thở bụng kèm bài tập thực hành, giúp bạn giữ luồng hơi sâu và ổn định — gốc rễ của một tiếng kèn không bị bí hay rè.',
  },
  {
    id: 'vid-3',
    title: 'Behind the Scenes: Đêm nhạc Mùa Thu Hà Nội',
    category: 'YOUTUBE VLOG',
    duration: '08:30',
    thumbnail: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Theo chân nghệ sĩ trong hậu trường một đêm diễn mùa thu: từ buổi tổng duyệt, chỉnh âm cho tới những phút giây trước khi ánh đèn sân khấu bật sáng.',
  },
  {
    id: 'vid-4',
    title: 'Luyện chạy ngón Pentatonic siêu tốc mỗi ngày',
    category: 'SHORT CLIPS',
    duration: '01:00',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description:
      'Một bài tập ngắn mỗi ngày giúp ngón tay linh hoạt và sạch trên thang âm pentatonic — nền tảng để ngẫu hứng mượt mà hơn.',
  },
];

export const artistProfile: ArtistProfile = {
  name: 'Lê Duy Mạnh',
  role: 'Saxophone Soloist & Educator',
  tagline: 'Hơi thở sang trọng của Saxophone đương đại',
  portrait: defaultAboutImage,
  bio: [
    'Lê Duy Mạnh là nghệ sĩ saxophone theo đuổi phong cách biểu diễn giàu cảm xúc, lịch thiệp và gần gũi. Với anh, âm sắc saxophone đẹp không đến từ kỹ thuật phô diễn, mà từ cách người nghệ sĩ kiểm soát hơi thở, khoảng lặng và cảm xúc.',
    'Trên sân khấu, anh tập trung vào màu âm mượt, câu nhạc có chiều sâu và sự giao tiếp tự nhiên với khán giả. Hơn một thập kỷ biểu diễn đã đưa anh qua nhiều sân khấu thính phòng, gala và những đêm acoustic ấm cúng khắp ba miền.',
    'Song song với biểu diễn, Lê Duy Mạnh dành tâm huyết cho đào tạo. Mỗi học viên được dẫn dắt bằng nền tảng hơi thở, tone, nhạc cảm và phong thái biểu diễn — để không chỉ chơi đúng, mà còn chơi có chuyện để kể.',
  ],
  facts: [
    { label: 'Năm sân khấu', value: '12+' },
    { label: 'Đêm diễn', value: '80+' },
    { label: 'Học viên', value: '300+' },
    { label: 'Dòng nhạc', value: 'Jazz · Pop · Thính phòng' },
  ],
  milestones: [
    { year: '2014', title: 'Khởi đầu chuyên nghiệp', detail: 'Bắt đầu biểu diễn thường xuyên tại các phòng trà và sự kiện thính phòng tại Hà Nội.' },
    { year: '2018', title: 'Lưu diễn & Jazz Trio', detail: 'Thành lập nhóm biểu diễn, mở rộng lưu diễn tới nhiều thành phố trên cả nước.' },
    { year: '2021', title: 'Thành lập Academy', detail: 'Xây dựng lộ trình đào tạo bài bản với giáo trình biên soạn riêng cho từng cấp độ.' },
    { year: '2026', title: 'Đêm nhạc cá nhân', detail: 'Trình diễn loạt chương trình riêng kết hợp biểu diễn và chia sẻ câu chuyện âm nhạc.' },
  ],
  repertoire: ['Hạ Trắng', 'Diễm Xưa', 'Autumn Leaves', 'Fly Me To The Moon', 'My Way', 'Besame Mucho'],
};

export const blogPosts: BlogPost[] = [
  {
    title: 'Người mới học saxophone nên bắt đầu từ dòng kèn nào?',
    desc: 'Giúp bạn so sánh chi tiết Alto, Tenor và Soprano để chọn ra cây kèn phù hợp nhất với thể trạng và sở thích cá nhân.',
    image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=500',
    date: '10 Tháng 5, 2026',
  },
  {
    title: '5 lỗi kinh điển khi luyện hơi khiến tiếng kèn bị bí',
    desc: 'Phân tích thói quen ghì chặt môi, gồng ngực và cách khắc phục tự nhiên để luồng hơi đi mượt mà sâu lắng.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500',
    date: '28 Tháng 4, 2026',
  },
  {
    title: 'Bí mật đằng sau tiếng kèn ấm, xốp và mộc mạc',
    desc: 'Làm thế nào để tạo chất giọng kèn giàu cảm xúc (subtone) như các huyền thoại nhạc Jazz thế giới?',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=500',
    date: '15 Tháng 4, 2026',
  },
  {
    title: 'Lựa chọn dăm kèn (reed) bao nhiêu độ là tối ưu?',
    desc: 'Dành cho người tập sự lẫn bán chuyên: Phân biệt dăm cứng, dăm mềm và cách mài dăm kèn tại nhà.',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=500',
    date: '02 Tháng 4, 2026',
  },
];
