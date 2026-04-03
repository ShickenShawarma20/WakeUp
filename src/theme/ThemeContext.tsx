import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAtmosphericState,
  palettes,
  type CircadianPalette,
  type AtmosphericState,
} from './colors';
import { getGlassStyles } from './glassStyles';

interface ThemeContextValue {
  theme: 'dark';
  isDark: true;
  colors: CircadianPalette;
  glassStyles: ReturnType<typeof getGlassStyles>;
  atmosphericState: AtmosphericState;
  gradientCSS: string;
  themePreference: 'auto' | AtmosphericState;
  setThemePreference: (pref: 'auto' | AtmosphericState) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [themePreference, setThemePreferenceState] = useState<'auto' | AtmosphericState>(() => {
    return (localStorage.getItem('themePreference') as 'auto' | AtmosphericState) || 'auto';
  });

  const setThemePreference = (pref: 'auto' | AtmosphericState) => {
    setThemePreferenceState(pref);
    localStorage.setItem('themePreference', pref);
  };

  // Update every minute
  useEffect(() => {
    const tick = () => {
      const h = new Date().getHours();
      setCurrentHour(h);
    };

    // Sync to next minute boundary
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60_000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  const atmosphericState = themePreference === 'auto' ? getAtmosphericState(currentHour) : themePreference;
  const colors = palettes[atmosphericState];
  const glassStyles = getGlassStyles(true, colors);

  // Atmospheric gradient CSS for use directly in background styles
  const gradientCSS = `linear-gradient(160deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`;

  useEffect(() => {
    document.body.style.backgroundColor = colors.backgroundDeep;
    document.body.style.color = colors.textPrimary;
    document.body.style.margin = '0';
  }, [colors]);

  return (
    <ThemeContext.Provider value={{
      theme: 'dark',
      isDark: true,
      colors,
      glassStyles,
      atmosphericState,
      gradientCSS,
      themePreference,
      setThemePreference,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};