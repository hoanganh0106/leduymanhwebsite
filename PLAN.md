# Hoàn thiện CMS: Bài viết, Video, Thay ảnh toàn trang

## Context (Vì sao làm việc này)

Trang web Lê Duy Mạnh Saxophone đã có sẵn một CMS qua Supabase quản trị **Lưu diễn / Workshop / Khóa học** tại `/#/admin` — sửa nội dung không cần đụng code, không deploy lại ([admin.tsx](src/admin.tsx), [content-data.ts](src/lib/content-data.ts)). Tuy nhiên còn 3 mảng vẫn **gắn cứng trong code**, mỗi lần đổi phải sửa code + build lại:

- **Bài viết blog** (×4) và **Video biểu diễn** (×4) — gắn cứng trong [content.ts](src/content.ts).
- **Ảnh Hero** và **ảnh Giới thiệu** — gắn cứng URL Unsplash trong [sections.tsx](src/sections.tsx) (dòng ~409 và ~467).
- Tất cả ảnh hiện là ảnh mẫu/AI; chủ trang muốn tự thay được dễ dàng, không lỗi.

Mục tiêu: đưa nốt 3 mảng này vào trang quản trị, thêm chức năng **tải/thay ảnh** dùng được cho mọi ảnh nội dung, và đảm bảo **hiển thị luôn chuẩn kể cả khi thiếu dữ liệu/ảnh hỏng**. Chủ trang sẽ kết nối Supabase thật **sau khi deploy** → code phải chạy tốt ở chế độ mặc định (chưa có Supabase) và "bật lên" đầy đủ sau khi cấu hình + chạy file SQL.

Quyết định đã chốt với người dùng:
1. Blog = **bài viết đầy đủ** (có nội dung dài + trang đọc chi tiết).
2. Thay ảnh = **tải file lên Supabase Storage** (kèm tùy chọn dán URL).
3. **Có** quản trị Video biểu diễn.
4. Cho deploy thật, bổ sung: **lưu đăng ký liên hệ/workshop** (lưu Supabase + admin xem danh sách, KHÔNG gửi email) và **SEO/Open Graph**. (Không làm: cho sửa thông tin liên hệ/MXH; tài liệu deploy.)

---

## Kiến trúc (giữ đúng pattern sẵn có)

