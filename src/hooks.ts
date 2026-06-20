import { useState, useEffect, useRef, useCallback } from 'react';

// Custom cursor hook - trailing glow
export function useCustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<{x: number; y: number}[]>([]);
  const [hovering, setHovering] = useState(false);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<{x: number; y: number}[]>(Array(5).fill({ x: -100, y: -100 }));

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], input, select, textarea')) setHovering(true);
    };
    const out = () => setHovering(false);

    const animate = () => {
      const m = mouseRef.current;
      setPos(m);
      // Smooth trail: each point lerps toward the previous
      const newTrail = trailRef.current.map((p, i) => {
        const target = i === 0 ? m : trailRef.current[i - 1];
        return {
          x: p.x + (target.x - p.x) * 0.35,
          y: p.y + (target.y - p.y) * 0.35,
        };
      });
      trailRef.current = newTrail;
      setTrail([...newTrail]);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout', out);
    };
  }, []);

  return { pos, trail, hovering };
}

// Scroll reveal hook.
// `deps` lets callers re-scan when async-loaded content swaps in new DOM nodes
// (otherwise late-arriving cards would stay stuck in their hidden initial state).
export function useScrollReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const items = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    items.forEach((item) => {
      if (!item.classList.contains('revealed')) observer.observe(item);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

// Scroll progress hook
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return { progress, scrolled };
}

// Parallax hook
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const y = -(rect.top * speed);
    ref.current.style.transform = `translateY(${y}px)`;
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return ref;
}
