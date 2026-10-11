import React, { useState, useEffect } from 'react';
import { getWritingGoal, saveWritingGoal } from '../../utils/advancedStorage';

export default function WritingGoalWidget({ currentWordCount = 0 }) {
  const [goal, setGoal] = useState(() => getWritingGoal());
  const [editing, setEditing] = useState(false);
  const [targetInput, setTargetInput] = useState(goal.targetWords || 500);

  useEffect(() => {
    setGoal(getWritingGoal());
  }, []);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const target = Math.max(50, parseInt(targetInput, 10) || 500);
    const updated = { ...goal, targetWords: target };
    saveWritingGoal(updated);
    setGoal(updated);
    setEditing(false);
  };

  const percentage = Math.min(100, Math.round((currentWordCount / (goal.targetWords || 500)) * 100));

  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        backgroundColor: 'var(--color-surface-secondary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
          Writing Intention
        </span>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="quill-btn-text"
          style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}
        >
          {editing ? 'Cancel' : 'Edit goal'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSaveGoal} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          <input
            type="number"
            min="50"
            max="10000"
            step="50"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            style={{
              width: '90px',
              padding: '0.2rem 0.4rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--color-border)'
            }}
          />
          <button
            type="submit"
            className="quill-btn quill-btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.76rem', minHeight: '26px' }}
          >
            Save
          </button>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              {currentWordCount} / {goal.targetWords} words
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.76rem' }}>
              {percentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-border-subtle)',
              overflow: 'hidden'
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: 'var(--color-accent)',
                transition: 'width 200ms ease'
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
