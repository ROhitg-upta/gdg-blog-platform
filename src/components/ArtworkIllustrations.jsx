import React from 'react';

/**
 * Card 1 Artwork:
 * Open book on muted lavender/periwinkle background (#A096C6),
 * matching the reference illustration.
 */
export function ArtworkLavenderBook() {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stylized open book on muted lavender background"
    >
      {/* Background lavender rectangle */}
      <rect width="320" height="200" fill="#A096C6" />

      {/* Book base/stand in dark ink */}
      <path
        d="M 68 140 L 72 170 L 248 170 L 252 140 Z"
        fill="#1E1A28"
      />
      <rect x="74" y="146" width="172" height="18" fill="#1E1A28" />

      {/* Left curving book cover edge */}
      <path
        d="M 80 148 L 78 108 C 78 105, 82 104, 85 106 L 158 145 Z"
        fill="#1E1A28"
      />
      {/* Right curving book cover edge */}
      <path
        d="M 240 148 L 242 108 C 242 105, 238 104, 235 106 L 162 145 Z"
        fill="#1E1A28"
      />

      {/* Left Page (Clean ivory curve) */}
      <path
        d="M 160 144 C 145 105, 105 82, 85 86 C 81 87, 80 90, 80 94 L 84 140 C 104 136, 142 138, 160 144 Z"
        fill="#FFFFFF"
      />
      {/* Left Page crease / subtle depth layer */}
      <path
        d="M 160 144 C 150 115, 118 95, 96 95 L 98 138 C 120 136, 146 140, 160 144 Z"
        fill="#F6F3FB"
      />

      {/* Right Page (Clean ivory curve) */}
      <path
        d="M 160 144 C 175 105, 215 82, 235 86 C 239 87, 240 90, 240 94 L 236 140 C 216 136, 178 138, 160 144 Z"
        fill="#FFFFFF"
      />
      {/* Right Page crease / subtle depth layer */}
      <path
        d="M 160 144 C 170 115, 202 95, 224 95 L 222 138 C 200 136, 174 140, 160 144 Z"
        fill="#F6F3FB"
      />

      {/* Center spine crease line */}
      <line x1="160" y1="96" x2="160" y2="148" stroke="#1E1A28" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Card 2 Artwork (Visual Anchor):
 * Minimalist desert/mediterranean architecture in peach, sand, terracotta, and ink.
 */
export function ArtworkArchitecturalPeach() {
  return (
    <svg
      viewBox="0 0 360 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minimalist Mediterranean architectural forms in peach, sand, and terracotta"
    >
      {/* Peach sky background */}
      <rect width="360" height="210" fill="#FCE3D2" />

      {/* Distant background wall */}
      <rect x="220" y="70" width="80" height="140" fill="#F0CDB7" />

      {/* Left building (sand colored) */}
      <polygon points="40,85 145,105 145,210 40,210" fill="#E8C3AC" />
      <polygon points="40,85 145,105 145,102 40,82" fill="#DFB79E" />

      {/* Left building arched doorway */}
      <path
        d="M 75 160 L 75 130 C 75 118, 92 118, 92 130 L 92 160 Z"
        fill="#1E1C1A"
      />

      {/* Foreground angled wall running horizontally */}
      <polygon points="40,165 185,150 185,210 40,210" fill="#DFB79E" />
      <polygon points="40,165 185,150 185,152 40,167" fill="#CF9F83" />

      {/* Subtle stairs / steps leading up in center */}
      <polygon points="145,130 185,130 185,135 145,135" fill="#FFFFFF" />
      <polygon points="150,135 185,135 185,140 150,140" fill="#FFFFFF" />
      <polygon points="155,140 185,140 185,145 155,145" fill="#FFFFFF" />

      {/* Center-right house with flat roof */}
      <rect x="185" y="90" width="70" height="120" fill="#EED0BD" />
      <line x1="185" y1="90" x2="255" y2="90" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="215" y1="90" x2="215" y2="125" stroke="#1E1C1A" strokeWidth="1.5" />
      <rect x="200" y="130" width="22" height="35" fill="#1E1C1A" />

      {/* Right prominent terracotta building block */}
      <polygon points="255,60 330,80 330,210 255,210" fill="#C85735" />
      <polygon points="255,60 330,80 330,76 255,56" fill="#B24727" />

      {/* Arched doorway on the right terracotta building */}
      <path
        d="M 280 190 L 280 105 C 280 82, 320 82, 320 105 L 320 190 Z"
        fill="#1E1C1A"
      />

      {/* Clean hairline outlines matching editorial illustration style */}
      <line x1="145" y1="105" x2="145" y2="210" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="40" y1="85" x2="145" y2="105" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="40" y1="165" x2="185" y2="150" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="255" y1="60" x2="255" y2="210" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="255" y1="60" x2="330" y2="80" stroke="#1E1C1A" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Card 3 Artwork:
 * Quiet sunlit reading room with armchair and diagonal light cast from window.
 */
export function ArtworkSunlitCorner() {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stylized quiet reading room with armchair, book, and sunlight"
    >
      {/* Peach room wall */}
      <rect width="320" height="200" fill="#FAD7BE" />

      {/* Floor line & floor plane */}
      <polygon points="0,155 320,155 320,200 0,200" fill="#F4C7A8" />
      <line x1="0" y1="155" x2="320" y2="155" stroke="#1E1C1A" strokeWidth="1.5" />

      {/* Window on upper right wall */}
      <polygon points="245,35 285,45 285,135 245,125" fill="#FFFFFF" opacity="0.9" stroke="#1E1C1A" strokeWidth="1.5" />
      <line x1="265" y1="40" x2="265" y2="130" stroke="#1E1C1A" strokeWidth="1.2" />

      {/* Diagonal beam of warm sunlight spilling across wall and floor */}
      <polygon
        points="245,45 285,55 320,200 130,200 155,155"
        fill="#FFF3E8"
        opacity="0.8"
      />

      {/* Mid-century stylized armchair */}
      {/* Wooden backrest & frame in dark ink line with terracotta cushion */}
      <rect x="155" y="85" width="45" height="40" rx="4" fill="#C85735" stroke="#1E1C1A" strokeWidth="1.8" />
      {/* Chair seat cushion */}
      <rect x="148" y="118" width="60" height="16" rx="3" fill="#DFB79E" stroke="#1E1C1A" strokeWidth="1.8" />
      {/* Armrests */}
      <path d="M 148 118 L 148 100 L 155 100" stroke="#1E1C1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 208 118 L 208 100 L 201 100" stroke="#1E1C1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      
      {/* Small open book resting on the seat */}
      <polygon points="172,118 184,115 190,118 184,121" fill="#FFFFFF" stroke="#1E1C1A" strokeWidth="1.2" />

      {/* Chair legs reaching to the floor */}
      <line x1="154" y1="134" x2="148" y2="168" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="202" y1="134" x2="208" y2="168" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="162" y1="134" x2="159" y2="164" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="194" y1="134" x2="197" y2="164" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Small book resting on the floor beside the chair */}
      <rect x="120" y="160" width="22" height="7" rx="1" fill="#C85735" stroke="#1E1C1A" strokeWidth="1.2" />
      <line x1="120" y1="162" x2="142" y2="162" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
}
