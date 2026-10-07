import React from 'react';
import StoryArtworkRenderer from '../editorial/StoryArtworkRenderer';

export const COVER_ARTWORK_OPTIONS = [
  { id: 'portal', label: 'Architectural Portal', description: 'Monolithic arch framing warm dawn light' },
  { id: 'geometric', label: 'Geometric Manuscript', description: 'Interlocking geometric lines and ink boundaries' },
  { id: 'parchment', label: 'Algorithmic Parchment', description: 'Algorithmic flow lines over aged linen texture' },
  { id: 'book-lavender', label: 'Lavender Book', description: 'Gentle lavender volumes on quiet wood' },
  { id: 'architectural-peach', label: 'Architectural Peach', description: 'Warm terracotta colonnade and classical balance' },
  { id: 'sunlit-corner', label: 'Sunlit Corner', description: 'Sunbeams across quiet morning workspace' }
];

export default function CoverArtworkPicker({
  selectedArtworkId = 'portal',
  onSelectArtwork
}) {
  return (
    <div className="quill-cover-picker" role="radiogroup" aria-label="Choose story cover artwork">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 'var(--space-3)'
        }}
      >
        {COVER_ARTWORK_OPTIONS.map((option) => {
          const isSelected = selectedArtworkId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectArtwork(option.id)}
              className="quill-cover-option"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--color-surface-card, #FFFDFA)',
                borderRadius: 'var(--radius-md)',
                border: isSelected
                  ? '2px solid var(--color-accent, #D85A35)'
                  : '1px solid var(--color-border, #DDD4C7)',
                boxShadow: isSelected ? '0 2px 8px rgba(216, 90, 53, 0.18)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  width: '100%',
                  height: '76px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-paper, #F8F5EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-2)'
                }}
              >
                <div style={{ width: '100%', height: '100%', transform: 'scale(0.85)', transformOrigin: 'center' }}>
                  <StoryArtworkRenderer artworkId={option.id} />
                </div>
              </div>

              {/* Label & Active Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    lineHeight: 1.25
                  }}
                >
                  {option.label}
                </span>

                {isSelected && (
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      flexShrink: 0
                    }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
