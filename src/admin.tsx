import { useCallback, useEffect, useState, type DragEvent, type FormEvent } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Crop,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import Cropper, { type Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { defaultAboutImage, defaultHeroImage } from './content';

/* ------------------------------------------------------------------ */
/* Resource definitions — add a field here and it shows up in the form */
/* ------------------------------------------------------------------ */

type FieldType = 'text' | 'textarea' | 'image' | 'gallery';
interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  rows?: number;
  placeholder?: string;
  /** Tỉ lệ khung cắt mặc định cho field ảnh (rộng/cao). */
  imageAspect?: number;
}
interface ResourceDef {
  table: string;
  label: string;
  titleKey: string;
  imageKey?: string;
  fields: FieldDef[];
}

type Row = { id: string; sort_order: number } & Record<string, string | number | string[] | null>;
type PhotoRow = {
  id: string;
  caption: string;
  image: string;
  sort_order: number;
};

const resources: ResourceDef[] = [
  {
    table: 'tours',
    label: 'Lưu diễn',
    titleKey: 'title',
    fields: [
      { key: 'month', label: 'Tháng', placeholder: 'Th06' },
      { key: 'year', label: 'Năm', placeholder: '2026' },
      { key: 'tag', label: 'Nhãn', placeholder: 'Concert' },
      { key: 'title', label: 'Tiêu đề', placeholder: 'Đêm nhạc "Hơi Thở Mùa Hạ"' },
      { key: 'location', label: 'Địa điểm', placeholder: 'Nhà hát Lớn Hà Nội' },
      { key: 'role', label: 'Vai trò', placeholder: 'Nghệ sĩ độc tấu khách mời' },
    ],
  },
  {
    table: 'milestones',
    label: 'Dấu mốc',
    titleKey: 'title',
    fields: [
      { key: 'year', label: 'Năm', placeholder: '2017' },
      { key: 'title', label: 'Tiêu đề', placeholder: 'Album đầu tay "Em"' },
      { key: 'detail', label: 'Mô tả', type: 'textarea', rows: 3, placeholder: 'Ra mắt MV "Mùa Thu Cho Em"...' },
      { key: 'images', label: 'Ảnh dấu mốc', type: 'gallery', imageAspect: 16 / 9 },
    ],
  },
  {
    table: 'workshops',
    label: 'Workshop',
    titleKey: 'title',
    fields: [
      { key: 'date', label: 'Ngày', placeholder: '20 JUN' },
      { key: 'year', label: 'Năm', placeholder: '2026' },
      { key: 'title', label: 'Tiêu đề', placeholder: 'Workshop cho người mới bắt đầu' },
      { key: 'location', label: 'Địa điểm', placeholder: 'Heritage Space, Hà Nội' },
      { key: 'price', label: 'Giá vé', placeholder: 'Miễn phí' },
      { key: 'status', label: 'Nút trạng thái', placeholder: 'Đăng ký' },
    ],
  },
  {
    table: 'courses',
    label: 'Khóa học',
    titleKey: 'title',
    imageKey: 'image',
    fields: [
      { key: 'title', label: 'Tên khóa', placeholder: 'BEGINNER' },
      { key: 'subtitle', label: 'Mô tả ngắn', placeholder: 'Nền tảng vàng cho người mới bắt đầu' },
      { key: 'description', label: 'Mô tả chi tiết', type: 'textarea', placeholder: 'Lộ trình từ con số 0...' },
      { key: 'duration', label: 'Thời lượng', placeholder: '3 tháng (24 buổi)' },
      { key: 'price', label: 'Học phí', placeholder: 'Liên hệ tư vấn' },
      { key: 'image', label: 'Ảnh khóa học', type: 'image', imageAspect: 4 / 3 },
    ],
  },
  {
    table: 'posts',
    label: 'Bài viết',
    titleKey: 'title',
    imageKey: 'image',
    fields: [
      { key: 'title', label: 'Tiêu đề', placeholder: 'Người mới học saxophone...' },
      { key: 'slug', label: 'Slug URL', placeholder: 'nguoi-moi-hoc-saxophone' },
      { key: 'date', label: 'Ngày đăng', placeholder: '10 Tháng 5, 2026' },
      { key: 'excerpt', label: 'Tóm tắt', type: 'textarea', rows: 3, placeholder: 'Mô tả ngắn hiển thị ở card blog' },
      { key: 'content', label: 'Nội dung bài viết', type: 'textarea', rows: 8, placeholder: 'Nội dung dài, tạo đoạn mới bằng dòng trống' },
      { key: 'image', label: 'Ảnh bìa', type: 'image', imageAspect: 16 / 9 },
    ],
  },
  {
    table: 'media',
    label: 'Video biểu diễn',
    titleKey: 'title',
    imageKey: 'thumbnail',
    fields: [
      { key: 'title', label: 'Tiêu đề video', placeholder: 'Hạ Trắng - Live Acoustic' },
      { key: 'category', label: 'Chuyên mục', placeholder: 'VIDEO BIỂU DIỄN' },
      { key: 'duration', label: 'Thời lượng', placeholder: '05:42' },
      { key: 'thumbnail', label: 'Thumbnail', type: 'image', imageAspect: 16 / 9 },
      { key: 'video_url', label: 'Link nhúng video', placeholder: 'https://www.youtube.com/embed/...' },
    ],
  },
];

