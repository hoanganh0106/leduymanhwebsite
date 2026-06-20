import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useScrollReveal } from './hooks';
import {
  artistProfile,
  blogPosts as defaultPosts,
  courses as defaultCourses,
  defaultAboutImage,
  defaultHeroImage,
  mediaItems as defaultMedia,
  recentTours as defaultTours,
  workshops as defaultWorkshops,
  type BlogPost,
  type ContactFormData,
  type Course,
  type MediaItem,
  type SiteImages,
  type Tour,
  type Workshop,
} from './content';
import {
  AboutSection,
  AcademySection,
  BlogPostPage,
  BlogSection,
  ContactSection,
  Footer,
  Header,
  HeroSection,
  PerformanceSection,
  SectionTabs,
} from './sections';
import {
  ArtistDetailPage,
  BookingDetailPage,
  CourseDetailPage,
  DetailNotFound,
  MediaDetailPage,
  TourDetailPage,
  WorkshopDetailPage,
} from './detail-pages';
import {
  contentTabs,
  ID_LESS_DETAIL_KINDS,
  KIND_TO_SEGMENT,
  SEGMENT_TO_KIND,
  type ContentSectionId,
  type DetailKind,
  type DetailRoute,
  type SiteSectionId,
} from './navigation';
import { SaxExplorerSection } from './sax-explorer';

const HEADER_BRAND_REVEAL_OFFSET = 96;
const HEADER_SOLID_REVEAL_OFFSET = 104;

const defaultFormData: ContactFormData = {
  name: '',
  phone: '',
  course: 'Beginner',
  note: '',
};

const contentSectionIds = contentTabs.map((tab) => tab.id);

const isContentSectionId = (value: string): value is ContentSectionId =>
  contentSectionIds.includes(value as ContentSectionId);

// Detail views are addressed through the URL hash with Vietnamese (no-diacritic)
// segments, e.g. #/khoa-hoc/beginner, #/luu-dien/tour-gala, #/video/vid-1,
// #/bai-viet/<slug> or #/nghe-si. Segment maps live in navigation.ts.
const DETAIL_HASH_RE = /^#\/([a-z-]+)(?:\/([^/?#]+))?$/;

const parseDetailFromHash = (): DetailRoute | null => {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(DETAIL_HASH_RE);
  if (!match) return null;
  const kind = SEGMENT_TO_KIND[match[1]];
  if (!kind) return null;
  if (ID_LESS_DETAIL_KINDS.includes(kind)) return { kind, id: '' };
  const id = match[2] ? decodeURIComponent(match[2]) : '';
  if (!id) return null;
  return { kind, id };
};

const buildDetailHash = (route: DetailRoute): string => {
  const segment = KIND_TO_SEGMENT[route.kind];
  return ID_LESS_DETAIL_KINDS.includes(route.kind) ? `#/${segment}` : `#/${segment}/${encodeURIComponent(route.id)}`;
};

const getInitialActiveSection = (): ContentSectionId => {
  if (typeof window === 'undefined') return 'about';
  const hash = window.location.hash.replace('#', '');
  return isContentSectionId(hash) ? hash : 'about';
};

const getPostSlug = (post: BlogPost, index: number) => post.slug || post.id || `post-${index + 1}`;

// Resolve a clicked item from its route id. Items with an explicit `id` match
// directly; items without one (e.g. Supabase rows) fall back to list index.
const resolveByRouteId = <T extends { id?: string }>(list: T[], id: string): T | null => {
  const byId = list.find((item) => item.id === id);
  if (byId) return byId;
  const index = Number(id);
  if (Number.isInteger(index) && index >= 0 && index < list.length) return list[index];
  return null;
};

const detailParentSection = (kind: DetailKind | undefined): ContentSectionId => {
  switch (kind) {
    case 'course':
    case 'workshop':
      return 'academy';
    case 'tour':
    case 'media':
      return 'performances';
    case 'artist':
      return 'about';
    case 'booking':
      return 'contact';
    case 'post':
    default:
      return 'blog';
  }
};

