import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Home, 
  title = 'No items found', 
  description = 'Try adjusting your filters or search criteria.',
  actionText,
  actionLink,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} strokeWidth={1.75} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-cta-teal">
          {actionText}
        </Link>
      )}
      {actionText && !actionLink && onAction && (
        <button onClick={onAction} className="btn btn-cta-teal">
          {actionText}
        </button>
      )}
    </div>
  );
}
