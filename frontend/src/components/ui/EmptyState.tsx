import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionPath,
  onAction,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-strong)',
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--color-pale-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--color-primary-green)',
        }}
      >
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-ink)', marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: actionText ? 20 : 0 }}>
        {description}
      </p>

      {actionText && actionPath && (
        <Link to={actionPath} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionPath && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
