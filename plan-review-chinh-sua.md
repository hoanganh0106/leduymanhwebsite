# Plan: Review & chỉnh sửa tiếp (sau đợt Thư viện ảnh + Dấu mốc + Polish UI)

> Trạng thái: **PLAN — đã review code, chưa sửa.**
> Phạm vi: được phép sửa UI và vị trí nút cũ, ưu tiên đẹp; không cần giữ quy tắc nút/CTA cũ nếu phương án mới đẹp hơn.

## 1. Bối cảnh

Working tree hiện có 16 file thay đổi chưa commit, gộp 4 mảng việc:

1. **Thư viện ảnh cá nhân** (theo `plan-anh-ca-nhan.md`, đã triển khai đủ): bảng `photos` + RLS, `fetchPhotos()`, `src/lightbox.tsx` (tách dùng chung), dải "Khoảnh khắc" trong AboutSection, trang masonry `#/thu-vien-anh`, tab admin `PhotoLibraryEditor` (multi-upload + crop từng ảnh).
2. **Dấu mốc CMS hóa**: bảng `milestones` + migration `image` → `images[]`, field type `gallery` trong admin, `MilestoneGallery` collage 1/2/3+ ảnh với overlay "+N", key `year-title` (sửa bug trùng key hai mốc 2023).
3. **Nội dung tiểu sử theo `info.md`**: bio, role, milestones 2019/2023/2024/2025, repertoire; stats About đổi "100+ đêm diễn" → "2015 Thạc sĩ Saxophone".
4. **Polish UI**: font Playfair/Inter → **Fraunces/Be Vietnam Pro**; sax explorer (ghost word parallax, vòng khắc nền, bóng sàn + vòng bệ, sheen chạy theo `--sax-ry`); `src/safe-image.tsx` tách riêng + retry khi `src` đổi; bỏ nút scroll-cue hero; hero/about không flash ảnh mặc định khi có Supabase.

Kết quả kiểm tra tự động: `npm run build` ✅ · `npm run lint` ✅ · chữ ≤10px chỉ còn trong admin (ngoài scope).

## 2. Lỗi & điểm yếu phát hiện khi review (cần sửa)

### Nhóm A — Bug/a11y (sửa trước)

- [ ] **A1. Lightbox: focus nhảy về nút Đóng mỗi lần chuyển ảnh** — `src/lightbox.tsx` effect có `index` trong deps nên `closeButtonRef.focus()` chạy lại mỗi lần bấm ←/→. Sửa: chỉ focus một lần lúc mount (tách effect focus riêng, deps `[]`).
- [ ] **A2. Lightbox chưa có focus trap** — Tab thoát ra trang phía sau khi modal mở. Sửa: trap Tab trong dialog (loop giữa các phần tử focusable: đóng / prev / next).
- [ ] **A3. Bộ đếm upload sai khi bỏ qua ảnh** — `skipCurrent` trong `src/admin.tsx` tăng `completedUploads`, thông báo "Đã tải X/Y" đếm cả ảnh skip. Sửa: đếm riêng `skipped`, thông báo "Đã tải X, bỏ qua Z / tổng Y".
- [ ] **A4. Batch upload đảo thứ tự** — mỗi ảnh mới nhận `sort_order` nhỏ dần nên ảnh chọn cuối đứng đầu. Sửa: cấp `sort_order` giữ nguyên thứ tự chọn trong một batch (batch bắt đầu tại `minOrder - queueTotal`, ảnh thứ i nhận `+ i`).

### Nhóm B — Cleanup code

- [ ] **B1. Xóa CSS chết**: `.animate-scroll-cue` + keyframes `scrollCue` trong `src/index.css` (nút cuộn hero đã bỏ).
- [ ] **B2. Tách hook `useLightbox()`** — bộ `openIndex + openerIndexRef + focus return` đang copy y hệt 3 nơi (AboutSection, MilestoneGallery, GalleryPage). Đặt trong `src/lightbox.tsx`, trả về `{ openIndex, open, close, registerTrigger }`.

### Nhóm C — UI/UX (được phép đổi bố cục, cứ đẹp là được)

