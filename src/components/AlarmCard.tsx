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
  const { colors } = useTheme();

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}.${m.toString().padStart(2, '0')}`;
  };

  const getDayLabel = (days: string[]) => {
    if (days.length === 0) return 'Once';
    if (days.length === 7) return 'Every day';
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const weekend = ['Sat', 'Sun'];
    if (weekdays.every(d => days.includes(d)) && days.length === 5) return 'Every weekdays';
    if (weekend.every(d => days.includes(d)) && days.length === 2) return 'Sat, Sun';
    return days.join(', ');
  };

  return (
    <motion.div
      onClick={() => onPress(id)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        background: colors.cardDark,
        border: `1px solid ${colors.cardDarkBorder}`,
        borderRadius: '20px',
        padding: '20px 24px',
        cursor: 'pointer',
        opacity: isEnabled ? 1 : 0.55,
        transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isEnabled ? '0 4px 24px rgba(224, 64, 251, 0.08)' : '0 2px 12px rgba(0,0,0,0.2)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Time & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{
            ...typography.alarmTimeSmall,
            color: colors.textPrimary,
            lineHeight: 1,
          }}>
            {formatTime(time.hours, time.minutes)}
          </span>
          <span style={{
            ...typography.labelText,
            color: isEnabled ? colors.accentMagenta : colors.textMuted,
            letterSpacing: '0.02em',
          }}>
            {label && `${label} • `}{getDayLabel(repeatDays)}
          </span>
        </div>

        {/* Right: Toggle + Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Toggle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
              }
              onToggle(id);
            }}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '14px',
              position: 'relative',
              cursor: 'pointer',
              background: isEnabled 
                ? 'linear-gradient(135deg, #B040E0, #E040FB)' 
                : colors.toggleInactive,
              boxShadow: isEnabled ? '0 0 16px rgba(224, 64, 251, 0.3)' : 'none',
              transition: 'all 0.3s ease',
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            />
          </div>

          {/* Three dot menu */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPress(id);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              padding: '4px',
              cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: colors.textMuted,
              }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};