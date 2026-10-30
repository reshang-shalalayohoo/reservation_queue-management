/**
 * Viking Grill — Reusable Empty State Component
 *
 * Props:
 *   title        – Main empty-state message (string, required)
 *   description  – Short supporting explanation (string, optional)
 *   illustration – Illustration key or custom React element (string|element, optional)
 *   actionLabel  – Optional action button text (string, optional)
 *   onAction     – Optional action button click handler (function, optional)
 *   variant      – Layout variant: 'default' | 'compact' | 'inline' | 'card' (string, optional)
 *   className    – Optional custom CSS class (string, optional)
 */

import '../../styles/emptyState.css';
import illustrations from './EmptyStateIllustrations';

export default function EmptyState({
  title,
  description,
  illustration,
  actionLabel,
  onAction,
  variant = 'default',
  className = '',
}) {
  // Resolve illustration: can be a string key or a React element
  const renderIllustration = () => {
    if (!illustration) return null;

    // If it's a React element, render directly
    if (typeof illustration !== 'string') {
      return <div className="empty-state-illustration">{illustration}</div>;
    }

    // Look up by key in the illustrations map
    const IllustrationComponent = illustrations[illustration];
    if (IllustrationComponent) {
      return (
        <div className="empty-state-illustration">
          <IllustrationComponent />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`empty-state-container variant-${variant} ${className}`}>
      {renderIllustration()}

      {title && <h3 className="empty-state-title">{title}</h3>}

      {description && (
        <p className="empty-state-description">{description}</p>
      )}

      {actionLabel && onAction && (
        <div className="empty-state-action">
          <button className="btn btn-primary" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

