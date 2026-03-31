import React from 'react';
import { typography } from '../theme/typography';

interface TimeDisplayProps {
  hours: string | number;
  minutes: string | number;
  ampm: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ hours, minutes, ampm }) => {
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return (
    <div
      style={{
        ...typography.alarmTime,
        color: '#F0E6FF',
        textShadow: '0px 4px 20px rgba(224, 64, 251, 0.2)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '6px',
      }}
    >
      <span>
        {hours}:{formattedMinutes}
      </span>
      <span style={{
        fontSize: '0.35em',
        fontWeight: 500,
        color: 'rgba(240, 230, 255, 0.6)',
      }}>
        {ampm}
      </span>
    </div>
  );
};