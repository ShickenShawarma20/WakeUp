import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface PillBadgeProps {
  label: string;
  emoji?: string;
}

/**
 * Glass secondary button style per Ethereal Horizon spec:
 * - Background: onSurface at 10% opacity + backdrop blur
 * - Inner 1px glass border (inset box-shadow)
 * - Label in labelMd (ALL-CAPS, 5% tracking)
 */
export const PillBadge: React.FC<PillBadgeProps> = ({ label, emoji }) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        background: `${colors.onSurface}1a`,   // 10% opacity
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '999px',
        padding: '6px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,  // inner border
        ...typography.labelMd,
        color: colors.textSecondary,
      }}
    >
      {emoji && <span>{emoji}</span>} {label}
    </div>
  );
};