import React from 'react';

/**
 * ArticleContentRenderer:
 * Safe semantic renderer for structured editorial essays.
 * Employs zero dangerouslySetInnerHTML injection and strict semantic tags.
 */
export default function ArticleContentRenderer({
  content = [],
  textSize = 'default',
  lineSpacing = 'standard'
}) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
        No article content recorded for this entry.
      </p>
    );
  }

  // Derive typography styles based on user preferences
  const getFontSize = () => {
    switch (textSize) {
      case 'small':
        return '1rem';
      case 'large':
        return '1.22rem';
      default:
        return '1.12rem';
    }
  };

  const getLineHeight = () => {
    switch (lineSpacing) {
      case 'relaxed':
        return '1.92';
      default:
        return '1.74';
    }
  };

  const baseTextStyle = {
    fontSize: getFontSize(),
    lineHeight: getLineHeight(),
    color: 'var(--color-text-primary)',
    transition: 'font-size var(--transition-fast), line-height var(--transition-fast)'
  };

  return (
    <div className="quill-article-body" style={baseTextStyle}>
      {content.map((block, index) => {
        // Fallback for simple string paragraphs
        if (typeof block === 'string') {
          return (
            <p
              key={index}
              style={{
                marginBottom: 'var(--space-6)',
                color: 'var(--color-text-primary)'
              }}
            >
              {block}
            </p>
          );
        }

        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="font-serif quill-article-heading"
                style={{
                  fontSize: textSize === 'large' ? '1.85rem' : textSize === 'small' ? '1.45rem' : '1.65rem',
                  lineHeight: 'var(--leading-snug)',
                  color: 'var(--color-text-primary)',
                  marginTop: 'var(--space-10)',
                  marginBottom: 'var(--space-4)',
                  fontWeight: 600
                }}
              >
                {block.text}
              </h2>
            );

          case 'quote':
            return (
              <blockquote
                key={index}
                className="quill-article-quote"
                style={{
                  borderLeft: '3px solid var(--color-accent)',
                  padding: 'var(--space-5) var(--space-6)',
                  margin: 'var(--space-8) 0',
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0'
                }}
              >
                <p
                  className="font-serif"
                  style={{
                    fontSize: textSize === 'large' ? '1.35rem' : textSize === 'small' ? '1.1rem' : '1.22rem',
                    fontStyle: 'italic',
                    lineHeight: '1.5',
                    color: 'var(--color-text-primary)',
                    marginBottom: block.attribution ? 'var(--space-3)' : 0
                  }}
                >
                  “{block.text}”
                </p>
                {block.attribution && (
                  <cite
                    style={{
                      fontSize: '0.85rem',
                      fontStyle: 'normal',
                      color: 'var(--color-text-secondary)',
                      display: 'block',
                      fontWeight: 500
                    }}
                  >
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case 'list':
            return (
              <ul
                key={index}
                className="quill-article-list"
                style={{
                  margin: 'var(--space-5) 0 var(--space-8) 0',
                  paddingLeft: 'var(--space-6)',
                  listStyleType: 'disc'
                }}
              >
                {Array.isArray(block.items) &&
                  block.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      style={{
                        marginBottom: 'var(--space-2)',
                        paddingLeft: 'var(--space-1)',
                        lineHeight: getLineHeight()
                      }}
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            );

          case 'paragraph':
          default:
            return (
              <p
                key={index}
                style={{
                  marginBottom: 'var(--space-6)',
                  color: 'var(--color-text-primary)'
                }}
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