type LeadPayload = {
  kind: 'contact' | 'workshop' | 'booking';
  name: string;
  phone: string;
  course: string;
  note: string;
};

const saveLead = async (payload: LeadPayload) => {
  try {
    const { isSupabaseConfigured, supabase } = await import('./lib/supabase');
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('leads').insert(payload);
  } catch {
    /* Contact UX should not be blocked by database availability. */
  }
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeaderBrand, setShowHeaderBrand] = useState(false);
  const [isHeaderSolidByPosition, setIsHeaderSolidByPosition] = useState(false);
  const [activeSection, setActiveSection] = useState<ContentSectionId>(getInitialActiveSection);
  const [formData, setFormData] = useState<ContactFormData>(defaultFormData);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [workshopSubmitted, setWorkshopSubmitted] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [tours, setTours] = useState<Tour[]>(defaultTours);
  const [courseList, setCourseList] = useState<Course[]>(defaultCourses);
  const [workshopList, setWorkshopList] = useState<Workshop[]>(defaultWorkshops);
  const [postList, setPostList] = useState<BlogPost[]>(defaultPosts);
  const [mediaList, setMediaList] = useState<MediaItem[]>(defaultMedia);
  const [siteImages, setSiteImages] = useState<SiteImages>({
    hero_image: defaultHeroImage,
    about_image: defaultAboutImage,
  });
  const [detail, setDetail] = useState<DetailRoute | null>(parseDetailFromHash);

  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const showHeaderBrandRef = useRef(false);
  const isHeaderSolidByPositionRef = useRef(false);
  const revealRef = useScrollReveal([activeSection, tours, courseList, workshopList, postList, mediaList, siteImages, detail]);

  useEffect(() => {
    let rafId = 0;
    // Cache the scroll bounds so the per-frame scroll handler never has to read
    // document.scrollHeight (a forced layout/reflow). We recompute it only when
    // the page can actually change height: on resize and when content reflows.
    let maxScroll = 0;

    const recalcBounds = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    };

    const updateScrollUi = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? window.innerHeight;
      const heroContentTop = heroContentRef.current?.getBoundingClientRect().top ?? heroBottom;
      const nextShowHeaderBrand = heroBottom <= HEADER_BRAND_REVEAL_OFFSET;
      const nextIsHeaderSolidByPosition =
        nextShowHeaderBrand || heroContentTop <= HEADER_SOLID_REVEAL_OFFSET;

      if (nextShowHeaderBrand !== showHeaderBrandRef.current) {
        showHeaderBrandRef.current = nextShowHeaderBrand;
        setShowHeaderBrand(nextShowHeaderBrand);
      }

      if (nextIsHeaderSolidByPosition !== isHeaderSolidByPositionRef.current) {
        isHeaderSolidByPositionRef.current = nextIsHeaderSolidByPosition;
        setIsHeaderSolidByPosition(nextIsHeaderSolidByPosition);
      }

      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(Math.max(progress / 100, 0), 1)})`;
      }

      rafId = 0;
    };

    const requestScrollUiUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollUi);
    };

    const onResize = () => {
      recalcBounds();
      requestScrollUiUpdate();
    };

    recalcBounds();
    updateScrollUi();
    window.addEventListener('scroll', requestScrollUiUpdate, { passive: true });
    window.addEventListener('resize', onResize);

    // The page height changes when the active content section swaps or images
    // load in — keep the cached bounds in sync without touching the scroll path.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', requestScrollUiUpdate);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let active = true;
    // Load Supabase + the content fetchers lazily, after first paint, so the
    // heavy client stays out of the initial bundle. The page already renders
    // with built-in defaults; this just upgrades them once data arrives.
    import('./lib/content-data')
      .then(({ fetchTours, fetchWorkshops, fetchCourses, fetchPosts, fetchMedia, fetchSiteImages }) =>
        Promise.all([fetchTours(), fetchWorkshops(), fetchCourses(), fetchPosts(), fetchMedia(), fetchSiteImages()]),
      )
      .then(([nextTours, nextWorkshops, nextCourses, nextPosts, nextMedia, nextSiteImages]) => {
        if (!active) return;
        setTours(nextTours);
        setWorkshopList(nextWorkshops);
        setCourseList(nextCourses);
        setPostList(nextPosts);
        setMediaList(nextMedia);
        setSiteImages(nextSiteImages);
      })
      .catch(() => {
        /* keep built-in defaults on failure */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Keep the detail view in sync with the URL for back/forward and for plain
    // hash links (e.g. the blog cards' #/post/<slug> anchors).
    const syncFromUrl = () => {
      setDetail(parseDetailFromHash());
      const path = window.location.pathname.replace(/^\//, '');
      if (isContentSectionId(path)) {
        setActiveSection(path);
      }
    };

    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  useEffect(() => {
    if (detail) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [detail]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.phone) return;
    await saveLead({
      kind: 'contact',
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      course: formData.course,
      note: formData.note,
    });
    setFormSubmitted(true);
  };

  const handleWorkshopSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const workshop = detail?.kind === 'workshop' ? resolveByRouteId(workshopList, detail.id) : null;
    if (!workshop) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (!name || !phone) return;
    await saveLead({
      kind: 'workshop',
      name,
      phone,
      course: workshop.title,
      note: '',
    });
    setWorkshopSubmitted(true);
  };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (!name || !phone) return;
    const eventType = String(data.get('eventType') || '').trim();
    const date = String(data.get('date') || '').trim();
    const location = String(data.get('location') || '').trim();
    const note = String(data.get('note') || '').trim();
    await saveLead({
      kind: 'booking',
      name,
      phone,
      course: eventType || 'Đặt lịch biểu diễn',
      note: [date && `Ngày: ${date}`, location && `Địa điểm: ${location}`, note].filter(Boolean).join(' · '),
    });
    setBookingSubmitted(true);
  };

  const handleNavigate = (target: SiteSectionId) => {
    setIsMenuOpen(false);
    setDetail(null);

    if (target === 'hero') {
      // "Trang chủ" returns to the default landing state: the artist intro tab,
      // scrolled to the very top. The hero lives at the top of the page, so
      // scrolling the window is reliable even when returning from a detail view
      // (there the hero element is unmounted and heroRef would be null). Jump
      // instantly when coming back from a detail page to avoid a long smooth
      // scroll across the swapping layout.
      const wasViewingDetail = detail !== null;
      setActiveSection('about');
      window.history.replaceState(null, '', '/');
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: wasViewingDetail ? 'auto' : 'smooth' });
      });
      return;
    }

    setActiveSection(target);
    window.history.replaceState(null, '', `/${target}`);
    window.requestAnimationFrame(() => {
      const targetSection = document.getElementById(target);
      const tabSection = document.getElementById('content-tabs');
      (targetSection ?? tabSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleOpenDetail = (kind: DetailKind, id: string) => {
    const route: DetailRoute = { kind, id };
    setIsMenuOpen(false);
    setWorkshopSubmitted(false);
    setBookingSubmitted(false);
    window.history.pushState(null, '', buildDetailHash(route));
    setDetail(route);
  };

  const closeDetail = () => handleNavigate(detailParentSection(detail?.kind));

  const handleCourseRegister = (course: Course) => {
    setFormData((prev) => ({ ...prev, course: course.title }));
    handleNavigate('contact');
  };

  const resetContactForm = () => {
    setFormSubmitted(false);
    setFormData(defaultFormData);
  };

  const isViewingDetail = detail !== null;
  const isHeaderSolid = isHeaderSolidByPosition || isMenuOpen || isViewingDetail;
  // While the hero is still in view the header should highlight "Trang chủ",
  // not the last content section the user visited.
  const activeNav: SiteSectionId = isViewingDetail
    ? detailParentSection(detail?.kind)
    : showHeaderBrand
      ? activeSection
      : 'hero';

  const renderDetail = () => {
    if (!detail) return null;

    switch (detail.kind) {
      case 'post': {
        const post = postList.find((item, index) => getPostSlug(item, index) === detail.id) ?? null;
        return <BlogPostPage post={post} onBack={closeDetail} />;
      }
      case 'course': {
        const course = resolveByRouteId(courseList, detail.id);
        return course ? (
          <CourseDetailPage course={course} onBack={closeDetail} onRegister={handleCourseRegister} />
        ) : (
          <DetailNotFound onBack={closeDetail} />
        );
      }
      case 'tour': {
        const tour = resolveByRouteId(tours, detail.id);
        return tour ? (
          <TourDetailPage tour={tour} onBack={closeDetail} onBook={() => handleOpenDetail('booking', '')} />
        ) : (
          <DetailNotFound onBack={closeDetail} />
        );
      }
      case 'workshop': {
        const workshop = resolveByRouteId(workshopList, detail.id);
        return workshop ? (
          <WorkshopDetailPage
            workshop={workshop}
            submitted={workshopSubmitted}
            onSubmit={handleWorkshopSubmit}
            onBack={closeDetail}
          />
        ) : (
          <DetailNotFound onBack={closeDetail} />
        );
      }
      case 'media': {
        const item = resolveByRouteId(mediaList, detail.id);
        return item ? <MediaDetailPage item={item} onBack={closeDetail} /> : <DetailNotFound onBack={closeDetail} />;
      }
      case 'artist':
        return <ArtistDetailPage artist={artistProfile} onBack={closeDetail} onContact={() => handleOpenDetail('booking', '')} />;
      case 'booking':
        return <BookingDetailPage submitted={bookingSubmitted} onSubmit={handleBookingSubmit} onBack={closeDetail} />;
      default:
        return <DetailNotFound onBack={closeDetail} />;
    }
  };

  return (
    <>
      <Header
        showHeaderBrand={showHeaderBrand || isViewingDetail}
        isMenuOpen={isMenuOpen}
        isHeaderSolid={isHeaderSolid}
        activeNav={activeNav}
        progressRef={progressRef}
        onNavigate={handleNavigate}
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
        onMenuClose={() => setIsMenuOpen(false)}
      />

      <main
        ref={revealRef}
        className="site-main bg-[#FBF9F4] text-[#2A2520] min-h-screen font-sans antialiased selection:bg-[#BF9B30] selection:text-white overflow-x-hidden"
      >
        {isViewingDetail ? (
          renderDetail()
        ) : (
          <>
            <HeroSection
              heroRef={heroRef}
              heroContentRef={heroContentRef}
              heroImage={siteImages.hero_image}
              onNavigate={handleNavigate}
            />
            <SectionTabs tabs={contentTabs} activeTab={activeSection} onTabChange={handleNavigate} />
            <div key={activeSection} className="active-section-panel animate-fadeIn">
              {activeSection === 'about' && (
                <AboutSection
                  aboutImage={siteImages.about_image}
                  onNavigate={handleNavigate}
                  onViewBio={() => handleOpenDetail('artist', '')}
                />
              )}
              {activeSection === 'sax' && <SaxExplorerSection />}
              {activeSection === 'performances' && (
                <PerformanceSection onOpenDetail={handleOpenDetail} media={mediaList} tours={tours} />
              )}
              {activeSection === 'academy' && (
                <AcademySection courses={courseList} workshops={workshopList} onOpenDetail={handleOpenDetail} />
              )}
              {activeSection === 'blog' && <BlogSection posts={postList} />}
              {activeSection === 'contact' && (
                <ContactSection
                  formData={formData}
                  formSubmitted={formSubmitted}
                  onFormChange={setFormData}
                  onSubmit={handleFormSubmit}
                  onReset={resetContactForm}
                />
              )}
            </div>
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}
