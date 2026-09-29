import React from 'react';
import type { AllowedSectionItem } from './visualBuilderConstraintUtils';

export type VisualBuilderConstraintAlertProps = {
  componentType: string;
  componentDisplayName?: string;
  pageDisplayName: string;
  allowedTypes: readonly AllowedSectionItem[];
};

export function VisualBuilderConstraintAlert({
  componentType,
  componentDisplayName,
  pageDisplayName,
  allowedTypes,
}: VisualBuilderConstraintAlertProps) {
  const displayTitle = componentDisplayName || componentType;

  return (
    <div
      role="alert"
      data-testid="visual-builder-constraint-alert"
      style={{
        margin: '24px auto',
        maxWidth: '1200px',
        padding: '20px 24px',
        borderRadius: '8px',
        backgroundColor: '#fffbeb',
        border: '2px dashed #f59e0b',
        color: '#78350f',
        fontFamily: 'var(--font-family-sans, system-ui, -apple-system, sans-serif)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }} aria-hidden="true">
          ⚠️
        </span>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
          Visual Builder Constraint: Unallowed Section
        </h4>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5, color: '#92400e' }}>
        The section <strong>&ldquo;{displayTitle}&rdquo;</strong> is not permitted on{' '}
        <strong>{pageDisplayName}</strong>.
      </p>
      <div style={{ fontSize: '13px', lineHeight: 1.4, color: '#78350f' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Allowed sections for this page:</p>
        <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
          {allowedTypes.map((item) => (
            <li key={item.key}>{item.displayName}</li>
          ))}
        </ul>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#b45309' }}>
          To resolve this warning, please delete this section from the Visual Builder outline. This
          unallowed section will not be displayed on the live public website.
        </p>
      </div>
    </div>
  );
}
