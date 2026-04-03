import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

interface CircleSelectorProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Selection Chip per Ethereal Horizon spec:
 * - Inactive: surfaceVariant at 30% opacity, no border
 * - Active: tertiaryContainer with glowing tertiary label
 * - Full pill shape
 */
export const CircleSelector: React.FC<CircleSelectorProps> = ({ label, isSelected, onPress }) => {
  const { colors } = useTheme();

  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '999px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        background: isSelected
          ? colors.tertiaryContainer
          : `${colors.surfaceVariant}`,
        boxShadow: isSelected
          ? `0 0 16px ${colors.tertiary}40`
          : 'none',
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <span style={{
        ...typography.labelMd,
        color: isSelected ? colors.tertiary : colors.textMuted,
        textShadow: isSelected ? `0 0 12px ${colors.tertiary}80` : 'none',
        transition: 'color 0.25s ease, text-shadow 0.25s ease',
      }}>
        {label}
      </span>
    </motion.button>
  );
};