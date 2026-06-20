import { useState, type FormEvent, type ImgHTMLAttributes, type MouseEvent, type RefObject, type SVGProps } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Mic2,
  Music2,
  Phone,
  Play,
  Sparkles,
  Star,
  Ticket,
  X,
} from 'lucide-react';
import {
  defaultAboutImage,
  defaultHeroImage,
  type BlogPost,
  type ContactFormData,
  type Course,
  type MediaItem,
  type Tour,
  type Workshop,
} from './content';
import { KIND_TO_SEGMENT } from './navigation';
import type { ContentSectionId, ContentTab, OpenDetail, SiteSectionId } from './navigation';

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Facebook = ({ size = 24, ...props }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 24, ...props }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = ({ size = 24, ...props }: BrandIconProps) => (
  <svg
    width={size}
    height={size}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" fill="currentColor" />
  </svg>
);

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
];

const fallbackImageClass =
  'flex items-center justify-center bg-[linear-gradient(135deg,#EFE6D6,#FBF6EC)] text-[#AF8C43]';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function SafeImage({ src, alt = '', className = '', fallbackClassName = '', onError, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`${className} ${fallbackImageClass} ${fallbackClassName}`}>
        <Music2 size={24} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}

const getPostSlug = (post: BlogPost, index: number) => post.slug || post.id || `post-${index + 1}`;
const getPostExcerpt = (post: BlogPost) => post.excerpt || post.desc || post.content?.split(/\n\s*\n/)[0] || '';
const getPostContent = (post: BlogPost) => post.content || post.excerpt || post.desc || '';

const menuItems = [
  { id: 'hero', href: '#hero', label: 'Trang chủ' },
  { id: 'about', href: '#about', label: 'Giới thiệu' },
  { id: 'performances', href: '#performances', label: 'Biểu diễn' },
  { id: 'academy', href: '#academy', label: 'Dạy học' },
  { id: 'blog', href: '#blog', label: 'Blog' },
  { id: 'contact', href: '#contact', label: 'Liên hệ' },
] satisfies Array<{ id: SiteSectionId; href: string; label: string }>;

interface SectionTabsProps {
  tabs: ContentTab[];
  activeTab: ContentSectionId;
  onTabChange: (tab: ContentSectionId) => void;
}

