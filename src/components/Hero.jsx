import React from 'react';

export default function Hero({ onExploreClick, onShareStoryClick }) {
  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="hero-inner">
        {/* Eyebrow: Star on the RIGHT */}
        <div className="hero-eyebrow-container">
          <span className="hero-eyebrow">A HOME FOR CURIOUS MINDS</span>
          <svg
            className="hero-star-icon"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z" />
          </svg>
        </div>

        {/* Semantic h1 */}
        <h1 className="hero-title">
          <span className="hero-title-line1">Good stories.</span>
          <span className="hero-title-line2">
            Unexpected{" "}
            <span className="hero-title-underlined-word">
              perspectives.
              {/* Refined hand-drawn organic terracotta underline matching reference image */}
              <svg
                className="hand-drawn-underline"
                viewBox="0 0 280 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M 3 10 C 65 3, 160 14, 275 8"
                  stroke="#C85735"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        </h1>

        {/* Supporting description with exact double quotes */}
        <p className="hero-subtitle">
          “Discover thoughtful reads, share what you know,<br className="hero-sub-break" />
          and find voices that stay with you.”
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={onExploreClick}
          >
            <span>Find your next read</span>
            <span className="btn-arrow-icon" aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            className="btn-secondary-action"
            onClick={onShareStoryClick}
          >
            <span>Share your story</span>
            <span className="btn-arrow-diagonal" aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