Tái sử dụng đúng mô hình hiện tại: bảng Supabase ⇄ fetcher có fallback về default ⇄ section nhận props. Admin dùng mảng khai báo `resources` ([admin.tsx:37](src/admin.tsx#L37)) — thêm loại nội dung = thêm 1 `ResourceDef`.

### 1. Schema Supabase mới — bổ sung vào [supabase-setup.sql](supabase-setup.sql)

- **`posts`** (bài viết): `id, slug, title, excerpt, content, image, date, sort_order, created_at`.
  - `content` = nội dung dài (nhiều đoạn, ngăn cách bằng dòng trống); `slug` để tạo URL trang đọc.
- **`media`** (video biểu diễn): `id, title, category, duration, thumbnail, video_url, sort_order, created_at`.
- **`settings`** (ảnh đơn lẻ của trang, dạng khóa–giá trị): `key text primary key, value text, updated_at`.
  - Khởi tạo 2 khóa: `hero_image`, `about_image` (extensible cho sau này).
- **`leads`** (đăng ký liên hệ/workshop — xem mục 9): `id, kind ('contact'|'workshop'), name, phone, course, note, status ('new'|'done'), created_at`.
  - **RLS khác biệt**: cho `anon` **insert** (khách gửi được), nhưng **chỉ `authenticated` được đọc/sửa/xóa** — KHÔNG có policy đọc công khai vì chứa dữ liệu cá nhân.
- Mỗi bảng (trừ `leads`): bật RLS, policy **đọc công khai** + **ghi yêu cầu đăng nhập** (copy y nguyên pattern policy của tours/workshops/courses, dòng 45–64).
- Seed dữ liệu mẫu trùng nội dung mặc định hiện tại (4 bài viết, 4 video, 2 ảnh) — chỉ nạp khi bảng rỗng (pattern `where not exists`).

### 2. Supabase Storage (cho tải ảnh) — thêm vào cuối file SQL

- Tạo bucket công khai: `insert into storage.buckets (id, name, public) values ('site-images','site-images',true) on conflict (id) do nothing;`
- Policy trên `storage.objects`: **đọc công khai** cho bucket `site-images`; **insert/update/delete** cho `authenticated`.
- → Toàn bộ cài đặt vẫn gói gọn trong "chạy 1 file SQL", không thao tác tay thêm.

### 3. Component `ImageField` mới (dùng chung) — trong [admin.tsx](src/admin.tsx)

Một ô ảnh dùng cho mọi field ảnh (khóa học, bài viết, thumbnail video, ảnh Hero/Giới thiệu):
- **Xem trước** ảnh hiện tại, có `onError` → hiện khung "ảnh lỗi/không tải được" thay vì icon vỡ.
- **Nút "Tải ảnh lên"**: chọn/kéo file → kiểm tra là ảnh & dung lượng (≤ ~5MB) → upload lên bucket `site-images` (đường dẫn duy nhất theo thời gian + tên) → lấy `getPublicUrl` → gọi `onChange`. Có trạng thái "Đang tải…" và báo lỗi rõ ràng.
- **Ô dán URL**: vẫn cho dán link ngoài (giữ tương thích cách cũ của khóa học).
- Khi chưa cấu hình Supabase: ẩn nút upload, hiện ghi chú "kết nối Supabase để tải ảnh"; ô URL vẫn dùng được.

Mở rộng `FieldDef` thêm `type: 'image'`; field nào `type:'image'` thì render `ImageField` (thay cho ô text + preview rời ở `imageKey` hiện tại).

### 4. Admin: thêm tab quản trị — [admin.tsx](src/admin.tsx)

- Thêm vào `resources`:
  - **`posts`** ("Bài viết"): title, slug, date, excerpt (textarea), content (textarea lớn), image (`type:'image'`).
  - **`media`** ("Video biểu diễn"): title, category, duration, thumbnail (`type:'image'`), video_url.
- Đổi field `image` của **courses** sang `type:'image'` để cũng tải lên được.
- Thêm tab đặc biệt **"Hình ảnh trang web"** với component mới `SiteImagesEditor` (không phải list): hiển thị các slot cố định (Ảnh Hero, Ảnh Giới thiệu), mỗi slot là 1 `ImageField` đọc/ghi bảng `settings` theo `key` (upsert).
- **Cấu trúc thanh tab**: hiện admin sinh tab từ mảng `resources` rồi render `ResourceEditor` ([admin.tsx:402-419](src/admin.tsx#L402)). Cần refactor nhẹ thành danh sách tab dạng `{ id, label, render }`: các tab generic dùng `ResourceEditor`, còn **"Hình ảnh trang web"** → `SiteImagesEditor`, **"Liên hệ / Đăng ký"** (mục 9a) → `LeadsManager`. Thứ tự tab: Lưu diễn · Workshop · Khóa học · Bài viết · Video biểu diễn · Hình ảnh trang web · Liên hệ/Đăng ký.

### 5. Đọc dữ liệu công khai — [content-data.ts](src/lib/content-data.ts) & [content.ts](src/content.ts)

- Thêm fetcher (cùng pattern fallback): `fetchPosts()`, `fetchMedia()` (map `video_url → videoUrl`), `fetchSiteImages()` → trả `{ hero_image, about_image }` với default là URL hiện đang gắn cứng.
- [content.ts](src/content.ts): cập nhật interface `BlogPost` (thêm `id, slug, content, excerpt`); thêm hằng default cho ảnh Hero/About (lấy đúng URL đang dùng trong sections.tsx). Giữ nguyên `blogPosts`, `mediaItems` làm dữ liệu fallback.

### 6. Hiển thị công khai — [App.tsx](src/App.tsx) & [sections.tsx](src/sections.tsx)

- [App.tsx](src/App.tsx): nạp lười `posts`, `media`, `siteImages` cùng chỗ đang nạp tours/courses ([App.tsx:137](src/App.tsx#L137)); truyền xuống props. Thêm vào mảng `deps` của `useScrollReveal`.
- [sections.tsx](src/sections.tsx): `HeroSection` nhận `heroImage`; `AboutSection` nhận `aboutImage`; `PerformanceSection` nhận `media` (thay vì import `mediaItems`); `BlogSection` nhận `posts`.
- **`SafeImage`**: thêm 1 component ảnh nhỏ dùng chung (hoặc helper `onError`) → khi URL hỏng tự thay bằng ảnh nền trung tính, để **không bao giờ hiện icon ảnh vỡ**. Áp cho hero/about/course/blog/media.

### 7. Trang đọc bài viết (blog detail)

- Định tuyến bằng hash `#/post/<slug>` (không đụng route `/admin` của [Root.tsx](src/Root.tsx)).
- Trong [App.tsx](src/App.tsx): phát hiện hash `#/post/<slug>` → render component mới **`BlogPostPage`** (vẫn nằm trong Header + Footer): ảnh bìa lớn, tiêu đề, ngày, nội dung dài tách đoạn theo dòng trống, nút "← Quay lại blog". Nếu không tìm thấy slug → hiện "Không tìm thấy bài viết" + link quay lại (không vỡ trang).
- Nút "Đọc bài viết" trong `BlogSection` set `window.location.hash = '#/post/' + slug`.

### 8. Tài liệu — [README.md](README.md) & [.env.example](.env.example)

- README: mô tả 3 tab mới (Bài viết / Video biểu diễn / Hình ảnh trang web), cách tải ảnh, và ghi chú bucket `site-images` đã nằm trong file SQL (cấu hình 1 lần). `.env` không đổi (vẫn 2 biến cũ).

### 9. Chức năng cho deploy thật

**9a. Lưu đăng ký liên hệ & workshop** (sửa form hiện đang mất dữ liệu)
- [App.tsx](src/App.tsx): `handleFormSubmit` (form Liên hệ) và `handleWorkshopSubmit` (WorkshopModal) hiện chỉ hiện "thành công". Sửa thành: **insert vào bảng `leads`** qua Supabase trước khi hiện thông báo.
  - Form liên hệ → `{ kind:'contact', name, phone, course, note }` (đã có sẵn `formData` đầy đủ trong state).
  - Workshop → `{ kind:'workshop', name, phone, course: workshop.title, note:'' }`.
  - ⚠️ **Lỗi cần sửa**: input trong [WorkshopModal](src/modals.tsx#L159) (Họ tên, SĐT) đang **không kiểm soát** — không có `name`/state, handler không đọc được giá trị → lead sẽ rỗng. Phải thêm `name="name"`/`name="phone"` và đọc bằng `new FormData(event.currentTarget)` trong `handleWorkshopSubmit` (cách gọn nhất, không cần thêm state ở App).
  - Hàm lưu nên là **async, có fallback an toàn**: nếu chưa cấu hình Supabase hoặc insert lỗi → vẫn hiện "thành công" cho khách (không chặn UX, không văng lỗi). Khi đã nối DB thì lead được lưu thật.
- Admin: thêm tab **"Liên hệ / Đăng ký"** với component mới `LeadsManager` (KHÔNG dùng trình tạo/sửa generic): liệt kê đăng ký mới nhất trước (`order('created_at', desc)`), hiện loại/tên/SĐT/khóa quan tâm/ghi chú/thời gian; nút **"Đánh dấu đã xử lý"** (đổi `status` new↔done) và **xóa**. Chỉ đọc + cập nhật trạng thái, admin không tự tạo lead.

**9b. SEO & Open Graph** — [index.html](index.html)
- Thêm thẻ `og:title`, `og:description`, `og:type=website`, `og:image`, `og:url`, `og:locale=vi_VN`; `twitter:card=summary_large_image` + `twitter:image`; `<link rel="canonical">`.
- `og:image` cần URL **tuyệt đối** (Facebook/Zalo yêu cầu): dùng tạm ảnh có sẵn `public/sax-real.png`, đặt một biến domain ở đầu và để **comment nhắc thay domain thật** (vd `https://leduymanhsaxophone.vn/sax-real.png`) sau khi deploy. Ghi chú: ảnh OG đẹp nhất là khổ ngang ~1200×630 — có thể thêm `public/og-image.jpg` riêng sau, không bắt buộc lần này.
- (Không thêm chức năng sửa SEO trong admin — ngoài phạm vi đã chốt.)

---

## Đảm bảo "hiển thị luôn chuẩn, không lỗi"

- Mọi fetcher trả **default** khi lỗi / bảng rỗng / chưa cấu hình → trang không bao giờ trống (đã là pattern sẵn).
- `SafeImage` `onError` → không hiện ảnh vỡ ở bất kỳ đâu.
- Thiếu chữ/field: card và trang chi tiết có giá trị dự phòng, không crash.
- Slug bài viết không tồn tại → trang "không tìm thấy" thân thiện.
- Upload kiểm tra loại file & dung lượng, báo lỗi rõ thay vì văng lỗi.
- Trình soạn chung (add/sửa/xóa/đổi thứ tự) giữ nguyên cơ chế an toàn hiện có.

## Các file sẽ sửa/thêm

- Sửa: [supabase-setup.sql](supabase-setup.sql), [admin.tsx](src/admin.tsx), [content.ts](src/content.ts), [content-data.ts](src/lib/content-data.ts), [App.tsx](src/App.tsx), [sections.tsx](src/sections.tsx), [modals.tsx](src/modals.tsx) (lưu đăng ký workshop), [index.html](index.html) (SEO/OG), [README.md](README.md).
- Thêm (có thể inline trong file sẵn có): component `ImageField`, `SiteImagesEditor`, `LeadsManager` (trong admin.tsx); `SafeImage`, `BlogPostPage` (trong sections.tsx / App.tsx).
- [Root.tsx](src/Root.tsx): giữ nguyên (route post xử lý trong App).

## Thứ tự thực hiện

1. **SQL** ([supabase-setup.sql](supabase-setup.sql)): thêm bảng `posts`, `media`, `settings`, `leads` + RLS + bucket Storage + seed. (Nền tảng cho mọi phần sau.)
2. **Dữ liệu & types** ([content.ts](src/content.ts), [content-data.ts](src/lib/content-data.ts)): cập nhật `BlogPost`, default ảnh Hero/About; thêm `fetchPosts/fetchMedia/fetchSiteImages`.
3. **Hiển thị công khai** ([App.tsx](src/App.tsx), [sections.tsx](src/sections.tsx)): nạp dữ liệu, truyền props, `SafeImage`, trang `BlogPostPage` + route `#/post/<slug>`.
4. **Lưu đăng ký** (mục 9a): sửa [modals.tsx](src/modals.tsx) (input có `name`) + 2 handler trong [App.tsx](src/App.tsx).
5. **Admin** ([admin.tsx](src/admin.tsx)): `ImageField`, refactor thanh tab, thêm `posts`/`media`/courses-image, `SiteImagesEditor`, `LeadsManager`.
6. **SEO/OG** ([index.html](index.html)) + **README** ([README.md](README.md)).
7. Chạy `npm run build` và phần Kiểm thử bên dưới.

## Kiểm thử (Verification)

1. **Chế độ mặc định (chưa có Supabase)**: `npm run dev` → trang hiển thị đầy đủ bằng dữ liệu mặc định; `/#/admin` hiện hướng dẫn cài đặt; mở `#/post/<slug>` của bài mẫu → trang đọc hiện đúng. → xác nhận "deploy trước, nối DB sau" hoạt động.
2. **Build**: `npm run build` (tsc + vite) phải pass, không lỗi type.
3. **Sau khi nối Supabase thật** (người dùng tự làm sau deploy): chạy [supabase-setup.sql](supabase-setup.sql), tạo user admin, điền `.env.local`. Rồi kiểm:
   - Đăng nhập `/#/admin` → có đủ tab: Lưu diễn, Workshop, Khóa học, **Bài viết, Video biểu diễn, Hình ảnh trang web**.
   - Tạo 1 bài viết mới, **tải 1 ảnh từ máy** → ảnh lên Storage, xem trước hiện ngay; mở trang chủ tab Blog thấy bài mới + bấm đọc chi tiết.
   - Thay **ảnh Hero** và **ảnh Giới thiệu** ở tab "Hình ảnh trang web" → tải lại trang chủ thấy ảnh mới.
   - Sửa 1 **video** (đổi link/thumbnail) → phần Biểu diễn cập nhật.
   - Dán 1 URL ảnh sai/hỏng → chỗ đó hiện khung dự phòng, không vỡ giao diện.
   - **Gửi thử form Liên hệ và đăng ký Workshop** → vào tab "Liên hệ / Đăng ký" thấy bản ghi mới; đánh dấu đã xử lý + xóa hoạt động. Xác nhận khách **không** đọc được bảng `leads` (chỉ admin đăng nhập).
   - Share link trang lên Facebook/Zalo (hoặc dùng trình kiểm tra OG) → hiện đúng tiêu đề + ảnh.
