import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassNavBar, type TabType } from '../components/GlassNavBar';
import { GlassPanel } from '../components/GlassPanel';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SettingsScreenProps {
  onTabPress: (tab: TabType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onTabPress }) => {
  const { colors } = useTheme();

  const [vibration, setVibration] = useState(true);
  const [volume, setVolume] = useState(80);
  const [snoozeDuration, setSnoozeDuration] = useState('10');
  const [gradualVolume, setGradualVolume] = useState(true);

  return (
    <div style={{
      background: `linear-gradient(180deg, ${colors.backgroundElevated} 0%, ${colors.backgroundDeep} 100%)`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <style>
        {`
          .slider-purple {
            -webkit-appearance: none;
            width: 120px;
            height: 6px;
            background: rgba(180, 120, 255, 0.2);
            border: none;
            border-radius: 4px;
            outline: none;
          }
          .slider-purple::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #B040E0, #E040FB);
            box-shadow: 0 0 12px rgba(224, 64, 251, 0.3);
            cursor: pointer;
          }
          .slider-purple::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #B040E0, #E040FB);
            box-shadow: 0 0 12px rgba(224, 64, 251, 0.3);
            cursor: pointer;
            border: none;
          }
          .slider-purple::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #E040FB ${volume}%, rgba(180, 120, 255, 0.2) ${volume}%);
            border-radius: 4px;
            height: 6px;
          }
          .select-purple {
            appearance: none;
            background: rgba(30, 20, 60, 0.6);
            border: 1px solid rgba(180, 120, 255, 0.15);
            padding: 8px 32px 8px 12px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: ${colors.textPrimary};
            outline: none;
            cursor: pointer;
            background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%239E8CC0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
          }
        `}
      </style>

      {/* Purple glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(176, 64, 224, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <header style={{
        padding: `calc(env(safe-area-inset-top) + 40px) ${spacing.screenPadding}px 20px`,
        zIndex: 10,
      }}>
        <h1 style={{ ...typography.heroTitle, color: colors.textPrimary, margin: 0 }}>Settings</h1>
      </header>

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: `0 ${spacing.screenPadding}px`,
        paddingBottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <SettingsSection title="Sound & Vibration" colors={colors}>
          <SettingsRow label="Default Sound" colors={colors} control={
            <select className="select-purple" defaultValue="Radar">
              <option value="Radar">Radar</option>
              <option value="Beacon">Beacon</option>
              <option value="Chimes">Chimes</option>
            </select>
          } hasDivider />
          <SettingsRow label="Vibration" colors={colors} control={
            <Toggle enabled={vibration} onToggle={() => setVibration(!vibration)} />
          } hasDivider />
          <SettingsRow label="Volume" colors={colors} control={
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="slider-purple"
            />
          } />
        </SettingsSection>

        <SettingsSection title="Behavior" colors={colors}>
          <SettingsRow label="Snooze Duration" colors={colors} control={
            <select
              className="select-purple"
              value={snoozeDuration}
              onChange={(e) => setSnoozeDuration(e.target.value)}
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
            </select>
          } hasDivider />
          <SettingsRow label="Gradually Increase Volume" colors={colors} control={
            <Toggle enabled={gradualVolume} onToggle={() => setGradualVolume(!gradualVolume)} />
          } />
        </SettingsSection>

        {/* About */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '16px' }}
        >
          <p style={{ ...typography.labelText, color: colors.textMuted }}>
            WakeUp Luxury v1.0
          </p>
        </motion.div>
      </main>

      <GlassNavBar activeTab="settings" onTabPress={onTabPress} />
    </div>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; colors: any }> = ({ title, children, colors }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <h3 style={{
      ...typography.labelText,
      color: colors.textMuted,
      marginLeft: '4px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      fontSize: '11px',
    }}>
      {title}
    </h3>
    <GlassPanel style={{
      padding: '4px 20px',
      background: 'rgba(20, 14, 40, 0.85)',
      border: '1px solid rgba(180, 120, 255, 0.1)',
    }}>
      {children}
    </GlassPanel>
  </div>
);

const SettingsRow: React.FC<{ label: string; control: React.ReactNode; hasDivider?: boolean; colors: any }> = ({ label, control, hasDivider = false, colors }) => (
  <>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
    }}>
      <span style={{ ...typography.bodyText, color: colors.textPrimary }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center' }}>{control}</div>
    </div>
    {hasDivider && <div style={{ height: '1px', backgroundColor: 'rgba(180, 120, 255, 0.08)', margin: '0 -20px' }} />}
  </>
);

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
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