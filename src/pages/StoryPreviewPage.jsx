import React from 'react';
import { useReader } from '../hooks/useReader';
import ArticleContentRenderer from '../components/editorial/ArticleContentRenderer';
import StoryArtworkRenderer from '../components/editorial/StoryArtworkRenderer';
import Avatar from '../components/ui/Avatar';
import { Toast, ToastContainer } from '../components/ui/Toast';

export default function StoryPreviewPage({ storyId, onNavigate }) {
  const {
    findStoryById,
    publishStory,
    toasts,
    dismissToast,
    showToast
  } = useReader();

  const story = findStoryById(storyId);

  if (!story) {
    return (
      <div
        className="quill-app-shell"
        style={{
          backgroundColor: 'var(--color-paper, #F8F5EE)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <header
          style={{
            padding: 'var(--space-4) var(--space-8)',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: '#FFFDFA'
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="brand-wordmark"
            style={{ fontSize: '1.75rem' }}
          >
            quill<span className="brand-dot">.</span>
          </a>
        </header>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-12) var(--space-4)',
            textAlign: 'center'
          }}
        >
          <h1
            className="font-serif text-h2"
            style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}
          >
            Story preview unavailable
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              maxWidth: '460px',
              marginBottom: 'var(--space-6)'
            }}
          >
            The requested story was not found in your local browser library.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/my-stories')}
            className="quill-btn quill-btn-primary"
          >
            Back to My Stories
          </button>
        </div>
      </div>
    );
  }

  const isDraft = story.status === 'draft';
  const isArchived = story.status === 'archived';

  const handlePublishFromPreview = () => {
    const result = publishStory(story.id);
    if (result.success) {
      onNavigate(`/story/${result.story.slug}`);
    } else {
      showToast('Cannot publish incomplete story. Returning to editor.', 'warning');
      onNavigate(`/write/${story.id}/edit`);
    }
  };

  return (
    <div
      className="quill-app-shell"
      style={{ backgroundColor: 'var(--color-paper, #F8F5EE)', minHeight: '100vh' }}
    >
      {/* 1. Preview Banner */}
      <div
        style={{
          backgroundColor: isDraft
            ? 'var(--color-warning-soft, #FFF8E6)'
            : 'var(--color-surface-secondary, #F0EBE2)',
          borderBottom: '1px solid var(--color-border, #DDD4C7)',
          padding: 'var(--space-2) var(--gutter-desktop, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: isDraft ? 'var(--color-warning)' : 'var(--color-accent)',
              color: '#FFFFFF'
            }}
          >
            {isDraft ? 'Draft Preview' : isArchived ? 'Archived Preview' : 'Story Preview'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            {isDraft
              ? 'This is a private preview of your draft. It is stored only in this browser.'
              : 'Viewing story formatting as readers see it.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => onNavigate(`/write/${story.id}/edit`)}
            className="quill-btn quill-btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', minHeight: '34px' }}
          >
            ← Back to editing
          </button>

          {isDraft && (
            <button
              type="button"
              onClick={handlePublishFromPreview}
              className="quill-btn quill-btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.35rem 1rem', minHeight: '34px' }}
            >
              Publish story
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('/my-stories')}
            className="quill-btn quill-btn-ghost"
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
          >
            My stories
          </button>
        </div>
      </div>

      {/* 2. Reader Article Masthead */}
      <div
        style={{
          maxWidth: '740px',
          margin: '0 auto',
          padding: 'var(--space-10) var(--space-4) var(--space-6) var(--space-4)'
        }}
      >
        {/* Topic Badge */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <span className="quill-chip quill-chip-compact selected">
            {story.topic || 'General'}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.85rem)',
            lineHeight: 1.2,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-4)'
          }}
        >
          {story.title || 'Untitled Story'}
        </h1>

        {/* Subtitle / Excerpt */}
        {(story.subtitle || story.excerpt) && (
          <p
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)'
            }}
          >
            {story.subtitle || story.excerpt}
          </p>
        )}

        {/* Author Byline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-subtle)',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: 'var(--space-4)',
            marginBottom: 'var(--space-8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={story.author?.name || 'Reader'} size="md" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                {story.author?.name || 'Reader'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {story.date} · {story.readTime || '1 min read'}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Artwork Banner */}
        <div
          style={{
            width: '100%',
            height: '320px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <StoryArtworkRenderer artworkId={story.artworkId || 'portal'} />
        </div>

        {/* Article Body */}
        <ArticleContentRenderer
          content={story.content || []}
          textSize="default"
          lineSpacing="standard"
        />

        {/* Bottom Actions */}
        <div
          style={{
            marginTop: 'var(--space-12)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate(`/write/${story.id}/edit`)}
            className="quill-btn quill-btn-secondary"
          >
            ← Return to Editor
          </button>

          {isDraft && (
            <button
              type="button"
              onClick={handlePublishFromPreview}
              className="quill-btn quill-btn-primary"
            >
              Publish this Story
            </button>
          )}
        </div>
      </div>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}
