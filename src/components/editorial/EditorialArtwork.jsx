import React from 'react';

/**
 * EditorialArtwork:
 * Lightweight, original local vector illustrations for story covers.
 * Uses the light editorial palette: lavender (#DDD5EA), peach (#F0D1BB), sage (#DCE3CC),
 * with deep ink outlines and terracotta orange accents. Zero external image dependencies.
 */

export function ArtworkGeometricManuscript({ className = '' }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} role="img" aria-label="Abstract open manuscript with geometric shapes">
      <rect width="320" height="200" fill="#DDD5EA" />
      <circle cx="100" cy="75" r="45" fill="#C5BBD6" />
      <circle cx="210" cy="85" r="24" fill="var(--color-accent, #D85A35)" opacity="0.85" />
      <path d="M 60 145 C 95 130, 140 142, 160 148 C 180 142, 225 130, 260 145 L 260 152 C 225 137, 180 149, 160 155 C 140 149, 95 137, 60 152 Z" fill="#FFFDFA" />
      <line x1="160" y1="115" x2="160" y2="155" stroke="var(--color-accent, #D85A35)" strokeWidth="2.5" />
      <path d="M 85 125 L 140 120" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 85 133 L 135 128" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 180 120 L 235 125" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 185 128 L 235 133" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArtworkArchitecturalPortal({ className = '' }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} role="img" aria-label="Abstract architectural arches and staircase">
      <rect width="320" height="200" fill="#F0D1BB" />
      <circle cx="160" cy="65" r="48" fill="#E2BD9E" />
      <path d="M 105 185 L 105 105 C 105 75 215 75 215 105 L 215 185 Z" fill="#C89F7D" />
      <path d="M 125 185 L 125 115 C 125 90 195 90 195 115 L 195 185 Z" fill="#FFFDFA" />
      <path d="M 142 185 L 142 125 C 142 105 178 105 178 125 L 178 185 Z" fill="#1E1C1A" />
      <rect x="70" y="95" width="22" height="90" fill="#C89F7D" />
      <polygon points="215,185 215,145 235,145 235,155 255,155 255,165 275,165 275,185" fill="var(--color-accent, #D85A35)" />
      <line x1="30" y1="185" x2="290" y2="185" stroke="#1E1C1A" strokeWidth="1.5" />
    </svg>
  );
}

export function ArtworkAlgorithmicParchment({ className = '' }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} role="img" aria-label="Algorithmic typography and clean geometry">
      <rect width="320" height="200" fill="#DCE3CC" />
      <rect x="40" y="30" width="240" height="140" rx="6" fill="#FFFDFA" stroke="#CBBEAE" strokeWidth="1.5" />
      <circle cx="70" cy="55" r="14" fill="#F8E4D9" />
      <circle cx="70" cy="55" r="4" fill="var(--color-accent, #D85A35)" />
      <line x1="100" y1="52" x2="220" y2="52" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="60" x2="170" y2="60" stroke="#696158" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="90" x2="250" y2="90" stroke="#DDD4C7" strokeWidth="1" />
      <line x1="60" y1="110" x2="210" y2="110" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="124" x2="230" y2="124" stroke="#696158" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="138" x2="160" y2="138" stroke="#82786B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="240" cy="138" r="12" fill="var(--color-accent, #D85A35)" opacity="0.9" />
    </svg>
  );
}
