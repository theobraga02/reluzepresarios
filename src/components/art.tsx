/** Ilustrações vetoriais originais (sem fotos de terceiros). */

export function HeroBackdrop() {
  return (
    <svg className="hero__bg" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a5a5f" />
          <stop offset=".5" stopColor="#2a2a2d" />
          <stop offset="1" stopColor="#09090a" />
        </linearGradient>
        <radialGradient id="hb-glow" cx=".5" cy=".42" r=".4">
          <stop offset="0" stopColor="#e4e4e7" stopOpacity=".8" />
          <stop offset="1" stopColor="#d9d9dc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hb-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#09090a" stopOpacity=".78" />
          <stop offset=".55" stopColor="#09090a" stopOpacity=".15" />
          <stop offset="1" stopColor="#09090a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hb-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".7" stopColor="#09090a" stopOpacity="0" />
          <stop offset="1" stopColor="#09090a" stopOpacity="1" />
        </linearGradient>
        <filter id="hb-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
        <filter id="hb-blur2"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="800" height="640" fill="url(#hb-sky)" />
      <rect width="800" height="640" fill="url(#hb-glow)" />
      <g filter="url(#hb-blur)" fill="#c9c9cd">
        <ellipse cx="300" cy="170" rx="190" ry="34" opacity=".3" />
        <ellipse cx="560" cy="230" rx="210" ry="40" opacity=".34" />
        <ellipse cx="430" cy="330" rx="260" ry="40" opacity=".42" />
        <ellipse cx="120" cy="260" rx="150" ry="28" opacity=".14" />
      </g>
      <path d="M0 360 L90 300 L160 340 L260 270 L340 330 L430 290 L520 345 L620 285 L720 335 L800 300 V640 H0Z" fill="#3d3d41" opacity=".9" filter="url(#hb-blur2)" />
      <path d="M0 420 L110 365 L200 405 L300 350 L390 400 L480 372 L590 420 L690 380 L800 415 V640 H0Z" fill="#202023" />
      <path d="M0 520 L140 480 L260 500 L350 468 Q400 424 430 424 Q470 424 520 470 L640 490 L800 460 V640 H0Z" fill="#0d0d0e" />
      {/* silhueta (original) de uma pessoa de costas no topo da montanha */}
      <g transform="translate(440 428) scale(1.4)" fill="#050506">
        <circle cx="0" cy="-103" r="11" />
        <path d="M-21 -90 Q0 -98 21 -90 L26 -40 L-26 -40Z" />
        <rect x="-33" y="-88" width="20" height="50" rx="8" />
        <path d="M21 -88 L36 -52 L29 -48 L16 -76Z" />
        <path d="M-22 -42 H-3 L-6 6 H-20Z M3 -42 H22 L20 6 H6Z" />
      </g>
      <rect width="800" height="640" fill="url(#hb-left)" />
      <rect width="800" height="640" fill="url(#hb-bottom)" />
    </svg>
  )
}

export function ClosingArt() {
  const lights = Array.from({ length: 46 }, (_, i) => ({
    x: (i * 53) % 400,
    y: 268 + ((i * 37) % 70),
    o: 0.2 + ((i * 13) % 5) / 10,
  }))
  return (
    <svg className="closing__art" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="ca-glow" cx=".6" cy=".55" r=".62">
          <stop offset="0" stopColor="#f3a964" />
          <stop offset=".4" stopColor="#8d4a26" />
          <stop offset="1" stopColor="#0d0b0c" />
        </radialGradient>
        <linearGradient id="ca-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".6" stopColor="#09090a" stopOpacity="0" />
          <stop offset="1" stopColor="#09090a" />
        </linearGradient>
      </defs>
      <rect width="400" height="360" fill="url(#ca-glow)" />
      <path d="M0 300 V262 h18 v-20 h14 v30 h16 v-48 h20 v40 h14 v-16 h18 v34 h22 v-60 h16 v50 h20 v-26 h18 v40 h16 V300Z" fill="#141012" opacity=".9" />
      {lights.map((l, i) => <rect key={i} x={l.x} y={l.y} width="2" height="2" fill="#ffb877" opacity={l.o} />)}
      {/* silhueta (original) de uma pessoa olhando o horizonte */}
      <g fill="#070607">
        <circle cx="325" cy="190" r="36" />
        <path d="M262 360 Q266 268 325 250 Q384 268 388 360Z" />
        <path d="M296 240 Q325 260 354 240 L358 256 Q325 276 292 256Z" />
      </g>
      <path d="M290 196 A36 36 0 0 1 312 156" fill="none" stroke="#f0a35f" strokeOpacity=".35" strokeWidth="2" />
      <rect width="400" height="360" fill="url(#ca-fade)" />
    </svg>
  )
}
