import React from 'react';
import { motion } from 'framer-motion';
import { AlarmCard } from '../components/AlarmCard';
import { GlassNavBar, type TabType } from '../components/GlassNavBar';
import { MoonIllustration } from '../components/MoonIllustration';
import { PillBadge } from '../components/PillBadge';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface Alarm {
  id: string;
  time: {
    hours: number;
    minutes: number;
    ampm: string;
  };
  label: string;
  isEnabled: boolean;
  repeatDays: string[];
  soundName?: string;
}

interface AlarmListScreenProps {
  alarms: Alarm[];
  nextAlarmText?: string;
  onToggleAlarm: (id: string) => void;
  onPressAlarm: (id: string) => void;
  onTabPress: (tab: TabType) => void;
}

export const AlarmListScreen: React.FC<AlarmListScreenProps> = ({
  alarms, nextAlarmText, onToggleAlarm, onPressAlarm, onTabPress,
}) => {
  const { colors } = useTheme();

  return (
    <div style={{
      background: `linear-gradient(180deg, ${colors.backgroundDeep} 0%, ${colors.backgroundCard} 40%, ${colors.backgroundDeep} 100%)`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Purple gradient glow at top */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(176, 64, 224, 0.2) 0%, rgba(224, 64, 251, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        padding: `calc(env(safe-area-inset-top) + 20px) ${spacing.screenPadding}px 0`,
        textAlign: 'center',
        zIndex: 10,
      }}>
        <h1 style={{
          ...typography.heroTitle,
          color: colors.textPrimary,
          margin: '0 0 8px',
        }}>
          Alarm
        </h1>
      </header>

      {/* Moon Illustration */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ zIndex: 5, marginBottom: '8px' }}
      >
        <MoonIllustration />
      </motion.div>

      {/* Sleep Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          textAlign: 'center',
          padding: `0 ${spacing.screenPadding}px`,
          marginBottom: '24px',
          zIndex: 10,
        }}
      >
        <p style={{ ...typography.labelText, color: colors.textSecondary, margin: '0 0 8px' }}>
          Sleep time
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ ...typography.alarmTime, color: colors.textPrimary, fontSize: '56px' }}>
            {new Date().getHours() > 12 ? 
              String(24 - new Date().getHours() + 6).padStart(2, '0') : 
              String(6 - new Date().getHours()).padStart(2, '0')
            }
          </span>
          <span style={{ ...typography.unitText, color: colors.textSecondary }}>hr</span>
          <span style={{ ...typography.alarmTime, color: colors.textPrimary, fontSize: '56px', marginLeft: '8px' }}>
            {String(60 - new Date().getMinutes()).padStart(2, '0')}
          </span>
          <span style={{ ...typography.unitText, color: colors.textSecondary }}>min</span>
        </div>

        {/* Sleep goal badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '16px',
        }}>
          <PillBadge emoji="⭐" label="62% of your goal" />
        </div>
      </motion.div>

      {/* Alarm Section Header */}
      <div style={{
        padding: `0 ${spacing.screenPadding}px`,
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <h2 style={{ ...typography.cardTitle, color: colors.textPrimary, margin: 0 }}>
          Alarm
        </h2>
        {nextAlarmText && alarms.some(a => a.isEnabled) && (
          <PillBadge label={nextAlarmText} />
        )}
      </div>

      {/* Alarm List */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        padding: `0 ${spacing.screenPadding}px`,
        paddingBottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        WebkitOverflowScrolling: 'touch',
        zIndex: 10,
      }}>
        {alarms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '150px',
              background: colors.cardDark,
              borderRadius: '20px',
              border: `1px solid ${colors.cardDarkBorder}`,
              padding: '32px',
            }}
          >
            <p style={{ ...typography.bodyText, color: colors.textSecondary, margin: '0 0 4px' }}>
              No alarms yet
            </p>
            <p style={{ ...typography.labelText, color: colors.textMuted, margin: 0 }}>
              Tap + to create your first alarm
            </p>
          </motion.div>
        ) : (
          alarms.map((alarm, index) => (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <AlarmCard
                id={alarm.id}
                time={alarm.time}
                label={alarm.label}
                isEnabled={alarm.isEnabled}
                repeatDays={alarm.repeatDays}
                soundName={alarm.soundName}
                onToggle={onToggleAlarm}
                onPress={onPressAlarm}
              />
            </motion.div>
          ))
        )}
      </main>

      <GlassNavBar activeTab="alarms" onTabPress={onTabPress} />
    </div>
  );
};