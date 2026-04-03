import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlarmCard } from '../components/AlarmCard';
import { GlassNavBar, type TabType } from '../components/GlassNavBar';
import { MoonIllustration } from '../components/MoonIllustration';
import { PillBadge } from '../components/PillBadge';
import { AtmosphericBackground } from '../components/AtmosphericBackground';
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
  const { colors, atmosphericState } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format current time for asymmetric hero display
  const dispHours = currentTime.getHours() % 12 || 12;
  const dispMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const dispAmPm = currentTime.getHours() >= 12 ? 'PM' : 'AM';

  // Greeting based on atmospheric state
  const greetingMap: Record<string, string> = {
    day: 'Good Morning',
    noon: 'Good Afternoon',
    evening: 'Good Evening',
    night: 'Good Night',
  };
  const greeting = greetingMap[atmosphericState] ?? 'Hello';

  return (
    <AtmosphericBackground style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* ── Header + Hero ──────────────────────────────── */}
        <header style={{
          padding: `calc(env(safe-area-inset-top) + 24px) ${spacing.screenPadding}px 0`,
          zIndex: 10,
        }}>
          {/* Asymmetric hero: clock left / illustration right */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '8px',
            }}
          >
            {/* Left: Hero clock + greeting */}
            <div style={{ flex: 1 }}>
              <p style={{
                ...typography.labelMd,
                color: colors.textSecondary,
                margin: '0 0 4px',
              }}>
                {greeting}
              </p>
              {/* Display-lg clock — left-aligned per asymmetric spec */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h1 style={{
                  ...typography.displayLg,
                  color: colors.textPrimary,
                  margin: 0,
                  textShadow: `0 4px 32px ${colors.ambientGlow}`,
                }}>
                  {dispHours}:{dispMinutes}
                </h1>
                <span style={{
                  ...typography.labelMd,
                  color: colors.accentPrimary,
                  marginBottom: '0.4rem',
                }}>
                  {dispAmPm}
                </span>
              </div>
            </div>

            {/* Right: Atmospheric illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
              style={{ flexShrink: 0 }}
            >
              <MoonIllustration />
            </motion.div>
          </motion.div>

          {/* Sleep stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px',
            }}
          >
            <PillBadge emoji="⭐" label="62% of sleep goal" />
            {nextAlarmText && alarms.some(a => a.isEnabled) && (
              <PillBadge label={nextAlarmText} />
            )}
          </motion.div>
        </header>

        {/* ── Spacing 16 (5.5rem) between hero and alarm list ── */}
        <div style={{ height: `${spacing.sectionGap}px` }} />

        {/* ── Alarm Section ──────────────────────────────── */}
        <div style={{
          padding: `0 ${spacing.screenPadding}px`,
          marginBottom: `${spacing.sp3}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          zIndex: 10,
        }}>
          <h2 style={{
            ...typography.headlineSm,
            color: colors.textPrimary,
            margin: 0,
          }}>
            Alarms
          </h2>
          <span style={{
            ...typography.labelMd,
            color: colors.textMuted,
          }}>
            {alarms.filter(a => a.isEnabled).length} active
          </span>
        </div>

        {/* ── Alarm List ─────────────────────────────────── */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          padding: `0 ${spacing.screenPadding}px`,
          paddingBottom: '120px',
          display: 'flex',
          flexDirection: 'column',
          gap: `${spacing.sp3}px`,   // 12px between cards
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
                // Level 1 glass — section
                background: colors.surfaceContainerLow,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <p style={{ ...typography.bodyLg, color: colors.textSecondary, margin: '0 0 4px' }}>
                No alarms yet
              </p>
              <p style={{ ...typography.labelMd, color: colors.textMuted, margin: 0 }}>
                TAP + TO CREATE YOUR FIRST ALARM
              </p>
            </motion.div>
          ) : (
            alarms.map((alarm, index) => (
              <motion.div
                key={alarm.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
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
    </AtmosphericBackground>

  );
};