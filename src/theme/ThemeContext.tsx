import React, { createContext, useContext, useEffect } from 'react';
import { darkColors } from './colors';
import { getGlassStyles } from './glassStyles';

interface ThemeContextValue {
  theme: 'dark';
  isDark: true;
  colors: typeof darkColors;
  glassStyles: ReturnType<typeof getGlassStyles>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colors = darkColors;
  const glassStyles = getGlassStyles(true);
  const toggleTheme = () => {}; // No-op — always dark

  useEffect(() => {
    document.body.style.backgroundColor = colors.backgroundDeep;
    document.body.style.color = colors.textPrimary;
    document.body.style.margin = '0';
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true, colors, glassStyles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};