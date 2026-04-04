// ============================================================
// Ethereal Horizon — Circadian Color System
// "The Temporal Prism" — colors tied to the time of day
// ============================================================

export interface CircadianPalette {
  // Surface Hierarchy (Level 0 → 2)
  surfaceDim: string;             // Level 0: Global Backdrop
  surfaceContainerLow: string;    // Level 1: Sections
  surfaceContainerHigh: string;   // Level 2: Cards (glass base)
  surfaceContainerHighest: string;// Level 2+: Elevated glass
  surfaceVariant: string;         // Chip/selection backgrounds
  surface: string;                // Neutral surface

  // Backgrounds (legacy aliases for screens)
  backgroundDeep: string;
  backgroundCard: string;
  backgroundElevated: string;

  // Glass
  glassBase: string;      // onSurface at 10% opacity
  glassHighlight: string; // white at 15% for inner border
  glassOnSurface: string; // onSurface at 20% for inner border

  // Atmospheric Gradient
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;

  // Accent
  accentPrimary: string;     // Primary CTA color
  accentPrimaryDim: string;  // For 45° gradient endpoint
  accentSecondary: string;   // Secondary accent
  tertiary: string;          // Tertiary accent (chips active)
  tertiaryContainer: string; // Chip active background

  // Text
  textPrimary: string;   // on_surface equivalent
  textSecondary: string; // on_surface_variant
  textMuted: string;     // subtle text

  // Functional
  onPrimary: string;
  onSurface: string;
  onSurfaceVariant: string;
  outlineVariant: string;  // ghost borders at 10% opacity

  // Toggle / Interaction
  toggleActive: string;
  toggleInactive: string;

  // Status
  success: string;
  danger: string;

  // Glow
  ambientGlow: string; // For shadows/glows, tinted not pure black
}

// ── Night (Deep Orbit) ──────────────────────────────────────
const night: CircadianPalette = {
  surfaceDim:              '#050411',
  surfaceContainerLow:     'rgba(30, 27, 75, 0.6)',
  surfaceContainerHigh:    'rgba(49, 46, 106, 0.5)',
  surfaceContainerHighest: 'rgba(67, 64, 135, 0.45)',
  surfaceVariant:          'rgba(67, 64, 135, 0.3)',
  surface:                 '#1e1b4b',

  backgroundDeep:     '#020617',
  backgroundCard:     '#0f0a2b',
  backgroundElevated: '#1e1b4b',

  glassBase:      'rgba(255, 255, 255, 0.08)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',
  glassOnSurface: 'rgba(255, 255, 255, 0.20)',

  gradientStart: '#1e1b4b',
  gradientMid:   '#0f172a',
  gradientEnd:   '#020617',

  accentPrimary:     '#818cf8',
  accentPrimaryDim:  '#6366f1',
  accentSecondary:   '#a78bfa',
  tertiary:          '#c4b5fd',
  tertiaryContainer: 'rgba(139, 92, 246, 0.25)',

  textPrimary:   '#e0e7ff',
  textSecondary: '#a5b4fc',
  textMuted:     '#6b7280',

  onPrimary:        '#ffffff',
  onSurface:        '#e0e7ff',
  onSurfaceVariant: '#a5b4fc',
  outlineVariant:   'rgba(165, 180, 252, 0.15)',

  toggleActive:   '#818cf8',
  toggleInactive: 'rgba(67, 64, 135, 0.5)',

  success: '#4ade80',
  danger:  '#f87171',

  ambientGlow: 'rgba(103, 102, 241, 0.15)',
};

// ── Day (Aura of Clarity) ───────────────────────────────────
const day: CircadianPalette = {
  surfaceDim:              '#0c1a2e',
  surfaceContainerLow:     'rgba(14, 165, 233, 0.12)',
  surfaceContainerHigh:    'rgba(125, 211, 252, 0.15)',
  surfaceContainerHighest: 'rgba(186, 230, 253, 0.18)',
  surfaceVariant:          'rgba(125, 211, 252, 0.2)',
  surface:                 '#0c4a6e',

  backgroundDeep:     '#0c1a2e',
  backgroundCard:     '#082f49',
  backgroundElevated: '#0c4a6e',

  glassBase:      'rgba(255, 255, 255, 0.10)',
  glassHighlight: 'rgba(255, 255, 255, 0.20)',
  glassOnSurface: 'rgba(255, 255, 255, 0.22)',

  gradientStart: '#7dd3fc',
  gradientMid:   '#38bdf8',
  gradientEnd:   '#0ea5e9',

  accentPrimary:     '#0284c7',
  accentPrimaryDim:  '#0369a1',
  accentSecondary:   '#0ea5e9',
  tertiary:          '#38bdf8',
  tertiaryContainer: 'rgba(2, 132, 199, 0.15)',

  textPrimary:   '#0f172a',
  textSecondary: '#334155',
  textMuted:     '#475569',

  onPrimary:        '#ffffff',
  onSurface:        '#0f172a',
  onSurfaceVariant: '#334155',
  outlineVariant:   'rgba(15, 23, 42, 0.15)',

  toggleActive:   '#0284c7',
  toggleInactive: 'rgba(15, 23, 42, 0.2)',

  success: '#16a34a',
  danger:  '#e11d48',

  ambientGlow: 'rgba(56, 189, 248, 0.15)',
};

