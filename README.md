# Lê Duy Mạnh Saxophone

Landing page biểu diễn & đào tạo saxophone (React + TypeScript + Vite + Tailwind).

```bash
npm install
npm run dev      # chạy local
npm run build    # build production
```

## Trang quản trị nội dung (`/#/admin`)

Cho phép sửa **Lưu diễn (tours)**, **Workshop** và **Khóa học** mà không cần đụng vào code. Dữ liệu lưu trên **Supabase** nên thay đổi áp dụng cho mọi khách truy cập.

> Khi chưa cấu hình Supabase, trang web vẫn chạy bình thường với dữ liệu mặc định trong `src/content.ts`, và `/#/admin` sẽ hiển thị hướng dẫn cài đặt.

**Cài đặt 3 bước:**

1. Tạo project miễn phí ở [supabase.com](https://supabase.com). Vào **SQL Editor**, dán toàn bộ nội dung file [`supabase-setup.sql`](./supabase-setup.sql) và bấm **Run** (tạo bảng, phân quyền, nạp dữ liệu mẫu).
2. Vào **Authentication → Users → Add user**, tạo tài khoản admin (email + mật khẩu) để đăng nhập trang quản trị.
3. Sao chép `.env.example` thành `.env.local`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (lấy ở **Project Settings → API**), rồi chạy lại `npm run dev`.

Truy cập trang quản trị: mở `http://localhost:5173/#/admin` (hoặc bấm **Quản trị** ở chân trang), đăng nhập bằng tài khoản vừa tạo.

- Đọc công khai (anon) · ghi yêu cầu đăng nhập — đã thiết lập sẵn bằng Row Level Security trong file SQL.
- Đổi thứ tự hiển thị bằng nút ▲ ▼ trong từng mục.

**CÃ¡c tab CMS Ä‘Ã£ má»Ÿ rá»™ng:**

- **BÃ i viáº¿t**: quáº£n lÃ½ tiÃªu Ä‘á», slug URL, tÃ³m táº¯t, ná»™i dung dÃ i, áº£nh bÃ¬a vÃ  ngÃ y Ä‘Äƒng. Link Ä‘á»c chi tiáº¿t dÃ¹ng hash route `#/post/<slug>`.
- **Video biá»ƒu diá»…n**: quáº£n lÃ½ title, category, duration, thumbnail vÃ  link nhÃºng video.
- **HÃ¬nh áº£nh trang web**: Ä‘á»•i áº£nh Hero vÃ  áº£nh Giá»›i thiá»‡u mÃ  khÃ´ng cáº§n build láº¡i.
- **LiÃªn há»‡ / ÄÄƒng kÃ½**: xem form khÃ¡ch gá»­i, Ä‘Ã¡nh dáº¥u Ä‘Ã£ xá»­ lÃ½ hoáº·c xÃ³a. KhÃ¡ch chá»‰ Ä‘Æ°á»£c gá»­i form, khÃ´ng Ä‘á»c Ä‘Æ°á»£c báº£ng lead.

Vá»›i cÃ¡c field áº£nh, admin cÃ³ thá»ƒ **táº£i file áº£nh lÃªn Supabase Storage** hoáº·c dÃ¡n URL ngoÃ i. Bucket cÃ´ng khai `site-images` vÃ  policy Ä‘á»c/ghi Ä‘Ã£ náº±m sáºµn trong `supabase-setup.sql`; chá»‰ cáº§n cháº¡y láº¡i SQL sau khi deploy/káº¿t ná»‘i Supabase. File `.env` váº«n giá»¯ 2 biáº¿n cÅ©: `VITE_SUPABASE_URL` vÃ  `VITE_SUPABASE_ANON_KEY`.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
