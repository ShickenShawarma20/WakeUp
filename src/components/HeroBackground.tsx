import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface HeroBackgroundProps {
  imageSource: string;
  children?: React.ReactNode;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ imageSource, children }) => {
  const { colors } = useTheme();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${imageSource})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Enables native parallax
        }}
      />
      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: `linear-gradient(to bottom, transparent, ${colors.backgroundDeep})`,
          pointerEvents: 'none',
        }}
      />
      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};