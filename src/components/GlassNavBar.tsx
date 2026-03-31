import React from 'react';
import { useTheme } from '../theme/ThemeContext';

export type TabType = 'alarms' | 'add' | 'settings';

interface GlassNavBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const GlassNavBar: React.FC<GlassNavBarProps> = ({ activeTab, onTabPress }) => {
  const { colors } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      maxWidth: '300px',
      minWidth: '220px',
      height: '56px',
      background: 'rgba(20, 14, 40, 0.9)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      border: '1px solid rgba(180, 120, 255, 0.12)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      borderRadius: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 1000,
    }}>
      {/* Alarms */}
      <NavButton isActive={activeTab === 'alarms'} onClick={() => onTabPress('alarms')} accentColor={colors.accentMagenta}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'alarms' ? colors.accentMagenta : colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3L2 6" />
          <path d="M22 6l-3-3" />
        </svg>
      </NavButton>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(180, 120, 255, 0.1)' }} />

      {/* Add */}
      <NavButton isActive={activeTab === 'add'} onClick={() => onTabPress('add')} accentColor={colors.accentMagenta}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: activeTab === 'add'
            ? 'linear-gradient(135deg, #B040E0, #E040FB)'
            : 'rgba(100, 80, 140, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: activeTab === 'add' ? '0 0 20px rgba(224, 64, 251, 0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </NavButton>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(180, 120, 255, 0.1)' }} />

      {/* Settings */}
      <NavButton isActive={activeTab === 'settings'} onClick={() => onTabPress('settings')} accentColor={colors.accentMagenta}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'settings' ? colors.accentMagenta : colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </NavButton>
    </div>
  );
};

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ isActive, onClick, accentColor, children }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
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
    {/* Active indicator dot */}
    {isActive && (
      <div style={{
        position: 'absolute',
        bottom: '6px',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: accentColor,
        boxShadow: `0 0 8px ${accentColor}`,
      }} />
    )}
  </button>
);