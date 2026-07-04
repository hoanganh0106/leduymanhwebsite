-- =====================================================================
--  Lê Duy Mạnh Saxophone — Supabase setup
--  Chạy toàn bộ file này trong: Supabase Dashboard → SQL Editor → Run
--  Tạo các bảng nội dung (tours / milestones / workshops / courses /
--  posts / media / settings / leads), bật phân quyền, và nạp dữ liệu
--  mẫu trùng với nội dung mặc định của trang web.
-- =====================================================================

-- ---------- BẢNG ----------
create table if not exists public.tours (
  id          uuid primary key default gen_random_uuid(),
  month       text not null default '',
  year        text not null default '',
  tag         text not null default '',
  title       text not null default '',
  location    text not null default '',
  role        text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  year        text not null default '',
  title       text not null default '',
  detail      text not null default '',
  images      text[] not null default '{}',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.workshops (
  id          uuid primary key default gen_random_uuid(),
  date        text not null default '',
  year        text not null default '',
  title       text not null default '',
  location    text not null default '',
  price       text not null default '',
  status      text not null default 'Đăng ký',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  subtitle    text not null default '',
  description text not null default '',
  duration    text not null default '',
  price       text not null default '',
  image       text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null default '',
  title       text not null default '',
  excerpt     text not null default '',
  content     text not null default '',
  image       text not null default '',
  date        text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  category    text not null default '',
  duration    text not null default '',
  thumbnail   text not null default '',
  video_url   text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  caption     text not null default '',
  image       text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.settings (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null default 'contact' check (kind in ('contact', 'workshop')),
  name        text not null default '',
  phone       text not null default '',
  course      text not null default '',
  note        text not null default '',
  status      text not null default 'new' check (status in ('new', 'done')),
  created_at  timestamptz not null default now()
);

alter table public.milestones add column if not exists images text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'milestones' and column_name = 'image'
  ) then
    update public.milestones
      set images = array[image]
      where image <> '' and coalesce(array_length(images, 1), 0) = 0;
    alter table public.milestones drop column image;
  end if;
end $$;

-- ---------- PHÂN QUYỀN (Row Level Security) ----------
alter table public.tours      enable row level security;
alter table public.milestones enable row level security;
alter table public.workshops  enable row level security;
alter table public.courses    enable row level security;
alter table public.posts      enable row level security;
alter table public.media      enable row level security;
alter table public.photos     enable row level security;
alter table public.settings   enable row level security;
alter table public.leads      enable row level security;

-- Ai cũng ĐỌC được (để hiển thị trên web)
drop policy if exists "public read tours"     on public.tours;
drop policy if exists "public read milestones" on public.milestones;
drop policy if exists "public read workshops" on public.workshops;
drop policy if exists "public read courses"   on public.courses;
drop policy if exists "public read posts"     on public.posts;
drop policy if exists "public read media"     on public.media;
drop policy if exists "public read photos"    on public.photos;
drop policy if exists "public read settings"  on public.settings;
create policy "public read tours"     on public.tours     for select using (true);
create policy "public read milestones" on public.milestones for select using (true);
create policy "public read workshops" on public.workshops for select using (true);
create policy "public read courses"   on public.courses   for select using (true);
create policy "public read posts"     on public.posts     for select using (true);
create policy "public read media"     on public.media     for select using (true);
create policy "public read photos"    on public.photos    for select using (true);
create policy "public read settings"  on public.settings  for select using (true);

-- Chỉ tài khoản ĐÃ ĐĂNG NHẬP mới được thêm/sửa/xóa
drop policy if exists "auth write tours"     on public.tours;
drop policy if exists "auth write milestones" on public.milestones;
drop policy if exists "auth write workshops" on public.workshops;
drop policy if exists "auth write courses"   on public.courses;
drop policy if exists "auth write posts"     on public.posts;
drop policy if exists "auth write media"     on public.media;
drop policy if exists "auth write photos"    on public.photos;
drop policy if exists "auth write settings"  on public.settings;
create policy "auth write tours"     on public.tours     for all to authenticated using (true) with check (true);
create policy "auth write milestones" on public.milestones for all to authenticated using (true) with check (true);
create policy "auth write workshops" on public.workshops for all to authenticated using (true) with check (true);
create policy "auth write courses"   on public.courses   for all to authenticated using (true) with check (true);
create policy "auth write posts"     on public.posts     for all to authenticated using (true) with check (true);
create policy "auth write media"     on public.media     for all to authenticated using (true) with check (true);
create policy "auth write photos"    on public.photos    for all to authenticated using (true) with check (true);
create policy "auth write settings"  on public.settings  for all to authenticated using (true) with check (true);

-- Leads chá»©a dá»¯ liá»‡u cÃ¡ nhÃ¢n: khÃ¡ch chá»‰ Ä‘Æ°á»£c gá»­i, admin Ä‘Äƒng nháº­p má»›i Ä‘Æ°á»£c xem/sá»­a/xÃ³a
drop policy if exists "anon insert leads" on public.leads;
drop policy if exists "auth manage leads" on public.leads;
create policy "anon insert leads" on public.leads for insert to anon with check (true);
create policy "auth manage leads" on public.leads for all to authenticated using (true) with check (true);

-- ---------- DỮ LIỆU MẪU (chỉ nạp khi bảng đang rỗng) ----------
insert into public.tours (month, year, tag, title, location, role, sort_order)
select * from (values
  ('Th06','2026','Concert','Đêm nhạc "Hơi Thở Mùa Hạ"','Nhà hát Lớn Hà Nội','Nghệ sĩ độc tấu khách mời',1),
  ('Th05','2026','Lưu diễn','Lưu diễn Saxophone & Jazz Trio','Đà Nẵng · Hội An · Nha Trang','Trưởng nhóm biểu diễn',2),
  ('Th04','2026','Gala','Gala "Giai Điệu Phương Nam"','Nhà Văn hóa Thanh Niên, TP.HCM','Biểu diễn & giao lưu',3),
  ('Th03','2026','Masterclass','Masterclass & Acoustic Session','Học viện Âm nhạc Quốc gia Việt Nam','Giảng viên khách mời',4)
) as v(month, year, tag, title, location, role, sort_order)
where not exists (select 1 from public.tours);

insert into public.milestones (year, title, detail, sort_order)
select * from (values
  ('1999','Bước vào con đường khí nhạc','Bắt đầu học tại Nhạc viện Hà Nội với cây kèn Cor.',1),
  ('2004','Bén duyên Saxophone','Chính thức chuyển sang theo đuổi và đam mê cây kèn saxophone.',2),
  ('2015','Thạc sĩ Saxophone đầu tiên tại Việt Nam','Bảo vệ thành công luận án tốt nghiệp Thạc sĩ chuyên ngành sư phạm biểu diễn Saxophone.',3),
  ('2016','Du học Thụy Điển','Nhận học bổng toàn phần của chính phủ tại Học viện Âm nhạc Malmö (Thụy Điển), chuyên ngành Saxophone Jazz.',4),
  ('2017','Album đầu tay "Em"','Ra mắt MV "Mùa Thu Cho Em" và album đầu tay "Em" gồm 9 tình khúc nổi tiếng của các nhạc sĩ Ngô Thụy Miên, Vũ Thành An.',5),
  ('2019','MV "Hello Việt Nam"','Ra mắt MV được quay tại nhiều quốc gia châu Âu và nhiều địa điểm đẹp tại Việt Nam.',6),
  ('2023','Liveshow Trịnh Jazz','Tổ chức liveshow Trịnh Jazz tại Vườn Quốc gia Ba Vì - Hà Nội, để lại ấn tượng sâu sắc với khán giả.',7),
  ('2023','Đĩa than "Cô Đơn"','Trở thành nghệ sĩ saxophone đầu tiên tại Việt Nam phát hành đĩa than saxophone với album "Cô Đơn".',8),
  ('2024','Tuần Văn hóa Việt Nam tại Thụy Điển','Biểu diễn trong chương trình hòa nhạc hữu nghị tại Nhà hát Musikaliska Kvarteret, Stockholm.',9),
  ('2025','Hoạt động quốc tế và truyền hình','Biểu diễn tại các sự kiện ngoại giao, thực hiện chuyến lưu diễn châu Âu, tổ chức liveshow và xuất hiện trong nhiều chương trình truyền hình quan trọng.',10)
) as v(year, title, detail, sort_order)
where not exists (select 1 from public.milestones);

insert into public.workshops (date, year, title, location, price, status, sort_order)
select * from (values
  ('20 JUN','2026','Workshop Saxophone Cho Người Mới Bắt Đầu','Heritage Space, Hà Nội','Miễn phí','Đăng ký',1),
  ('05 JUL','2026','Chuyên Đề Luyện Tone & Kiểm Soát Hơi Nâng Cao','Trực tuyến (Zoom Premium Live)','300.000đ','Đăng ký',2),
  ('18 JUL','2026','Saxophone Acoustic Night & Talkshow','The Classical Lounge, Hà Nội','Vé mời giới hạn','Xem chi tiết',3)
) as v(date, year, title, location, price, status, sort_order)
where not exists (select 1 from public.workshops);

insert into public.courses (title, subtitle, description, duration, price, image, sort_order)
select * from (values
  ('BEGINNER',
   'Nền tảng vàng cho người mới bắt đầu',
   'Lộ trình từ con số 0. Học viên được hướng dẫn chi tiết cách lấy hơi bụng, điều chỉnh khẩu hình, làm quen với phím bấm và diễn tấu các tác phẩm nhạc trữ tình, pop ballad cơ bản sau 12 buổi.',
   '3 tháng (24 buổi)','Liên hệ tư vấn',
   'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=1000',1),
  ('INTERMEDIATE',
   'Làm chủ tone nhạc & kỹ thuật ngón nâng cao',
   'Khóa học giúp tinh luyện luồng hơi, sửa tone mỏng/khàn, học kỹ thuật láy, rung nghệ thuật (vibrato), và kỹ thuật luyến âm mượt mà. Đặc biệt rèn luyện tư duy xử lý giai điệu đậm chất Jazz/Soul.',
   '4 tháng (32 buổi)','Liên hệ tư vấn',
   'https://images.unsplash.com/photo-1573871664414-3916477ad9ce?auto=format&fit=crop&q=80&w=1000',2),
  ('PRIVATE 1:1',
   'Đặc quyền đào tạo cá nhân hóa',
   'Lộ trình tối thượng thiết kế riêng theo dòng nhạc yêu thích (Jazz, Pop, Chamber) và trình độ của học viên. Thời gian linh hoạt, giảng viên trực tiếp sửa từng lỗi nhỏ và định hướng biểu diễn chuyên nghiệp.',
   'Linh hoạt','Đăng ký nhận báo giá',
   'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1000',3)
) as v(title, subtitle, description, duration, price, image, sort_order)
where not exists (select 1 from public.courses);

insert into public.posts (slug, title, excerpt, content, image, date, sort_order)
select * from (values
  (
    'nguoi-moi-hoc-saxophone-nen-bat-dau-tu-dong-ken-nao',
    'Người mới học saxophone nên bắt đầu từ dòng kèn nào?',
    'Giúp bạn so sánh Alto, Tenor và Soprano để chọn cây kèn phù hợp nhất với thể trạng và sở thích cá nhân.',
    $$Alto saxophone thường là lựa chọn dễ bắt đầu nhất vì thân kèn gọn, lực hơi vừa phải và dễ kiểm soát tone trong những tháng đầu.

Tenor có âm sắc dày, ấm và rất hấp dẫn với pop ballad, jazz, nhưng yêu cầu luồng hơi ổn định hơn. Nếu bạn thích chất âm trầm và sẵn sàng kiên nhẫn, Tenor vẫn là một khởi đầu đẹp.

Soprano nhỏ gọn nhưng khó lên tone chuẩn hơn. Với hầu hết người mới, hãy bắt đầu bằng Alto hoặc Tenor, sau đó chuyển sang Soprano khi nền tảng hơi và tai nghe đã vững.$$,
    'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=500',
    '10 Tháng 5, 2026',
    1
  ),
  (
    '5-loi-kinh-dien-khi-luyen-hoi-khien-tieng-ken-bi-bi',
    '5 lỗi kinh điển khi luyện hơi khiến tiếng kèn bị bí',
    'Phân tích thói quen ghì chặt môi, gồng ngực và cách khắc phục tự nhiên để luồng hơi đi mượt mà sâu lắng.',
    $$Lỗi thường gặp nhất là lấy hơi bằng ngực, khiến vai nâng lên và cổ bị cứng. Hơi saxophone cần đi từ phần bụng và sườn, để luồng hơi ra đều thay vì bị nghẹn ở cổ.

Thói quen ghì chặt môi lên mouthpiece làm reed khó rung, tone mỏng và mệt rất nhanh. Hãy nghĩ đến việc đỡ mouthpiece bằng cườm rất vững nhưng môi vẫn linh hoạt.

Một lỗi khác là thổi quá mạnh ngay từ đầu câu. Âm đẹp thường đến từ luồng hơi ổn định, có điểm bắt đầu mềm và kết thúc gọn.$$,
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500',
    '28 Tháng 4, 2026',
    2
  ),
  (
    'bi-mat-dang-sau-tieng-ken-am-xop-va-moc-mac',
    'Bí mật đằng sau tiếng kèn ấm, xốp và mộc mạc',
    'Làm thế nào để tạo chất giọng kèn giàu cảm xúc như các huyền thoại nhạc Jazz thế giới?',
    $$Subtone không phải là thổi nhỏ đi cho yếu hơn. Đó là cách điều chỉnh luồng hơi, khẩu hình và vị trí lưỡi để reed rung mềm hơn, tạo cảm giác ấm và gần.

Người học nên bắt đầu bằng những nốt thấp, chạy long tone rất chậm và lắng nghe phần đầu nốt. Khi âm đảm bảo không rớt cao độ, hãy thêm vibrato nhẹ ở cuối câu.

Bí quyết nằm ở việc không cố bắt chước màu âm của ai đó, mà tìm được điểm thoải mái của chính mình: hơi đủ sâu, cườm thả lỏng và tai luôn nghe trước khi tay đi tiếp.$$,
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=500',
    '15 Tháng 4, 2026',
    3
  ),
  (
    'lua-chon-dam-ken-reed-bao-nhieu-do-la-toi-uu',
    'Lựa chọn dăm kèn (reed) bao nhiêu độ là tối ưu?',
    'Dành cho người tập sự lẫn bán chuyên: phân biệt dăm cứng, dăm mềm và cách chọn reed phù hợp tại nhà.',
    $$Với người mới, reed quá cứng thường làm âm khó ra, cổ và môi nhanh mỏi. Reed quá mềm lại dễ bị bè, cao độ không ổn định khi thổi mạnh.

Mức 2 hoặc 2.5 thường là điểm bắt đầu an toàn cho Alto, sau đó điều chỉnh theo mouthpiece và thể lực hơi. Nếu bạn thường xuyên chỉ chạy được vài phút đã mỏi, hãy thử hạ reed xuống một nấc.

Reed tốt không phải reed đắt nhất, mà là reed phù hợp với mouthpiece và giúp bạn tập trung vào âm nhạc.$$,
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=500',
    '02 Tháng 4, 2026',
    4
  )
) as v(slug, title, excerpt, content, image, date, sort_order)
where not exists (select 1 from public.posts);

insert into public.media (title, category, duration, thumbnail, video_url, sort_order)
select * from (values
  ('Hạ Trắng (Trịnh Công Sơn) - Live Acoustic','VIDEO BIỂU DIỄN','05:42','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000','https://www.youtube.com/embed/dQw4w9WgXcQ',1),
  ('Hướng dẫn cách lấy hơi bụng chuẩn xác nhất','BÀI HỌC SAXOPHONE','12:15','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000','https://www.youtube.com/embed/dQw4w9WgXcQ',2),
  ('Behind the Scenes: Đêm nhạc Mùa Thu Hà Nội','YOUTUBE VLOG','08:30','https://images.unsplash.com/photo-1486591978090-58e619d37fe7?auto=format&fit=crop&q=80&w=1000','https://www.youtube.com/embed/dQw4w9WgXcQ',3),
  ('Luyện chạy ngón Pentatonic siêu tốc mỗi ngày','SHORT CLIPS','01:00','https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=1000','https://www.youtube.com/embed/dQw4w9WgXcQ',4)
) as v(title, category, duration, thumbnail, video_url, sort_order)
where not exists (select 1 from public.media);

insert into public.settings (key, value)
select * from (values
  ('hero_image', 'https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80&w=1100'),
  ('about_image', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1000')
) as v(key, value)
where not exists (select 1 from public.settings);

-- ---------- STORAGE CHO áº¢NH ----------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "public read site images" on storage.objects;
drop policy if exists "auth insert site images" on storage.objects;
drop policy if exists "auth update site images" on storage.objects;
drop policy if exists "auth delete site images" on storage.objects;
create policy "public read site images"
  on storage.objects for select
  using (bucket_id = 'site-images');
create policy "auth insert site images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-images');
create policy "auth update site images"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');
create policy "auth delete site images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-images');
