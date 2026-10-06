import React from 'react';

/**
 * LoadingSkeleton:
 * Accessible placeholder shimmers for loading states.
 */
export function SkeletonText({ lines = 1, width = '100%', height = '14px', className = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`quill-skeleton ${className}`}
          style={{
            height,
            width: i === lines - 1 && lines > 1 ? '75%' : '100%'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = '36px', className = '' }) {
  return (
    <div
      className={`quill-skeleton ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonStoryCard() {
  return (
    <div
      className="quill-surface-card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        padding: 'var(--space-6)'
      }}
      aria-hidden="true"
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <SkeletonAvatar size="24px" />
          <SkeletonText lines={1} width="120px" height="12px" />
        </div>
        <SkeletonText lines={1} width="85%" height="22px" />
        <SkeletonText lines={2} width="100%" height="14px" />
        <SkeletonText lines={1} width="160px" height="12px" />
      </div>

      <div
        className="quill-skeleton"
        style={{
          width: '140px',
          height: '94px',
          borderRadius: 'var(--radius-md)',
          flexShrink: 0
        }}
      />
    </div>
  );
}