const fieldClass =
  'w-full bg-[#FBF6EC] border border-[#BF9B30]/25 text-[#2A2520] text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#AF8C43] focus:ring-2 focus:ring-[#AF8C43]/15 transition-colors';
const labelClass = 'block text-[10px] uppercase font-bold tracked-sm text-[#9A7C30] mb-1.5';

/* ------------------------------------------------------------------ */
/* Image cropper — tải ảnh từ máy, cắt + căn chỉnh + xem trước rồi lưu  */
/* ------------------------------------------------------------------ */

const ASPECT_PRESETS: Array<{ label: string; value: number }> = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
];

/** Cạnh dài tối đa của ảnh xuất ra, để file upload không quá nặng. */
const MAX_OUTPUT_EDGE = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error('Không đọc được ảnh.')));
    image.src = src;
  });
}

/** Cắt vùng `area` (theo pixel ảnh gốc) ra một Blob JPEG. */
async function cropToBlob(imageSrc: string, area: Area): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const longest = Math.max(area.width, area.height);
  const scale = longest > MAX_OUTPUT_EDGE ? MAX_OUTPUT_EDGE / longest : 1;
  const outW = Math.max(1, Math.round(area.width * scale));
  const outH = Math.max(1, Math.round(area.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ canvas.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, outW, outH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Không xuất được ảnh.'))),
      'image/jpeg',
      0.9,
    );
  });
}

function getImageFileError(file: File | null | undefined) {
  if (!file) return '';
  if (!file.type.startsWith('image/')) return 'Vui lòng chọn tệp ảnh.';
  if (file.size > 10 * 1024 * 1024) return 'Ảnh gốc nên nhỏ hơn 10MB.';
  if (!isSupabaseConfigured || !supabase) return 'Cần kết nối Supabase để lưu ảnh.';
  return '';
}

async function uploadImageBlob(blob: Blob): Promise<string> {
  if (!supabase) throw new Error('Chưa kết nối Supabase.');
  const path = `${Date.now()}-crop.jpg`;
  const { error: uploadError } = await supabase.storage.from('site-images').upload(path, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/jpeg',
  });
  if (uploadError) throw new Error(`Lỗi tải ảnh: ${uploadError.message}`);
  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return data.publicUrl;
}

