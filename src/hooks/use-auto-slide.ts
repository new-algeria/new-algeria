import { useEffect, type RefObject } from "react";

const INTERVAL_MS = 3200;
const PAUSE_AFTER_TOUCH_MS = 6000;

// Fait défiler doucement une rangée de cartes (.mb-row) sur mobile, carte par
// carte, puis revient au début. Se met en pause dès que l'utilisateur la touche.
export const useAutoSlide = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const row = ref.current;
    if (!row) return;

    const mobile = window.matchMedia("(max-width: 860px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pausedUntil = 0;
    let visible = false;

    const pause = () => {
      pausedUntil = Date.now() + PAUSE_AFTER_TOUCH_MS;
    };
    row.addEventListener("pointerdown", pause, { passive: true });
    row.addEventListener("touchstart", pause, { passive: true });
    row.addEventListener("wheel", pause, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.6 }
    );
    observer.observe(row);

    const timer = window.setInterval(() => {
      if (!mobile.matches || reduced.matches || !visible || Date.now() < pausedUntil) {
        return;
      }
      const first = row.firstElementChild as HTMLElement | null;
      if (!first) return;

      // En arabe (RTL), scrollLeft devient négatif
      const direction = getComputedStyle(row).direction === "rtl" ? -1 : 1;
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const step = first.offsetWidth + gap;
      const atEnd = Math.abs(row.scrollLeft) + row.clientWidth >= row.scrollWidth - 8;

      row.scrollTo({
        left: atEnd ? 0 : row.scrollLeft + step * direction,
        behavior: "smooth",
      });
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      row.removeEventListener("pointerdown", pause);
      row.removeEventListener("touchstart", pause);
      row.removeEventListener("wheel", pause);
    };
  }, [ref]);
};
