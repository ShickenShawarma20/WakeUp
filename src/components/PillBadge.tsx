import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface PillBadgeProps {
  label: string;
  emoji?: string;
}

export const PillBadge: React.FC<PillBadgeProps> = ({ label, emoji }) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        background: 'rgba(224, 64, 251, 0.12)',
        border: '1px solid rgba(224, 64, 251, 0.2)',
        borderRadius: '12px',
        padding: '6px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        ...typography.labelText,
        color: colors.accentMagenta,
      }}
    >
      {emoji && <span>{emoji}</span>} {label}
    </div>
  );
};