import { useCallback, useRef, useState } from 'react';

/* Shared open/close state for the galleries that use the Lightbox (About
   "Khoảnh khắc" strip, milestone gallery, full gallery page). Remembers which
   trigger opened the modal so focus returns to it on close. */
export function useLightbox() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openerIndexRef = useRef<number | null>(null);

  const open = useCallback((index: number) => {
    openerIndexRef.current = index;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    window.setTimeout(() => {
      const openerIndex = openerIndexRef.current;
      if (openerIndex !== null) triggerRefs.current[openerIndex]?.focus();
      openerIndexRef.current = null;
    }, 0);
  }, []);

  const registerTrigger = useCallback(
    (index: number) => (element: HTMLButtonElement | null) => {
      triggerRefs.current[index] = element;
    },
    [],
  );

  return { openIndex, setOpenIndex, open, close, registerTrigger };
}
