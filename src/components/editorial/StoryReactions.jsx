import React from 'react';
import { useReader } from '../../hooks/useReader';

const REACTION_TYPES = [
  {
    id: 'applaud',
    label: 'Applaud',
    symbol: '👏',
    description: 'Resonated deeply with this craftsmanship'
  },
  {
    id: 'thoughtful',
    label: 'Thoughtful',
    symbol: '💡',
    description: 'Prompted quiet reflection and fresh perspective'
  },
  {
    id: 'inspiring',
    label: 'Inspiring',
    symbol: '✨',
    description: 'Brought creative momentum and new ideas'
  }
];

export default function StoryReactions({ storyId, showToast }) {
  const { getReaction, toggleReaction } = useReader();
  const currentReaction = getReaction ? getReaction(storyId) : null;

  const handleSelectReaction = (typeId) => {
    if (!toggleReaction) return;
    const next = toggleReaction(storyId, typeId);
    if (next) {
      const item = REACTION_TYPES.find((r) => r.id === typeId);
      showToast?.(`Marked as "${item?.label || typeId}" in this browser.`, 'info');
    } else {
      showToast?.('Reaction removed.', 'info');
    }
  };

  return (
    <div
      className="quill-reactions-bar quill-surface-card"
      style={{
        marginTop: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        padding: 'var(--space-5) var(--space-6)',
        backgroundColor: '#FFFDFA',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
            Reader Contemplation
          </span>
          <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
            How did this piece land with you?
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
            Your reaction is saved honestly in this browser for this reading desk.
          </p>
        </div>

        {/* Reaction Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {REACTION_TYPES.map((item) => {
            const isSelected = currentReaction === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectReaction(item.id)}
                className={`quill-btn quill-btn-secondary ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  minHeight: '36px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 600 : 400
                }}
                aria-pressed={isSelected}
                title={item.description}
              >
                <span aria-hidden="true" style={{ fontSize: '1rem' }}>{item.symbol}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
