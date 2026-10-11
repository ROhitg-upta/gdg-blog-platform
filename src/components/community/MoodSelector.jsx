import React from 'react';

export const MOODS = [
  { id: 'build', label: 'Build something', symbol: '🛠️', topic: 'Technology', desc: 'Systems and craft' },
  { id: 'think', label: 'Think deeply', symbol: '🌿', topic: 'AI', desc: 'Mind and machines' },
  { id: 'space', label: 'Make space', symbol: '☁️', topic: 'Culture', desc: 'Quietude and silence' },
  { id: 'learn', label: 'Learn slowly', symbol: '📖', topic: 'Design', desc: 'Typography and form' },
  { id: 'inspire', label: 'Feel inspired', symbol: '✨', topic: 'Personal Growth', desc: 'Perspective and focus' }
];

export default function MoodSelector({ selectedMood, onSelectMood }) {
  return (
    <div
      className="quill-surface-card"
      style={{
        padding: 'var(--space-5)',
        backgroundColor: '#FFFDFA',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-6)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
            Curated Moods
          </span>
          <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
            Read by mood
          </h3>
        </div>
        {selectedMood && (
          <button
            type="button"
            onClick={() => onSelectMood(null)}
            className="quill-btn-text"
            style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}
          >
            Clear mood
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--space-2)'
        }}
      >
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(isSelected ? null : mood.id)}
              className={`quill-btn quill-btn-secondary ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.45rem 0.6rem',
                minHeight: '44px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface-card)',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)',
                textAlign: 'left'
              }}
              aria-pressed={isSelected}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span aria-hidden="true">{mood.symbol}</span>
                <span>{mood.label}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {mood.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