function ImageCropperModal({
  file,
  initialAspect,
  onCancel,
  onConfirm,
}: {
  file: File;
  initialAspect: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => Promise<void>;
}) {
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialAspect);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Create the preview URL in an effect (not useState) so StrictMode's
  // mount → cleanup → remount cycle recreates it instead of leaving a revoked
  // URL behind; keying on `file` also refreshes it for each queued upload.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // One synchronous set to expose the fresh URL; revoke uses the local `url`
    // so StrictMode's remount recreates it instead of reusing a revoked one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!areaPixels) return;
    setBusy(true);
    setError('');
    try {
      const blob = await cropToBlob(imageSrc, areaPixels);
      await onConfirm(blob);
      // Thành công: parent gỡ modal, không cần reset state ở đây.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cắt ảnh thất bại.');
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-[1.3rem] border border-[#BF9B30]/20 bg-[#FFFDF9] shadow-[0_24px_60px_rgba(33,29,24,0.28)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#BF9B30]/15 px-5 py-3.5">
          <h3 className="flex items-center gap-2 font-serif-lux text-lg text-[#211D18]">
            <Crop size={18} className="text-[#AF8C43]" /> Cắt &amp; căn chỉnh ảnh
          </h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-[#9A7C30] transition-colors hover:bg-[#F6EFDF] disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-[320px] w-full bg-[#211D18]">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              minZoom={1}
              maxZoom={3}
              restrictPosition
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracked-sm text-[#9A7C30]">Tỉ lệ</span>
            {ASPECT_PRESETS.map((preset) => {
              const active = Math.abs(aspect - preset.value) < 0.001;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAspect(preset.value)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors ${
                    active
                      ? 'border-[#AF8C43] bg-[#AF8C43] text-white'
                      : 'border-[#BF9B30]/30 text-[#9A7C30] hover:bg-[#F6EFDF]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-bold uppercase tracked-sm text-[#9A7C30]">Phóng to</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-[#AF8C43]"
            />
          </label>

          <p className="text-[11px] text-[#2A2520]/55">
            Kéo ảnh để di chuyển, kéo thanh để phóng to. Vùng trong khung chính là ảnh sẽ được lưu.
          </p>

          {error && (
            <p className="rounded-lg border border-[#B4452F]/20 bg-[#B4452F]/5 px-3 py-2 text-xs text-[#B4452F]">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#BF9B30]/15 px-5 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-[#BF9B30]/30 px-4 py-2 text-[11px] font-bold uppercase tracked-sm text-[#9A7C30] transition-colors hover:bg-[#F6EFDF] disabled:opacity-40"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={busy || !areaPixels}
            className="btn-luxury inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] px-5 py-2.5 text-[11px] font-bold uppercase tracked-sm text-white shadow-[0_8px_20px_rgba(191,155,48,0.28)] disabled:opacity-60"
          >
            <Check size={14} /> {busy ? 'Đang lưu…' : 'Cắt & Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageField({
  value,
  aspect = 4 / 3,
  onChange,
}: {
  value: string;
  aspect?: number;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState('');
  const [previewFailed, setPreviewFailed] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = (file: File | null | undefined) => {
    setError('');
    if (!file) return;
    const nextError = getImageFileError(file);
    if (nextError) {
      setError(nextError);
      return;
    }
    setCropFile(file);
  };

  const uploadCropped = async (blob: Blob) => {
    setUploading(true);
    try {
      const publicUrl = await uploadImageBlob(blob);
      onChange(publicUrl);
      setPreviewFailed(false);
      setCropFile(null);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    pickFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="group relative flex min-h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#BF9B30]/35 bg-[#FBF6EC] text-center transition-colors hover:border-[#AF8C43]"
      >
        {value && !previewFailed ? (
          <>
            <img
              src={value}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setPreviewFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-[#211D18]/0 text-xs font-bold uppercase tracked-sm text-white opacity-0 transition-all group-hover:bg-[#211D18]/40 group-hover:opacity-100">
              <UploadCloud size={16} /> {uploading ? 'Đang tải…' : 'Đổi ảnh'}
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-xs text-[#2A2520]/55">
            <UploadCloud size={24} className="text-[#AF8C43]" />
            {uploading ? 'Đang tải ảnh lên…' : value ? 'Ảnh lỗi hoặc không tải được' : 'Chọn hoặc kéo ảnh vào đây'}
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            pickFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>

      <div className="flex min-h-5 items-center justify-between gap-3 text-[11px] text-[#2A2520]/55">
        <span>Tải ảnh từ máy — bạn sẽ cắt &amp; căn chỉnh trước khi lưu.</span>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setPreviewFailed(false);
            }}
            className="font-bold text-[#B4452F] hover:underline"
          >
            Xóa ảnh
          </button>
        )}
        {!isSupabaseConfigured && <span className="text-[#9A7C30]">Chưa nối Supabase</span>}
      </div>

      {error && <p className="rounded-lg border border-[#B4452F]/20 bg-[#B4452F]/5 px-3 py-2 text-xs text-[#B4452F]">{error}</p>}

      {cropFile && (
        <ImageCropperModal
          file={cropFile}
          initialAspect={aspect}
          onCancel={() => setCropFile(null)}
          onConfirm={uploadCropped}
        />
      )}
    </div>
  );
}

function GalleryField({
  value,
  aspect = 16 / 9,
  onChange,
}: {
  value: string[];
  aspect?: number;
  onChange: (value: string[]) => void;
}) {
  const [error, setError] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const images = value.filter(Boolean);

  const pickFile = (file: File | null | undefined) => {
    setError('');
    if (!file) return;
    const nextError = getImageFileError(file);
    if (nextError) {
      setError(nextError);
      return;
    }
    setCropFile(file);
  };

  const uploadCropped = async (blob: Blob) => {
    setUploading(true);
    try {
      const publicUrl = await uploadImageBlob(blob);
      onChange([...images, publicUrl]);
      setCropFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => onChange(images.filter((_, imageIndex) => imageIndex !== index));

  const moveAt = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    [nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
    onChange(nextImages);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    pickFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="group relative aspect-video overflow-hidden rounded-xl border border-[#BF9B30]/20 bg-[#FBF6EC]">
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => moveAt(index, -1)}
                disabled={index === 0}
                aria-label="Đưa ảnh sang trái"
                className="grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-[#211D18]/70 text-white backdrop-blur transition-colors hover:bg-[#211D18]/85 disabled:opacity-35"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveAt(index, 1)}
                disabled={index === images.length - 1}
                aria-label="Đưa ảnh sang phải"
                className="grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-[#211D18]/70 text-white backdrop-blur transition-colors hover:bg-[#211D18]/85 disabled:opacity-35"
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Xóa ảnh"
                className="grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-[#B4452F]/80 text-white backdrop-blur transition-colors hover:bg-[#8f3322]"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#BF9B30]/35 bg-[#FBF6EC] px-3 text-center text-xs font-semibold text-[#2A2520]/60 transition-colors hover:border-[#AF8C43] hover:bg-[#F6EFDF]"
        >
          <UploadCloud size={22} className="text-[#AF8C43]" />
          {uploading ? 'Đang tải ảnh…' : '+ Thêm ảnh'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              pickFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
      </div>

      <p className="text-[11px] leading-relaxed text-[#2A2520]/55">
        Ảnh hiển thị theo thứ tự trái → phải. Tải nhiều ảnh cho một dấu mốc; đẹp nhất khoảng 1-5 ảnh.
      </p>

      {!isSupabaseConfigured && <p className="text-[11px] text-[#9A7C30]">Chưa nối Supabase</p>}
      {error && <p className="rounded-lg border border-[#B4452F]/20 bg-[#B4452F]/5 px-3 py-2 text-xs text-[#B4452F]">{error}</p>}

      {cropFile && (
        <ImageCropperModal
          file={cropFile}
          initialAspect={aspect}
          onCancel={() => setCropFile(null)}
          onConfirm={uploadCropped}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Per-resource editor                                                 */
/* ------------------------------------------------------------------ */

function ResourceEditor({ def }: { def: ResourceDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from(def.table).select('*').order('sort_order', { ascending: true });
    setLoading(false);
    if (error) setStatus(`Lỗi tải dữ liệu: ${error.message}`);
    else setRows((data as Row[]) ?? []);
  }, [def.table]);

  useEffect(() => {
    // load() only updates state after an awaited fetch, so there is no synchronous cascade here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const setField = (id: string, key: string, value: string | string[]) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)));

  const save = async (row: Row) => {
    if (!supabase) return;
    setBusyId(row.id);
    const { error } = await supabase.from(def.table).upsert(row);
    setStatus(error ? `Lỗi lưu: ${error.message}` : 'Đã lưu thay đổi ✓');
    setBusyId(null);
    if (!error) void load();
  };

  const remove = async (id: string) => {
    if (!supabase || !window.confirm('Xóa mục này? Hành động không thể hoàn tác.')) return;
    setBusyId(id);
    const { error } = await supabase.from(def.table).delete().eq('id', id);
    setStatus(error ? `Lỗi xóa: ${error.message}` : 'Đã xóa mục.');
    setBusyId(null);
    if (!error) void load();
  };

  const addNew = async () => {
    if (!supabase) return;
    // Mục mới nhận sort_order nhỏ nhất để hiện ở ĐẦU danh sách (list sắp xếp tăng dần).
    const minOrder = rows.length ? Math.min(...rows.map((row) => Number(row.sort_order) || 0)) : 0;
    const blank: Record<string, string | number | string[]> = { sort_order: minOrder - 1 };
    def.fields.forEach((field) => {
      blank[field.key] = field.type === 'gallery' ? [] : '';
    });
    const { error } = await supabase.from(def.table).insert(blank);
    setStatus(error ? `Lỗi thêm: ${error.message}` : 'Đã thêm mục mới ở đầu danh sách — chỉnh sửa rồi nhấn Lưu.');
    if (!error) void load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!supabase) return;
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    await supabase.from(def.table).upsert([
      { ...a, sort_order: b.sort_order },
      { ...b, sort_order: a.sort_order },
    ]);
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="font-sans-clean text-sm text-[#2A2520]/60">
          {loading ? 'Đang tải…' : `${rows.length} mục`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#BF9B30]/30 text-[#9A7C30] text-[11px] font-bold uppercase tracked-sm hover:bg-[#F6EFDF] transition-colors"
          >
            <RefreshCw size={13} /> Tải lại
          </button>
          <button
            type="button"
            onClick={() => void addNew()}
            className="btn-luxury inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-[11px] font-bold uppercase tracked-sm shadow-[0_8px_20px_rgba(191,155,48,0.28)]"
          >
            <Plus size={14} /> Thêm mục
          </button>
        </div>
      </div>

      {status && (
        <p className="mb-5 rounded-xl border border-[#BF9B30]/25 bg-[#FBF6EC] px-4 py-2.5 text-xs text-[#2A2520]/75">{status}</p>
      )}

      <div className="space-y-5">
        {rows.map((row, index) => (
          <article key={row.id} className="rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] shadow-[var(--shadow-card)] p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-serif-lux text-lg text-[#211D18] leading-snug">
                {String(row[def.titleKey] || '(chưa có tiêu đề)')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => void move(index, -1)} disabled={index === 0} aria-label="Lên" className="p-1.5 rounded-lg text-[#9A7C30] hover:bg-[#F6EFDF] disabled:opacity-30 transition-colors">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => void move(index, 1)} disabled={index === rows.length - 1} aria-label="Xuống" className="p-1.5 rounded-lg text-[#9A7C30] hover:bg-[#F6EFDF] disabled:opacity-30 transition-colors">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {def.fields.map((field) => {
                const isImageField = field.type === 'image' || field.key === 'image' || field.key === 'thumbnail';
                const isGalleryField = field.type === 'gallery';
                const isWide = field.type === 'textarea' || isImageField || isGalleryField;
                const fieldValue = row[field.key];
                const galleryValue = Array.isArray(fieldValue)
                  ? fieldValue.filter((item): item is string => typeof item === 'string')
                  : [];
                return (
                  <div key={field.key} className={isWide ? 'sm:col-span-2' : ''}>
                    <span className={labelClass}>{field.label}</span>
                    {isImageField ? (
                      <ImageField
                        value={String(row[field.key] ?? '')}
                        aspect={field.imageAspect}
                        onChange={(value) => setField(row.id, field.key, value)}
                      />
                    ) : isGalleryField ? (
                      <GalleryField
                        value={galleryValue}
                        aspect={field.imageAspect}
                        onChange={(value) => setField(row.id, field.key, value)}
                      />
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={field.rows ?? 3}
                        value={String(row[field.key] ?? '')}
                        placeholder={field.placeholder}
                        onChange={(event) => setField(row.id, field.key, event.target.value)}
                        className={`${fieldClass} resize-y`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(row[field.key] ?? '')}
                        placeholder={field.placeholder}
                        onChange={(event) => setField(row.id, field.key, event.target.value)}
                        className={fieldClass}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => void remove(row.id)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracked-sm text-[#B4452F] hover:text-[#8f3322] transition-colors"
              >
                <Trash2 size={14} /> Xóa
              </button>
              <button
                type="button"
                onClick={() => void save(row)}
                disabled={busyId === row.id}
                className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-[11px] font-bold uppercase tracked-sm shadow-[0_8px_20px_rgba(191,155,48,0.28)] disabled:opacity-60"
              >
                <Save size={14} /> {busyId === row.id ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </article>
        ))}

        {!loading && rows.length === 0 && (
          <p className="rounded-[1.1rem] border border-dashed border-[#BF9B30]/30 bg-[#FFFDF9] px-5 py-8 text-center text-sm text-[#2A2520]/55">
            Chưa có dữ liệu. Nhấn “Thêm mục” để tạo mới. (Trang công khai đang hiển thị dữ liệu mặc định cho tới khi bảng này có dữ liệu.)
          </p>
        )}
      </div>
    </div>
  );
}

type SiteImageKey = 'hero_image' | 'about_image';

const siteImageSlots: Array<{ key: SiteImageKey; label: string; fallback: string; aspect: number }> = [
  { key: 'hero_image', label: 'Ảnh Hero', fallback: defaultHeroImage, aspect: 3 / 4 },
  { key: 'about_image', label: 'Ảnh Giới thiệu', fallback: defaultAboutImage, aspect: 4 / 3 },
];

function SiteImagesEditor() {
  const [values, setValues] = useState<Record<SiteImageKey, string>>({
    hero_image: defaultHeroImage,
    about_image: defaultAboutImage,
  });
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<SiteImageKey | null>(null);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('settings').select('key,value').in('key', siteImageSlots.map((slot) => slot.key));
    setLoading(false);
    if (error) {
      setStatus(`Lỗi tải ảnh: ${error.message}`);
      return;
    }
    const next = { hero_image: defaultHeroImage, about_image: defaultAboutImage };
    (data as Array<{ key: SiteImageKey; value: string }> | null)?.forEach((item) => {
      next[item.key] = item.value || next[item.key];
    });
    setValues(next);
  }, []);

  useEffect(() => {
    // load() only updates state after an awaited fetch, so there is no synchronous cascade here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const save = async (key: SiteImageKey) => {
    if (!supabase) return;
    setBusyKey(key);
    const { error } = await supabase.from('settings').upsert({
      key,
      value: values[key],
      updated_at: new Date().toISOString(),
    });
    setStatus(error ? `Lỗi lưu: ${error.message}` : 'Đã lưu ảnh trang web ✓');
    setBusyKey(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans-clean text-sm text-[#2A2520]/60">{loading ? 'Đang tải…' : '2 vị trí ảnh'}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#BF9B30]/30 text-[#9A7C30] text-[11px] font-bold uppercase tracked-sm hover:bg-[#F6EFDF] transition-colors"
        >
          <RefreshCw size={13} /> Tải lại
        </button>
      </div>
      {status && <p className="rounded-xl border border-[#BF9B30]/25 bg-[#FBF6EC] px-4 py-2.5 text-xs text-[#2A2520]/75">{status}</p>}
      {siteImageSlots.map((slot) => (
        <section key={slot.key} className="rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-serif-lux text-lg text-[#211D18]">{slot.label}</h3>
            <button
              type="button"
              onClick={() => void save(slot.key)}
              disabled={busyKey === slot.key}
              className="btn-luxury inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-[11px] font-bold uppercase tracked-sm shadow-[0_8px_20px_rgba(191,155,48,0.28)] disabled:opacity-60"
            >
              <Save size={14} /> {busyKey === slot.key ? 'Đang lưu…' : 'Lưu'}
            </button>
          </div>
          <ImageField
            value={values[slot.key]}
            aspect={slot.aspect}
            onChange={(value) => setValues((current) => ({ ...current, [slot.key]: value }))}
          />
        </section>
      ))}
    </div>
  );
}

function PhotoLibraryEditor() {
  const [rows, setRows] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  // sort_order for the first image of the current batch; each image gets
  // batchStartOrder + its position so the batch keeps its picked order and
  // sits ahead of existing photos.
  const [batchStartOrder, setBatchStartOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('photos').select('*').order('sort_order', { ascending: true });
    setLoading(false);
    if (error) setStatus(`Lỗi tải thư viện ảnh: ${error.message}`);
    else setRows((data as PhotoRow[]) ?? []);
  }, []);

  useEffect(() => {
    // load() only updates state after an awaited fetch, so there is no synchronous cascade here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const acceptFiles = (fileList: FileList | null | undefined) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const nextError = getImageFileError(file);
      if (nextError) errors.push(`${file.name}: ${nextError}`);
      else validFiles.push(file);
    });

    if (errors.length > 0) setStatus(errors.join(' '));
    if (validFiles.length === 0) return;
    const minOrder = rows.length ? Math.min(...rows.map((row) => Number(row.sort_order) || 0)) : 0;
    setBatchStartOrder(minOrder - validFiles.length);
    setQueue(validFiles);
    setQueueTotal(validFiles.length);
    setUploadedCount(0);
    setSkippedCount(0);
    setStatus(`${validFiles.length} ảnh đang chờ cắt & tải lên.`);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    acceptFiles(event.dataTransfer.files);
  };

  const uploadCurrent = async (blob: Blob) => {
    if (!supabase || queue.length === 0) return;
    setUploading(true);
    try {
      const publicUrl = await uploadImageBlob(blob);
      // Position of this image within the batch (0-based), so picked order is kept.
      const position = queueTotal - queue.length;
      const { error } = await supabase.from('photos').insert({
        caption: '',
        image: publicUrl,
        sort_order: batchStartOrder + position,
      });
      if (error) {
        setStatus(`Lỗi thêm ảnh: ${error.message}`);
        return;
      }

      const nextUploaded = uploadedCount + 1;
      const remainingQueue = queue.slice(1);
      setUploadedCount(nextUploaded);
      setQueue(remainingQueue);
      setStatus(
        remainingQueue.length > 0
          ? `Đã tải ${nextUploaded}/${queueTotal} ảnh. Tiếp tục cắt ảnh kế tiếp.`
          : `Hoàn tất: đã tải ${nextUploaded}/${queueTotal} ảnh${skippedCount > 0 ? `, bỏ qua ${skippedCount}` : ''}.`,
      );
      void load();
    } finally {
      setUploading(false);
    }
  };

  const skipCurrent = () => {
    const nextSkipped = skippedCount + 1;
    const remainingQueue = queue.slice(1);
    setSkippedCount(nextSkipped);
    setQueue(remainingQueue);
    setStatus(
      remainingQueue.length > 0
        ? `Đã bỏ qua ảnh. Còn ${remainingQueue.length} ảnh trong hàng đợi.`
        : `Hoàn tất: đã tải ${uploadedCount}/${queueTotal} ảnh, bỏ qua ${nextSkipped}.`,
    );
  };

  const setCaption = (id: string, caption: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, caption } : row)));
  };

  const save = async (row: PhotoRow) => {
    if (!supabase) return;
    setBusyId(row.id);
    const { error } = await supabase.from('photos').upsert(row);
    setStatus(error ? `Lỗi lưu ảnh: ${error.message}` : 'Đã lưu chú thích ảnh ✓');
    setBusyId(null);
    if (!error) void load();
  };

  const remove = async (row: PhotoRow) => {
    if (!supabase || !window.confirm('Xóa ảnh này? Hành động không thể hoàn tác.')) return;
    setBusyId(row.id);
    const { error } = await supabase.from('photos').delete().eq('id', row.id);
    setStatus(error ? `Lỗi xóa ảnh: ${error.message}` : 'Đã xóa ảnh.');
    setBusyId(null);
    if (!error) void load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!supabase) return;
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    await supabase.from('photos').upsert([
      { ...a, sort_order: b.sort_order },
      { ...b, sort_order: a.sort_order },
    ]);
    void load();
  };

  const currentFile = queue[0] ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans-clean text-sm text-[#2A2520]/60">{loading ? 'Đang tải...' : `${rows.length} ảnh`}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#BF9B30]/30 px-3.5 py-2 text-[11px] font-bold uppercase tracked-sm text-[#9A7C30] transition-colors hover:bg-[#F6EFDF] sm:self-auto"
        >
          <RefreshCw size={13} /> Tải lại
        </button>
      </div>

      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.1rem] border border-dashed border-[#BF9B30]/35 bg-[#FFFDF9] px-5 py-8 text-center transition-colors hover:border-[#AF8C43] hover:bg-[#FBF6EC]"
      >
        <UploadCloud size={28} className="text-[#AF8C43]" />
        <span className="font-serif-lux text-xl text-[#211D18]">Thêm ảnh vào thư viện</span>
        <span className="max-w-md font-sans-clean text-xs leading-relaxed text-[#2A2520]/58">
          Chọn nhiều ảnh cùng lúc hoặc kéo thả vào đây. Mỗi ảnh sẽ được cắt riêng trước khi tải lên.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            acceptFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </label>

      {status && <p className="rounded-xl border border-[#BF9B30]/25 bg-[#FBF6EC] px-4 py-2.5 text-xs text-[#2A2520]/75">{status}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, index) => (
          <article key={row.id} className="overflow-hidden rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] shadow-[var(--shadow-card)]">
            <div className="relative aspect-[4/5] bg-[#FBF6EC]">
              <img
                src={row.image}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => void move(index, -1)}
                  disabled={index === 0}
                  aria-label="Đưa ảnh lên trước"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-[#211D18]/70 text-white backdrop-blur transition-colors hover:bg-[#211D18]/85 disabled:opacity-35"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => void move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Đưa ảnh xuống sau"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-[#211D18]/70 text-white backdrop-blur transition-colors hover:bg-[#211D18]/85 disabled:opacity-35"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => void remove(row)}
                  disabled={busyId === row.id}
                  aria-label="Xóa ảnh"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-[#B4452F]/85 text-white backdrop-blur transition-colors hover:bg-[#8f3322] disabled:opacity-60"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <label className="block">
                <span className={labelClass}>Chú thích</span>
                <input
                  type="text"
                  value={row.caption ?? ''}
                  onChange={(event) => setCaption(row.id, event.target.value)}
                  className={fieldClass}
                  placeholder="Hậu trường, đời thường, kỷ niệm..."
                />
              </label>
              <button
                type="button"
                onClick={() => void save(row)}
                disabled={busyId === row.id}
                className="btn-luxury inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] px-5 py-2.5 text-[11px] font-bold uppercase tracked-sm text-white shadow-[0_8px_20px_rgba(191,155,48,0.28)] disabled:opacity-60"
              >
                <Save size={14} /> {busyId === row.id ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {!loading && rows.length === 0 && (
        <p className="rounded-[1.1rem] border border-dashed border-[#BF9B30]/30 bg-[#FFFDF9] px-5 py-8 text-center text-sm text-[#2A2520]/55">
          Chưa có ảnh cá nhân. Hãy tải ảnh đầu tiên để dải Khoảnh khắc xuất hiện trên trang Giới thiệu.
        </p>
      )}

      {currentFile && (
        <ImageCropperModal
          // Remount per queued image so busy/crop/zoom state resets for each one
          // (the modal instance is otherwise reused as the queue advances).
          key={queueTotal - queue.length}
          file={currentFile}
          initialAspect={4 / 3}
          onCancel={skipCurrent}
          onConfirm={uploadCurrent}
        />
      )}
    </div>
  );
}

type LeadRow = {
  id: string;
  kind: 'contact' | 'workshop';
  name: string;
  phone: string;
  course: string;
  note: string;
  status: 'new' | 'done';
  created_at: string;
};

function LeadsManager() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLoading(false);
    if (error) setStatus(`Lỗi tải đăng ký: ${error.message}`);
    else setLeads((data as LeadRow[]) ?? []);
  }, []);

  useEffect(() => {
    // load() only updates state after an awaited fetch, so there is no synchronous cascade here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const toggleStatus = async (lead: LeadRow) => {
    if (!supabase) return;
    setBusyId(lead.id);
    const nextStatus = lead.status === 'done' ? 'new' : 'done';
    const { error } = await supabase.from('leads').update({ status: nextStatus }).eq('id', lead.id);
    setStatus(error ? `Lỗi cập nhật: ${error.message}` : 'Đã cập nhật trạng thái.');
    setBusyId(null);
    if (!error) void load();
  };

  const remove = async (lead: LeadRow) => {
    if (!supabase || !window.confirm('Xóa đăng ký này?')) return;
    setBusyId(lead.id);
    const { error } = await supabase.from('leads').delete().eq('id', lead.id);
    setStatus(error ? `Lỗi xóa: ${error.message}` : 'Đã xóa đăng ký.');
    setBusyId(null);
    if (!error) void load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans-clean text-sm text-[#2A2520]/60">{loading ? 'Đang tải…' : `${leads.length} đăng ký`}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#BF9B30]/30 text-[#9A7C30] text-[11px] font-bold uppercase tracked-sm hover:bg-[#F6EFDF] transition-colors"
        >
          <RefreshCw size={13} /> Tải lại
        </button>
      </div>
      {status && <p className="rounded-xl border border-[#BF9B30]/25 bg-[#FBF6EC] px-4 py-2.5 text-xs text-[#2A2520]/75">{status}</p>}
      <div className="space-y-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F6EFDF] px-3 py-1 text-[10px] font-bold uppercase tracked-sm text-[#9A7C30]">
                    {lead.kind === 'workshop' ? 'Workshop' : 'Liên hệ'}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracked-sm ${lead.status === 'done' ? 'bg-[#E7F4E8] text-[#3E7B42]' : 'bg-[#FFF2DA] text-[#A46B18]'}`}>
                    {lead.status === 'done' ? 'Đã xử lý' : 'Mới'}
                  </span>
                </div>
                <h3 className="mt-3 font-serif-lux text-xl text-[#211D18]">{lead.name || '(chưa có tên)'}</h3>
                <p className="mt-1 font-sans-clean text-sm text-[#2A2520]/70">{lead.phone || '(chưa có SĐT)'}</p>
                <p className="mt-2 font-sans-clean text-xs text-[#2A2520]/58">Khóa/sự kiện: {lead.course || 'Chưa chọn'}</p>
                {lead.note && <p className="mt-2 font-sans-clean text-xs text-[#2A2520]/65">Ghi chú: {lead.note}</p>}
                <p className="mt-2 font-sans-clean text-[11px] text-[#2A2520]/45">
                  {lead.created_at ? new Date(lead.created_at).toLocaleString('vi-VN') : ''}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void toggleStatus(lead)}
                  disabled={busyId === lead.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#BF9B30]/35 px-3.5 py-2 text-[11px] font-bold uppercase tracked-sm text-[#9A7C30] transition-colors hover:bg-[#F6EFDF] disabled:opacity-60"
                >
                  {lead.status === 'done' ? 'Đánh dấu mới' : 'Đã xử lý'}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(lead)}
                  disabled={busyId === lead.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#B4452F]/25 px-3.5 py-2 text-[11px] font-bold uppercase tracked-sm text-[#B4452F] transition-colors hover:bg-[#B4452F]/5 disabled:opacity-60"
                >
                  <Trash2 size={13} /> Xóa
                </button>
              </div>
            </div>
          </article>
        ))}
        {!loading && leads.length === 0 && (
          <p className="rounded-[1.1rem] border border-dashed border-[#BF9B30]/30 bg-[#FFFDF9] px-5 py-8 text-center text-sm text-[#2A2520]/55">
            Chưa có đăng ký nào.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-to-b from-[#FBF9F4] to-[#F4EDDF]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[1.4rem] border border-[#BF9B30]/20 bg-[#FFFDF9] shadow-[var(--shadow-soft)] p-7 sm:p-8 space-y-5">
        <div className="text-center">
          <span className="font-vietnamese-signature text-3xl text-[#AF8C43]">Lê Duy Mạnh</span>
          <h1 className="font-serif-lux text-2xl text-[#211D18] mt-1">Trang quản trị</h1>
          <p className="font-sans-clean text-xs text-[#2A2520]/55 mt-1">Đăng nhập để chỉnh sửa nội dung</p>
        </div>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="admin@email.com" />
        </label>
        <label className="block">
          <span className={labelClass}>Mật khẩu</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} placeholder="••••••••" />
        </label>
        {error && <p className="text-xs text-[#B4452F]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-luxury w-full py-3.5 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-xs font-bold uppercase tracked-sm shadow-[0_10px_26px_rgba(191,155,48,0.30)] disabled:opacity-60"
        >
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <a href="/" className="block text-center text-[11px] text-[#2A2520]/50 hover:text-[#AF8C43] transition-colors">← Về trang chủ</a>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Setup guide (shown until Supabase env vars are present)             */
/* ------------------------------------------------------------------ */

function SetupGuide() {
  return (
    <div className="min-h-screen px-5 py-16 bg-gradient-to-b from-[#FBF9F4] to-[#F4EDDF]">
      <div className="max-w-2xl mx-auto rounded-[1.4rem] border border-[#BF9B30]/20 bg-[#FFFDF9] shadow-[var(--shadow-soft)] p-7 sm:p-9">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#BF9B30] to-[#DFBD69] text-white">
            <Settings size={20} />
          </span>
          <div>
            <h1 className="font-serif-lux text-2xl text-[#211D18]">Chưa kết nối Supabase</h1>
            <p className="font-sans-clean text-xs text-[#2A2520]/55">Làm theo 3 bước để bật trang quản trị</p>
          </div>
        </div>
        <ol className="space-y-4 font-sans-clean text-sm text-[#2A2520]/80 leading-relaxed list-decimal pl-5">
          <li>Tạo project miễn phí tại <strong>supabase.com</strong>, vào <em>SQL Editor</em> và chạy file <code className="px-1.5 py-0.5 rounded bg-[#FBF6EC] text-[#9A7C30]">supabase-setup.sql</code> (nằm ở thư mục gốc dự án) để tạo bảng &amp; phân quyền.</li>
          <li>Vào <em>Authentication → Users</em>, tạo 1 tài khoản admin (email + mật khẩu) để đăng nhập trang này.</li>
          <li>Tạo file <code className="px-1.5 py-0.5 rounded bg-[#FBF6EC] text-[#9A7C30]">.env.local</code> ở thư mục gốc với 2 dòng sau (lấy trong <em>Project Settings → API</em>) rồi khởi động lại:</li>
        </ol>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-[#211D18] text-[#F2E6C2] text-xs p-4 leading-relaxed">{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}</pre>
        <p className="mt-5 font-sans-clean text-xs text-[#2A2520]/55">
          Trong lúc chờ cấu hình, trang web vẫn chạy bình thường với dữ liệu mặc định có sẵn trong mã nguồn.
        </p>
        <a href="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracked-sm text-[#9A7C30] hover:text-[#AF8C43] transition-colors">
          <ArrowLeft size={14} /> Về trang chủ
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin shell                                                         */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(() => !supabase);
  const [tab, setTab] = useState(resources[0].table);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <SetupGuide />;
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#2A2520]/55 bg-[#FBF9F4]">Đang tải…</div>
    );
  }
  if (!session) return <LoginForm />;

  const adminTabs = [
    ...resources.map((resource) => ({
      id: resource.table,
      label: resource.label,
      content: <ResourceEditor key={resource.table} def={resource} />,
    })),
    {
      id: 'site-images',
      label: 'Hình ảnh trang web',
      content: <SiteImagesEditor />,
    },
    {
      id: 'photos',
      label: 'Thư viện ảnh',
      content: <PhotoLibraryEditor />,
    },
    {
      id: 'leads',
      label: 'Liên hệ / Đăng ký',
      content: <LeadsManager />,
    },
  ];
  const activeTab = adminTabs.find((item) => item.id === tab) ?? adminTabs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF9F4] to-[#F4EDDF] text-[#2A2520]">
      <header className="sticky top-0 z-10 border-b border-[#BF9B30]/15 bg-[#FFFDF9]/85 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="leading-none">
            <span className="font-serif-lux text-lg text-[#211D18]">Quản trị nội dung</span>
            <span className="block font-sans-clean text-[10px] uppercase tracked-sm text-[#9A7C30] mt-1">Lê Duy Mạnh Saxophone</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#BF9B30]/30 text-[#9A7C30] text-[11px] font-bold uppercase tracked-sm hover:bg-[#F6EFDF] transition-colors">
              <ArrowLeft size={13} /> <span className="hidden sm:inline">Trang chủ</span>
            </a>
            <button
              type="button"
              onClick={() => void supabase?.auth.signOut()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#BF9B30]/30 text-[#2A2520]/70 text-[11px] font-bold uppercase tracked-sm hover:bg-[#F6EFDF] transition-colors"
            >
              <LogOut size={13} /> <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-7">
          {adminTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracked-sm transition-all ${
                tab === item.id
                  ? 'bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white shadow-[0_8px_20px_rgba(191,155,48,0.25)]'
                  : 'border border-[#BF9B30]/25 text-[#9A7C30] hover:bg-[#F6EFDF]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeTab.content}
      </div>
    </div>
  );
}