- [ ] **C1. Hero blur-up thay icon nốt nhạc** — khi có Supabase, hero/about hiện placeholder gradient + icon cho tới khi fetch xong (mạng chậm → xấu, hại LCP; hero thật đang load từ bucket `site-images`). Sửa: dùng ảnh default làm lớp nền blur (blur-up) hoặc shimmer ivory trong lúc chờ, crossfade khi ảnh thật về.
- [ ] **C2. Lightbox mobile** — 2 nút tròn prev/next đè lên ảnh trên màn hình nhỏ. Sửa: mobile dùng swipe + chạm nửa trái/phải màn hình; desktop giữ nút tròn. Kèm: preload ảnh kế cận, crossfade nhẹ khi chuyển.
- [ ] **C3. Strip "Khoảnh khắc" desktop thiếu affordance cuộn** — chỉ có scrollbar mỏng. Sửa: thêm cặp mũi tên tròn vàng hai bên (cùng ngôn ngữ với lightbox), cuộn theo trang; mobile giữ scroll tự do + snap.
- [ ] **C4. Kiểm tra bằng mắt sax explorer** — ghost word "Saxophone" (rotate 90°, `left:15%`) trên viewport hẹp có đè/tràn không; nếu chật thì ẩn dưới `sm:`.
- [ ] **C5. (Tùy chọn) Vị trí nút "Xem thư viện ảnh"** — đang ở góc phải trên strip; cân nhắc đưa xuống giữa, dưới strip (như mockup trong `plan-anh-ca-nhan.md`) nếu nhìn cân hơn. Quyết khi xem bằng mắt.

## 3. Trình tự thực hiện

1. Sửa **Nhóm A** (A1→A4) → build + lint.
2. Sửa **Nhóm B** (B2 trước để A1/A2 viết một chỗ, rồi B1) → build + lint.
3. Sửa **Nhóm C** (C1→C3, C4/C5 quyết sau khi xem dev server) → build + lint.
4. Verify bằng mắt (`npm run dev`):
   - Tab Giới thiệu: strip Khoảnh khắc, lightbox ←/→/Esc/swipe, focus trả về đúng ảnh.
   - `#/thu-vien-anh`: masonry giữ tỉ lệ, caption, trạng thái rỗng.
   - Trang Tiểu sử: gallery dấu mốc 1/2/3+ ảnh, overlay "+N".
   - Sax explorer trên viewport hẹp (C4).
   - Font Fraunces/Be Vietnam Pro render dấu tiếng Việt đúng ở heading/body/nút.
5. Verify dữ liệu trên Supabase thật:
   - Chạy lại `supabase-setup.sql` → bảng `photos`/`milestones` + RLS đúng, migration `image`→`images` an toàn khi chạy lặp.
   - Admin: upload batch 3-5 ảnh tỉ lệ khác nhau → thứ tự đúng (A4), skip giữa chừng (A3), caption, đổi thứ tự, xóa.
6. Chạy `trellis-check`, cập nhật spec nếu có convention mới (hook `useLightbox`, pattern blur-up).
7. **Commit tách 3 nhóm**:
   - ① feat: thư viện ảnh cá nhân (photos + gallery page + lightbox chung + admin tab)
   - ② feat: dấu mốc CMS + gallery ảnh + nội dung tiểu sử theo info.md
   - ③ refactor/style: font Fraunces/Be Vietnam Pro + sax explorer polish + safe-image + cleanup
   (Các fix ở plan này gộp vào đúng commit theo mảng, hoặc commit ④ fix riêng nếu sửa sau.)

## 4. Không làm (đợt này)

- Không thêm thư viện ngoài cho lightbox/masonry/swipe (tự viết bằng touch events, CSS có sẵn).
- Không đổi mô hình điều hướng tab-panel, không thêm dark section (lightbox là modal, không tính).
- Không phân album/filter cho thư viện ảnh (mở rộng sau).

## 5. Tiêu chí hoàn thành

- [ ] Nhóm A + B sửa xong, build + lint pass.
- [ ] Nhóm C1-C3 sửa xong; C4/C5 đã xem bằng mắt và chốt.
- [ ] Checklist verify mục 3.4-3.5 chạy đủ, không regression gallery dấu mốc.
- [ ] Diff được commit tách nhóm, task Trellis `ui-accessibility-plan` cập nhật/đóng đúng trạng thái.
