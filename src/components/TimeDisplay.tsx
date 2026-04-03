import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface TimeDisplayProps {
  hours: string | number;
  minutes: string | number;
  ampm: string;
}

/**
 * Hero clock display using displayLg (Space Grotesk 3.5rem).
 * AM/PM in labelMd — ALL-CAPS, 5% tracking.
 * High-contrast white with circadian-tinted text shadow.
 */
export const TimeDisplay: React.FC<TimeDisplayProps> = ({ hours, minutes, ampm }) => {
  const { colors } = useTheme();
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
    }}>
      <span style={{
        ...typography.displayLg,
        color: colors.textPrimary,
        textShadow: `0 4px 32px ${colors.ambientGlow}`,
      }}>
        {hours}:{formattedMinutes}
      </span>
      <span style={{
        ...typography.labelMd,
        color: colors.textSecondary,
        lineHeight: 1,
        alignSelf: 'flex-end',
        marginBottom: '0.4rem',
      }}>
        {ampm}
      </span>
    </div>
  );
};