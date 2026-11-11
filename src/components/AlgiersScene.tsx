import React from "react";

/*
 * Décor du hero : une aube paisible sur la baie d'Alger, dessinée en SVG.
 * Deux calques partagent le même viewBox (1440×900, ancré en bas) pour que
 * le drapeau puisse se glisser entre le ciel et les collines.
 */

const VIEWBOX = "0 0 1440 900";

// Générateur pseudo-aléatoire déterministe : le décor est identique à chaque rendu
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Point = [number, number];

// Relie des points par des courbes douces (ligne de crête)
const smoothLine = (points: Point[]) =>
  points
    .map(([x, y], i) => {
      if (i === 0) return `M${x} ${y}`;
      const [px, py] = points[i - 1];
      const mx = (px + x) / 2;
      return `Q${px} ${py} ${mx} ${(py + y) / 2}`;
    })
    .join(" ") + ` L${points[points.length - 1][0]} ${points[points.length - 1][1]}`;

const ridge = (seed: number, base: number, amplitude: number, step: number) => {
  const rand = seeded(seed);
  const points: Point[] = [];
  for (let x = -40; x <= 1480; x += step) {
    points.push([x, base - rand() * amplitude]);
  }
  return `${smoothLine(points)} L1480 900 L-40 900 Z`;
};

/* ---------- Réseau « connecté » dans le ciel ---------- */

const network = (() => {
  const rand = seeded(7);
  const nodes: Point[] = [];
  while (nodes.length < 30) {
    const candidate: Point = [40 + rand() * 1360, 50 + rand() * 520];
    if (nodes.every(([x, y]) => Math.hypot(x - candidate[0], y - candidate[1]) > 120)) {
      nodes.push(candidate);
    }
  }
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1]) }))
      .filter(({ j, d }) => j > i && d < 230)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach(({ j }) => edges.push([i, j]));
  });
  return { nodes, edges };
})();

// Points de la ville (minaret, Casbah) reliés au nœud le plus proche au-dessus d'eux
const uplinkSources: Point[] = [
  [477, 694],
  [250, 740],
];

const uplinks = uplinkSources.map((from) => {
  const above = network.nodes
    .map(([x, y], i) => ({ i, y, d: Math.hypot(x - from[0], y - from[1]) }))
    .filter(({ y }) => y < from[1] - 80)
    .sort((a, b) => a.d - b.d);
  return { from, to: above[0].i };
});

/* ---------- Casbah : maisons blanches en cascade vers la mer ---------- */

const hillTop = (x: number) => {
  // Colline de la Casbah : haute à gauche, descend vers le port
  if (x < 0) return 718;
  if (x > 600) return 900;
  const t = x / 600;
  return 718 + 182 * t * t;
};

const casbah = (() => {
  const rand = seeded(42);
  const houses: { x: number; y: number; w: number; h: number; tone: number; windows: { x: number; y: number; lit: boolean }[] }[] = [];
  for (let x = -16; x < 590; x += 20 + rand() * 8) {
    let y = hillTop(x) - 6 - rand() * 10;
    while (y < 900) {
      const w = 22 + rand() * 14;
      const h = 15 + rand() * 12;
      const windows = Array.from({ length: rand() > 0.35 ? (rand() > 0.6 ? 2 : 1) : 0 }, (_, k) => ({
        x: x + 5 + k * 9 + rand() * 3,
        y: y + 5 + rand() * 4,
        lit: rand() > 0.55,
      }));
      houses.push({ x: x + rand() * 6 - 3, y, w, h, tone: Math.floor(rand() * 3), windows });
      y += h * (0.62 + rand() * 0.2);
    }
  }
  // Les maisons du bas recouvrent celles du haut, comme sur la pente
  return houses.sort((a, b) => a.y - b.y);
})();

const stars = (() => {
  const rand = seeded(99);
  return Array.from({ length: 70 }, () => ({
    x: rand() * 1440,
    y: rand() * 560,
    r: 0.6 + rand() * 1.3,
    d: (rand() * 4).toFixed(2),
  }));
})();

/* ---------- Calque du fond : ciel, réseau, montagnes, mer ---------- */

