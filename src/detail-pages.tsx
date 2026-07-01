import type { FormEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Music2,
  Play,
  Sparkles,
  Star,
  Ticket,
} from 'lucide-react';
import { SafeImage } from './sections';
import type { ArtistProfile, Course, LeadFormErrors, LeadFormField, MediaItem, Tour, Workshop } from './content';
import { normalizeVideoEmbedUrl } from './lib/video-url';

const fieldClassName =
  'focus-ring w-full bg-[#FBF6EC] border border-[#BF9B30]/25 text-[#2A2520] text-sm px-4 py-3 focus:border-[#AF8C43] focus:ring-2 focus:ring-[#AF8C43]/15 transition-colors rounded-xl';
const invalidFieldClassName =
  'border-[#B4452F]/75 focus:border-[#B4452F] focus:ring-[#B4452F]/15';
const labelClassName = 'ui-label tracked-sm';

const getFieldClassName = (hasError = false) =>
  hasError ? `${fieldClassName} ${invalidFieldClassName}` : fieldClassName;

function MetaChip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BF9B30]/20 bg-[#FAF5EB] px-3.5 py-1.5 text-xs font-sans-clean font-semibold text-[#2A2520]/75">
      <span className="text-[#AF8C43]">{icon}</span>
      {children}
    </span>
  );
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-9 first:mt-0">
      <h2 className="font-serif-lux text-xl sm:text-2xl font-medium text-[#211D18]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

interface DetailShellProps {
  kicker: string;
  kickerIcon?: ReactNode;
  title: string;
  lede?: string;
  image?: string;
  hero?: ReactNode;
  metaChips?: ReactNode;
  backLabel: string;
  onBack: () => void;
  children: ReactNode;
}

