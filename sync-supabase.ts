import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newTours = [
  {
    month: '2022',
    year: '',
    title: 'Đĩa than "Cô Đơn"',
    location: 'Album Vinyl LP',
    role: 'Nghệ sĩ saxophone đầu tiên tại Việt Nam phát hành đĩa than',
    tag: 'Album',
    description:
      'Cuối năm 2022, Lê Duy Mạnh gây tiếng vang khi trở thành nghệ sĩ saxophone đầu tiên tại Việt Nam phát hành đĩa than (Vinyl LP) với album "Cô Đơn" — một tuyên ngôn cho chất âm mộc, ấm và giàu tự sự.',
  },
  {
    month: '2021',
    year: '',
    title: 'Connecting Jazz',
    location: 'Phối hợp Đại sứ quán Thụy Điển',
    role: 'Nghệ sĩ biểu diễn & tổ chức',
    tag: 'Đối ngoại',
    description:
      'Chương trình giao lưu âm nhạc đối ngoại do anh tổ chức phối hợp cùng Đại sứ quán Thụy Điển, nối nhịp Jazz giữa hai nền văn hóa và để lại dấu ấn đậm nét.',
  },
  {
    month: '2017',
    year: '',
    title: 'Album đầu tay "Em"',
    location: 'CD phòng thu',
    role: 'Nghệ sĩ độc tấu & hòa âm',
    tag: 'Album',
    description:
      'CD đầu tay gồm 9 tình khúc nhạc xưa được phối theo phong cách Jazz, ghi dấu một màu saxophone trữ tình rất riêng của Lê Duy Mạnh.',
    setlist: ['Mắt Biếc', 'Riêng Một Góc Trời', 'Chiều Nay Không Có Em'],
  },
  {
    month: '2007',
    year: '',
    title: 'Lưu diễn cùng Dàn nhạc trẻ Đông Nam Á (SAYOWE)',
    location: 'Thái Lan',
    role: 'Thành viên biểu diễn',
    tag: 'Quốc tế',
    description:
      'Tham gia Dàn nhạc trẻ Đông Nam Á (SAYOWE) và biểu diễn tại Thái Lan — dấu ấn quốc tế đầu tiên trên hành trình khí nhạc của anh.',
  },
];

const newWorkshops = [
  {
    date: 'Offline',
    year: '90 phút',
    title: 'Workshop Saxophone Cho Người Mới Bắt Đầu',
    location: 'Hà Nội',
    status: 'Nhận đăng ký',
    price: 'Miễn phí',
    seats: 'Số chỗ giới hạn mỗi buổi',
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
    date: 'Online',
    year: 'Ghi hình lại',
    title: 'Chuyên Đề Luyện Tone & Kiểm Soát Hơi Nâng Cao',
    location: 'Trực tuyến (Zoom Premium Live)',
    status: 'Nhận đăng ký',
    price: '300.000đ',
    seats: 'Phát trực tiếp, có ghi hình xem lại',
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
    date: 'Live',
    year: 'Sự kiện',
    title: 'Saxophone Acoustic Night & Talkshow',
    location: 'Hà Nội',
    status: 'Xem chi tiết',
    price: 'Vé mời giới hạn',
    seats: 'Số lượng vé mời có hạn',
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

async function sync() {
  try {
    console.log('🔄 Syncing tours and workshops to Supabase...\n');

    // Delete existing tours
    console.log('📍 Deleting old tours...');
    const { error: deleteToursError } = await supabase.from('tours').delete().neq('month', '');
    if (deleteToursError) {
      console.error('❌ Error deleting tours:', deleteToursError);
      process.exit(1);
    }
    console.log('✅ Old tours deleted\n');

    // Delete existing workshops
    console.log('📍 Deleting old workshops...');
    const { error: deleteWorkshopsError } = await supabase.from('workshops').delete().neq('date', '');
    if (deleteWorkshopsError) {
      console.error('❌ Error deleting workshops:', deleteWorkshopsError);
      process.exit(1);
    }
    console.log('✅ Old workshops deleted\n');

    // Insert new tours
    console.log('📍 Inserting new tours...');
    const { error: insertToursError } = await supabase.from('tours').insert(
      newTours.map((tour, idx) => ({
        ...tour,
        sort_order: idx,
      }))
    );
    if (insertToursError) {
      console.error('❌ Error inserting tours:', insertToursError);
      process.exit(1);
    }
    console.log(`✅ ${newTours.length} tours inserted\n`);

    // Insert new workshops
    console.log('📍 Inserting new workshops...');
    const { error: insertWorkshopsError } = await supabase.from('workshops').insert(
      newWorkshops.map((workshop, idx) => ({
        ...workshop,
        sort_order: idx,
      }))
    );
    if (insertWorkshopsError) {
      console.error('❌ Error inserting workshops:', insertWorkshopsError);
      process.exit(1);
    }
    console.log(`✅ ${newWorkshops.length} workshops inserted\n`);

    console.log('✨ Sync complete! Refresh your browser to see changes.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

sync();
