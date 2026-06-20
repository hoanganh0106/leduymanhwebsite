import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Hand, RotateCcw, Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Part data — anchors are in % of the 482×959 cropped image          */
/* ------------------------------------------------------------------ */
interface SaxPart {
  id: string;
  name: string;
  en: string;
  desc: string;
  x: number; // % left
  y: number; // % top
  z: number; // Z-depth in px
  side: 'left' | 'right';
}

const PARTS: SaxPart[] = [
  {
    id: 'mouthpiece',
    name: 'Ống thổi (Bec)',
    en: 'Mouthpiece',
    desc: 'Nơi gắn dăm (reed). Hơi thổi làm dăm rung lên, tạo ra âm thanh đầu tiên của cây kèn.',
    x: 14,
    y: 5,
    z: 20,
    side: 'right',
  },
  {
    id: 'neck',
    name: 'Cổ kèn',
    en: 'Neck / Crook',
    desc: 'Ống đồng cong nối bec với thân kèn, mang phím bát độ (octave) để chuyển quãng cao – thấp.',
    x: 38,
    y: 10,
    z: 14,
    side: 'right',
  },
  {
    id: 'bell',
    name: 'Loa kèn',
    en: 'Bell',
    desc: 'Phần loe rộng ở cuối kèn, khuếch đại và lan tỏa âm thanh ấm áp đặc trưng của saxophone.',
    x: 76,
    y: 57,
    z: 24,
    side: 'left',
  },
  {
    id: 'keys',
    name: 'Hệ thống phím',
    en: 'Keys',
    desc: 'Các phím xà cừ và cần bấm mở/đóng lỗ âm trên thân kèn, quyết định cao độ của từng nốt nhạc.',
    x: 48,
    y: 38,
    z: 18,
    side: 'right',
  },
  {
    id: 'body',
    name: 'Thân kèn',
    en: 'Body',
    desc: 'Ống đồng hình côn chính của kèn, nơi đặt phần lớn lỗ âm và toàn bộ hệ thống phím bấm.',
    x: 50,
    y: 62,
    z: 8,
    side: 'left',
  },
  {
    id: 'bow',
    name: 'Khúc cong (Bow)',
    en: 'Bow',
    desc: 'Đoạn cong hình chữ U nối thân kèn với loa kèn, tạo nên dáng cong mềm mại đặc trưng.',
    x: 56,
    y: 90,
    z: 10,
    side: 'left',
  },
];