function DetailShell({ kicker, kickerIcon, title, lede, image, hero, metaChips, backLabel, onBack, children }: DetailShellProps) {
  return (
    <article className="relative bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] px-5 pt-28 pb-16 sm:pt-32 lg:pb-24">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="focus-ring mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#BF9B30]/35 bg-[#FFFDF9]/80 px-4 py-2 text-[11px] font-bold uppercase tracked-sm text-gold-ink transition-colors hover:bg-[#F6EFDF]"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>

        <div className="overflow-hidden rounded-[1.2rem] border border-[#BF9B30]/18 bg-[#FFFDF9] shadow-[var(--shadow-soft)]">
          {hero ? (
            hero
          ) : image ? (
            <div className="relative aspect-[16/9] bg-[#EFE6D6]">
              <SafeImage src={image} alt={title} loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#211D18]/45 via-transparent to-transparent" />
            </div>
          ) : null}

          <div className="p-6 sm:p-9 lg:p-11">
            <span className="section-kicker">
              {kickerIcon}
              {kicker}
            </span>
            <h1 className="mt-4 font-serif-lux text-3xl leading-tight text-[#211D18] sm:text-5xl">{title}</h1>
            {lede ? <p className="mt-5 font-garamond text-xl italic leading-relaxed text-[#7A5E22]">{lede}</p> : null}
            {metaChips ? <div className="mt-6 flex flex-wrap gap-2.5">{metaChips}</div> : null}
            <div className="mt-8 border-t border-[#BF9B30]/15 pt-8">{children}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

const primaryCtaClass =
  'btn-luxury focus-ring inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] via-[#DFBD69] to-[#BF9B30] px-9 py-4 text-xs font-bold uppercase tracked-sm text-white shadow-[0_12px_30px_rgba(191,155,48,0.30)] transition-all hover:-translate-y-0.5 sm:w-auto';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
  onRegister: (course: Course) => void;
}

export function CourseDetailPage({ course, onBack, onRegister }: CourseDetailPageProps) {
  return (
    <DetailShell
      kicker="Khóa đào tạo"
      kickerIcon={<GraduationCap size={16} />}
      title={course.title}
      lede={course.subtitle}
      image={course.image}
      backLabel="Quay lại Dạy học"
      onBack={onBack}
      metaChips={
        <>
          {course.level ? <MetaChip icon={<Star size={13} fill="currentColor" />}>{course.level}</MetaChip> : null}
          <MetaChip icon={<Clock size={13} />}>{course.duration}</MetaChip>
          <MetaChip icon={<Ticket size={13} />}>{course.price}</MetaChip>
        </>
      }
    >
      <p className="font-sans-clean text-sm leading-8 text-[#2A2520]/80 sm:text-base">{course.description}</p>

      {course.forWho ? (
        <DetailBlock title="Phù hợp với ai">
          <p className="font-sans-clean text-sm leading-relaxed text-[#2A2520]/75 sm:text-base">{course.forWho}</p>
        </DetailBlock>
      ) : null}

      {course.highlights?.length ? (
        <DetailBlock title="Điểm nổi bật">
          <ul className="space-y-3">
            {course.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 font-sans-clean text-sm text-[#2A2520]/80">
                <Star size={16} className="mt-0.5 shrink-0 text-[#AF8C43]" fill="currentColor" />
                {item}
              </li>
            ))}
          </ul>
        </DetailBlock>
      ) : null}

      {course.curriculum?.length ? (
        <DetailBlock title="Lộ trình học">
          <ol className="space-y-5">
            {course.curriculum.map((step, index) => (
              <li key={step.label} className="flex gap-4">
                <span className="w-10 shrink-0 font-serif-lux text-2xl leading-none text-[#AF8C43]/80">0{index + 1}</span>
                <div>
                  <span className="block font-sans-clean text-[11px] font-bold uppercase tracked-sm text-gold-ink">{step.label}</span>
                  <p className="mt-1 font-sans-clean text-sm leading-relaxed text-[#2A2520]/78">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </DetailBlock>
      ) : null}

      {course.outcomes?.length ? (
        <DetailBlock title="Kết quả đạt được">
          <ul className="grid gap-3 sm:grid-cols-2">
            {course.outcomes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-xl border border-[#BF9B30]/15 bg-[#FAF5EB] px-4 py-3 font-sans-clean text-sm text-[#2A2520]/80"
              >
                <Check size={16} className="mt-0.5 shrink-0 text-[#AF8C43]" />
                {item}
              </li>
            ))}
          </ul>
        </DetailBlock>
      ) : null}

      <div className="mt-10">
        <button type="button" onClick={() => onRegister(course)} className={primaryCtaClass}>
          Đăng ký khóa học
          <ArrowRight size={15} />
        </button>
      </div>
    </DetailShell>
  );
}

interface TourDetailPageProps {
  tour: Tour;
  onBack: () => void;
  onBook: () => void;
}

export function TourDetailPage({ tour, onBack, onBook }: TourDetailPageProps) {
  return (
    <DetailShell
      kicker={tour.tag}
      kickerIcon={<CalendarDays size={16} />}
      title={tour.title}
      lede={tour.role}
      image={tour.image}
      backLabel="Quay lại Biểu diễn"
      onBack={onBack}
      metaChips={
        <>
          <MetaChip icon={<CalendarDays size={13} />}>
            {tour.month} {tour.year}
          </MetaChip>
          <MetaChip icon={<MapPin size={13} />}>{tour.location}</MetaChip>
        </>
      }
    >
      {tour.description ? (
        <p className="font-sans-clean text-sm leading-8 text-[#2A2520]/80 sm:text-base">{tour.description}</p>
      ) : null}

      {tour.setlist?.length ? (
        <DetailBlock title="Tiết mục tiêu biểu">
          <ul className="overflow-hidden rounded-xl border border-[#BF9B30]/15 divide-y divide-[#BF9B30]/12">
            {tour.setlist.map((piece, index) => (
              <li key={piece} className="flex items-center gap-3 bg-[#FFFDF9] px-4 py-3 font-sans-clean text-sm text-[#2A2520]/80">
                <span className="w-6 font-serif-lux text-[#AF8C43]">{String(index + 1).padStart(2, '0')}</span>
                <Music2 size={14} className="shrink-0 text-[#AF8C43]" />
                {piece}
              </li>
            ))}
          </ul>
        </DetailBlock>
      ) : null}

      <div className="mt-10">
        <button type="button" onClick={onBook} className={primaryCtaClass}>
          Mời nghệ sĩ biểu diễn
          <ArrowRight size={15} />
        </button>
      </div>
    </DetailShell>
  );
}

interface WorkshopDetailPageProps {
  workshop: Workshop;
  submitted: boolean;
  formErrors: LeadFormErrors;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (field: LeadFormField, value: string) => void;
  onBack: () => void;
}

export function WorkshopDetailPage({
  workshop,
  submitted,
  formErrors,
  isSubmitting,
  onSubmit,
  onFieldChange,
  onBack,
}: WorkshopDetailPageProps) {
  const errorId = (field: LeadFormField) => `workshop-${field}-error`;

  return (
    <DetailShell
      kicker="Workshop"
      kickerIcon={<Ticket size={16} />}
      title={workshop.title}
      lede={workshop.description}
      image={workshop.image}
      backLabel="Quay lại Dạy học"
      onBack={onBack}
      metaChips={
        <>
          <MetaChip icon={<CalendarDays size={13} />}>
            {workshop.date}, {workshop.year}
          </MetaChip>
          <MetaChip icon={<MapPin size={13} />}>{workshop.location}</MetaChip>
          <MetaChip icon={<Ticket size={13} />}>{workshop.price}</MetaChip>
          {workshop.seats ? <MetaChip icon={<Star size={13} fill="currentColor" />}>{workshop.seats}</MetaChip> : null}
        </>
      }
    >
      {workshop.agenda?.length ? (
        <DetailBlock title="Nội dung buổi học">
          <ul className="space-y-3">
            {workshop.agenda.map((item) => (
              <li key={item} className="flex items-start gap-3 font-sans-clean text-sm text-[#2A2520]/80">
                <Check size={16} className="mt-0.5 shrink-0 text-[#AF8C43]" />
                {item}
              </li>
            ))}
          </ul>
        </DetailBlock>
      ) : null}

      <DetailBlock title="Giữ chỗ tham dự">
        {submitted ? (
          <div className="space-y-2 rounded-[1.1rem] border border-[#BF9B30]/30 bg-[#FAF5EB] p-7 text-center">
            <Check className="mx-auto text-[#AF8C43]" size={34} />
            <h3 className="font-serif-lux text-xl font-semibold text-[#AF8C43]">Đăng ký hoàn tất</h3>
            <p className="font-sans-clean text-xs text-[#2A2520]/70">Chúng tôi đã ghi nhận đăng ký của bạn cho workshop này.</p>
            <Sparkles className="mx-auto text-[#AF8C43]/70" size={18} />
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-left">
              <span className={labelClassName}>Họ và tên</span>
              <input
                required
                name="name"
                type="text"
                placeholder="Nguyễn Văn A"
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? errorId('name') : undefined}
                onChange={(event) => onFieldChange('name', event.target.value)}
                className={getFieldClassName(Boolean(formErrors.name))}
              />
              {formErrors.name ? <span id={errorId('name')} className="form-error">{formErrors.name}</span> : null}
            </label>
            <label className="space-y-1.5 text-left">
              <span className={labelClassName}>Số điện thoại</span>
              <input
                required
                name="phone"
                type="tel"
                placeholder="0912 345 678"
                aria-invalid={Boolean(formErrors.phone)}
                aria-describedby={formErrors.phone ? errorId('phone') : undefined}
                onChange={(event) => onFieldChange('phone', event.target.value)}
                className={getFieldClassName(Boolean(formErrors.phone))}
              />
              {formErrors.phone ? <span id={errorId('phone')} className="form-error">{formErrors.phone}</span> : null}
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury focus-ring inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] via-[#DFBD69] to-[#BF9B30] px-9 py-4 text-xs font-bold uppercase tracked-sm text-white shadow-[0_12px_30px_rgba(191,155,48,0.30)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
            >
              {isSubmitting ? <LoaderCircle size={15} className="animate-spin" /> : null}
              {isSubmitting ? 'Đang giữ chỗ' : 'Xác nhận giữ chỗ'}
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </DetailBlock>
    </DetailShell>
  );
}

interface MediaDetailPageProps {
  item: MediaItem;
  onBack: () => void;
}

export function MediaDetailPage({ item, onBack }: MediaDetailPageProps) {
  const videoUrl = normalizeVideoEmbedUrl(item.videoUrl);

  return (
    <DetailShell
      kicker={item.category}
      kickerIcon={<Play size={14} fill="currentColor" />}
      title={item.title}
      backLabel="Quay lại Biểu diễn"
      onBack={onBack}
      hero={
        <div className="relative aspect-[16/9] bg-[#211D18]">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={item.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-sans-clean text-sm text-[#F7F1E5]/78">
              Video chưa có link YouTube hợp lệ để nhúng.
            </div>
          )}
        </div>
      }
      metaChips={<MetaChip icon={<Clock size={13} />}>{item.duration}</MetaChip>}
    >
      <p className="font-sans-clean text-sm leading-8 text-[#2A2520]/80 sm:text-base">
        {item.description || 'Video biểu diễn từ nghệ sĩ saxophone Lê Duy Mạnh.'}
      </p>
    </DetailShell>
  );
}

interface ArtistDetailPageProps {
  artist: ArtistProfile;
  onBack: () => void;
  onContact: () => void;
}

export function ArtistDetailPage({ artist, onBack, onContact }: ArtistDetailPageProps) {
  return (
    <DetailShell
      kicker="Nghệ sĩ"
      kickerIcon={<Sparkles size={14} />}
      title={artist.name}
      lede={artist.tagline}
      image={artist.portrait}
      backLabel="Quay lại Giới thiệu"
      onBack={onBack}
      metaChips={<MetaChip icon={<Music2 size={13} />}>{artist.role}</MetaChip>}
    >
      <div className="space-y-5 font-sans-clean text-sm leading-8 text-[#2A2520]/80 sm:text-base">
        {artist.bio.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
        ))}
      </div>

      <DetailBlock title="Con số">
        <div className="grid grid-cols-2 divide-x divide-[#BF9B30]/20 border-y border-[#BF9B30]/15 py-5 sm:grid-cols-4">
          {artist.facts.map((fact) => (
            <div key={fact.label} className="px-3 text-center">
              <span className="block font-serif-lux text-2xl font-light text-[#AF8C43] sm:text-3xl">{fact.value}</span>
              <span className="mt-1.5 block text-[11px] font-semibold uppercase tracked-sm text-[#2A2520]/72 sm:text-[11px]">{fact.label}</span>
            </div>
          ))}
        </div>
      </DetailBlock>

      <DetailBlock title="Dấu mốc">
        <ol className="relative space-y-6 pl-6">
          <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[#BF9B30]/45 to-transparent" />
          {artist.milestones.map((milestone) => (
            <li key={milestone.year} className="relative">
              <span aria-hidden="true" className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#DFBD69] to-[#BF9B30] ring-4 ring-[#FFFDF9]" />
              <span className="font-serif-lux text-lg text-[#AF8C43]">{milestone.year}</span>
              <h3 className="font-serif-lux text-lg text-[#211D18]">{milestone.title}</h3>
              <p className="mt-1 font-sans-clean text-sm leading-relaxed text-[#2A2520]/75">{milestone.detail}</p>
            </li>
          ))}
        </ol>
      </DetailBlock>

      <DetailBlock title="Tác phẩm tiêu biểu">
        <div className="flex flex-wrap gap-2.5">
          {artist.repertoire.map((piece) => (
            <span
              key={piece}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#BF9B30]/20 bg-[#FAF5EB] px-3.5 py-1.5 text-xs font-semibold text-[#2A2520]/75"
            >
              <Music2 size={12} className="text-[#AF8C43]" />
              {piece}
            </span>
          ))}
        </div>
      </DetailBlock>

      <div className="mt-10">
        <button type="button" onClick={onContact} className={primaryCtaClass}>
          Đặt lịch biểu diễn
          <ArrowRight size={15} />
        </button>
      </div>
    </DetailShell>
  );
}

const bookingEventTypes = [
  'Tiệc & sự kiện doanh nghiệp',
  'Gala / Lễ trao giải',
  'Phòng trà / Acoustic night',
  'Tiệc cưới',
  'Sự kiện cá nhân khác',
];

interface BookingDetailPageProps {
  submitted: boolean;
  formErrors: LeadFormErrors;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (field: LeadFormField, value: string) => void;
  onBack: () => void;
}

export function BookingDetailPage({
  submitted,
  formErrors,
  isSubmitting,
  onSubmit,
  onFieldChange,
  onBack,
}: BookingDetailPageProps) {
  const errorId = (field: LeadFormField) => `booking-${field}-error`;

  return (
    <DetailShell
      kicker="Đặt lịch biểu diễn"
      kickerIcon={<CalendarDays size={16} />}
      title="Mời nghệ sĩ biểu diễn"
      lede="Để lại thông tin sự kiện của bạn — trợ lý sẽ liên hệ trao đổi tiết mục, thời lượng và báo giá phù hợp."
      backLabel="Quay lại"
      onBack={onBack}
    >
      {submitted ? (
        <div className="space-y-2 rounded-[1.1rem] border border-[#BF9B30]/30 bg-[#FAF5EB] p-7 text-center">
          <Check className="mx-auto text-[#AF8C43]" size={34} />
          <h2 className="font-serif-lux text-xl font-semibold text-[#AF8C43]">Đã nhận yêu cầu đặt lịch</h2>
          <p className="font-sans-clean text-xs text-[#2A2520]/70">
            Trợ lý của nghệ sĩ Lê Duy Mạnh sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận chi tiết.
          </p>
          <Sparkles className="mx-auto text-[#AF8C43]/70" size={18} />
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-1.5 text-left">
            <span className={labelClassName}>Họ và tên</span>
            <input
              required
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              aria-invalid={Boolean(formErrors.name)}
              aria-describedby={formErrors.name ? errorId('name') : undefined}
              onChange={(event) => onFieldChange('name', event.target.value)}
              className={getFieldClassName(Boolean(formErrors.name))}
            />
            {formErrors.name ? <span id={errorId('name')} className="form-error">{formErrors.name}</span> : null}
          </label>
          <label className="space-y-1.5 text-left">
            <span className={labelClassName}>Số điện thoại</span>
            <input
              required
              name="phone"
              type="tel"
              placeholder="0912 345 678"
              aria-invalid={Boolean(formErrors.phone)}
              aria-describedby={formErrors.phone ? errorId('phone') : undefined}
              onChange={(event) => onFieldChange('phone', event.target.value)}
              className={getFieldClassName(Boolean(formErrors.phone))}
            />
            {formErrors.phone ? <span id={errorId('phone')} className="form-error">{formErrors.phone}</span> : null}
          </label>
          <label className="space-y-1.5 text-left sm:col-span-2">
            <span className={labelClassName}>Loại sự kiện</span>
            <select name="eventType" defaultValue={bookingEventTypes[0]} className={getFieldClassName()}>
              {bookingEventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-left">
            <span className={labelClassName}>Ngày mong muốn</span>
            <input name="date" type="text" placeholder="Ví dụ: 20/08/2026" className={getFieldClassName()} />
          </label>
          <label className="space-y-1.5 text-left">
            <span className={labelClassName}>Địa điểm</span>
            <input name="location" type="text" placeholder="Khách sạn, hội trường, thành phố…" className={getFieldClassName()} />
          </label>
          <label className="space-y-1.5 text-left sm:col-span-2">
            <span className={labelClassName}>Ghi chú</span>
            <textarea name="note" rows={3} placeholder="Quy mô khách, phong cách nhạc mong muốn, thời lượng…" className={`${getFieldClassName()} resize-y`} />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-luxury focus-ring inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] via-[#DFBD69] to-[#BF9B30] px-9 py-4 text-xs font-bold uppercase tracked-sm text-white shadow-[0_12px_30px_rgba(191,155,48,0.30)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
          >
            {isSubmitting ? <LoaderCircle size={15} className="animate-spin" /> : null}
            {isSubmitting ? 'Đang gửi yêu cầu' : 'Gửi yêu cầu đặt lịch'}
            <ArrowRight size={15} />
          </button>
        </form>
      )}
    </DetailShell>
  );
}

export function DetailNotFound({ onBack }: { onBack: () => void }) {
  return (
    <section className="relative min-h-[72vh] bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] px-5 pt-32 pb-16 text-center">
      <div aria-hidden="true" className="section-rule" />
      <div className="mx-auto max-w-xl rounded-[1.2rem] border border-[#BF9B30]/20 bg-[#FFFDF9] p-8 shadow-[var(--shadow-card)]">
        <span className="section-kicker justify-center">Chi tiết</span>
        <h1 className="mt-4 font-serif-lux text-3xl text-[#211D18]">Không tìm thấy nội dung</h1>
        <p className="mt-3 font-sans-clean text-sm text-[#2A2520]/72">Mục bạn tìm có thể đã được cập nhật hoặc gỡ bỏ.</p>
        <button
          type="button"
          onClick={onBack}
          className="focus-ring mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#BF9B30]/45 px-5 py-3 text-[11px] font-bold uppercase tracked-sm text-gold-ink transition-colors hover:bg-[#F6EFDF]"
        >
          <ArrowLeft size={14} />
          Quay lại
        </button>
      </div>
    </section>
  );
}
