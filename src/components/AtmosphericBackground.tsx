import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface AtmosphericBackgroundProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Full-screen circadian gradient backdrop.
 * Uses position:absolute (NOT fixed) to avoid z-index stacking
 * context issues in Android WebView / Capacitor.
 */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ children, style }) => {
  const { colors, gradientCSS } = useTheme();

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      // Apply the gradient directly — no fixed positioning, no z-index tricks
      background: gradientCSS,
      ...style,
    }}>
      {/* Primary ambient orb — top */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accentPrimary}20 0%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Secondary accent orb — lower left */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '-40px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accentSecondary}15 0%, transparent 70%)`,
        filter: 'blur(36px)',
        pointerEvents: 'none',
      }} />

      {/* Tertiary orb — upper right */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-20px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.tertiary}12 0%, transparent 70%)`,
        filter: 'blur(28px)',
        pointerEvents: 'none',
      }} />

      {/* Content — renders above the orbs naturally (no z-index needed) */}
      {children}
    </div>
  );
};
