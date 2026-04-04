import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleSelector } from '../components/CircleSelector';

import { AtmosphericBackground } from '../components/AtmosphericBackground';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface AlarmTime { hours: number; minutes: number; ampm: 'AM' | 'PM'; }
interface AlarmData { id?: string; time: AlarmTime; label: string; isEnabled: boolean; repeatDays: string[]; soundName: string; snoozeEnabled: boolean; }
interface AlarmDetailScreenProps { isEditMode: boolean; initialData?: AlarmData; onSave: (data: AlarmData) => void; onDelete?: (id: string) => void; onBack: () => void; }

const DAYS_OF_WEEK = [
  { id: 'Mon', label: 'M' },
  { id: 'Tue', label: 'T' },
  { id: 'Wed', label: 'W' },
  { id: 'Thu', label: 'T' },
  { id: 'Fri', label: 'F' },
  { id: 'Sat', label: 'S' },
  { id: 'Sun', label: 'S' },
];

export const AlarmDetailScreen: React.FC<AlarmDetailScreenProps> = ({ isEditMode, initialData, onSave, onDelete, onBack }) => {
  const { colors, glassStyles } = useTheme();
  const [time, setTime] = useState<AlarmTime>(initialData?.time || { hours: 7, minutes: 0, ampm: 'AM' });
  const [label, setLabel] = useState(initialData?.label || '');
  const [repeatDays, setRepeatDays] = useState<string[]>(initialData?.repeatDays || []);
  const [soundName] = useState(initialData?.soundName || 'Radar');
  const [snoozeEnabled, setSnoozeEnabled] = useState(initialData?.snoozeEnabled ?? true);

  const toggleDay = (dayId: string) => setRepeatDays(prev =>
    prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
  );
  const handleSave = () => onSave({
    id: initialData?.id, time, label, isEnabled: initialData?.isEnabled ?? true,
    repeatDays, soundName, snoozeEnabled,
  });

  return (
    <AtmosphericBackground style={{
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
        {/* ── Top Bar ────────────────────────────────────── */}
        <div style={{
          padding: `calc(env(safe-area-inset-top) + 24px) 32px 16px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}>
          {/* Back button — glass secondary style */}
          <button
            id="detail-back-btn"
            onClick={onBack}
            style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${colors.onSurface}15`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 style={{ ...typography.headlineSm, color: colors.textPrimary, margin: 0 }}>
            {isEditMode ? 'Edit Alarm' : 'New Alarm'}
          </h1>

          {/* Done — primary translucent pill button */}
          <button
            id="detail-save-btn"
            onClick={handleSave}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              ...typography.buttonMd,
              color: colors.onPrimary,
              background: `${colors.accentPrimary}cc`,  // 80% opacity
              backdropFilter: 'blur(12px)',
              boxShadow: `0 0 2rem ${colors.ambientGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            Done
          </button>
        </div>

        {/* Removed Redundant Hero Time Display */}

        {/* ── Bottom Sheet — Level 2 elevated glass ─────── */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 120 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '75%', zIndex: 10,
          }}
        >
          <div style={{
            height: '100%',
            ...glassStyles.elevated,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 24px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}>
            {/* Drag handle */}
            <div style={{
              width: '36px', height: '4px', borderRadius: '2px',
              background: `${colors.onSurface}30`,
              margin: '-12px auto 20px',
            }} />

            {/* ── Time Selectors ─────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: `${spacing.sp6}px` }}>
              <GlassTimeSelect
                value={time.hours}
                onChange={(v) => setTime({ ...time, hours: v })}
                options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))}
                colors={colors}
              />
              <span style={{
                ...typography.headlineSm,
                color: colors.textSecondary,
                lineHeight: '48px',
              }}>:</span>
              <GlassTimeSelect
                value={time.minutes}
                onChange={(v) => setTime({ ...time, minutes: v })}
                options={Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))}
                colors={colors}
              />
              <GlassTimeSelect
                value={time.ampm}
                onChange={(v) => setTime({ ...time, ampm: v as 'AM' | 'PM' })}
                options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]}
                colors={colors}
              />
            </div>

            {/* ── Label ─────────────────────────────────── */}
            <div style={{ marginBottom: `${spacing.sp5}px` }}>
              <input
                type="text"
                placeholder="Alarm label..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: `${spacing.inputBorderRadius}px`,
                  border: 'none',
                  ...typography.bodyLg,
                  color: colors.textPrimary,
                  outline: 'none',
                  boxSizing: 'border-box',
                  // Recessed glass style
                  background: 'rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25)',
                }}
              />
            </div>

            {/* ── Repeat Days ────────────────────────────── */}
            <div style={{ marginBottom: `${spacing.sp5}px` }}>
              <span style={{ ...typography.labelMd, color: colors.textMuted, marginBottom: '12px', display: 'block' }}>
                Repeat
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {DAYS_OF_WEEK.map((day) => (
                  <CircleSelector
                    key={day.id}
                    label={day.label}
                    isSelected={repeatDays.includes(day.id)}
                    onPress={() => toggleDay(day.id)}
                  />
                ))}
              </div>
            </div>

            {/* ── Snooze ─────────────────────────────────── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: `${spacing.sp6}px`,
            }}>
              <span style={{ ...typography.bodyLg, color: colors.textPrimary }}>Snooze</span>
              <ToggleSwitch enabled={snoozeEnabled} onToggle={() => setSnoozeEnabled(!snoozeEnabled)} colors={colors} />
            </div>

            {/* ── Actions ──────────────────────────────────── */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '32px' }}>
              {isEditMode && onDelete && (
                <button
                  id="detail-delete-btn"
                  onClick={() => { if (window.confirm('Delete this alarm?')) onDelete(initialData?.id as string); }}
                  style={{
                    background: `${colors.danger}18`,
                    backdropFilter: 'blur(8px)',
                    boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,
                    borderRadius: '16px',
                    border: 'none',
                    ...typography.bodyLg,
                    color: colors.danger,
                    padding: '14px', cursor: 'pointer',
                  }}
                >
                  Delete Alarm
                </button>
              )}

              <motion.button
                id="detail-save-alarm-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                style={{
                  width: '100%',
                  padding: '17px',
                  borderRadius: '999px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentPrimaryDim} 100%)`,
                  boxShadow: `0 0 2.5rem ${colors.ambientGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  color: colors.onPrimary,
                  ...typography.buttonLg,
                  cursor: 'pointer',
                }}
              >
                Save Alarm
              </motion.button>
            </div>
          </div>
        </motion.div>
    </AtmosphericBackground>
  );
};

// ── Glass Time Select ───────────────────────────────────────
const GlassTimeSelect = ({ value, onChange, options, colors }: {
  value: any;
  onChange: (v: any) => void;
  options: { value: any; label: string }[];
  colors: any;
}) => (
  <select
    value={value}
    onChange={(e) => {
      const v = e.target.value;
      onChange(isNaN(Number(v)) ? v : Number(v));
    }}
    style={{
      padding: '10px 14px',
      borderRadius: '14px',
      border: 'none',
      background: 'rgba(0,0,0,0.2)',
      backdropFilter: 'blur(8px)',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
      color: colors.textPrimary,
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 600,
      fontSize: '1.1rem',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as const,
      textAlign: 'center' as const,
      minWidth: '58px',
    }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// ── Toggle Switch ───────────────────────────────────────────
const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void; colors: any }> = ({ enabled, onToggle, colors }) => (
  <div
    onClick={onToggle}
    style={{
      width: '52px', height: '28px',
      borderRadius: '999px',
      position: 'relative', cursor: 'pointer',
      background: enabled
        ? `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`
        : 'rgba(0,0,0,0.3)',
      boxShadow: enabled
        ? `0 0 16px ${colors.ambientGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`
        : 'inset 0 2px 4px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
    }}
  >
    <motion.div
      animate={{ left: enabled ? '26px' : '3px' }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        position: 'absolute', top: '3px',
        width: '22px', height: '22px', borderRadius: '50%',
        backgroundColor: '#FFF', boxShadow: '0 1px 6px rgba(0,0,0,0.25)',
      }}
    />
  </div>
);