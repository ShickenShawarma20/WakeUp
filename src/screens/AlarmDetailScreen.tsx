import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../components/GlassPanel';
import { CircleSelector } from '../components/CircleSelector';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface AlarmTime { hours: number; minutes: number; ampm: 'AM' | 'PM'; }
interface AlarmData { id?: string; time: AlarmTime; label: string; isEnabled: boolean; repeatDays: string[]; soundName: string; snoozeEnabled: boolean; }
interface AlarmDetailScreenProps { isEditMode: boolean; initialData?: AlarmData; onSave: (data: AlarmData) => void; onDelete?: (id: string) => void; onBack: () => void; }

const DAYS_OF_WEEK = [{ id: 'Mon', label: 'M' }, { id: 'Tue', label: 'T' }, { id: 'Wed', label: 'W' }, { id: 'Thu', label: 'T' }, { id: 'Fri', label: 'F' }, { id: 'Sat', label: 'S' }, { id: 'Sun', label: 'S' }];

export const AlarmDetailScreen: React.FC<AlarmDetailScreenProps> = ({ isEditMode, initialData, onSave, onDelete, onBack }) => {
  const { colors } = useTheme();
  const [time, setTime] = useState<AlarmTime>(initialData?.time || { hours: 7, minutes: 0, ampm: 'AM' });
  const [label, setLabel] = useState(initialData?.label || '');
  const [repeatDays, setRepeatDays] = useState<string[]>(initialData?.repeatDays || []);
  const [soundName] = useState(initialData?.soundName || 'Radar');
  const [snoozeEnabled, setSnoozeEnabled] = useState(initialData?.snoozeEnabled ?? true);

  const toggleDay = (dayId: string) => setRepeatDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
  const handleSave = () => onSave({ id: initialData?.id, time, label, isEnabled: initialData?.isEnabled ?? true, repeatDays, soundName, snoozeEnabled });

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: `linear-gradient(180deg, ${colors.backgroundElevated} 0%, ${colors.backgroundDeep} 100%)`,
    }}>
      {/* Purple glow */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(176, 64, 224, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top Bar */}
      <div style={{
        position: 'relative',
        padding: `calc(env(safe-area-inset-top) + 20px) ${spacing.screenPadding}px 20px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <button onClick={onBack} style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${colors.cardDarkBorder}`,
          cursor: 'pointer',
          padding: 0,
          background: colors.cardDark,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 style={{ ...typography.cardTitle, color: colors.textPrimary, margin: 0 }}>
          {isEditMode ? 'Edit Alarm' : 'New Alarm'}
        </h1>
        <button onClick={handleSave} style={{
          padding: '8px 20px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          ...typography.badgeText,
          color: '#FFF',
          background: 'linear-gradient(135deg, #B040E0, #E040FB)',
          boxShadow: '0 4px 16px rgba(224, 64, 251, 0.3)',
        }}>
          Done
        </button>
      </div>

      {/* Time Display */}
      <div style={{ textAlign: 'center', padding: '20px 0 24px', zIndex: 10, position: 'relative' }}>
        <div style={{ ...typography.alarmTime, color: colors.textPrimary, fontSize: '80px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
          <span>{time.hours}:{time.minutes.toString().padStart(2, '0')}</span>
          <span style={{ fontSize: '0.3em', color: colors.textSecondary }}>{time.ampm}</span>
        </div>
      </div>

      {/* Bottom Panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 120 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', zIndex: 10,
          touchAction: 'none',
        }}
      >
        <GlassPanel style={{
          height: '100%',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'rgba(20, 14, 40, 0.92)',
          border: '1px solid rgba(180, 120, 255, 0.1)',
          borderBottom: 'none',
        }}>
          {/* Time Picker */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <StyledSelect value={time.hours} onChange={(v) => setTime({ ...time, hours: v })} options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))} colors={colors} />
            <span style={{ ...typography.alarmTimeSmall, color: colors.textPrimary, lineHeight: '44px' }}>:</span>
            <StyledSelect value={time.minutes} onChange={(v) => setTime({ ...time, minutes: v })} options={Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))} colors={colors} />
            <StyledSelect value={time.ampm} onChange={(v) => setTime({ ...time, ampm: v as 'AM' | 'PM' })} options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} colors={colors} />
          </div>

          {/* Label */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Alarm label..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: `1px solid ${colors.cardDarkBorder}`,
                ...typography.bodyText,
                color: colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                background: 'rgba(30, 20, 60, 0.5)',
              }}
            />
          </div>

          {/* Repeat Days */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ ...typography.labelText, color: colors.textSecondary, marginBottom: '12px', display: 'block' }}>Repeat</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
              {DAYS_OF_WEEK.map((day) => (
                <CircleSelector key={day.id} label={day.label} isSelected={repeatDays.includes(day.id)} onPress={() => toggleDay(day.id)} />
              ))}
            </div>
          </div>

          {/* Snooze Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ ...typography.bodyText, color: colors.textPrimary }}>Snooze</span>
            <ToggleSwitch enabled={snoozeEnabled} onToggle={() => setSnoozeEnabled(!snoozeEnabled)} />
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            {isEditMode && onDelete && (
              <button
                onClick={() => { if (window.confirm('Delete this alarm?')) onDelete(initialData?.id as string); }}
                style={{
                  background: 'transparent',
                  border: `1px solid rgba(255,71,87,0.3)`,
                  borderRadius: '16px',
                  ...typography.bodyText,
                  color: colors.danger,
                  padding: '14px',
                  cursor: 'pointer',
                }}
              >
                Delete Alarm
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #B040E0 0%, #E040FB 50%, #FF4081 100%)',
                boxShadow: '0 8px 32px rgba(224, 64, 251, 0.35)',
                color: '#FFF',
                ...typography.cardTitle,
                fontSize: '17px',
                cursor: 'pointer',
              }}
            >
              Save Alarm
            </motion.button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
};

// Styled select component
const StyledSelect = ({ value, onChange, options, colors }: {
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
      padding: '10px 12px',
      borderRadius: '12px',
      border: `1px solid ${colors.cardDarkBorder}`,
      background: 'rgba(30, 20, 60, 0.5)',
      color: colors.textPrimary,
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
      fontSize: '16px',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as const,
      textAlign: 'center' as const,
      minWidth: '60px',
    }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// Toggle switch
const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      width: '52px',
      height: '28px',
      borderRadius: '14px',
      position: 'relative',
      cursor: 'pointer',
      background: enabled
        ? 'linear-gradient(135deg, #B040E0, #E040FB)'
        : 'rgba(100, 80, 140, 0.5)',
      boxShadow: enabled ? '0 0 16px rgba(224, 64, 251, 0.3)' : 'none',
      transition: 'all 0.3s ease',
    }}
  >
    <motion.div
      animate={{ left: enabled ? '26px' : '3px' }}
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
);