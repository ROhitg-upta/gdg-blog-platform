import React, { useState } from 'react';
import { EXPLORE_TOPICS } from '../data/editorialData';

export default function ExploreTopics({ onSelectStory, onNavigateTopic }) {
  const [selectedTopicId, setSelectedTopicId] = useState(EXPLORE_TOPICS[0].id);

  const currentTopic = EXPLORE_TOPICS.find((t) => t.id === selectedTopicId) || EXPLORE_TOPICS[0];

  const handleTopicClick = (topic) => {
    setSelectedTopicId(topic.id);
    if (onNavigateTopic) {
      onNavigateTopic(topic.name);
    }
  };

  return (
    <section id="explore" className="explore-section" aria-label="Explore Topics">
      <div className="explore-header-row">
        <h2 className="explore-title">Follow your curiosity.</h2>

        {/* Functional Topic Chips matching reference image */}
        <div className="explore-chips-container" role="tablist" aria-label="Explore topics">
          {EXPLORE_TOPICS.map((topic) => {
            const isActive = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                role="tab"
                id={`tab-${topic.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${topic.id}`}
                className={`topic-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Curated Topic Preview Drawer */}
      <div
        id={`panel-${currentTopic.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentTopic.id}`}
        className="topic-preview-container"
      >
        <div className="topic-preview-header">
          <span className="topic-preview-tagline">{currentTopic.tagline}</span>
          {onNavigateTopic && (
            <button
              type="button"
              className="editorial-inline-action"
              style={{ fontSize: '0.85rem' }}
              onClick={() => onNavigateTopic(currentTopic.name)}
            >
              Browse all {currentTopic.name} in Community →
            </button>
          )}
        </div>

        <div className="topic-articles-grid">
          {currentTopic.stories.map((story) => (
            <div
              key={story.id}
              className="preview-article-card"
              onClick={() =>
                onSelectStory({
                  id: story.id,
                  topic: currentTopic.name,
                  title: story.title,
                  author: { name: story.author },
                  readingTime: story.readTime,
                  previewContent: story.content
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStory({
                    id: story.id,
                    topic: currentTopic.name,
                    title: story.title,
                    author: { name: story.author },
                    readingTime: story.readTime,
                    previewContent: story.content
                  });
                }
              }}
              aria-label={`Read story: ${story.title} by ${story.author}`}
            >
              <div>
                <h3 className="preview-article-title">{story.title}</h3>
                <p className="preview-article-excerpt">{story.excerpt}</p>
              </div>

              <div className="preview-article-footer">
                <span className="preview-article-author">{story.author}</span>
                <span className="preview-article-action">Read preview →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
