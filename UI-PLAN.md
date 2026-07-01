# Đánh giá UI & Kế hoạch cải thiện — Lê Duy Mạnh Saxophone

> Chỉ là **kế hoạch** (không sửa code). Đánh giá dựa trên khung 10-priority của skill `ui-ux-pro-max`
> (Accessibility → Touch → Performance → Style → Layout → Typography/Color → Animation → Forms → Navigation → Charts).
> Ghi vào `UI-PLAN.md` để **không ghi đè** [PLAN.md](PLAN.md) (kế hoạch CMS đang có).

## 0. Ngữ cảnh

- **Loại sản phẩm:** Portfolio / thương hiệu cá nhân nghệ sĩ (soloist + academy) — không phải SaaS/dashboard.
- **Stack:** React 19 + Tailwind v4 + lucide-react. Một trang, chuyển nội dung bằng **tab panel** (`about/performances/academy/sax/blog/contact`) thay vì cuộn dài.
- **Hệ thiết kế:** "Quiet-luxury / warm ivory" — 1 tông ivory ấm, nhấn vàng gold, serif Playfair + Cormorant + Inter. Tokens đã khai báo ở [src/index.css](src/index.css#L10-L36).
- **Ràng buộc bắt buộc (từ trí nhớ dự án):**
  - Giữ **một tông ivory duy nhất** — *không* thêm section nền tối. ⇒ Sửa tương phản = **làm đậm chữ/tăng opacity**, không đổi nền.
  - Giữ **hệ phân cấp nút/CTA** hiện có (Hero làm mẫu, detail 1 back + 1 primary, card 1 vùng bấm) — không thêm CTA cạnh tranh.

## 1. Nhận định tổng quan

Thẩm mỹ **rất tốt và nhất quán**: token màu, seam letterpress, scroll-reveal, sax explorer 3D, xử lý scroll tối ưu (rAF + cache bounds tại [App.tsx:171-236](src/App.tsx#L171-L236)), CLS tốt (ảnh đều có aspect-ratio), SEO/OG + font `display=swap` đã có ([index.html](index.html)). `prefers-reduced-motion` được tôn trọng ([index.css:412](src/index.css#L412)).

**Khoảng trống chính không nằm ở "đẹp" mà ở "chuẩn UX/A11y":**
1. **Tương phản chữ (CRITICAL)** — nhiều text opacity thấp trên nền ivory dưới ngưỡng 4.5:1.
2. **Cỡ chữ siêu nhỏ (< 12px)** dày đặc cho nhãn.
3. **Focus ring không nhất quán** — nhiều phần tử tương tác thiếu.
4. **Touch target < 44px** ở nav/tab/social/nút nhỏ.
5. **Token đã có nhưng không nối vào Tailwind** — component xài hex thô (`text-[#2A2520]/70`) khắp nơi.

Ưu tiên xử lý theo thứ tự P0 → P2 bên dưới.

---

## 2. Đánh giá chi tiết theo 10 priority

### P1 · Accessibility — ⚠️ CRITICAL (điểm yếu lớn nhất)

**a) Tương phản chữ chưa đạt 4.5:1** (ước lượng trên nền ivory `#FBF9F4`):
- `text-[#2A2520]/55`, `/50`, `/48`, `/45` → ~2.9–3.5:1 → **fail** cho normal text. Ví dụ: nhãn thống kê Hero [sections.tsx:436](src/sections.tsx#L436), số liệu About [sections.tsx:548](src/sections.tsx#L548), copyright footer [sections.tsx:1190](src/sections.tsx#L1190), mô tả section `/62`, `/65`.
- Gold nhỏ: kicker `#9A7C30` (~3.65:1) [index.css:313](src/index.css#L313) và tiêu đề nhấn `#AF8C43` (~2.9:1) — fail cho chữ nhỏ/bold.
- Thân bài `text-[#2A2520]/70` ~5:1 → **đạt** (giữ nguyên).

**b) Cỡ chữ < 12px** (anti-pattern của skill): `text-[8px]` (chữ "SAXOPHONE" mobile [sections.tsx:284](src/sections.tsx#L284)), `text-[9px]`, `text-[10px]` cho hàng loạt eyebrow/nhãn.

**c) Focus ring không nhất quán:** có ở tour/media/course card (`focus:ring-2`) nhưng **thiếu** ở: nav pill (`gold-line` chỉ hover) [sections.tsx:205](src/sections.tsx#L205), SectionTabs [sections.tsx:162](src/sections.tsx#L162), CTA Hero [sections.tsx:414](src/sections.tsx#L414), submit form Liên hệ [sections.tsx:1117](src/sections.tsx#L1117), quick-links & social footer, wordmark header.

**d) Tốt sẵn:** alt text (SafeImage), aria-label nút icon (menu/social/scroll-cue/sax hotspot), `<label>` cho input, heading h1→h2→h3 hợp lý (mỗi lúc chỉ 1 tab render).

### P2 · Touch & Interaction — ⚠️ HIGH
- **< 44×44px:** nav pill (~32px), SectionTabs (`py-2.5`≈40px) [sections.tsx:162](src/sections.tsx#L162), social footer `w-9 h-9`=36px [sections.tsx:1180](src/sections.tsx#L1180), menu toggle `h-10 w-10`=40px, nút "status" workshop [sections.tsx:872](src/sections.tsx#L872).
- **Affordance chỉ-hover:** "Xem chi tiết" trong tour card `opacity-0 group-hover` [sections.tsx:742](src/sections.tsx#L742) và overlay play trên mobile không hiện (cả card vẫn bấm được ⇒ mức nhẹ).
- **Sax drag** [sax-explorer.tsx:286](src/sax-explorer.tsx#L286): kéo ngang có thể tranh cuộn dọc — `.sax-stage` chưa đặt `touch-action`. Có danh sách part bấm được thay thế ⇒ đỡ, nhưng nên khoá trục.
- **Submit không có loading state** — `saveLead` async nhưng nút không disable/spinner ([App.tsx:289](src/App.tsx#L289)) ⇒ có thể double-submit.

### P3 · Performance — ✅ HIGH (khá tốt)
- CLS ổn (aspect-ratio khắp nơi), hero `fetchPriority=high`, dưới màn `loading=lazy`, lazy-import Supabase/content-data [App.tsx:243](src/App.tsx#L243), font `display=swap` + preconnect.
- **Thiếu:** `srcset/sizes` & WebP/AVIF cho ảnh (đang để URL Unsplash/upload nguyên khổ). Cải thiện được nhưng ưu tiên thấp.

### P4 · Style Selection — ✅ HIGH
- Nhất quán cao, icon SVG (không emoji), 1 tông ivory đúng chủ trương. Giữ.
- Lưu ý nhẹ: nút "gradient gold pill" xuất hiện rất nhiều nơi ⇒ khi làm P0 nhớ giữ đúng phân cấp, tránh mọi CTA đều "primary".

### P5 · Layout & Responsive — ✅ HIGH
- Mobile-first, `max-w-7xl`, `overflow-x-hidden`, viewport meta OK. SectionTabs cuộn ngang trên mobile nhưng **không có gợi ý còn tab bên phải** (ẩn scrollbar) ⇒ có thể bỏ sót tab.

### P6 · Typography & Color — ⚠️ MEDIUM
- **Token không nối Tailwind:** [index.css:10-36](src/index.css#L10-L36) khai báo `--ink/--gold/...` nhưng component dùng hex thô arbitrary (`from-[#BF9B30]`, `text-[#2A2520]/70`) ⇒ khó bảo trì, dễ lệch tông, đúng anti-pattern "raw hex in components".
- Thang chữ: nhiều bậc siêu nhỏ (8/9/10/11px) — nên chuẩn hoá thang tối thiểu.

### P7 · Animation — ✅ MEDIUM
- Thời lượng 300–500ms hợp lý; zoom ảnh 1.6–2s (chấp nhận cho luxury). `reduced-motion` ✓, `will-change` ✓. Vài hiệu ứng thuần trang trí (shimmer/float/pulse/sparkle) — hợp brand, có thể tiết chế nếu muốn.

### P8 · Forms & Feedback — ⚠️ MEDIUM
- Label hiện rõ ✓, success state đẹp ✓.
- **Thiếu báo lỗi inline:** handler `if (!name || !phone) return;` im lặng ([App.tsx:291](src/App.tsx#L291)) — chỉ dựa `required` của trình duyệt, không có thông báo trong app. Không có loading khi gửi.

### P9 · Navigation — ✅ HIGH (1 điểm cân nhắc)
- Back/forward + deep-link hash chuẩn ([App.tsx:264-287](src/App.tsx#L264-L287)). Nav desktop 6 mục chia 2 bên wordmark — ổn.
- **Cân nhắc mô hình tab:** click nav = **đổi panel** chứ không cuộn, nội dung các khối không đọc tuyến tính được. Đây là chủ ý thiết kế; chỉ nêu để xác nhận, không đổi trong plan này trừ khi bạn muốn.

### P10 · Charts — N/A.

---

## 3. Kế hoạch sửa (phân đợt)

> Nguyên tắc: giữ 1 tông ivory & phân cấp CTA. Không refactor kiến trúc. Ưu tiên đúng thứ tự tác động.

### Đợt P0 — Accessibility & Touch (bắt buộc, tác động cao nhất)

| # | Việc | File | Chuẩn đạt (acceptance) |
|---|------|------|------------------------|
| P0-1 | Nâng tương phản: thay các opacity `/45–/62` ở **chữ nhỏ** lên `/72–/80` hoặc dùng `--ink-soft`; đổi gold nhãn nhỏ từ `#AF8C43`→`#9A7C30`, cân nhắc `#8A6E28` cho nhãn ≤ 12px | [sections.tsx](src/sections.tsx), [detail-pages.tsx](src/detail-pages.tsx), [index.css](src/index.css) | Mọi text thường ≥ 4.5:1; text lớn ≥ 3:1 (kiểm bằng công cụ contrast) |
| P0-2 | Nâng sàn cỡ chữ: bỏ `text-[8px]`, gộp `9/10px` → tối thiểu **11px** cho nhãn, 12px nếu là thông tin đọc | [sections.tsx](src/sections.tsx) | Không còn body/label < 11px |
| P0-3 | Thêm `focus-visible` ring thống nhất cho **mọi** phần tử tương tác còn thiếu (nav pill, SectionTabs, CTA Hero, submit, footer links, social, wordmark) — nên tạo 1 class dùng chung `.focus-ring` | [index.css](src/index.css), [sections.tsx](src/sections.tsx) | Tab bàn phím thấy rõ ring 2–3px ở 100% phần tử bấm được |
| P0-4 | Đưa touch target ≥ 44px: tăng padding nav pill/SectionTabs/nút status, social `w-11 h-11`, menu toggle `h-11 w-11` (hoặc mở rộng hit-area) | [sections.tsx](src/sections.tsx) | Đo được ≥ 44×44 trên mobile |
| P0-5 | `touch-action` cho sax drag (khoá cuộn khi kéo) + đảm bảo danh sách part là lối thay thế rõ ràng | [index.css](src/index.css), [sax-explorer.tsx](src/sax-explorer.tsx) | Kéo kèn không cướp cuộn trang trên mobile |

### Đợt P1 — Consistency & Forms (nên làm)

| # | Việc | File | Acceptance |
|---|------|------|-----------|
| P1-1 | **Nối token vào Tailwind v4** (`@theme` trong index.css): map `--gold/--ink/--ivory/...` thành `color-*` rồi dần thay hex thô bằng lớp token | [index.css](src/index.css) | Component mới dùng `text-ink-soft`/`bg-surface`… thay hex |
| P1-2 | Báo lỗi inline cho form (viền đỏ + message cạnh field khi trống/không hợp lệ) thay vì `return` im lặng | [sections.tsx](src/sections.tsx), [detail-pages.tsx](src/detail-pages.tsx), [App.tsx](src/App.tsx) | Gửi khi trống → thấy lỗi tại field |
| P1-3 | Loading state khi submit (disable + spinner) chống double-submit | [App.tsx](src/App.tsx), [sections.tsx](src/sections.tsx) | Nút khoá trong lúc gửi |
| P1-4 | Gợi ý "còn tab" cho SectionTabs mobile (fade cạnh phải hoặc mũi tên) | [sections.tsx](src/sections.tsx), [index.css](src/index.css) | Người dùng biết có tab bị tràn |

### Đợt P2 — Polish (tùy chọn)

| # | Việc | File |
|---|------|------|
| P2-1 | Ảnh responsive: `srcset/sizes` + tham số WebP cho ảnh Unsplash/upload | [sections.tsx](src/sections.tsx), [detail-pages.tsx](src/detail-pages.tsx) |
| P2-2 | Hiện affordance "Xem chi tiết" ở tour card cả khi không hover (mobile) | [sections.tsx:742](src/sections.tsx#L742) |
| P2-3 | Chuẩn hoá thang typography thành vài bậc semantic (eyebrow/label/body/lede/h*) | [index.css](src/index.css) |

---

## 4. Ngoài phạm vi (không đụng lần này)
- Không đổi mô hình tab→panel (P9) trừ khi bạn yêu cầu.
- Không thêm section nền tối (giữ 1 tông ivory).
- Không đổi nội dung/copy, không đụng logic CMS/Supabase trong [PLAN.md](PLAN.md).

## 5. Cách kiểm thử sau khi sửa
1. **Contrast:** kiểm vài mẫu bằng công cụ (DevTools/axe) — nhãn nhỏ, kicker, copyright ≥ 4.5:1.
2. **Bàn phím:** Tab toàn trang, mọi phần tử bấm được có focus ring rõ; Esc thoát menu/detail.
3. **Mobile (≤ 640px):** đo target ≥ 44px; kéo sax không cuộn trang; tab thấy gợi ý tràn.
4. **Form:** gửi khi trống → lỗi inline; đang gửi → nút khoá.
5. `npm run build` pass (tsc + vite), không lỗi type.
6. Đối chiếu 1 lượt: không phát sinh nền tối, CTA vẫn đúng phân cấp.
