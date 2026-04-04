import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

export type TabType = 'alarms' | 'add' | 'settings';

interface GlassNavBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const GlassNavBar: React.FC<GlassNavBarProps> = ({ activeTab, onTabPress }) => {
  const { colors, glassStyles } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(max(env(safe-area-inset-bottom), 16px) + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: '340px',
      minWidth: '240px',
      height: '64px',
      // Nav glass — pill shape, ambient float
      ...glassStyles.navBar,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 12px',
      zIndex: 1000,
    }}>
      {/* Alarms Tab */}
      <NavButton
        id="nav-alarms"
        isActive={activeTab === 'alarms'}
        onClick={() => onTabPress('alarms')}
        accentColor={colors.accentPrimary}
        ambientGlow={colors.ambientGlow}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={activeTab === 'alarms' ? colors.accentPrimary : colors.onSurfaceVariant}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3L2 6" />
          <path d="M22 6l-3-3" />
        </svg>
      </NavButton>

      {/* Add Tab — floating gradient pill (FAB style) */}
      <NavButton
        id="nav-add"
        isActive={activeTab === 'add'}
        onClick={() => onTabPress('add')}
        accentColor={colors.accentPrimary}
        ambientGlow={colors.ambientGlow}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: activeTab === 'add'
            ? `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentPrimaryDim})`
            : `${colors.onSurface}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // Ambient shadow for FAB — 3rem blur, 4% surface_tint
          boxShadow: activeTab === 'add'
            ? `0 0 3rem ${colors.ambientGlow}, 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`
            : `inset 0 1px 0 ${colors.glassHighlight}`,
          transition: 'all 0.35s ease',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </NavButton>

      {/* Settings Tab */}
      <NavButton
        id="nav-settings"
        isActive={activeTab === 'settings'}
        onClick={() => onTabPress('settings')}
        accentColor={colors.accentPrimary}
        ambientGlow={colors.ambientGlow}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={activeTab === 'settings' ? colors.accentPrimary : colors.onSurfaceVariant}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </NavButton>
    </div>
  );
};

interface NavButtonProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
  ambientGlow: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ id, isActive, onClick, accentColor, ambientGlow, children }) => (
  <motion.button
    id={id}
    onClick={onClick}
    whileTap={{ scale: 0.88 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    style={{
      flex: 1, height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      outline: 'none',
      WebkitTapHighlightColor: 'transparent',
      position: 'relative',
    }}
  >
    {children}
    {/* Active indicator — glowing dot, no lines */}
    {isActive && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        style={{
          position: 'absolute',
          bottom: '8px',
          width: '5px', height: '5px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${ambientGlow}`,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      />
    )}
  </motion.button>
);