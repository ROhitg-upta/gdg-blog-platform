import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { getStoryVersions, createStorySnapshot } from '../../utils/advancedStorage';

export default function VersionHistoryModal({
  isOpen,
  onClose,
  story,
  onRestoreVersion,
  showToast
}) {
  const [versions, setVersions] = useState([]);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [versionToRestore, setVersionToRestore] = useState(null);
  const [customNote, setCustomNote] = useState('');

  const loadVersions = () => {
    if (story && story.id) {
      setVersions(getStoryVersions(story.id));
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVersions();
      setPreviewVersion(null);
    }
  }, [isOpen, story]);

  const handleCreateManualSnapshot = (e) => {
    e.preventDefault();
    if (!story) return;
    const note = customNote.trim() || 'Manual revision snapshot';
    createStorySnapshot(story, note);
    setCustomNote('');
    loadVersions();
    showToast?.('Version snapshot created locally.', 'success');
  };

  const handleConfirmRestore = () => {
    if (versionToRestore && onRestoreVersion) {
      onRestoreVersion(versionToRestore);
      setVersionToRestore(null);
      onClose();
      showToast?.('Draft restored to selected snapshot.', 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Version Snapshots & History"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Create Snapshot Form */}
          <form
            onSubmit={handleCreateManualSnapshot}
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Snapshot label (e.g. Before refactoring conclusion)..."
              style={{
                flex: 1,
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                fontSize: '0.86rem'
              }}
            />
            <button
              type="submit"
              className="quill-btn quill-btn-secondary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', minHeight: '32px' }}
            >
              Take snapshot
            </button>
          </form>

          {/* Versions List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Saved Snapshots ({versions.length}/10)
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                Saved locally on this device
              </span>
            </div>

            {versions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', backgroundColor: 'var(--color-surface-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  No snapshots recorded yet. Create one above or snapshots will be taken automatically before publishing.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '320px', overflowY: 'auto' }}>
                {versions.map((v) => {
                  const dateStr = new Date(v.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={v.id}
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-3)'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {v.note || 'Snapshot'}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            · {dateStr}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          "{v.title || 'Untitled'}" · {v.wordCount} words · {v.status}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewVersion(v)}
                          className="quill-btn quill-btn-secondary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem', minHeight: '28px' }}
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setVersionToRestore(v)}
                          className="quill-btn quill-btn-primary"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.76rem', minHeight: '28px' }}
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preview Snapshot Drawer / Card */}
          {previewVersion && (
            <div
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                animation: 'fadeIn var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600 }}>
                  Previewing Snapshot: {previewVersion.note}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewVersion(null)}
                  className="quill-btn-text"
                  style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}
                >
                  Close preview
                </button>
              </div>

              <h4 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                {previewVersion.title}
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-3) 0' }}>
                {previewVersion.subtitle}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setVersionToRestore(previewVersion)}
                  className="quill-btn quill-btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                >
                  Restore this version
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Dialog before Restore */}
      <ConfirmDialog
        isOpen={Boolean(versionToRestore)}
        title="Restore snapshot version?"
        message={`Are you sure you want to restore the snapshot "${versionToRestore?.note || 'Untitled'}"? Any unsaved edits in your current studio session will be replaced.`}
        confirmLabel="Confirm Restore"
        cancelLabel="Keep Current Draft"
        isDestructive={false}
        onConfirm={handleConfirmRestore}
        onCancel={() => setVersionToRestore(null)}
      />
    </>
  );
}
