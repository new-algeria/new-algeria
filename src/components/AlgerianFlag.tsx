import React from "react";

// Drapeau officiel (3:2) : moitié verte, moitié blanche, croissant et étoile rouges
const FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><path fill="#fff" d="M0 0h900v600H0z"/><path fill="#006233" d="M0 0h450v600H0z"/><path fill="#d21034" d="M579.904 225a150 150 0 1 0 0 150 120 120 0 1 1 0-150m3.6 75L450 256.603l82.442 113.471v-140.148L450 343.397z"/></svg>`;
const FLAG_URL = `url("data:image/svg+xml,${encodeURIComponent(FLAG_SVG)}")`;

const STRIPS = 40;

type AlgerianFlagProps = {
  className?: string;
};

// Le drapeau ondule grâce à des bandes verticales décalées dans le temps :
// plus on s'éloigne de la hampe, plus l'amplitude grandit.
const AlgerianFlag = ({ className = "" }: AlgerianFlagProps) => (
  <div
    className={`dz-flag ${className}`}
    role="img"
    aria-label="Drapeau de l'Algérie"
  >
    <span className="dz-flag-pole" aria-hidden="true" />
    <span
      className="dz-flag-cloth"
      aria-hidden="true"
      style={{ "--n": STRIPS } as React.CSSProperties}
    >
      {Array.from({ length: STRIPS }, (_, i) => (
        <span
          key={i}
          className="dz-flag-strip"
          style={
            {
              "--i": i,
              "--a": (0.15 + (0.85 * i) / (STRIPS - 1)).toFixed(3),
              backgroundImage: FLAG_URL,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  </div>
);

export default AlgerianFlag;
