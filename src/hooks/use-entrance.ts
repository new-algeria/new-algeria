import { useEffect } from "react";

type Kind = "drop" | "unblur" | "spring" | "rise";

const KEYFRAMES: Record<Kind, Keyframe[]> = {
  drop: [
    { opacity: 0, transform: "translateY(-18px)" },
    { opacity: 1, transform: "none" },
  ],
  unblur: [
    { opacity: 0, filter: "blur(14px)" },
    { opacity: 1, filter: "blur(0)" },
  ],
  spring: [
    { opacity: 0, transform: "translateY(48px) scale(0.96)", filter: "blur(12px)" },
    { opacity: 1, transform: "none", filter: "blur(0)" },
  ],
  rise: [
    { opacity: 0, transform: "translateY(26px)" },
    { opacity: 1, transform: "none" },
  ],
};

const TIMING: Record<Kind, { duration: number; easing: string }> = {
  drop: { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  unblur: { duration: 700, easing: "ease-out" },
  spring: { duration: 900, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  rise: { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
};

// Une seule timeline Web Animations jouée une fois : chaque élément
// [data-enter="kind"] démarre à son tour (dans l'ordre du DOM, ou selon
// data-enter-at en ms). À la fin, on rend la main au CSS (hover, etc.).
export const useEntrance = () => {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-enter]")
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || typeof Element.prototype.animate !== "function") {
      elements.forEach((el) => el.removeAttribute("data-enter"));
      return;
    }

    let cursor = 0;
    const animations = elements.map((el) => {
      const kind = (el.dataset.enter as Kind) || "rise";
      const at = el.dataset.enterAt ? Number(el.dataset.enterAt) : cursor;
      cursor = at + (kind === "spring" ? 160 : 80);

      const animation = el.animate(KEYFRAMES[kind], {
        ...TIMING[kind],
        delay: at,
        fill: "both",
      });
      animation.onfinish = () => {
        el.removeAttribute("data-enter");
        animation.cancel();
      };
      return animation;
    });

    return () =>
      animations.forEach((animation) => {
        animation.onfinish = null;
        animation.cancel();
      });
  }, []);
};