export const SceneBack = () => (
  <svg className="dz-scene-layer" viewBox={VIEWBOX} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <radialGradient id="dz-sun-glow">
        <stop offset="0" stopColor="var(--dz-sun-glow)" stopOpacity="0.9" />
        <stop offset="1" stopColor="var(--dz-sun-glow)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="dz-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--dz-sea-top)" />
        <stop offset="1" stopColor="var(--dz-sea-bottom)" />
      </linearGradient>
    </defs>

    <g className="dz-stars">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `${s.d}s` }} />
      ))}
    </g>

    <circle cx="760" cy="672" r="260" fill="url(#dz-sun-glow)" />
    <circle className="dz-sun" cx="760" cy="672" r="58" />

    {/* Nuages qui dérivent lentement */}
    <g className="dz-clouds">
      {[
        { x: 80, y: 120, s: 1.1, d: 90 },
        { x: 620, y: 70, s: 0.8, d: 120 },
        { x: 1060, y: 150, s: 1, d: 100 },
        { x: 340, y: 300, s: 0.7, d: 140 },
        { x: 1240, y: 360, s: 0.6, d: 110 },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
          <path
            className="dz-cloud"
            style={{ animationDuration: `${c.d}s` }}
            d="M0 60c0-22 18-38 40-36 8-20 30-32 52-24 14-18 46-18 60 4 24-6 46 10 46 32 18 2 30 14 30 28H0c-12 0-12-4 0-4z"
          />
        </g>
      ))}
    </g>

    {/* Réseau de données : nœuds, liens et impulsions qui circulent */}
    <g className="dz-network">
      {network.edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          className="dz-link"
          x1={network.nodes[a][0]}
          y1={network.nodes[a][1]}
          x2={network.nodes[b][0]}
          y2={network.nodes[b][1]}
        />
      ))}
      {network.edges
        .filter((_, i) => i % 3 === 0)
        .map(([a, b], i) => (
          <line
            key={`p${i}`}
            className="dz-pulse"
            pathLength={100}
            x1={network.nodes[a][0]}
            y1={network.nodes[a][1]}
            x2={network.nodes[b][0]}
            y2={network.nodes[b][1]}
            style={{ animationDelay: `${(i * 0.9) % 7}s`, animationDuration: `${5 + (i % 4)}s` }}
          />
        ))}
      {network.nodes.map(([x, y], i) => (
        <g key={`n${i}`} className="dz-node" style={{ animationDelay: `${(i * 0.37) % 5}s` }}>
          <circle cx={x} cy={y} r="9" className="dz-node-halo" />
          <circle cx={x} cy={y} r="3.2" />
        </g>
      ))}
    </g>

    {/* Goélands */}
    <g className="dz-gulls">
      {[
        [860, 240, 1],
        [905, 268, 0.75],
        [820, 285, 0.6],
      ].map(([x, y, s], i) => (
        <path
          key={i}
          className="dz-gull"
          style={{ animationDelay: `${i * 1.3}s` }}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M-14 0c6-6 10-6 14 0 4-6 8-6 14 0-5-3-9-2-14 3-5-5-9-6-14-3z"
        />
      ))}
    </g>

    {/* Atlas au loin */}
    <path className="dz-mountain-far" d={ridge(3, 668, 70, 110)} />
    <path className="dz-mountain-near" d={ridge(11, 690, 36, 80)} />

    {/* Notre-Dame d'Afrique sur sa colline */}
    <path className="dz-headland" d="M-40 900 L-40 668 C40 650 120 640 190 652 C250 662 300 690 330 720 L330 900 Z" />
    <g className="dz-basilica" transform="translate(150 606)">
      <rect x="-26" y="22" width="52" height="30" />
      <path d="M-16 22a16 16 0 0 1 32 0z" />
      <rect x="-2" y="-6" width="4" height="12" />
      <rect x="26" y="4" width="10" height="48" />
      <path d="M26 4l5-10 5 10z" />
    </g>

    {/* La Méditerranée */}
    <rect x="-40" y="700" width="1520" height="200" fill="url(#dz-sea)" />
    <g className="dz-shimmer">
      {[
        [640, 730, 90],
        [820, 752, 140],
        [1010, 724, 70],
        [700, 790, 120],
        [930, 812, 80],
        [1140, 770, 110],
      ].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height="2.5" rx="1.25" style={{ animationDelay: `${i * 0.8}s` }} />
      ))}
    </g>
  </svg>
);

/* ---------- Calque de devant : Casbah, Maqam Echahid, front de mer ---------- */