const SPARKLES = [
  { id: 1, x: 20, y: 15, z: 20, scale: 0.8, delay: 0 },
  { id: 2, x: 80, y: 30, z: -10, scale: 0.6, delay: 1.5 },
  { id: 3, x: 15, y: 65, z: 35, scale: 1.1, delay: 0.7 },
  { id: 4, x: 85, y: 75, z: 15, scale: 0.7, delay: 2.2 },
  { id: 5, x: 50, y: 45, z: -25, scale: 0.5, delay: 3.1 },
  { id: 6, x: 30, y: 85, z: 25, scale: 0.9, delay: 1.1 },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function SaxExplorerSection() {
  const rotorRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const pointerActive = useRef(false); // pointer is down but may still be a tap
  const dragging = useRef(false); // crossed the move threshold → actually rotating
  const start = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });
  const target = useRef({ rx: -4, ry: 0 }); // where a drag wants the rotor
  const current = useRef({ rx: -4, ry: 0 }); // what is currently rendered
  const idleT = useRef(0);
  const visible = useRef(true);
  const reduceMotion = useRef(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const activePart = PARTS.find((part) => part.id === activeId) ?? null;

  const focusPart = (id: string) => {
    setActiveId(id);
    setRevealed(true);
  };

  /* ---- pointer drag to rotate ----
     We do NOT capture the pointer on pointerdown: doing so steals the click
     from the hotspot buttons (the capturing element receives pointerup, so the
     synthesized click targets the stage instead of the button). Instead we wait
     until the pointer moves past a small threshold before treating it as a drag,
     so a plain tap/click on a part still reaches the button. */
  const DRAG_THRESHOLD = 6; // px before a press becomes a rotate gesture

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerActive.current = true;
    dragging.current = false;
    start.current = { x: event.clientX, y: event.clientY };
    last.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerActive.current) return;

    if (!dragging.current) {
      const movedX = event.clientX - start.current.x;
      const movedY = event.clientY - start.current.y;
      if (Math.hypot(movedX, movedY) < DRAG_THRESHOLD) return;
      // Promote to a real drag now that the user clearly intends to rotate.
      dragging.current = true;
      setRevealed(true);
      last.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }

    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    target.current.ry = clamp(target.current.ry + dx * 0.4, -62, 62);
    target.current.rx = clamp(target.current.rx - dy * 0.32, -24, 18);
    current.current.rx = target.current.rx;
    current.current.ry = target.current.ry;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerActive.current = false;
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resetRotation = () => {
    target.current = { rx: -4, ry: 0 };
  };

  /* ---- animation loop: live idle sway + smooth ease toward target ---- */
  useEffect(() => {
    let raf = 0;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => {
      reduceMotion.current = motionQuery.matches;
    };
    syncReducedMotion();

    const renderFrame = () => {
      if (!visible.current) return;

      if (dragging.current) {
        current.current.rx = target.current.rx;
        current.current.ry = target.current.ry;
      } else if (reduceMotion.current) {
        current.current.rx += (target.current.rx - current.current.rx) * 0.08;
        current.current.ry += (target.current.ry - current.current.ry) * 0.08;
      } else {
        idleT.current += 0.016;
        const swayY = target.current.ry + Math.sin(idleT.current * 0.66) * 13;
        const swayX = target.current.rx + Math.sin(idleT.current * 0.5) * 4;
        current.current.rx += (swayX - current.current.rx) * 0.05;
        current.current.ry += (swayY - current.current.ry) * 0.05;
      }

      if (rotorRef.current) {
        rotorRef.current.style.transform = `rotateX(${current.current.rx.toFixed(2)}deg) rotateY(${current.current.ry.toFixed(2)}deg)`;
      }
    };

    const tick = () => {
      renderFrame();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const setVisible = (nextVisible: boolean) => {
      visible.current = nextVisible;
      if (nextVisible) {
        start();
      } else {
        stop();
      }
    };

    const stage = stageRef.current;
    let observer: IntersectionObserver | undefined;
    if (stage && 'IntersectionObserver' in window) {
      visible.current = false;
      observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting);
        },
        { threshold: 0.05 },
      );
      observer.observe(stage);
    } else {
      setVisible(true);
    }

    motionQuery.addEventListener('change', syncReducedMotion);

    return () => {
      stop();
      observer?.disconnect();
      motionQuery.removeEventListener('change', syncReducedMotion);
    };
  }, []);

  return (
    <section
      id="sax"
      className="relative overflow-hidden bg-gradient-to-b from-[#FBF9F4] via-[#F7F1E5] to-[#FBF9F4] text-[#2A2520] py-16 lg:py-24"
    >
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#BF9B30]/30 to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(223,189,105,0.20),transparent_66%)] blur-2xl lg:block"
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        {/* heading */}
        <div className="text-center max-w-2xl mx-auto scroll-reveal">
          <span className="section-kicker justify-center">
            <Sparkles size={14} />
            Khám phá
          </span>
          <h2 className="font-serif-lux text-3xl sm:text-4xl lg:text-5xl font-light mt-4 text-[#211D18]">
            Giải phẫu cây{' '}
            <span className="gold-foil font-normal">Alto Saxophone</span>
          </h2>
          <p className="font-sans-clean text-sm sm:text-base text-[#2A2520]/70 leading-relaxed mt-4">
            Kéo để xoay cây kèn và khám phá từng bộ phận tạo nên âm thanh sang trọng của saxophone.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* 3D stage */}
          <div className="lg:col-span-7 scroll-reveal-scale">
            <div
              className={`sax-explorer relative mx-auto w-full max-w-[24rem] sm:max-w-[28rem] ${revealed ? 'is-revealed' : ''}`}
            >
              <div ref={stageRef} className="sax-stage">
                <div
                  className="sax-grab relative touch-pan-y select-none"
                  style={{ aspectRatio: '482/959' }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  <div ref={rotorRef} className="sax-rotor absolute inset-0 scale-[0.83]">
                    <div className="sax-floater absolute inset-0 animate-float">
                      <SaxophoneSvg />

                      {/* halos behind active part */}
                      {PARTS.map((part) => (
                        <span
                          key={`halo-${part.id}`}
                          aria-hidden="true"
                          className={`sax-halo ${activeId === part.id ? 'is-active' : ''}`}
                          style={{
                            left: `${part.x}%`,
                            top: `${part.y}%`,
                            transform: `translate(-50%, -50%) translateZ(${part.z - 8}px)`,
                          }}
                        />
                      ))}

                      {/* hotspots */}
                      {PARTS.map((part, index) => (
                        <button
                          key={part.id}
                          type="button"
                          className={`sax-hotspot ${part.side === 'left' ? 'is-left' : ''} ${activeId === part.id ? 'is-active' : ''}`}
                          style={{
                            left: `${part.x}%`,
                            top: `${part.y}%`,
                            transform: `translate(-50%, -50%) translateZ(${part.z}px)`,
                          }}
                          onFocus={() => focusPart(part.id)}
                          onClick={() => focusPart(part.id)}
                          aria-label={`${part.name} — ${part.en}`}
                        >
                          <span className="sax-dot">{index + 1}</span>
                          <span className="sax-tag">{part.name}</span>
                        </button>
                      ))}

                      {/* floating sparkles in 3D */}
                      {SPARKLES.map((sp) => (
                        <div
                          key={`spark-${sp.id}`}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${sp.x}%`,
                            top: `${sp.y}%`,
                            transform: `translateZ(${sp.z}px) scale(${sp.scale})`,
                          }}
                        >
                          <div
                            className="sax-sparkle-child"
                            style={{
                              animationDelay: `${sp.delay}s`,
                              width: '18px',
                              height: '18px',
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#FFF2CC] opacity-90">
                              <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8Z" fill="url(#saxSparkleGrad)" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* drag hint + reset */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="sax-hint inline-flex items-center gap-2 rounded-full border border-[#BF9B30]/30 bg-[#FFFDF9]/70 px-4 py-2 font-sans-clean text-[11px] font-semibold uppercase tracked-sm text-[#9A7C30] backdrop-blur-sm">
                  <Hand size={13} />
                  Kéo để xoay
                </span>
                <button
                  type="button"
                  onClick={resetRotation}
                  className="inline-flex items-center gap-2 rounded-full border border-[#BF9B30]/30 bg-[#FFFDF9]/70 px-4 py-2 font-sans-clean text-[11px] font-semibold uppercase tracked-sm text-[#2A2520]/70 backdrop-blur-sm transition-colors hover:text-[#9A7C30] hover:border-[#BF9B30]"
                >
                  <RotateCcw size={13} />
                  Xoay lại
                </button>
              </div>
            </div>
          </div>

          {/* part list + description */}
          <div className="lg:col-span-5 scroll-reveal-right">
            <h3 className="font-garamond text-2xl sm:text-3xl italic text-[#7A5E22] font-light">
              Các bộ phận chính
            </h3>
            <ul className="mt-5 space-y-2.5">
              {PARTS.map((part, index) => (
                <li key={part.id}>
                  <button
                    type="button"
                    onFocus={() => focusPart(part.id)}
                    onClick={() => focusPart(part.id)}
                    className={`sax-part-item flex w-full items-center gap-3.5 rounded-xl border border-[#BF9B30]/15 bg-[#FFFDF9]/55 px-4 py-3 text-left ${activeId === part.id ? 'is-active' : ''}`}
                  >
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#DFBD69] to-[#BF9B30] text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="leading-tight">
                      <span className="block font-sans-clean text-sm font-semibold text-[#211D18]">
                        {part.name}
                      </span>
                      <span className="block font-sans-clean text-[11px] uppercase tracked-sm text-[#2A2520]/45">
                        {part.en}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 min-h-[6.5rem] rounded-2xl border border-[#BF9B30]/20 bg-[#FFFDF9] p-5 shadow-[var(--shadow-card)]">
              {activePart ? (
                <>
                  <p className="font-serif-lux text-lg text-[#9A7C30]">{activePart.name}</p>
                  <p className="mt-1.5 font-sans-clean text-sm leading-relaxed text-[#2A2520]/75">
                    {activePart.desc}
                  </p>
                </>
              ) : (
                <p className="font-garamond text-lg italic text-[#2A2520]/55">
                  Rê chuột hoặc chạm vào một điểm trên cây kèn để xem chi tiết bộ phận…
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Real photograph implementation of Alto Saxophone with 3D layers   */
/* ------------------------------------------------------------------ */
function SaxophoneSvg() {
  return (
    <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
      {/* 1. Defs Container (Hidden) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <radialGradient id="saxSparkleGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF2CC" />
            <stop offset="70%" stopColor="#DFBD69" />
            <stop offset="100%" stopColor="#BF9B30" opacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Layer 1: Realistic blurred cast shadow */}
      <img
        src="/sax-real.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          transform: 'translateZ(-25px) scale(0.98)',
          filter: 'blur(12px) brightness(0) opacity(0.35)',
        }}
      />
      
      {/* Layer 2: Ultra-realistic saxophone photo */}
      <img
        src="/sax-real.png"
        alt="Alto Saxophone"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          transform: 'translateZ(0px)',
          filter: 'drop-shadow(0 4px 10px rgba(74, 58, 28, 0.12))',
        }}
      />

      {/* Layer 3: High-contrast light reflection sheen */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
        style={{
          transform: 'translateZ(10px)',
          mixBlendMode: 'overlay',
          opacity: 0.15,
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 52%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'saxGlint 6s ease-in-out infinite',
        }}
      />
    </div>
  );
}
