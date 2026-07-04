import { useCallback, useEffect, useRef, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SafeImage } from './safe-image';

export type LightboxImage = {
  src: string;
  caption?: string;
};

interface LightboxProps {
  images: LightboxImage[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 48;

export function Lightbox({ images, title, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const currentImage = images[index] || images[0];
  const caption = currentImage?.caption || title;
  const hasMultipleImages = images.length > 1;

  const goTo = useCallback(
    (nextIndex: number) => onIndexChange((nextIndex + images.length) % images.length),
    [images.length, onIndexChange],
  );

  // Lock body scroll and move focus into the dialog once, when it opens.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Escape closes, arrows navigate, Tab stays trapped inside the dialog.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft' && hasMultipleImages) goTo(index - 1);
      if (event.key === 'ArrowRight' && hasMultipleImages) goTo(index + 1);
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goTo, hasMultipleImages, index, onClose]);

  // Warm the browser cache for the neighbouring images so navigation is instant.
  useEffect(() => {
    if (!hasMultipleImages) return;
    [index - 1, index + 1].forEach((neighbour) => {
      const image = images[(neighbour + images.length) % images.length];
      if (image?.src) {
        const preload = new Image();
        preload.src = image.src;
      }
    });
  }, [hasMultipleImages, images, index]);

  if (!currentImage) return null;

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) goTo(index - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goTo(index + 1);
    touchStartX.current = null;
  };

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex animate-[fadeUp_180ms_ease-out] items-center justify-center bg-[#211D18]/92 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh ${title}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Đóng ảnh"
        className="focus-ring absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#DFBD69]/45 bg-[#FFFDF9]/10 text-[#FFFDF9] transition-colors hover:bg-[#FFFDF9]/18"
      >
        <X size={18} />
      </button>

      {hasMultipleImages && (
        <>
          {/* Desktop: round arrow controls. */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Ảnh trước"
            className="focus-ring absolute left-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#DFBD69]/45 bg-[#FFFDF9]/10 text-[#FFFDF9] transition-colors hover:bg-[#FFFDF9]/18 sm:grid"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Ảnh tiếp theo"
            className="focus-ring absolute right-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#DFBD69]/45 bg-[#FFFDF9]/10 text-[#FFFDF9] transition-colors hover:bg-[#FFFDF9]/18 sm:grid"
          >
            <ChevronRight size={24} />
          </button>

          {/* Mobile: tap the left / right edge of the screen to navigate (swipe
              works too). tabIndex -1 keeps them out of the focus trap. */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => goTo(index - 1)}
            aria-hidden="true"
            className="absolute inset-y-16 left-0 z-10 w-1/4 sm:hidden"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => goTo(index + 1)}
            aria-hidden="true"
            className="absolute inset-y-16 right-0 z-10 w-1/4 sm:hidden"
          />
        </>
      )}

      <figure className="pointer-events-none flex max-w-[92vw] flex-col items-center gap-3">
        <SafeImage
          key={currentImage.src}
          src={currentImage.src}
          alt={caption}
          className="max-h-[82vh] max-w-[92vw] animate-[lightboxFade_220ms_ease-out] rounded-lg object-contain shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          loading="eager"
          decoding="async"
        />
        <figcaption className="font-sans-clean text-xs text-[#FFFDF9]/78">
          {caption} · {index + 1} / {images.length}
        </figcaption>
      </figure>
    </div>
  );
}
