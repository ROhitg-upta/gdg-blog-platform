import React from 'react';
import StoryCard from './StoryCard';
import { MOSAIC_STORIES } from '../data/editorialData';

export default function StoryMosaic({ onSelectStory }) {
  return (
    <section className="mosaic-wrapper" aria-label="Curated Editorial Stories">
      {/* Decorative SVG elements matching the reference image */}
      <div className="mosaic-decorations" aria-hidden="true">
        {/* 1. Curved Terracotta Arrow pointing down to Card 1 */}
        <svg
          className="decor-arrow"
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 85 8 C 50 4, 18 28, 14 62"
            stroke="#C85735"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 6 52 L 14 64 L 25 57"
            stroke="#C85735"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 2. Hand-drawn ink asterisk between Card 2 and Card 3 */}
        <svg
          className="decor-asterisk"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 16 3 L 16 29 M 3 16 L 29 16 M 7 7 L 25 25 M 7 25 L 25 7"
            stroke="#1E1C1A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>

        {/* 3. Delicate dotted arc over Card 3 */}
        <svg
          className="decor-dotted-arc"
          viewBox="0 0 110 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 70 A 55 55 0 0 1 100 60"
            stroke="#6D675F"
            strokeWidth="1.8"
            strokeDasharray="3 5"
            strokeLinecap="round"
          />
        </svg>

        {/* 4. Faint 4-point star watermark in the bottom-right corner */}
        <svg
          className="decor-watermark-star"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 0 C 50 35, 65 50, 100 50 C 65 50, 50 65, 50 100 C 50 65, 35 50, 0 50 C 35 50, 50 35, 50 0 Z"
            fill="#FFFFFF"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* Mosaic Grid of 3 Cards */}
      <div className="mosaic-grid">
        {MOSAIC_STORIES.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onSelectStory={onSelectStory}
          />
        ))}
      </div>
    </section>
  );
}
