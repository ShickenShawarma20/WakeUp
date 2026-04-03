import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';




/**
 * Circadian-aware atmospheric illustration.
 * Adapts to the current time of day (night/day/noon/evening).
 */
export const MoonIllustration: React.FC = () => {
  const { atmosphericState, colors } = useTheme();

  return (
    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '160px', height: '160px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.ambientGlow.replace('0.15', '0.35')} 0%, transparent 70%)`,
        filter: 'blur(24px)',
      }} />

      {atmosphericState === 'night' && <NightIllustration colors={colors} />}
      {atmosphericState === 'day' && <DayIllustration colors={colors} />}
      {atmosphericState === 'noon' && <NoonIllustration colors={colors} />}
      {atmosphericState === 'evening' && <EveningIllustration colors={colors} />}
    </div>
  );
};

// ── Night: Moon crescent + stars ────────────────────────────
const NightIllustration: React.FC<{ colors: any }> = ({ colors }) => (
  <>
    <svg viewBox="0 0 180 180" width="180" height="180" style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="60%" stopColor={colors.accentSecondary} />
          <stop offset="100%" stopColor={colors.accentPrimaryDim} />
        </linearGradient>
        <mask id="crescentMask">
          <rect width="180" height="180" fill="white" />
          <circle cx="108" cy="63" r="50" fill="black" />
        </mask>
      </defs>
      <circle cx="90" cy="90" r="58" fill="url(#moonGrad)" mask="url(#crescentMask)" />
      {/* Subtle craters */}
      <circle cx="72" cy="100" r="5" fill="rgba(160,140,220,0.25)" mask="url(#crescentMask)" />
      <circle cx="64" cy="78" r="3.5" fill="rgba(160,140,220,0.2)" mask="url(#crescentMask)" />
      <circle cx="82" cy="118" r="2.5" fill="rgba(160,140,220,0.2)" mask="url(#crescentMask)" />
    </svg>

    {/* Twinkling stars */}
    {[
      { top: '14px', right: '28px', size: 8, delay: 0 },
      { top: '36px', right: '12px', size: 6, delay: 0.5 },
      { top: '50px', right: '46px', size: 5, delay: 1.0 },
      { top: '22px', left: '38px', size: 4, delay: 0.8 },
      { top: '65px', left: '22px', size: 3, delay: 1.5 },
    ].map((s, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: s.delay }}
        style={{ position: 'absolute', top: s.top, right: (s as any).right, left: (s as any).left }}
      >
        <StarSVG size={s.size} color={colors.textPrimary} />
      </motion.div>
    ))}
  </>
);

// ── Day: Sun with radiating rays ────────────────────────────
const DayIllustration: React.FC<{ colors: any }> = ({ colors }) => (
  <>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: '10px', left: '10px', width: '160px', height: '160px' }}
    >
      <svg viewBox="0 0 160 160" width="160" height="160">
        {[0,45,90,135].map((angle) => (
          <rect
            key={angle}
            x="76" y="4" width="8" height="28" rx="4"
            fill={colors.accentPrimary}
            opacity="0.5"
            transform={`rotate(${angle} 80 80)`}
          />
        ))}
        {[22.5, 67.5, 112.5, 157.5].map((angle) => (
          <rect
            key={angle}
            x="77" y="6" width="6" height="20" rx="3"
            fill={colors.accentSecondary}
            opacity="0.35"
            transform={`rotate(${angle} 80 80)`}
          />
        ))}
      </svg>
    </motion.div>
    {/* Sun core */}
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '72px', height: '72px', borderRadius: '50%',
      background: `radial-gradient(circle, ${colors.accentPrimary} 0%, ${colors.accentPrimaryDim} 60%, transparent 100%)`,
      boxShadow: `0 0 40px ${colors.ambientGlow}`,
    }} />
  </>
);

// ── Noon: Intense golden orb ────────────────────────────────
const NoonIllustration: React.FC<{ colors: any }> = ({ colors }) => (
  <>
    <motion.div
      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100px', height: '100px', borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.tertiary} 0%, ${colors.accentPrimary} 50%, ${colors.accentPrimaryDim} 100%)`,
        boxShadow: `0 0 60px ${colors.ambientGlow.replace('0.15', '0.5')}, 0 0 100px ${colors.ambientGlow}`,
      }}
    />
    {/* Heat shimmer rings */}
    {[120, 140, 160].map((size, i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${size}px`, height: `${size}px`, borderRadius: '50%',
          boxShadow: `inset 0 0 0 1px ${colors.accentPrimary}40`,
        }}
      />
    ))}
  </>
);

// ── Evening: Sunset orb with warm bloom ─────────────────────
const EveningIllustration: React.FC<{ colors: any }> = ({ colors }) => (
  <>
    {/* Horizon gradient orb */}
    <div style={{
      position: 'absolute', top: '55%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '140px', height: '80px', borderRadius: '50% 50% 0 0',
      background: `linear-gradient(to top, ${colors.accentSecondary}80, transparent)`,
      filter: 'blur(20px)',
    }} />
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.accentSecondary}, ${colors.accentPrimary})`,
        boxShadow: `0 0 48px ${colors.ambientGlow}`,
      }}
    />
    {/* Stars beginning to appear */}
    {[
      { top: '10px', right: '20px', size: 5, delay: 0 },
      { top: '20px', left: '30px', size: 4, delay: 1 },
    ].map((s, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.1, 0.7, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
        style={{ position: 'absolute', top: s.top, right: (s as any).right, left: (s as any).left }}
      >
        <StarSVG size={s.size} color={colors.textSecondary} />
      </motion.div>
    ))}
  </>
);

const StarSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 3} height={size * 3} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