export const SceneFront = () => (
  <svg className="dz-scene-layer" viewBox={VIEWBOX} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    {/* Liens montants : la ville est connectée */}
    <g className="dz-network">
      {uplinks.map(({ from, to }, i) => (
        <g key={i}>
          <line className="dz-uplink" x1={from[0]} y1={from[1]} x2={network.nodes[to][0]} y2={network.nodes[to][1]} />
          <line
            className="dz-pulse dz-pulse-up"
            pathLength={100}
            x1={from[0]}
            y1={from[1]}
            x2={network.nodes[to][0]}
            y2={network.nodes[to][1]}
            style={{ animationDelay: `${i * 1.7}s` }}
          />
        </g>
      ))}
    </g>

    {/* Colline de droite et Maqam Echahid */}
    <path className="dz-hill" d="M800 900 C860 800 960 748 1100 734 C1240 720 1360 722 1480 732 L1480 900 Z" />
    <g className="dz-shrubs">
      {[
        [940, 790, 16],
        [985, 772, 12],
        [1080, 752, 14],
        [1160, 744, 11],
        [1330, 738, 15],
        [1390, 744, 12],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
    <g className="dz-maqam" transform="translate(1366 728)">
      <path className="dz-maqam-shade" d="M-46 0 C-40 -70 -20 -140 -4 -176 L0 -176 L0 0 Z" />
      <path d="M46 0 C40 -70 20 -140 4 -176 L0 -176 L0 0 Z" />
      <path className="dz-maqam-mid" d="M-12 0 C-8 -60 -4 -130 0 -176 C4 -130 8 -60 12 0 Z" />
      <rect className="dz-maqam-shade" x="-7" y="-196" width="14" height="22" rx="3" />
      <path d="M-9 -196 L0 -206 L9 -196 Z" />
      <rect className="dz-maqam-base" x="-60" y="-6" width="120" height="8" rx="2" />
    </g>

    {/* La Casbah */}
    <g className="dz-casbah">
      {casbah.map((house, i) => (
        <g key={i}>
          <rect className={`dz-house dz-tone-${house.tone}`} x={house.x} y={house.y} width={house.w} height={house.h} />
          <rect className="dz-house-side" x={house.x + house.w * 0.74} y={house.y} width={house.w * 0.26} height={house.h} />
          {house.windows.map((win, k) => (
            <rect key={k} className={win.lit ? "dz-window dz-window-lit" : "dz-window"} x={win.x} y={win.y} width="4" height="5" rx="1" />
          ))}
        </g>
      ))}
      {/* Minaret */}
      <g className="dz-minaret" transform="translate(470 712)">
        <rect x="0" y="0" width="14" height="80" />
        <rect className="dz-house-side" x="10" y="0" width="4" height="80" />
        <rect x="-3" y="-6" width="20" height="8" />
        <path d="M1 -6 L7 -20 L13 -6 Z" />
        <rect className="dz-window dz-window-lit" x="5" y="14" width="4" height="7" rx="1" />
      </g>
    </g>

    {/* Front de mer et ses arcades */}
    <g className="dz-arcades">
      <rect x="380" y="852" width="660" height="48" />
      <rect className="dz-house-side" x="380" y="852" width="660" height="5" />
      {Array.from({ length: 29 }, (_, i) => (
        <path key={i} className="dz-arch" d={`M${394 + i * 22} 900 v-22 a7 7 0 0 1 14 0 v22 z`} />
      ))}
    </g>

    {/* Palmiers */}
    {[
      [760, 900, 0.8],
      [1010, 900, 1.05],
      [1072, 900, 0.85],
      [1400, 900, 0.9],
    ].map(([x, y, s], i) => (
      <g key={i} className="dz-palm" transform={`translate(${x} ${y}) scale(${s})`}>
        <path className="dz-palm-trunk" d="M-4 0 C-2 -60 4 -120 10 -170 L16 -170 C10 -120 6 -60 6 0 Z" />
        <g className="dz-palm-crown" transform="translate(13 -172)">
          <path d="M0 0 C-30 -18 -60 -10 -78 14 C-52 -2 -28 -2 0 6 Z" />
          <path d="M0 0 C30 -18 60 -10 78 14 C52 -2 28 -2 0 6 Z" />
          <path d="M0 0 C-20 -34 -46 -44 -66 -36 C-40 -30 -20 -16 0 4 Z" />
          <path d="M0 0 C20 -34 46 -44 66 -36 C40 -30 20 -16 0 4 Z" />
          <path d="M0 0 C-4 -30 2 -50 14 -60 C8 -40 6 -20 2 4 Z" />
        </g>
      </g>
    ))}

    <path className="dz-ground" d="M-40 900 L-40 884 C300 876 700 892 1060 880 C1250 874 1380 880 1480 884 L1480 900 Z" />
  </svg>
);