// ── Noon (Zenith Glow) ──────────────────────────────────────
const noon: CircadianPalette = {
  surfaceDim:              '#1a0d00',
  surfaceContainerLow:     'rgba(251, 146, 60, 0.12)',
  surfaceContainerHigh:    'rgba(253, 224, 71, 0.15)',
  surfaceContainerHighest: 'rgba(254, 240, 138, 0.18)',
  surfaceVariant:          'rgba(253, 224, 71, 0.2)',
  surface:                 '#78350f',

  backgroundDeep:     '#1a0d00',
  backgroundCard:     '#2d1600',
  backgroundElevated: '#78350f',

  glassBase:      'rgba(255, 255, 255, 0.10)',
  glassHighlight: 'rgba(255, 255, 255, 0.20)',
  glassOnSurface: 'rgba(255, 255, 255, 0.22)',

  gradientStart: '#fde047',
  gradientMid:   '#fb923c',
  gradientEnd:   '#f97316',

  accentPrimary:     '#d97706',
  accentPrimaryDim:  '#b45309',
  accentSecondary:   '#fb923c',
  tertiary:          '#fcd34d',
  tertiaryContainer: 'rgba(217, 119, 6, 0.15)',

  textPrimary:   '#451a03',
  textSecondary: '#78350f',
  textMuted:     '#92400e',

  onPrimary:        '#ffffff',
  onSurface:        '#451a03',
  onSurfaceVariant: '#78350f',
  outlineVariant:   'rgba(69, 26, 3, 0.15)',

  toggleActive:   '#d97706',
  toggleInactive: 'rgba(69, 26, 3, 0.2)',

  success: '#16a34a',
  danger:  '#e11d48',

  ambientGlow: 'rgba(251, 191, 36, 0.15)',
};

// ── Evening (Twilight Bloom) ────────────────────────────────
const evening: CircadianPalette = {
  surfaceDim:              '#130a1e',
  surfaceContainerLow:     'rgba(251, 146, 60, 0.10)',
  surfaceContainerHigh:    'rgba(129, 140, 248, 0.15)',
  surfaceContainerHighest: 'rgba(167, 139, 250, 0.18)',
  surfaceVariant:          'rgba(129, 140, 248, 0.2)',
  surface:                 '#3b1f60',

  backgroundDeep:     '#130a1e',
  backgroundCard:     '#1e1040',
  backgroundElevated: '#3b1f60',

  glassBase:      'rgba(255, 255, 255, 0.08)',
  glassHighlight: 'rgba(255, 255, 255, 0.16)',
  glassOnSurface: 'rgba(255, 255, 255, 0.20)',

  gradientStart: '#fb923c',
  gradientMid:   '#c084fc',
  gradientEnd:   '#818cf8',

  accentPrimary:     '#c084fc',
  accentPrimaryDim:  '#a855f7',
  accentSecondary:   '#fb923c',
  tertiary:          '#e879f9',
  tertiaryContainer: 'rgba(192, 132, 252, 0.2)',

  textPrimary:   '#faf5ff',
  textSecondary: '#d8b4fe',
  textMuted:     '#a78bfa',

  onPrimary:        '#ffffff',
  onSurface:        '#faf5ff',
  onSurfaceVariant: '#d8b4fe',
  outlineVariant:   'rgba(216, 180, 254, 0.15)',

  toggleActive:   '#c084fc',
  toggleInactive: 'rgba(59, 31, 96, 0.5)',

  success: '#4ade80',
  danger:  '#fb7185',

  ambientGlow: 'rgba(192, 132, 252, 0.15)',
};

// ── Circadian resolver ──────────────────────────────────────
export type AtmosphericState = 'day' | 'noon' | 'evening' | 'night';

export const getAtmosphericState = (hour: number): AtmosphericState => {
  if (hour >= 6 && hour < 11)  return 'day';
  if (hour >= 11 && hour < 16) return 'noon';
  if (hour >= 16 && hour < 21) return 'evening';
  return 'night';
};

export const palettes: Record<AtmosphericState, CircadianPalette> = {
  day, noon, evening, night
};

export const getCircadianColors = (hour: number): CircadianPalette => {
  const state = getAtmosphericState(hour);
  return palettes[state];
};

// Legacy export — maps to night for backward compatibility
export const darkColors = {
  ...night,
  // map legacy keys to new keys
  cardGlass:       night.glassBase,
  cardBorder:      night.glassHighlight,
  cardDark:        night.surfaceContainerLow,
  cardDarkBorder:  night.glassOnSurface,
  accentMagenta:   night.accentPrimary,
  accentPink:      night.accentSecondary,
  accentPurple:    night.accentPrimaryDim,
  accentGlow:      night.ambientGlow,
  gradientStart:   night.gradientStart,
  gradientMid:     night.gradientMid,
  gradientEnd:     night.gradientEnd,
  toggleActive:    night.toggleActive,
  toggleInactive:  night.toggleInactive,
};

export const lightColors = { ...darkColors };