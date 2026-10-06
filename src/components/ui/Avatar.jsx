import React, { useState } from 'react';

/**
 * Avatar:
 * User profile avatar with graceful initials fallback and broken image safety.
 */
export default function Avatar({
  src = '',
  name = 'User',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  className = '',
  ...props
}) {
  const [imageFailed, setImageFailed] = useState(!src);

  // Derive initials from name (e.g. "Alex Vance" -> "AV")
  const getInitials = (n) => {
    if (!n) return 'Q';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`quill-avatar quill-avatar-${size} ${className}`}
      title={name}
      aria-label={name}
      {...props}
    >
      {!imageFailed && src ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}
