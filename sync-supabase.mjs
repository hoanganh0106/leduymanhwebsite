import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach((line) => {
  const [key, ...valueParts] = line.split('=');
  if (key && key.trim()) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

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
    sort_order: 1,
  },
  {
    month: '2021',
    year: '',
    title: 'Connecting Jazz',
    location: 'Phối hợp Đại sứ quán Thụy Điển',
    role: 'Nghệ sĩ biểu diễn & tổ chức',
    tag: 'Đối ngoại',
    sort_order: 2,
  },
  {
    month: '2017',
    year: '',
    title: 'Album đầu tay "Em"',
    location: 'CD phòng thu',
    role: 'Nghệ sĩ độc tấu & hòa âm',
    tag: 'Album',
    sort_order: 3,
  },
  {
    month: '2007',
    year: '',
    title: 'Lưu diễn cùng Dàn nhạc trẻ Đông Nam Á (SAYOWE)',
    location: 'Thái Lan',
    role: 'Thành viên biểu diễn',
    tag: 'Quốc tế',
    sort_order: 4,
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
    sort_order: 1,
  },
  {
    date: 'Online',
    year: 'Ghi hình lại',
    title: 'Chuyên Đề Luyện Tone & Kiểm Soát Hơi Nâng Cao',
    location: 'Trực tuyến (Zoom Premium Live)',
    status: 'Nhận đăng ký',
    price: '300.000đ',
    sort_order: 2,
  },
  {
    date: 'Live',
    year: 'Sự kiện',
    title: 'Saxophone Acoustic Night & Talkshow',
    location: 'Hà Nội',
    status: 'Xem chi tiết',
    price: 'Vé mời giới hạn',
    sort_order: 3,
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
    const { error: insertToursError } = await supabase.from('tours').insert(newTours);
    if (insertToursError) {
      console.error('❌ Error inserting tours:', insertToursError);
      process.exit(1);
    }
    console.log(`✅ ${newTours.length} tours inserted\n`);

    // Insert new workshops
    console.log('📍 Inserting new workshops...');
    const { error: insertWorkshopsError } = await supabase.from('workshops').insert(newWorkshops);
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
