import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { spacing } from '../theme/spacing';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, style }) => {
  const { glassStyles } = useTheme();

  return (
    <div
      style={{
        ...glassStyles.standard,
        padding: spacing.cardPadding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};