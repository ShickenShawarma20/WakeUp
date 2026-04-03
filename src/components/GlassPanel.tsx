import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

type GlassLevel = 'section' | 'standard' | 'elevated' | 'ghost' | 'recessed';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  level?: GlassLevel;
}

/**
 * Refractive glass panel — depth through surface tiers, not borders.
 * level 'section'  → Level 1: sections inside the backdrop
 * level 'standard' → Level 2: cards and interactives (default)
 * level 'elevated' → Level 2+: modals, sheets
 * level 'ghost'    → Ghost border (accessibility fallback)
 * level 'recessed' → Inner element (toggle bg, input bg)
 */
export const GlassPanel: React.FC<GlassPanelProps> = ({ children, style, level = 'standard' }) => {
  const { glassStyles } = useTheme();
  const selectedStyle = glassStyles[level] ?? glassStyles.standard;

  return (
    <div
      style={{
        ...selectedStyle,
        padding: spacing.cardPadding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};