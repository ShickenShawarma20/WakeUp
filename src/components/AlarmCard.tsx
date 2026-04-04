import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface AlarmTime {
  hours: number;
  minutes: number;
  ampm: string;
}

interface AlarmCardProps {
  id: string;
  time: AlarmTime;
  label: string;
  isEnabled: boolean;
  repeatDays: string[];
  soundName?: string;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  id, time, label, isEnabled, repeatDays, onToggle, onPress,
}) => {
  const { colors, glassStyles } = useTheme();

  const getDayLabel = (days: string[]) => {
    if (days.length === 0) return 'ONCE';
    if (days.length === 7) return 'EVERY DAY';
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const weekend = ['Sat', 'Sun'];
    if (weekdays.every(d => days.includes(d)) && days.length === 5) return 'WEEKDAYS';
    if (weekend.every(d => days.includes(d)) && days.length === 2) return 'WEEKENDS';
    return days.join(' · ');
  };

  return (
    <motion.div
      onClick={() => onPress(id)}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        // Level 2 Glass Card — No outer border, inner glow only
        ...glassStyles.standard,
        padding: '16px 20px',
        cursor: 'pointer',
        opacity: isEnabled ? 1 : 0.45,
        // Ambient glow when active — tinted, never pure black
        boxShadow: isEnabled
          ? `inset 0 1px 0 ${colors.glassHighlight}, 0 0 2rem ${colors.ambientGlow}`
          : `inset 0 1px 0 ${colors.glassHighlight}`,
        transition: 'opacity 0.3s ease, box-shadow 0.4s ease',
        position: 'relative',
      }}
    >
      {/* Enabled indicator — subtle accent top-left line */}
      {isEnabled && (
        <div style={{
          position: 'absolute',
          top: 0, left: 24, right: 24, height: '2px',
          borderRadius: '0 0 2px 2px',
          background: `linear-gradient(90deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`,
          opacity: 0.8,
        }} />
      )}

      {/* Asymmetric layout: Time left-dominant, details to the right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>

        {/* Left: Oversized time + technical label */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          {/* Time in headlineSm with ampm in labelMd */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: colors.textPrimary,
            }}>
              {time.hours}:{time.minutes.toString().padStart(2, '0')}
            </span>
            <span style={{
              ...typography.labelMd,
              color: isEnabled ? colors.accentPrimary : colors.textMuted,
              lineHeight: 1,
            }}>
              {time.ampm}
            </span>
          </div>

          {/* Label + Repeat — Technical label style */}
          <span style={{
            ...typography.labelMd,
            color: isEnabled ? colors.textSecondary : colors.textMuted,
            letterSpacing: '0.06em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {label ? `${label.toUpperCase()} · ` : ''}{getDayLabel(repeatDays)}
          </span>
        </div>

        {/* Right: Toggle + menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* Toggle — recessed container */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
              onToggle(id);
            }}
            style={{
              // Recessed look for inner element
              width: '52px',
              height: '28px',
              borderRadius: '999px',
              position: 'relative',
              cursor: 'pointer',
              background: isEnabled
                ? `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`
                : 'rgba(0,0,0,0.25)',
              boxShadow: isEnabled
                ? `0 0 20px ${colors.ambientGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`
                : 'inset 0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.35s ease',
            }}
          >
            <motion.div
              animate={{ left: isEnabled ? '26px' : '3px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute',
                top: '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#FFF',
                boxShadow: '0 1px 6px rgba(0,0,0,0.25)',
              }}
            />
          </div>

          {/* Three-dot menu — using dots, no border */}
          <div
            onClick={(e) => { e.stopPropagation(); onPress(id); }}
            style={{
              display: 'flex', flexDirection: 'column', gap: '3.5px',
              padding: '6px 4px', cursor: 'pointer', opacity: 0.5,
            }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '3.5px', height: '3.5px', borderRadius: '50%',
                backgroundColor: colors.textSecondary,
              }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};