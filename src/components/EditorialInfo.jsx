import React from 'react';

export default function EditorialInfo({ onStartWritingClick, onExploreClick }) {
  return (
    <section className="editorial-info-section" aria-label="About Quill">
      <div className="editorial-columns">
        {/* Our Story */}
        <article id="our-story" className="editorial-col">
          <span className="editorial-col-eyebrow">Our Story</span>
          <h2 className="editorial-col-heading">
            An open space for ideas worth sharing.
          </h2>
          <p className="editorial-col-body">
            We started quill. with a quiet premise: that the internet does not need more hurried noise, but deeper attention. Here, independent writers, essayists, and curious observers publish thoughtful reflections on craft, culture, philosophy, and human life. No algorithms shouting for outrage—only stories worth your time.
          </p>
          <button
            type="button"
            className="editorial-inline-action"
            onClick={onExploreClick}
          >
            Explore our curated archive →
          </button>
        </article>

        {/* For Writers */}
        <article id="for-writers" className="editorial-col">
          <span className="editorial-col-eyebrow">For Writers</span>
          <h2 className="editorial-col-heading">
            Your perspective belongs here.
          </h2>
          <p className="editorial-col-body">
            Whether you are capturing an intimate personal essay, dissecting an intricate architectural idea, or tracing the quiet evolution of a craft—quill. provides a typography-first canvas that respects the dignity of your prose and the focus of your readers.
          </p>
          <button
            type="button"
            className="editorial-inline-action"
            onClick={onStartWritingClick}
          >
            Submit an essay or draft ↗
          </button>
        </article>
      </div>
    </section>
  );
}
