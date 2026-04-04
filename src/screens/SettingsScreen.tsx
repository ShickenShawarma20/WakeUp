import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassNavBar, type TabType } from '../components/GlassNavBar';
import { AtmosphericBackground } from '../components/AtmosphericBackground';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SettingsScreenProps {
  onTabPress: (tab: TabType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onTabPress }) => {
  const { colors, themePreference, setThemePreference } = useTheme();

  const [vibration, setVibration] = useState<boolean>(() => {
    const saved = localStorage.getItem('settings-vibration');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('settings-volume');
    return saved !== null ? Number(saved) : 80;
  });
  const [snoozeDuration, setSnoozeDuration] = useState(() => {
    return localStorage.getItem('settings-snooze') || '10';
  });
  const [gradualVolume, setGradualVolume] = useState<boolean>(() => {
    const saved = localStorage.getItem('settings-gradual');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [defaultSound, setDefaultSound] = useState(() => {
    return localStorage.getItem('settings-sound') || 'Radar';
  });

  useEffect(() => {
    localStorage.setItem('settings-vibration', JSON.stringify(vibration));
    localStorage.setItem('settings-volume', volume.toString());
    localStorage.setItem('settings-snooze', snoozeDuration);
    localStorage.setItem('settings-gradual', JSON.stringify(gradualVolume));
    localStorage.setItem('settings-sound', defaultSound);
  }, [vibration, volume, snoozeDuration, gradualVolume, defaultSound]);

  return (
    <AtmosphericBackground style={{
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <style>{`
        /* Slider — circadian accent tinted */
        .crisp-slider {
          -webkit-appearance: none;
          width: 130px;
          height: 5px;
          border-radius: 3px;
          outline: none;
          background: rgba(255,255,255,0.1);
          border: none;
        }
        .crisp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          cursor: pointer;
          background: var(--accent-primary, #818cf8);
          box-shadow: 0 0 12px var(--accent-glow, rgba(129,140,248,0.3));
        }
        .crisp-slider::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: var(--accent-primary, #818cf8);
        }
        /* Glass select */
        .crisp-select {
          appearance: none;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(8px);
          border: none;
          padding: 8px 32px 8px 14px;
          border-radius: 12px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.875rem;
          color: ${colors.textPrimary};
          outline: none;
          cursor: pointer;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.2);
          background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(colors.textSecondary)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
      `}</style>
      <style>{`
        :root {
          --accent-primary: ${colors.accentPrimary};
          --accent-glow: ${colors.ambientGlow};
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────── */}
      <header style={{
        padding: `calc(env(safe-area-inset-top) + 40px) ${spacing.screenPadding}px 20px`,
        zIndex: 10,
      }}>
        <h1 style={{ ...typography.headlineMd, color: colors.textPrimary, margin: 0 }}>Settings</h1>
      </header>

      {/* ── Content ──────────────────────────────────────── */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: `0 ${spacing.screenPadding}px`,
        paddingBottom: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing.groupGap}px`,
      }}>

        {/* ── Display & Theme ──────────────────────────── */}
        <SettingsSection title="Display & Theme" colors={colors}>
          <SettingsRow label="App Theme" colors={colors}>
            <select
              className="crisp-select"
              value={themePreference}
              onChange={(e) => setThemePreference(e.target.value as any)}
            >
              <option value="auto">Auto (Circadian)</option>
              <option value="day">Day (Aura)</option>
              <option value="noon">Noon (Zenith)</option>
              <option value="evening">Evening (Dusk)</option>
              <option value="night">Night (Deep Orbit)</option>
            </select>
          </SettingsRow>
        </SettingsSection>

        {/* ── Sound & Vibration ────────────────────────── */}
        <SettingsSection title="Sound & Vibration" colors={colors}>
          <SettingsRow label="Default Sound" colors={colors}>
            <select className="crisp-select" value={defaultSound} onChange={(e) => setDefaultSound(e.target.value)}>
              <option value="Radar">Radar</option>
              <option value="Beacon">Beacon</option>
              <option value="Chimes">Chimes</option>
            </select>
          </SettingsRow>

          <div style={{ height: `${spacing.sp6}px` }} />

          <SettingsRow label="Vibration" colors={colors}>
            <ToggleSwitch enabled={vibration} onToggle={() => setVibration(!vibration)} colors={colors} />
          </SettingsRow>

          <div style={{ height: `${spacing.sp6}px` }} />

          <SettingsRow label="Alarm Volume" colors={colors}>
            <input
              type="range"
              min="0" max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="crisp-slider"
            />
          </SettingsRow>
        </SettingsSection>

        {/* ── Behavior ─────────────────────────────────── */}
        <SettingsSection title="Behavior" colors={colors}>
          <SettingsRow label="Snooze Duration" colors={colors}>
            <select
              className="crisp-select"
              value={snoozeDuration}
              onChange={(e) => setSnoozeDuration(e.target.value)}
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
            </select>
          </SettingsRow>

          <div style={{ height: `${spacing.sp6}px` }} />

          <SettingsRow label="Gradually Increase Volume" colors={colors}>
            <ToggleSwitch enabled={gradualVolume} onToggle={() => setGradualVolume(!gradualVolume)} colors={colors} />
          </SettingsRow>
        </SettingsSection>

        {/* ── About ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', paddingTop: '8px' }}
        >
          <p style={{ ...typography.labelMd, color: colors.textMuted }}>
            WakeUp Luxury v1.0
          </p>
          <p style={{ ...typography.labelSm, color: `${colors.textMuted}80`, marginTop: '4px' }}>
            THE TEMPORAL PRISM DESIGN SYSTEM
          </p>
        </motion.div>
      </main>

      <GlassNavBar activeTab="settings" onTabPress={onTabPress} />
    </AtmosphericBackground>
  );
};

// ── Settings Section ─────────────────────────────────────────
const SettingsSection: React.FC<{ title: string; children: React.ReactNode; colors: any }> = ({ title, children, colors }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <h3 style={{
      ...typography.labelSm,
      color: colors.textMuted,
      marginLeft: '4px',
      marginBottom: '8px',
    }}>
      {title}
    </h3>
    {/* Level 1 glass section panel */}
    <div style={{
      background: colors.surfaceContainerLow,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '24px',
      boxShadow: `inset 0 1px 0 ${colors.glassHighlight}`,
      padding: '20px 24px',
    }}>
      {children}
    </div>
  </div>
);

// ── Settings Row ─────────────────────────────────────────────
const SettingsRow: React.FC<{ label: string; children: React.ReactNode; colors: any }> = ({ label, children, colors }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <span style={{ ...typography.bodyLg, color: colors.textPrimary }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
  </div>
);

// ── Toggle Switch ─────────────────────────────────────────────
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