export function SectionTabs({ tabs, activeTab, onTabChange }: SectionTabsProps) {
  return (
    <section id="content-tabs" className="section-tabs-shell relative z-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-3.5 sm:py-5">
        <div role="tablist" aria-label="Nội dung trang" className="no-scrollbar flex gap-2 overflow-x-auto sm:justify-center">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-tab-id={tab.id}
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`section-tab shrink-0 min-w-[8.6rem] rounded-full border px-4 py-2.5 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-[#BF9B30]/55 bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white shadow-[0_12px_28px_rgba(191,155,48,0.26)]'
                    : 'border-[#BF9B30]/18 bg-[#FFFDF9]/78 text-[#2A2520] hover:border-[#BF9B30]/45 hover:text-[#9A7C30]'
                }`}
              >
                <span className="block font-sans-clean text-[9px] uppercase tracked-sm font-bold opacity-75">{tab.eyebrow}</span>
                <span className="mt-0.5 block font-serif-lux text-lg leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface HeaderProps {
  showHeaderBrand: boolean;
  isMenuOpen: boolean;
  isHeaderSolid: boolean;
  activeNav: SiteSectionId;
  progressRef: RefObject<HTMLDivElement | null>;
  onNavigate: (target: SiteSectionId) => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

export function Header({
  showHeaderBrand,
  isMenuOpen,
  isHeaderSolid,
  activeNav,
  progressRef,
  onNavigate,
  onMenuToggle,
  onMenuClose,
}: HeaderProps) {
  const leftItems = menuItems.slice(0, 3);
  const rightItems = menuItems.slice(3);
  const navClassName =
    'hidden lg:flex items-center gap-1 text-[11px] font-sans-clean uppercase font-semibold tracked-sm text-[#3A332B]/85';
  const navItemClassName = (item: (typeof menuItems)[number]) =>
    `nav-pill gold-line transition-colors ${
      item.id === activeNav ? 'bg-[#BF9B30]/10 text-[#9A7C30]' : 'hover:text-[#9A7C30]'
    }`;
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, target: SiteSectionId) => {
    event.preventDefault();
    onNavigate(target);
    onMenuClose();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 isolate transition-[padding] duration-300 ease-out ${
          isHeaderSolid ? 'py-2.5' : 'py-4 sm:py-5'
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-3 sm:inset-x-4 top-2 bottom-1 z-0 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xl border border-[#BF9B30]/15 shadow-[0_16px_42px_rgba(74,58,28,0.10)] transition-opacity duration-300 ease-out ${
            isHeaderSolid ? 'opacity-100' : 'opacity-100 lg:opacity-0'
          }`}
        />
        <div
          ref={progressRef}
          className={`header-progress z-20 transition-opacity duration-200 ${
            isHeaderSolid ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-7 lg:px-12 flex items-center justify-between gap-4">
          <nav className={navClassName}>
            {leftItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigate(event, item.id)}
                aria-current={item.id === activeNav ? 'page' : undefined}
                className={navItemClassName(item)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop centred wordmark — fades in once past the hero */}
          <a
            href="#hero"
            onClick={(event) => handleNavigate(event, 'hero')}
            aria-hidden={!showHeaderBrand}
            tabIndex={showHeaderBrand ? 0 : -1}
            className={`hidden lg:flex flex-col items-center text-center group shrink-0 transition-all duration-500 ${
              showHeaderBrand ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
            }`}
          >
            <span className="font-serif-lux text-lg font-medium text-[#211D18] group-hover:text-[#9A7C30] transition-colors duration-500">
              LÊ DUY MẠNH
            </span>
            <span className="font-sans-clean text-[10px] text-[#9A7C30] mt-0.5 font-bold tracked">SAXOPHONE</span>
          </a>

          <nav className={navClassName}>
            {rightItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigate(event, item.id)}
                aria-current={item.id === activeNav ? 'page' : undefined}
                className={navItemClassName(item)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile wordmark (always visible) */}
          <a href="#hero" onClick={(event) => handleNavigate(event, 'hero')} className="lg:hidden flex shrink-0 flex-col overflow-visible">
            <span className="font-serif-lux whitespace-nowrap pb-0.5 text-base leading-[1.35] font-medium text-[#211D18]">
              Lê Duy Mạnh
            </span>
            <span className="font-sans-clean text-[8px] text-[#9A7C30] mt-0.5 font-bold tracked">SAXOPHONE</span>
          </a>

          <button
            onClick={onMenuToggle}
            className="lg:hidden -mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#BF9B30]/18 bg-[#FFFDF9]/75 text-[#2A2520] shadow-[0_8px_22px_rgba(74,58,28,0.08)] transition-colors hover:text-[#9A7C30]"
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            type="button"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <nav
        className={`fixed inset-0 z-30 bg-[#FBF9F4]/98 backdrop-blur-lg transform transition-transform duration-500 ease-out flex flex-col ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-8 text-center">
          <span className="font-vietnamese-signature text-4xl text-[#AF8C43]">Lê Duy Mạnh</span>
          <span className="font-sans-clean text-[10px] text-[#9A7C30] font-bold tracked mt-2">SAXOPHONE SOLOIST</span>

          <div className="mt-10 flex flex-col items-center gap-6 font-serif-lux text-xl text-[#211D18]">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavigate(event, item.id)}
                aria-current={item.id === activeNav ? 'page' : undefined}
                className={`gold-line transition-colors ${item.id === activeNav ? 'text-[#AF8C43]' : 'hover:text-[#AF8C43]'}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            onClick={(event) => handleNavigate(event, 'contact')}
            className="btn-shine mt-11 inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-xs font-sans-clean font-bold uppercase tracked-sm shadow-[0_12px_30px_rgba(191,155,48,0.30)]"
          >
            Đăng ký học thử
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="pb-10 flex flex-col items-center gap-4">
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-[#BF9B30]/25 bg-[#FFFDF9] flex items-center justify-center text-[#2A2520]/70 hover:text-[#AF8C43] hover:border-[#AF8C43]/50 transition-all"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
          <p className="font-sans-clean text-[11px] text-[#2A2520]/55">0389172879 · Hào Nam, Ô Chợ Dừa, TP Hà Nội</p>
        </div>
      </nav>
    </>
  );
}

interface HeroSectionProps {
  heroRef: RefObject<HTMLElement | null>;
  heroContentRef: RefObject<HTMLDivElement | null>;
  heroImage: string;
  onNavigate: (target: ContentSectionId) => void;
}

export function HeroSection({ heroRef, heroContentRef, heroImage, onNavigate }: HeroSectionProps) {
  const stats: [string, string][] = [
    ['12+', 'năm sân khấu'],
    ['80+', 'đêm diễn'],
    ['300+', 'học viên'],
  ];

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative isolate w-full overflow-hidden flex flex-col pt-24 pb-12 sm:min-h-[100svh] sm:pt-36 sm:pb-20"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FCFAF5] via-[#F8F2E7] to-[#F2EADB]" />
        <div className="absolute -top-28 -right-24 w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(223,189,105,0.30),transparent_66%)] blur-2xl" />
        <div className="absolute top-1/3 -left-28 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(191,155,48,0.14),transparent_70%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FBF9F4] to-transparent" />
      </div>

      <div ref={heroContentRef} className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:my-auto sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 items-center">
          {/* Text column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <span className="hero-reveal hero-eyebrow inline-flex items-center gap-2 font-sans-clean text-[9px] sm:text-[11px] text-[#9A7C30] uppercase font-bold tracked-sm">
              <Sparkles size={13} />
              Saxophone Soloist · Live · Academy
            </span>

            <h1 className="hero-reveal-delay1 font-serif-lux text-[2.55rem] sm:text-7xl lg:text-[5.7rem] font-light leading-[1.15] mt-5 sm:mt-6 text-[#211D18] text-balance overflow-visible">
              LÊ DUY{' '}
              <span className="block lg:inline-block gold-foil font-normal pb-[0.12em]">
                MẠNH
              </span>
            </h1>

            <div className="hero-reveal-delay2 mx-auto lg:mx-0 mt-5 mb-5 sm:mt-6 sm:mb-6 h-px w-20 sm:w-24 bg-gradient-to-r from-[#BF9B30] to-transparent" />

            <p className="hero-reveal-delay2 font-garamond text-[1.45rem] sm:text-3xl lg:text-[2.1rem] italic text-[#7A5E22] font-light leading-snug text-balance max-w-[21rem] mx-auto lg:max-w-none lg:mx-0">
              Hơi thở sang trọng của Saxophone đương đại
            </p>

            <p className="hero-reveal-delay3 font-sans-clean text-sm sm:text-base text-[#2A2520]/70 leading-relaxed max-w-[21rem] sm:max-w-xl mx-auto lg:mx-0 mt-4 sm:mt-5">
              Không gian biểu diễn, đào tạo và truyền cảm hứng saxophone dành cho người yêu âm nhạc tinh tế.
            </p>

            <div className="hero-reveal-delay4 mt-7 sm:mt-9 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 max-w-[20rem] sm:max-w-none mx-auto lg:mx-0">
              <a
                href="#performances"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate('performances');
                }}
                className="btn-shine w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#BF9B30] via-[#DFBD69] to-[#BF9B30] text-white text-xs font-sans-clean uppercase font-bold tracked-sm shadow-[0_12px_30px_rgba(191,155,48,0.30)] hover:shadow-[0_16px_40px_rgba(191,155,48,0.45)] hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <Play size={15} />
                Xem biểu diễn
              </a>
              <a
                href="#academy"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate('academy');
                }}
                className="group w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-full border border-[#BF9B30]/45 bg-[#FFFDF9]/60 backdrop-blur-sm text-[#2A2520] text-xs font-sans-clean uppercase font-bold tracked-sm hover:border-[#BF9B30] hover:text-[#9A7C30] hover:bg-[#FFFDF9] transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Lộ trình học
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="hero-reveal-delay4 mt-7 sm:mt-10 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[21rem] sm:max-w-md mx-auto lg:mx-0">
              {stats.map(([value, label]) => (
                <div key={label} className="hero-stat min-h-[4.7rem] rounded-xl sm:rounded-2xl px-1.5 sm:px-2 py-3 sm:py-4 text-center">
                  <span className="block font-serif-lux text-[1.35rem] sm:text-3xl text-[#AF8C43]">{value}</span>
                  <span className="mt-1 block font-sans-clean text-[9px] sm:text-[10px] uppercase text-[#2A2520]/55 font-semibold">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="hero-reveal-delay3 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-[380px]">
              <div aria-hidden="true" className="absolute -top-4 -right-4 hidden h-full w-full rounded-[1.4rem] border border-[#BF9B30]/40 sm:block" />
              <div aria-hidden="true" className="absolute -inset-2 sm:-inset-3 rounded-[1.2rem] sm:rounded-[1.6rem] bg-[radial-gradient(circle,rgba(223,189,105,0.18),transparent_70%)] blur-xl" />
              <div className="relative aspect-[16/9] sm:aspect-[4/5] overflow-hidden rounded-[1.05rem] sm:rounded-[1.4rem] shadow-[var(--shadow-soft)]">
                <SafeImage
                  src={heroImage || defaultHeroImage}
                  alt="Nghệ sĩ saxophone Lê Duy Mạnh"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-[center_35%]"
                />
                <div aria-hidden="true" className="absolute inset-0 rounded-[1.05rem] sm:rounded-[1.4rem] ring-1 ring-inset ring-white/40" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#2A2520]/18 via-transparent to-transparent" />
              </div>

              <div className="hero-stat hidden sm:flex absolute -bottom-5 -left-5 items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#BF9B30] to-[#DFBD69] text-white">
                  <Music2 size={18} />
                </span>
                <span className="leading-tight">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={11} className="text-[#BF9B30]" fill="currentColor" />
                    ))}
                  </span>
                  <span className="block font-sans-clean text-[10px] text-[#2A2520]/60 font-semibold mt-0.5">
                    Soloist &amp; Educator
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        onClick={(event) => {
          event.preventDefault();
          onNavigate('about');
        }}
        aria-label="Cuộn xuống phần giới thiệu"
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 hidden sm:flex h-10 w-6 items-start justify-center rounded-full border border-[#BF9B30]/35 bg-[#FFFDF9]/50 p-1.5"
      >
        <span className="h-2 w-1 rounded-full bg-[#BF9B30] animate-scroll-cue" />
      </a>
    </section>
  );
}

interface AboutSectionProps {
  aboutImage: string;
  onNavigate: (target: ContentSectionId) => void;
  onViewBio: () => void;
}

export function AboutSection({ aboutImage, onNavigate, onViewBio }: AboutSectionProps) {
  return (
    <section id="about" className="relative bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] text-[#2A2520] py-16 lg:py-28 overflow-hidden">
      <div aria-hidden="true" className="section-rule" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 relative group scroll-reveal-left max-w-sm mx-auto lg:max-w-none">
          <div className="absolute -top-4 -left-4 w-full h-full border border-[#BF9B30]/40 rounded-[1.2rem] transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#EFE6D6] shadow-[var(--shadow-soft)] rounded-[1.2rem]">
            <SafeImage
              src={aboutImage || defaultAboutImage}
              alt="Chân dung nghệ sĩ saxophone"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 rounded-[1.2rem] ring-1 ring-inset ring-white/40" />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center space-y-7 lg:pl-6 scroll-reveal-right">
          <div className="space-y-4">
            <span className="section-kicker">
              <span className="w-8 h-px bg-[#BF9B30]" />
              Giới thiệu
            </span>
            <h2 className="font-serif-lux text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#211D18] font-light">
              Nghệ sĩ của sân khấu,
              <span className="block text-[#AF8C43] italic">người thầy của hơi thở</span>
            </h2>
          </div>

          <p className="font-garamond text-xl sm:text-2xl italic text-[#2A2520]/75 leading-relaxed">
            Âm sắc saxophone đẹp không đến từ kỹ thuật phô diễn, mà từ cách người nghệ sĩ kiểm soát hơi thở, khoảng lặng và cảm xúc.
          </p>
          <p className="font-sans-clean text-sm sm:text-base text-[#2A2520]/70 leading-relaxed max-w-2xl">
            Lê Duy Mạnh theo đuổi phong cách biểu diễn giàu cảm xúc, lịch thiệp và gần gũi. Trên sân khấu, anh tập trung vào màu âm mượt, câu nhạc có chiều sâu và sự giao tiếp tự nhiên với khán giả. Trong đào tạo, mỗi học viên được dẫn dắt bằng nền tảng hơi thở, tone, nhạc cảm và phong thái biểu diễn.
          </p>

          <div className="grid grid-cols-3 max-w-xl divide-x divide-[#BF9B30]/20">
            {[
              ['12+', 'năm sân khấu'],
              ['300+', 'học viên'],
              ['80+', 'đêm diễn'],
            ].map(([number, label]) => (
              <div key={label} className="px-3 sm:px-6 first:pl-0 text-center sm:text-left">
                <span className="block font-serif-lux text-3xl sm:text-4xl font-light text-[#AF8C43]">{number}</span>
                <span className="mt-1.5 block text-[9px] sm:text-[10px] uppercase text-[#2A2520]/50 font-sans-clean font-semibold tracked-sm">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5 pt-1">
            <div className="leading-none">
              <span className="font-vietnamese-signature text-3xl text-[#AF8C43]">Lê Duy Mạnh</span>
              <span className="block font-sans-clean text-[10px] uppercase text-[#2A2520]/45 font-bold tracked-sm mt-1">Saxophone Soloist</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={onViewBio}
                className="btn-luxury inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] px-6 py-3 text-[11px] font-sans-clean font-bold uppercase tracked-sm text-white shadow-[0_10px_26px_rgba(191,155,48,0.28)] transition-all hover:-translate-y-0.5"
              >
                Tiểu sử đầy đủ
                <ArrowRight size={15} />
              </button>
              <a
                href="#performances"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate('performances');
                }}
                className="group inline-flex items-center gap-3 font-sans-clean text-xs uppercase font-bold tracked-sm text-[#2A2520] hover:text-[#AF8C43] transition-colors w-fit"
              >
                Xem lịch biểu diễn
                <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-2 text-[#AF8C43]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PerformanceSectionProps {
  onOpenDetail: OpenDetail;
  media: MediaItem[];
  tours: Tour[];
}

export function PerformanceSection({ onOpenDetail, media, tours }: PerformanceSectionProps) {
  const [spotlight, ...playlist] = media;

  return (
    <section id="performances" className="relative bg-gradient-to-b from-[#F6F0E4] via-[#FBF9F4] to-[#F6F0E4] text-[#2A2520] py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div aria-hidden="true" className="section-rule" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-16 scroll-reveal">
          <div className="lg:col-span-7 space-y-4">
            <span className="section-kicker">
              <Mic2 size={16} />
              Biểu diễn
            </span>
            <h2 className="font-serif-lux text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-[#211D18]">
              Sân khấu được đưa lên trước,
              <span className="block text-[#AF8C43] italic">đúng trọng tâm nghệ sĩ.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 font-sans-clean text-sm sm:text-base text-[#2A2520]/65 leading-relaxed">
            Khối biểu diễn gom video, dấu mốc lưu diễn và lời mời booking trong một không gian tinh tế, giúp người xem cảm nhận chất nghệ sĩ trước khi đi vào phần đào tạo.
          </p>
        </div>

        <div id="media" className="grid lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          <article className="lg:col-span-7 group flex flex-col overflow-hidden rounded-[1.2rem] border border-[#BF9B30]/15 bg-[#FFFDF9] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] transition-all duration-500 scroll-reveal-scale">
            <button
              type="button"
              onClick={() => onOpenDetail('media', spotlight.id)}
              className="relative block w-full overflow-hidden"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                <SafeImage
                  src={spotlight.thumbnail}
                  alt={spotlight.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF9]/90 backdrop-blur-sm text-[#9A7C30] text-[10px] uppercase font-bold tracked-sm shadow-sm">
                  <Music2 size={12} />
                  {spotlight.category}
                </span>
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9]/90 backdrop-blur-sm text-[#2A2520] text-[11px] font-semibold shadow-sm">
                  <Clock size={12} />
                  {spotlight.duration}
                </span>
                <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFDF9]/90 backdrop-blur-sm text-[#AF8C43] shadow-[0_10px_30px_rgba(74,58,28,0.25)] transition-transform duration-500 group-hover:scale-110">
                  <Play size={24} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
            </button>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7">
              <h3 className="font-serif-lux text-2xl sm:text-3xl text-[#211D18] font-light leading-snug">{spotlight.title}</h3>
              <button
                type="button"
                onClick={() => onOpenDetail('media', spotlight.id)}
                className="btn-luxury inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-[11px] uppercase font-bold tracked-sm shadow-[0_10px_26px_rgba(191,155,48,0.30)] hover:-translate-y-0.5 transition-all"
              >
                <Play size={14} fill="currentColor" />
                Xem chi tiết
              </button>
            </div>
          </article>

          <div className="lg:col-span-5 grid gap-5">
            {playlist.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenDetail('media', item.id)}
                className={`scroll-reveal stagger-${index + 1} card-glow group flex items-center gap-4 rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] p-3 pr-5 text-left shadow-[var(--shadow-card)] hover:border-[#BF9B30]/40 hover:-translate-y-0.5 transition-all`}
              >
                <span className="relative h-[72px] w-24 sm:w-28 shrink-0 overflow-hidden rounded-[0.8rem]">
                  <SafeImage
                    src={item.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-[#2A2520]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase text-[#9A7C30] font-bold tracked-sm">{item.category}</span>
                  <h3 className="font-serif-lux text-lg text-[#211D18] mt-1 leading-snug line-clamp-2 group-hover:text-[#AF8C43] transition-colors">
                    {item.title}
                  </h3>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#2A2520]/55">
                    <Clock size={12} />
                    {item.duration}
                  </span>
                </span>
                <span className="hidden sm:flex w-10 h-10 rounded-full bg-[#F6EFDF] border border-[#BF9B30]/20 items-center justify-center text-[#AF8C43] shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#BF9B30] group-hover:to-[#DFBD69] group-hover:text-white transition-all">
                  <Play size={15} className="ml-0.5" fill="currentColor" />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div id="tours" className="mt-16 lg:mt-24">
          <div className="max-w-2xl mx-auto text-center scroll-reveal">
            <span className="section-kicker justify-center">
              <CalendarDays size={16} />
              Lưu diễn
            </span>
            <h3 className="font-serif-lux text-3xl sm:text-4xl lg:text-5xl mt-4 mb-4 font-light text-[#211D18]">Dấu mốc sân khấu gần đây</h3>
            <p className="font-sans-clean text-sm text-[#2A2520]/62 leading-relaxed">
              Một dòng thời gian các chương trình biểu diễn — để người xem cảm nhận ngay nhịp hoạt động và chất nghệ sĩ.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-16 max-w-4xl mx-auto">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[22px] lg:left-1/2 w-px lg:-translate-x-1/2 bg-gradient-to-b from-transparent via-[#BF9B30]/45 to-transparent"
            />
            <div className="space-y-7 lg:space-y-0">
              {tours.map((tour, index) => {
                const onLeft = index % 2 === 0;
                return (
                  <div
                    key={`${tour.month}-${tour.title}-${index}`}
                    className="relative lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center lg:py-5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-[22px] lg:left-1/2 top-6 lg:top-1/2 z-10 -translate-x-1/2 lg:-translate-y-1/2 flex h-4 w-4 items-center justify-center"
                    >
                      <span className="absolute inset-0 rounded-full bg-[#BF9B30]/25 pulse-dot" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#DFBD69] to-[#BF9B30] ring-4 ring-[#FBF9F4]" />
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenDetail('tour', tour.id ?? String(index))}
                      className={`tour-card group ml-12 block w-full text-left lg:ml-0 rounded-[1.1rem] border border-[#BF9B30]/15 bg-[#FFFDF9] px-5 py-5 shadow-[var(--shadow-card)] hover:border-[#BF9B30]/40 hover:bg-[#FFFBF3] focus:outline-none focus:ring-2 focus:ring-[#AF8C43]/35 focus:ring-offset-2 focus:ring-offset-[#FBF9F4] ${
                        onLeft ? 'scroll-reveal-left lg:col-start-1 lg:text-right' : 'scroll-reveal-right lg:col-start-2'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-2 ${onLeft ? 'lg:justify-end' : ''}`}>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EFDF] px-3 py-1 text-[10px] uppercase font-bold tracked-sm text-[#9A7C30]">
                          <Star size={11} fill="currentColor" />
                          {tour.tag}
                        </span>
                        <span className="font-serif-lux text-lg text-[#AF8C43] leading-none">
                          {tour.month} <span className="text-sm text-[#2A2520]/45">{tour.year}</span>
                        </span>
                      </div>
                      <h4 className="font-serif-lux text-xl sm:text-2xl leading-snug text-[#211D18] group-hover:text-[#AF8C43] transition-colors">{tour.title}</h4>
                      <p className={`font-sans-clean text-xs sm:text-sm text-[#2A2520]/58 mt-1.5 flex items-center gap-1.5 ${onLeft ? 'lg:justify-end' : ''}`}>
                        <MapPin size={13} className="text-[#AF8C43] shrink-0" />
                        {tour.location} · {tour.role}
                      </p>
                      <span className={`mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracked-sm text-[#9A7C30] opacity-0 transition-opacity group-hover:opacity-100 ${onLeft ? 'lg:flex-row-reverse' : ''}`}>
                        Xem chi tiết
                        <ChevronRight size={12} />
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 text-center scroll-reveal">
            <button
              type="button"
              onClick={() => onOpenDetail('booking', '')}
              className="btn-luxury inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white text-[11px] uppercase font-bold tracked-sm shadow-[0_10px_26px_rgba(191,155,48,0.28)] hover:-translate-y-0.5 transition-all"
            >
              Mời nghệ sĩ biểu diễn
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface AcademySectionProps {
  courses: Course[];
  workshops: Workshop[];
  onOpenDetail: OpenDetail;
}

export function AcademySection({ courses, workshops, onOpenDetail }: AcademySectionProps) {
  return (
    <section id="academy" className="relative bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] text-[#2A2520] py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div aria-hidden="true" className="section-rule" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-16 scroll-reveal">
          <div className="lg:col-span-7 space-y-4">
            <span className="section-kicker">
              <GraduationCap size={16} />
              Dạy học
            </span>
            <h2 className="font-serif-lux text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-[#211D18]">
              Academy gọn hơn,
              <span className="block text-[#AF8C43] italic">tập trung lộ trình và kết quả.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 font-sans-clean text-sm sm:text-base text-[#2A2520]/65 leading-relaxed">
            Sau khi người xem đã cảm nhận phần sân khấu, khu vực dạy học đóng vai trò chuyển đổi: chọn khóa, xem workshop và gửi thông tin tư vấn.
          </p>
        </div>

        <div id="courses" className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {courses.map((course, index) => (
            <button
              key={course.id}
              type="button"
              onClick={() => onOpenDetail('course', course.id)}
              className={`scroll-reveal stagger-${index + 1} card-glow group relative bg-[#FFFDF9] border border-[#BF9B30]/15 hover:border-[#BF9B30]/40 flex flex-col h-full overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1.5 rounded-[1.1rem] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#AF8C43]/35 focus:ring-offset-4 focus:ring-offset-[#F7F1E5] text-left`}
            >
              <div className="relative h-48 overflow-hidden">
                <SafeImage
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2520]/45 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 font-serif-lux text-3xl font-light text-white/85 [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]">
                  0{index + 1}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif-lux text-2xl text-[#AF8C43] group-hover:text-[#211D18] transition-colors font-medium">
                  {course.title}
                </h3>
                <p className="font-sans-clean text-sm text-[#2A2520]/68 leading-relaxed mt-3 flex-1">{course.subtitle}</p>
                <div className="mt-6 pt-5 border-t border-[#BF9B30]/15 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-[#2A2520]/80">{course.duration}</span>
                  <span className="btn-luxury inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-sans-clean font-bold tracked-sm text-white bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] group-hover:from-[#2A2520] group-hover:to-[#2A2520] transition-all duration-300 rounded-full">
                    Chi tiết
                    <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div id="workshops" className="mt-14 lg:mt-20 grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 scroll-reveal-left">
            <span className="section-kicker">
              <Ticket size={16} />
              Workshop
            </span>
            <h3 className="font-serif-lux text-3xl sm:text-4xl mt-4 mb-5 font-light text-[#211D18]">Lịch đào tạo chọn lọc</h3>
            <p className="font-sans-clean text-sm text-[#2A2520]/62 leading-relaxed">
              Các buổi học ngắn, tập trung một chủ đề rõ ràng để học viên thử phương pháp trước khi chọn lộ trình dài hạn.
            </p>
          </div>

          <div className="lg:col-span-8 rounded-[1.2rem] border border-[#BF9B30]/18 bg-[#FFFDF9] shadow-[var(--shadow-card)] overflow-hidden">
            {workshops.map((workshop, index) => (
              <article
                key={`${workshop.date}-${workshop.title}`}
                className={`scroll-reveal stagger-${index + 1} py-5 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 md:items-center hover:bg-[#FAF5EB] transition-colors duration-300 group px-5 sm:px-6 border-b border-[#BF9B30]/12 last:border-b-0`}
              >
                <div className="md:col-span-2 flex md:block items-baseline gap-2">
                  <span className="block font-serif-lux text-2xl text-[#AF8C43] leading-none">{workshop.date}</span>
                  <span className="font-sans-clean text-[11px] text-[#2A2520]/45">{workshop.year}</span>
                </div>
                <div className="md:col-span-6">
                  <h4 className="font-serif-lux text-lg lg:text-xl text-[#211D18] group-hover:text-[#AF8C43] transition-colors duration-300 font-medium leading-snug">
                    {workshop.title}
                  </h4>
                  <p className="font-sans-clean text-xs sm:text-sm text-[#2A2520]/56 mt-2 flex items-center gap-2">
                    <MapPin size={14} className="text-[#AF8C43] shrink-0" />
                    {workshop.location}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-bold text-[#2A2520]/75">{workshop.price}</span>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <button
                    type="button"
                    onClick={() => onOpenDetail('workshop', workshop.id ?? String(index))}
                    className="btn-luxury inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#BF9B30]/50 text-[#9A7C30] text-[10px] font-sans-clean uppercase font-bold tracked-sm hover:bg-gradient-to-r hover:from-[#BF9B30] hover:to-[#DFBD69] hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    {workshop.status}
                    <ChevronRight size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section id="blog" className="relative bg-gradient-to-b from-[#F6F0E4] via-[#FBF9F4] to-[#F6F0E4] text-[#2A2520] py-16 lg:py-28">
      <div aria-hidden="true" className="section-rule" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="text-center space-y-4 mb-12 lg:mb-16 scroll-reveal">
          <span className="section-kicker justify-center">
            <span className="w-8 h-px bg-[#BF9B30]" />
            The diary
            <span className="w-8 h-px bg-[#BF9B30]" />
          </span>
          <h2 className="font-serif-lux text-4xl lg:text-5xl font-light text-[#211D18]">Ghi chép saxophone</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {posts.map((post, index) => {
            const slug = getPostSlug(post, index);
            const excerpt = getPostExcerpt(post);
            return (
            <article
              key={post.id || post.slug || post.title}
              className={`scroll-reveal stagger-${index + 1} card-glow group flex flex-col justify-between h-full bg-[#FFFDF9] border border-[#BF9B30]/14 p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1.5 transition-all duration-500 rounded-[1.1rem]`}
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#EFE6D6] mb-5 rounded-[0.9rem]">
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="font-sans-clean text-[10px] text-[#9A7C30] font-bold uppercase tracked-sm">{post.date}</span>
                <h3 className="font-serif-lux text-lg text-[#211D18] group-hover:text-[#AF8C43] transition-colors duration-300 leading-snug font-medium mt-2">
                  {post.title}
                </h3>
                <p className="font-sans-clean text-xs text-[#2A2520]/60 leading-relaxed mt-3">{excerpt}</p>
              </div>
              <a href={`#/${KIND_TO_SEGMENT.post}/${slug}`} className="text-[10px] font-sans-clean font-bold uppercase tracked-sm text-[#2A2520] group-hover:text-[#AF8C43] transition-colors inline-flex items-center gap-1.5 mt-5">
                Đọc bài viết
                <ArrowRight size={12} />
              </a>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface BlogPostPageProps {
  post: BlogPost | null;
  onBack: () => void;
}

export function BlogPostPage({ post, onBack }: BlogPostPageProps) {
  if (!post) {
    return (
      <section className="min-h-[72vh] bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] px-5 pt-32 pb-16 text-center">
        <div className="mx-auto max-w-xl rounded-[1.2rem] border border-[#BF9B30]/20 bg-[#FFFDF9] p-8 shadow-[var(--shadow-card)]">
          <span className="section-kicker justify-center">Blog</span>
          <h1 className="mt-4 font-serif-lux text-3xl text-[#211D18]">Không tìm thấy bài viết</h1>
          <p className="mt-3 font-sans-clean text-sm text-[#2A2520]/65">Bài viết có thể đã được đổi slug hoặc chưa được xuất bản.</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#BF9B30]/45 px-5 py-3 text-[11px] font-bold uppercase tracked-sm text-[#9A7C30] transition-colors hover:bg-[#F6EFDF]"
          >
            <ArrowLeft size={14} />
            Quay lại blog
          </button>
        </div>
      </section>
    );
  }

  const paragraphs = getPostContent(post)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] px-5 pt-28 sm:pt-32 pb-16 lg:pb-24">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#BF9B30]/35 bg-[#FFFDF9]/80 px-4 py-2 text-[11px] font-bold uppercase tracked-sm text-[#9A7C30] transition-colors hover:bg-[#F6EFDF]"
        >
          <ArrowLeft size={14} />
          Quay lại blog
        </button>

        <div className="overflow-hidden rounded-[1.2rem] border border-[#BF9B30]/18 bg-[#FFFDF9] shadow-[var(--shadow-soft)]">
          <div className="relative aspect-[16/9] bg-[#EFE6D6]">
            <SafeImage
              src={post.image}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#211D18]/55 via-transparent to-transparent" />
          </div>
          <div className="p-6 sm:p-9 lg:p-11">
            <span className="font-sans-clean text-[10px] font-bold uppercase tracked-sm text-[#9A7C30]">{post.date}</span>
            <h1 className="mt-3 font-serif-lux text-3xl sm:text-5xl leading-tight text-[#211D18]">{post.title}</h1>
            {getPostExcerpt(post) && (
              <p className="mt-5 font-garamond text-xl italic leading-relaxed text-[#7A5E22]">{getPostExcerpt(post)}</p>
            )}
            <div className="mt-8 space-y-5 border-t border-[#BF9B30]/15 pt-8 font-sans-clean text-sm sm:text-base leading-8 text-[#2A2520]/78">
              {(paragraphs.length ? paragraphs : [getPostExcerpt(post)]).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

interface ContactSectionProps {
  formData: ContactFormData;
  formSubmitted: boolean;
  onFormChange: (next: ContactFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export function ContactSection({ formData, formSubmitted, onFormChange, onSubmit, onReset }: ContactSectionProps) {
  const fieldClassName =
    'w-full bg-[#FBF6EC] border border-[#BF9B30]/25 text-[#2A2520] px-4 py-3 text-sm font-sans-clean focus:outline-none focus:border-[#AF8C43] focus:ring-2 focus:ring-[#AF8C43]/15 transition-colors rounded-xl';

  return (
    <section id="contact" className="relative py-16 lg:py-28 bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] overflow-hidden">
      <div aria-hidden="true" className="section-rule" />
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-12 text-center">
        <div className="mb-6 scroll-reveal">
          <span className="section-kicker justify-center">
            <Mail size={16} />
            Contact
          </span>
        </div>
        <h2 className="scroll-reveal font-serif-lux text-3xl sm:text-4xl lg:text-5xl font-light text-[#211D18] mb-4 leading-tight">
          Bắt đầu hành trình saxophone của bạn
        </h2>
        <p className="scroll-reveal font-sans-clean text-sm text-[#2A2520]/60 max-w-md mx-auto mb-12">
          Để lại thông tin để nhận tư vấn lộ trình đào tạo, tinh tế hóa hơi thở và thử âm miễn phí trực tiếp cùng Nghệ sĩ Lê Duy Mạnh.
        </p>

        {formSubmitted ? (
          <div className="bg-[#FFFDF9] border border-[#BF9B30]/35 p-6 sm:p-8 max-w-xl mx-auto text-center space-y-4 shadow-[var(--shadow-soft)] animate-fadeIn rounded-[1.2rem]">
            <div className="w-16 h-16 rounded-full bg-[#BF9B30]/12 flex items-center justify-center text-[#AF8C43] mx-auto">
              <Sparkles size={28} />
            </div>
            <h3 className="font-serif-lux text-2xl text-[#AF8C43] font-semibold">Đăng ký thành công</h3>
            <p className="font-sans-clean text-xs text-[#2A2520]/80 leading-relaxed max-w-sm mx-auto">
              Trân trọng cảm ơn bạn đã gửi gắm niềm tin yêu saxophone. Trợ lý của Nghệ sĩ Lê Duy Mạnh sẽ trực tiếp gọi điện tư vấn chi tiết lịch hẹn trong vòng 24 giờ tới.
            </p>
            <button
              type="button"
              onClick={onReset}
              className="mt-4 px-6 py-2.5 rounded-full border border-[#AF8C43] text-xs uppercase font-bold tracked-sm text-[#AF8C43] hover:bg-[#AF8C43] hover:text-white transition-all"
            >
              Gửi lại đăng ký mới
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="max-w-3xl mx-auto bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 border border-[#BF9B30]/20 shadow-[var(--shadow-soft)] space-y-6 rounded-[1.2rem]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <label className="text-left space-y-2">
                <span className="text-[10px] uppercase font-sans-clean text-[#9A7C30] font-bold tracked-sm">Họ và tên của bạn</span>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(event) => onFormChange({ ...formData, name: event.target.value })}
                  className={fieldClassName}
                />
              </label>

              <label className="text-left space-y-2">
                <span className="text-[10px] uppercase font-sans-clean text-[#9A7C30] font-bold tracked-sm">Số điện thoại liên hệ</span>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={formData.phone}
                  onChange={(event) => onFormChange({ ...formData, phone: event.target.value })}
                  className={fieldClassName}
                />
              </label>

              <label className="text-left space-y-2">
                <span className="text-[10px] uppercase font-sans-clean text-[#9A7C30] font-bold tracked-sm">Khóa học bạn quan tâm</span>
                <select
                  value={formData.course}
                  onChange={(event) => onFormChange({ ...formData, course: event.target.value })}
                  className={fieldClassName}
                >
                  <option value="Beginner">BEGINNER (Cơ bản)</option>
                  <option value="Intermediate">INTERMEDIATE (Trung cấp)</option>
                  <option value="Private">PRIVATE 1:1 (Cá nhân hóa)</option>
                </select>
              </label>

              <label className="text-left space-y-2">
                <span className="text-[10px] uppercase font-sans-clean text-[#9A7C30] font-bold tracked-sm">Ghi chú</span>
                <input
                  type="text"
                  placeholder="Ví dụ: Chưa có kèn, muốn chơi nhạc Trịnh"
                  value={formData.note}
                  onChange={(event) => onFormChange({ ...formData, note: event.target.value })}
                  className={fieldClassName}
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-luxury w-full md:w-auto px-10 sm:px-12 py-4 rounded-full bg-gradient-to-r from-[#BF9B30] via-[#DFBD69] to-[#BF9B30] text-white text-xs font-bold uppercase tracked-sm font-sans-clean shadow-[0_12px_30px_rgba(191,155,48,0.30)] hover:shadow-[0_16px_40px_rgba(191,155,48,0.45)] hover:-translate-y-0.5 transition-all"
              >
                Xác nhận gửi thông tin
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

interface FooterProps {
  onNavigate: (target: SiteSectionId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative bg-gradient-to-b from-[#F4EDDF] to-[#EFE6D4] text-[#2A2520] pt-14 sm:pt-16 pb-8">
      <div aria-hidden="true" className="section-rule" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
        <div className="space-y-4">
          <h3 className="font-serif-lux text-xl text-[#AF8C43] font-semibold">LÊ DUY MẠNH</h3>
          <p className="font-sans-clean text-[11px] text-[#2A2520]/50 uppercase font-bold tracked-sm">Saxophone soloist</p>
          <p className="font-sans-clean text-xs text-[#2A2520]/70 leading-relaxed font-light">
            Người truyền cảm hứng và tinh thần tự do phóng khoáng qua phím kèn Saxophone. Đồng hành cùng bạn trên chặng đường chinh phục tinh hoa nghệ thuật âm nhạc.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <h4 className="font-sans-clean text-xs uppercase text-[#9A7C30] font-bold tracked-sm">Contact information</h4>
          <div className="space-y-3 font-sans-clean text-xs text-[#2A2520]/70 font-light">
            <p className="flex items-center gap-2"><Mail size={14} className="text-[#AF8C43] shrink-0" /> jazzleduymanh@gmail.com</p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-[#AF8C43] shrink-0" /> 0389172879</p>
            <p className="flex items-center gap-2"><MapPin size={14} className="text-[#AF8C43] shrink-0" /> Hào Nam, Ô Chợ Dừa, TP Hà Nội</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-sans-clean text-xs uppercase text-[#9A7C30] font-bold tracked-sm">Quick links</h4>
          <ul className="space-y-2.5 font-sans-clean text-xs text-[#2A2520]/75 font-light">
            <li><button type="button" onClick={() => onNavigate('about')} className="gold-line bg-transparent p-0 text-left hover:text-[#AF8C43] transition-colors">Về Nghệ sĩ Lê Duy Mạnh</button></li>
            <li><button type="button" onClick={() => onNavigate('performances')} className="gold-line bg-transparent p-0 text-left hover:text-[#AF8C43] transition-colors">Biểu diễn &amp; video</button></li>
            <li><button type="button" onClick={() => onNavigate('academy')} className="gold-line bg-transparent p-0 text-left hover:text-[#AF8C43] transition-colors">Khóa học &amp; workshop</button></li>
            <li><button type="button" onClick={() => onNavigate('contact')} className="gold-line bg-transparent p-0 text-left hover:text-[#AF8C43] transition-colors">Tư vấn lộ trình</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-sans-clean text-xs uppercase text-[#9A7C30] font-bold tracked-sm">Join community</h4>
          <p className="font-sans-clean text-xs text-[#2A2520]/65 font-light leading-relaxed">
            Theo dõi để chiêm ngưỡng những sản phẩm âm nhạc mới nhất và các lịch biểu diễn chọn lọc.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-[#BF9B30]/20 hover:border-[#AF8C43] flex items-center justify-center text-[#2A2520]/70 hover:text-[#AF8C43] transition-all bg-[#FFFDF9] shadow-[0_2px_8px_rgba(74,58,28,0.05)]"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-8 border-t border-[#BF9B30]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="font-sans-clean text-[11px] text-[#2A2520]/50 font-medium">
          &copy; {new Date().getFullYear()} LÊ DUY MẠNH SAXOPHONE. All rights reserved.
        </p>
        <div className="flex gap-6 font-sans-clean text-[11px] text-[#2A2520]/50 font-medium">
          <a href="#hero" className="hover:text-[#AF8C43] transition-colors">Privacy Policy</a>
          <span className="text-[#BF9B30]/25">|</span>
          <a href="#hero" className="hover:text-[#AF8C43] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
