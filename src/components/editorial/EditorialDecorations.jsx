import React from 'react';

/**
 * EditorialDecorations:
 * Restrained vector marks for subtle typographic and visual embellishment.
 * Strictly non-interactive and hidden from assistive technology.
 */

export function EditorialAsterisk({ size = 20, color = 'currentColor', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ pointerEvents: 'none', display: 'inline-block' }}
      className={className}
    >
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
    </svg>
  );
}

export function HandDrawnUnderline({ color = 'var(--color-accent)', className = '' }) {
  return (
    <svg
      viewBox="0 0 280 16"
      fill="none"
      aria-hidden="true"
      style={{ pointerEvents: 'none', width: '100%', height: 'auto', display: 'block' }}
      className={className}
    >
      <path
        d="M 3 10 C 65 3, 160 14, 275 8"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DottedArc({ size = 80, color = 'var(--color-border-strong)', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
      className={className}
    >
      <path
        d="M 10 70 A 55 55 0 0 1 70 10"
        stroke={color}
        strokeWidth="1.8"
        strokeDasharray="3 5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SmallArrow({ color = 'var(--color-accent)', className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ pointerEvents: 'none', display: 'inline-block' }}
      className={className}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
