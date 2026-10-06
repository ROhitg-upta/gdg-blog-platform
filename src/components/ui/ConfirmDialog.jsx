import React from 'react';
import Modal from './Modal';
import { PrimaryButton, SecondaryButton } from './Button';

/**
 * ConfirmDialog:
 * Specialized confirmation dialog for destructive or irreversible actions.
 */
export default function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="460px"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-6)'
        }}
      >
        <SecondaryButton onClick={onClose} disabled={loading}>
          {cancelLabel}
        </SecondaryButton>

        <PrimaryButton
          onClick={onConfirm}
          loading={loading}
          style={{
            backgroundColor: destructive ? 'var(--color-error)' : 'var(--color-accent)',
            borderColor: destructive ? 'var(--color-error)' : 'var(--color-accent)',
            color: '#FFFFFF'
          }}
        >
          {confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
