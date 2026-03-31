import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface CircleSelectorProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CircleSelector: React.FC<CircleSelectorProps> = ({ label, isSelected, onPress }) => {
  const { colors } = useTheme();

  return (
    <button
      onClick={onPress}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: isSelected
          ? 'linear-gradient(135deg, #B040E0, #E040FB)'
          : 'rgba(100, 80, 140, 0.2)',
        border: isSelected
          ? 'none'
          : `1px solid ${colors.cardDarkBorder}`,
        boxShadow: isSelected
          ? '0 0 16px rgba(224, 64, 251, 0.25)'
          : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{
        ...typography.labelText,
        color: isSelected ? '#FFF' : colors.textMuted,
        fontWeight: isSelected ? 600 : 500,
      }}>
        {label}
      </span>
    </button>
  );
};